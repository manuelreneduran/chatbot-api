import openai from "../services/openAI";
import knex from "../services/knex";
import { generateEmbedding } from "./utils";
import { insertMessage } from "./messagesController";

// Helper function to store interaction in the database
async function insertUserEmbeddings(
  userId: string,
  embedding: number[],
  userInput: string,
  response: string
) {
  try {
    await knex("user_embeddings")
      .returning("id")
      .insert({
        user_id: userId,
        embedding: JSON.stringify(embedding),
        user_input: userInput,
        response: response,
      });
  } catch (err) {
    console.error("Error storing user embedding:", err);
  }
}

// Helper function to query relevant information from the database
async function fetchRelevantUserEmbeddings(
  userId: string,
  embedding: number[]
): Promise<any[]> {
  try {
    const result = await knex("user_embeddings")
      .where("user_embeddings.user_id", userId)
      .orderByRaw("user_embeddings.embedding <-> ?", [
        JSON.stringify(embedding),
      ])
      .limit(5);

    return result;
  } catch (err) {
    console.error("Error querying relevant info:", err);
    throw err; // Rethrow the error to be handled by the caller
  }
}

// Helper function to query relevant reference texts from the database
const fetchRelevantReferenceTexts = async (embedding: number[]) => {
  try {
    const result = await knex("reference_texts")
      .orderByRaw("embedding <-> ?", [JSON.stringify(embedding)])
      .limit(5);

    return result;
  } catch (err) {
    console.error("Error querying reference texts:", err);
    throw err;
  }
};

// Endpoint to save user embedding and make request to ChatGPT
const createUserEmbedding = async (req, res) => {
  const { userId, userInput } = req.body;

  try {
    // Generate embedding for the user input
    const embedding = await generateEmbedding(userInput);

    if (!embedding) {
      return res.status(500).json({ error: "Error generating embedding" });
    }

    // Query the vector database for relevant chat history
    const userEmbeddings = await fetchRelevantUserEmbeddings(userId, embedding);

    // Query the reference texts for relevant reference texts
    const referenceTexts = await fetchRelevantReferenceTexts(embedding);

    // Combine the relevant information and reference texts
    userEmbeddings.push(...referenceTexts);

    // Construct the prompt for ChatGPT
    const context = userEmbeddings
      .map((info) => {
        if (info.user_input) {
          return (
            info.created_at +
            "\n" +
            "user_input: " +
            info.user_input +
            "\n" +
            "response: " +
            info.response
          );
        } else {
          return info.title + "\n" + "text: " + info.text;
        }
      })
      .join("\n");

    // Generate response using ChatGPT
    const gptResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
        {
          role: "system",
          content: `You are Alexander Hamilton. You always answer as Alexander Hamilton. If a user asks a question that Hamilton would not reasonably know, make your best guess as to how Hamilton would respond. Match the style and tone of this context and refer to it to answer questions: ${context}. You respond to the ${userInput}. Don't greet more than once. Do not use modern language. Keep your answers relatively short.`,
        },
        { role: "user", content: userInput },
      ],
      max_tokens: 150,
    });

    const aiResponse =
      gptResponse.choices[0].message.content ||
      "I'm sorry, I didn't understand that.";

    // Store the interaction in the database
    await insertUserEmbeddings(userId, embedding, userInput, aiResponse);

    // Save the response to the messages table
    await insertMessage(userId, aiResponse, "Agent");

    // Return the response to the user
    res.json({ response: "success" });
  } catch (err) {
    console.error("Error handling chat request", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { createUserEmbedding };

import openai from "../services/openAI";
import knex from "../services/knex";
import { generateEmbedding } from "./utils";

// Helper function to store interaction in the database
async function storeInteraction(
  userId: string,
  embedding: number[],
  userInput: string,
  response: string
) {
  try {
    await knex("user_embeddings").insert({
      user_id: userId,
      embedding: JSON.stringify(embedding),
      user_input: userInput,
      response: response,
    });
    console.log("User embedding stored successfully");
  } catch (err) {
    console.error("Error storing user embedding:", err);
  }
}

// Helper function to query relevant information from the database
async function queryChatHistory(
  userId: string,
  embedding: number[]
): Promise<any[]> {
  try {
    const result = await knex("user_embeddings")
      .where("user_id", userId)
      .orderByRaw("embedding <-> ?", [JSON.stringify(embedding)])
      .limit(5);

    return result;
  } catch (err) {
    console.error("Error querying relevant info:", err);
    throw err; // Rethrow the error to be handled by the caller
  }
}

const queryReferenceTexts = async (embedding: number[]) => {
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

// Endpoint to handle user input and generate response
const handleUserChatRequest = async (req, res) => {
  const { userId, userInput } = req.body;

  try {
    // Generate embedding for the user input
    const embedding = await generateEmbedding(userInput);

    // Query the vector database for relevant information
    const relevantInfo = await queryChatHistory(userId, embedding);

    // Query the reference texts for relevant information
    const referenceTexts = await queryReferenceTexts(embedding);

    // Combine the relevant information and reference texts
    relevantInfo.push(...referenceTexts);

    // Construct the prompt for ChatGPT
    const context = relevantInfo
      .map((info) =>
        info.user_input ? info.user_input + "\n" + info.response : info.text
      )
      .join("\n");

    // Generate response using ChatGPT
    const gptResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
        {
          role: "system",
          content: `You are Alexander Hamilton, an aide-to-camp. Match the style and tone of this context and refer to it to answer questions: ${context}. Don't greet more than once. Do not use modern language.`,
        },
        { role: "user", content: userInput },
      ],
      max_tokens: 150,
    });

    const aiResponse =
      gptResponse.choices[0].message.content ||
      "I'm sorry, I didn't understand that.";

    // Store the interaction in the database
    await storeInteraction(userId, embedding, userInput, aiResponse);

    // Return the response to the user
    res.json({ response: aiResponse });
  } catch (err) {
    console.error("Error handling chat request", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { handleUserChatRequest };

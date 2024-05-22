import openai from "../services/openAI";
import knex from "../services/knex";
import { generateEmbedding } from "./utils";
import { serializeChatHistory } from "../serializers/chatHistorySerializer";

// Helper function to store interaction in the database
async function insertChatHistory(
  userId: string,
  embedding: number[],
  userInput: string,
  response: string
) {
  try {
    const [result]: { id: number }[] = await knex("user_embeddings")
      .returning("id")
      .insert({
        user_id: userId,
        embedding: JSON.stringify(embedding),
        user_input: userInput,
        response: response,
      });

    await insertReaction(result.id);
  } catch (err) {
    console.error("Error storing user embedding:", err);
  }
}
// Helper function to store reaction in the database
async function insertReaction(embeddingId: number) {
  try {
    await knex("reactions").insert({
      embedding_id: embeddingId,
      user_like: false,
      user_love: false,
      user_haha: false,
      user_wow: false,
      user_sad: false,
      user_angry: false,
      agent_like: false,
      agent_love: false,
      agent_haha: false,
      agent_wow: false,
      agent_sad: false,
      agent_angry: false,
    });
  } catch (e) {
    console.error("Error storing reaction:", e);
  }
}

// Helper function to query relevant information from the database
async function queryRelevantChatHistory(
  userId: string,
  embedding: number[]
): Promise<any[]> {
  try {
    const result = await knex("user_embeddings")
      .join("reactions", "user_embeddings.id", "reactions.embedding_id")
      .where("user_embeddings.user_id", userId)
      .orderByRaw("user_embeddings.embedding <-> ?", [
        JSON.stringify(embedding),
      ])
      .select("user_embeddings.*", "reactions.*")
      .limit(5);

    return result;
  } catch (err) {
    console.error("Error querying relevant info:", err);
    throw err; // Rethrow the error to be handled by the caller
  }
}

// Helper function to query relevant information from the database
async function queryAllChatHistory(userId: string): Promise<any[]> {
  try {
    const result = await knex("user_embeddings")
      .join("reactions", "user_embeddings.id", "reactions.embedding_id")
      .where("user_embeddings.user_id", userId)
      .select(
        "user_embeddings.id",
        "user_embeddings.user_input",
        "user_embeddings.user_id",
        "user_embeddings.response",
        "user_embeddings.user_read",
        "user_embeddings.agent_read",
        "user_embeddings.created_at",
        "reactions.*"
      );

    return result;
  } catch (err) {
    console.error("Error querying relevant info:", err);
    throw err; // Rethrow the error to be handled by the caller
  }
}
// Helper function to query relevant reference texts from the database
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

// Endpoint to take in user input and generate response
const createChatHistory = async (req, res) => {
  const { userId, userInput } = req.body;

  try {
    // Generate embedding for the user input
    const embedding = await generateEmbedding(userInput);

    if (!embedding) {
      return res.status(500).json({ error: "Error generating embedding" });
    }

    // Query the vector database for relevant chat history
    const chatHistory = await queryRelevantChatHistory(userId, embedding);

    // Query the reference texts for relevant reference texts
    const referenceTexts = await queryReferenceTexts(embedding);

    // Combine the relevant information and reference texts
    chatHistory.push(...referenceTexts);

    // Construct the prompt for ChatGPT
    const context = chatHistory
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
          content: `You are Alexander Hamilton. You always answer as Alexander Hamilton. If a user asks a question that Hamilton would not reasonably know, you respond, "Apologies, but I am not familiar with what you speak.". Match the style and tone of this context and refer to it to answer questions: ${context}. Don't greet more than once. Do not use modern language. Keep your answers relatively short.`,
        },
        { role: "user", content: userInput },
      ],
      max_tokens: 150,
    });

    const aiResponse =
      gptResponse.choices[0].message.content ||
      "I'm sorry, I didn't understand that.";

    // Store the interaction in the database
    await insertChatHistory(userId, embedding, userInput, aiResponse);

    // Return the response to the user
    res.json({ response: "success" });
  } catch (err) {
    console.error("Error handling chat request", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getChatHistory = async (req, res) => {
  const { userId } = req.query;

  try {
    // query chat history again for all messages and reactions
    const updatedChatHistory = await queryAllChatHistory(userId);

    if (!updatedChatHistory) {
      return res.status(200).json({ chatHistory: {} });
    }
    // Serialize the chat history for the response
    const serializedChatHistory = serializeChatHistory(updatedChatHistory);

    res.json({ chatHistory: serializedChatHistory });
  } catch (e) {
    console.error("Error fetching chat history:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { createChatHistory, getChatHistory };

import knex from "../services/knex";
import { randomBoolean } from "../utils/number";
import { generateGptReaction, generateGptResponse } from "./gptController";
import {
  fetchMessage,
  handleDelayedMessageInsertion,
} from "./messagesController";
import { handleDelayedReaction } from "./reactionsController";
import { extractReactions, generateEmbedding } from "./utils";

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

// Helper function to build the context for ChatGPT
const buildContext = (userEmbeddings: any[]) => {
  return userEmbeddings
    .map((info) => {
      if (info.user_input) {
        return `${info.created_at}\nuser_input: ${info.user_input}\nresponse: ${info.response}`;
      } else {
        return `${info.title}\ntext: ${info.text}`;
      }
    })
    .join("\n");
};

// Endpoint to save user embedding and make request to ChatGPT
const createUserEmbedding = async (req: any, res: any) => {
  const { userId, messageId } = req.body;

  try {
    // fetch the user message from the database
    const message = await fetchMessage(messageId);

    const userInput = message.text;

    // Generate a reaction to the user message
    const gptReactionResponse = await generateGptReaction(userInput);

    // parses response in case the AI does a derp and returns a full string
    const aiReactionResponse =
      extractReactions(
        gptReactionResponse.choices[0].message.content || ""
      )?.[0] || "";

    // Has a % chance to react to the message
    if (aiReactionResponse && randomBoolean(0.85)) {
      handleDelayedReaction(messageId, aiReactionResponse);
    }

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
    const context = buildContext(userEmbeddings);

    // Generate response using ChatGPT
    const gptResponse = await generateGptResponse(userInput, context);

    const aiResponse = gptResponse.choices[0].message.content;

    if (!aiResponse) {
      return res.status(500).json({ error: "Error generating response" });
    }

    // Store the interaction in the database
    await insertUserEmbeddings(
      userId,
      embedding,
      userInput,
      aiResponse as string
    );

    // Return the response to the user
    res.json({ response: "success" });

    // Delay the insertion of the message by 10-30 seconds to give time to react
    handleDelayedMessageInsertion(userId, aiResponse);
  } catch (err) {
    console.error("Error handling chat request", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { createUserEmbedding };

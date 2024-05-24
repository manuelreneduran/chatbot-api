import { serializeMessages } from "../serializers/messagesSerializer";
import knex from "../services/knex";
import { getRandomNumber } from "../utils/number";
import { insertReaction } from "./reactionsController";
import _ from "lodash";

// Helper function to get the latest message from every user
const getLatestMessagesFromAllUsers = async () => {
  try {
    const result = await knex("messages")
      .select("user_id", "text")
      .max("created_at as latest_created_at")
      .where("user_type", "!=", "Agent")
      .groupBy("user_id", "text");

    // Fetch the full message details for the latest messages
    const latestMessages = _.uniqBy(result, "user_id");
    return latestMessages;
  } catch (e) {
    console.error("Error getting latest messages from all users:", e);
  }
};

// Helper function to fetch a message from a user
const fetchMessage = async (messageId: string) => {
  try {
    const result = await knex("messages")
      .where("id", messageId)
      .orderBy("created_at", "desc")
      .first();

    return result;
  } catch (e) {
    console.error("Error fetching message:", e);
  }
};

// Helper function to query relevant information from the database
async function fetchAllMessages(userId: string): Promise<any[]> {
  try {
    const result = await knex("messages")
      .join("reactions", "messages.id", "reactions.message_id")
      .where("messages.user_id", userId)
      .select(
        "messages.id as message_id",
        "messages.*",
        "reactions.id as reaction_id",
        "reactions.*"
      );

    return result;
  } catch (err) {
    console.error("Error querying relevant info:", err);
    throw err; // Rethrow the error to be handled by the caller
  }
}

// Helper function to store message in the database
async function insertMessage(userId: string, text: string, userType: string) {
  try {
    const [result]: { id: number }[] = await knex("messages")
      .returning("id")
      .insert({
        user_id: userId,
        text,
        user_type: userType,
      });
    await insertReaction(result.id);
    return result.id;
  } catch (err) {
    console.error("Error storing user embedding:", err);
  }
}

// Helper function to store message in the database after a delay
export const handleDelayedMessageInsertion = (userId, aiResponse) => {
  setTimeout(async () => {
    try {
      await insertMessage(userId, aiResponse, "Agent");
      console.log("Message inserted successfully after 20 seconds");
    } catch (error) {
      console.error("Error inserting delayed message", error);
    }
  }, getRandomNumber(3000, 7000));
};

const getMessages = async (req, res) => {
  const { userId } = req.query;

  try {
    // query messages and reactions
    const messages = await fetchAllMessages(userId);

    if (!messages) {
      return res.status(200).json({ messages: {} });
    }
    // Serialize messages for the response
    const serializedMessages = serializeMessages(messages);

    res.json({ messages: serializedMessages });
  } catch (e) {
    console.error("Error fetching messages:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};

const createMessage = async (req, res) => {
  const { userId, text } = req.body;

  try {
    const messageId = await insertMessage(userId, text, "User");
    res.json({ messageId });
  } catch (e) {
    console.error("Error saving message:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};

export {
  getMessages,
  createMessage,
  insertMessage,
  getLatestMessagesFromAllUsers,
  fetchMessage,
};

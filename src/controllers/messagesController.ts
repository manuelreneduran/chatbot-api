import { serializeMessages } from "../serializers/messagesSerializer";
import knex from "../services/knex";
import { insertReaction } from "./reactionsController";

// Helper function to query relevant information from the database
async function fetchAllMessages(userId: string): Promise<any[]> {
  try {
    const result = await knex("messages")
      .join("reactions", "messages.id", "reactions.message_id")
      .where("messages.user_id", userId)
      .select("messages.*", "reactions.*");

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
  } catch (err) {
    console.error("Error storing user embedding:", err);
  }
}

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
    await insertMessage(userId, text, "User");
    res.json({ message: "Message saved" });
  } catch (e) {
    console.error("Error saving message:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { getMessages, createMessage, insertMessage };

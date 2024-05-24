import knex from "../services/knex";
import { getRandomNumber } from "../utils/number";

// Helper function to store reaction in the database
export async function insertReaction(messageId: number) {
  try {
    await knex("reactions").insert({
      message_id: messageId,
      like: false,
      love: false,
      haha: false,
      wow: false,
      sad: false,
      angry: false,
    });
  } catch (e) {
    console.error("Error storing reaction:", e);
  }
}

export async function updateReaction(
  messageId: number,
  emoji: string,
  state: boolean
) {
  try {
    await knex("reactions")
      .where("message_id", messageId)
      .update({ [emoji]: state });
  } catch (e) {
    console.error("Error updating reaction:", e);
  }
}

export async function getReaction(messageId: number) {
  try {
    const result = await knex("reactions").where("message_id", messageId);
    return result[0];
  } catch (e) {
    console.error("Error getting reaction:", e);
  }
}

export const createOrDeleteReaction = async (req, res) => {
  const { messageId, type } = req.body;

  const reaction = await getReaction(messageId);

  // If the reaction is already set, remove it
  if (reaction[type]) {
    try {
      await updateReaction(messageId, type, false);
      return res.json({ message: "Reaction removed" });
    } catch (e) {
      console.error("Error removing reaction:", e);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    // Otherwise, add the reaction
    try {
      await updateReaction(messageId, type, true);
      res.json({ message: "Reaction added" });
    } catch (e) {
      console.error("Error adding reaction:", e);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const handleDelayedReaction = (messageId, aiReactionResponse) => {
  setTimeout(async () => {
    try {
      await updateReaction(messageId, aiReactionResponse, true);
      console.log("Reaction inserted successfully after X seconds");
    } catch (error) {
      console.error("Error inserting delayed reaction", error);
    }
  }, getRandomNumber(1, 3000));
};

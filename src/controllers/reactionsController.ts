import knex from "../services/knex";

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

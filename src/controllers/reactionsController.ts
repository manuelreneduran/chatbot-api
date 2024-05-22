import knex from "../services/knex";

// Helper function to store reaction in the database
export async function insertReaction(embeddingId: number) {
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

import knex from "../services/knex";

const deleteUserData = async (req: any, res: any) => {
  const { userId } = req.body;
  try {
    await knex("user_embeddings").where("user_id", userId).del();
    await knex("reactions")
      .whereIn("message_id", function () {
        this.select("id").from("messages").where("user_id", userId);
      })
      .del();
    await knex("messages").where("user_id", userId).del();

    res.json({ message: "User data deleted successfully" });
  } catch (e) {
    console.error("Error deleting user data", e);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { deleteUserData };

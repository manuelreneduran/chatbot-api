import knex from "../services/knex";

const deleteUserData = async (req, res) => {
  const { userId } = req.body;
  try {
    await knex("user_embeddings").where("user_id", userId).del();

    res.json({ message: "User data deleted successfully" });
  } catch (e) {
    console.error("Error deleting user data", e);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { deleteUserData };

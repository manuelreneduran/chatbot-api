import openai from "../services/openAI";
import db from "../services/db";

// Helper function to generate embedding using OpenAI API
async function generateEmbedding(input: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: input,
  });
  return response.data[0].embedding;
}

// Helper function to store interaction in the database
async function storeInteraction(
  userId: string,
  embedding: number[],
  userInput: string,
  response: string
) {
  await db.query(
    `
            INSERT INTO user_embeddings (user_id, embedding, user_input, response)
            VALUES ($1, $2, $3, $4);
        `,
    [userId, JSON.stringify(embedding), userInput, response]
  );
}

// Helper function to query relevant information from the database
async function queryRelevantInfo(
  userId: string,
  embedding: number[]
): Promise<any[]> {
  const result = await db.query(
    `
            SELECT * FROM user_embeddings
            WHERE user_id = $1
            ORDER BY embedding <-> $2
            LIMIT 5;
        `,
    [userId, JSON.stringify(embedding)]
  );

  return result.rows;
}

// Endpoint to handle user input and generate response
const handleUserChatRequest = async (req, res) => {
  const { userId, userInput } = req.body;

  try {
    // Generate embedding for the user input
    const embedding = await generateEmbedding(userInput);

    // Query the vector database for relevant information
    const relevantInfo = await queryRelevantInfo(userId, embedding);

    // Construct the prompt for ChatGPT
    const context = relevantInfo
      .map((info) => info.user_input + "\n" + info.response)
      .join("\n");

    console.log("context -------------------", context);

    // Generate response using ChatGPT
    const gptResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
        {
          role: "system",
          content: `You are a helpful chatbot. Use this context for your answers: ${context}`,
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

const deleteUserData = async (req, res) => {
  const { userId } = req.body;
  try {
    const deleteQuery = `
            DELETE FROM user_embeddings
            WHERE user_id = $1;
        `;

    await db.query(deleteQuery, [userId]);
    res.json({ message: "User data deleted successfully" });
  } catch (e) {
    console.error("Error deleting user data", e);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { handleUserChatRequest, deleteUserData };

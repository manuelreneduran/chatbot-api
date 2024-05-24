import openai from "../services/openAI";
import fs from "fs";
import readline from "readline";

// Helper function to generate embedding using OpenAI API
async function generateEmbedding(input: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: input,
  });
  return response.data[0].embedding;
}

// Function to split text into chunks based on character count
function splitTextIntoChunks(text: string, chunkSize: number): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end =
      start + chunkSize > text.length ? text.length : start + chunkSize;
    const chunk = text.slice(start, end);
    chunks.push(chunk);
    start = end;
  }

  return chunks;
}

// Main function to process and store large reference texts
async function processAndStoreLargeText(
  filePath: string,
  title: string,
  maxTokens: number,
  storeText: Function
) {
  try {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let text = "";
    for await (const line of rl) {
      text += line + "\n";
    }

    const chunks = splitTextIntoChunks(text, maxTokens);

    for (const chunk of chunks) {
      const embedding = await generateEmbedding(chunk);
      await storeText(title, chunk, embedding);
    }
  } catch (e) {
    console.log("Error processing and storing reference text:", e);
  }
}
// Helper function to extract reactions from text
function extractReactions(text) {
  const reactions = ["haha", "wow", "like", "love", "angry", "sad"];
  const regex = new RegExp(`\\b(${reactions.join("|")})\\b`, "gi");
  const matches = text.match(regex);
  return matches ? matches.map((match) => match.toLowerCase()) : [];
}

export {
  generateEmbedding,
  splitTextIntoChunks,
  processAndStoreLargeText,
  extractReactions,
};

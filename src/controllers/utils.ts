import openai from "../services/openAI";

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

export { generateEmbedding, splitTextIntoChunks };

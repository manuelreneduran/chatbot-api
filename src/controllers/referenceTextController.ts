import knex from "../services/knex";
import fs from "fs";
import readline from "readline";
import { generateEmbedding, splitTextIntoChunks } from "./utils";
import { resolve } from "path";

// Helper function to store reference text and its embedding in the database
async function storeReferenceText(
  title: string,
  text: string,
  embedding: number[]
) {
  try {
    await knex("reference_texts").insert({
      title,
      text,
      embedding: JSON.stringify(embedding),
    });
    console.log("User embedding stored successfully");
  } catch (err) {
    console.error("Error storing user embedding:", err);
  }
}

// Main function to process and store large reference texts
async function processAndStoreReferenceText(
  filePath: string,
  title: string,
  maxTokens: number
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
      await storeReferenceText(title, chunk, embedding);
    }
  } catch (e) {
    console.log("Error processing and storing reference text:", e);
  }
}

const filePath = resolve("./hamilton_1.txt");
const title = "Hamilton_1";
const maxTokens = 1000; // Adjust the token size as needed

processAndStoreReferenceText(filePath, title, maxTokens)
  .then(() => console.log("Processing and storage complete."))
  .catch((err) =>
    console.error("Error processing and storing reference text:", err)
  );

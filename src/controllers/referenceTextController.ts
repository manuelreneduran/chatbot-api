import knex from "../services/knex";
import { resolve } from "path";
import { processAndStoreLargeText } from "./utils";

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

async function processAndStoreReferenceText(res, req) {
  const filePath = resolve("./hamilton_1.txt");
  const title = "Hamilton_1";
  const maxTokens = 1000; // Adjust the token size as needed

  try {
    await processAndStoreLargeText(
      filePath,
      title,
      maxTokens,
      storeReferenceText
    );
    res.json({ message: "Reference text stored successfully" });
  } catch (e) {
    console.log("Error processing and storing reference text:", e);
    res
      .status(500)
      .json({ message: "Error processing and storing reference text" });
  }
}
export { storeReferenceText, processAndStoreReferenceText };
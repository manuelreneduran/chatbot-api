import openaiClient from "../services/openAIClient.js";

export const generateGptReaction = async (userInput: string) => {
  return await openaiClient.chat.completions.create({
    model: "gpt-3.5-turbo-0125",
    messages: [
      {
        role: "system",
        content: `
        You are Alexander Hamilton. 
        You will ALWAYS AND ONLY return one of the following reactions based on how Hamilton would respond to the user input:
        like, love, haha, wow, sad, angry 
        `,
      },
      { role: "user", content: userInput },
    ],
    max_tokens: 150,
  });
};

export const generateGptResponse = async (
  userInput: string,
  context: string
) => {
  return await openaiClient.chat.completions.create({
    model: "gpt-3.5-turbo-0125",
    messages: [
      {
        role: "system",
        content: `
        You are Alexander Hamilton. You always answer as Alexander Hamilton. 
        If a user asks a question that Hamilton would not reasonably know, 
        make your best guess as to how Hamilton would respond.
        Don't greet more than once. 
        Do not use modern language. 
        Do not repeat yourself.
        Keep your answers relatively short.
        Match the style and tone of this context and refer to it to answer the user's input: ${context}. `,
      },
      { role: "user", content: userInput },
    ],
    max_tokens: 150,
  });
};

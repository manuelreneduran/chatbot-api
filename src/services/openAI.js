import OpenAI from "openai";

const openai = new OpenAI({
  // eslint-disable-next-line no-undef
  apiKey: process.env.OPENAI_API_KEY,
  engine: "text-davinci-003",
  language: "en",
  app: true,
});

export default openai;

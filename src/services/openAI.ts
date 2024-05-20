import OpenAIApi from "openai";

const openaiClient = new OpenAIApi({
  // eslint-disable-next-line no-undef
  apiKey: process.env.OPENAI_API_KEY,
});

export default openaiClient;

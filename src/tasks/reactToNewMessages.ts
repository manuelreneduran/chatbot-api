import cron from "node-cron";

// periodically scans new messages and determines

import {
  getLatestMessagesFromAllUsers,
  insertMessage,
} from "../controllers/messagesController";

// if the bot should react to them
export const reactToNewMessages = async () => {
  // Fetch the latest messages from the database
  const latestMessage = await getLatestMessagesFromAllUsers();
  console.log(latestMessage);
  // const latestMessages = await db.getLatestMessages();
  // Implement your logic to decide if the bot should react
  // latestMessages.forEach(message => {
  //   if (shouldBotReact(message)) {
  //     // Perform the bot's reaction
  //     db.saveMessage({ text: 'Bot reaction', userId: 'bot' });
  //   }
  // });
};

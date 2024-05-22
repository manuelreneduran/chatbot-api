import { TMessage, TMessageList } from "../types";
import { formatDate } from "../utils/date";

// Helper function to serialize chat history for the response
export const serializeChatHistory = (chatHistory) => {
  const serializedChatHistory: TMessageList = {};

  chatHistory.forEach((chat) => {
    const date = formatDate(new Date(chat.created_at));

    if (!serializedChatHistory[date]) {
      serializedChatHistory[date] = [];
    }

    const userMessage: TMessage = {
      id: chat.id,
      content: chat.user_input,
      sender: "User",
      created_at: chat.created_at,
      read: chat.user_read,
      reactions: {
        like: chat.user_like,
        love: chat.user_love,
        haha: chat.user_haha,
        wow: chat.user_wow,
        sad: chat.user_sad,
        angry: chat.user_angry,
      },
    };

    const agentMessage: TMessage = {
      id: chat.id,
      content: chat.response,
      sender: "Agent",
      created_at: chat.created_at,
      read: chat.agent_read,
      reactions: {
        like: chat.agent_like,
        love: chat.agent_love,
        haha: chat.agent_haha,
        wow: chat.agent_wow,
        sad: chat.agent_sad,
        angry: chat.agent_angry,
      },
    };

    serializedChatHistory[date].push(userMessage, agentMessage);
  });

  return serializedChatHistory;
};

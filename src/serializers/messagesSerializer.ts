import { TMessage, TMessageList } from "../types";
import { formatDate, formatTime } from "../utils/date";

// Helper function to serialize messages for the response
export const serializeMessages = (chatHistory) => {
  const serializedMessages: TMessageList = {};

  chatHistory.forEach((chat) => {
    const date = formatDate(new Date(chat.created_at));

    if (!serializedMessages[date]) {
      serializedMessages[date] = [];
    }

    const userMessage: TMessage = {
      id: chat.id,
      content: chat.user_input,
      sender: "User",
      created_at: formatTime(chat.created_at),
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
      created_at: formatTime(chat.created_at),
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

    serializedMessages[date].push(userMessage, agentMessage);
  });

  return serializedMessages;
};

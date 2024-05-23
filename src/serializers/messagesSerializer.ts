import { TMessage, TMessageList } from "../types";
import { formatDate, formatTime } from "../utils/date";

// Helper function to serialize messages for the response
export const serializeMessages = (messages) => {
  const serializedMessages: TMessageList = {};

  messages.forEach((message) => {
    const date = formatDate(new Date(message.created_at));

    if (!serializedMessages[date]) {
      serializedMessages[date] = [];
    }

    const serializedMessage: TMessage = {
      id: message.id,
      content: message.text,
      sender: message.user_type,
      createdAt: formatTime(message.created_at),
      read: message.read,
      reactions: {
        like: message.like,
        love: message.love,
        haha: message.haha,
        wow: message.wow,
        sad: message.sad,
        angry: message.angry,
      },
    };

    serializedMessages[date].push(serializedMessage);
  });

  return serializedMessages;
};

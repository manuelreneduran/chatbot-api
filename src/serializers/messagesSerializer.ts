import { TMessage, TMessageList } from "../types";
import { formatDate, formatTime } from "../utils/date";

// Helper function to serialize messages for the response
export const serializeMessages = (messages) => {
  const serializedMessages: TMessageList = {};

  const sortedMessages = messages.sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
  sortedMessages.forEach((message) => {
    const date = formatDate(new Date(message.created_at));

    if (!serializedMessages[date]) {
      serializedMessages[date] = [];
    }

    // for some reason id points the reactions.id not message.id so we set it explicitly
    const serializedMessage: TMessage = {
      id: message.message_id,
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

export type TMessage = {
  id: string;
  content: string;
  sender: "User" | "Agent";
  createdAt: string;
  read: boolean;
  reactions: {
    [key in TEmoji]: boolean;
  };
};

export type TMessageList = {
  [key: string]: TMessage[];
};

export type TEmoji = "like" | "love" | "haha" | "wow" | "sad" | "angry";

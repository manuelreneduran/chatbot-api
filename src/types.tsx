export type TMessage = {
  id: string;
  content: string;
  sender: "User" | "Agent";
  created_at: string;
  read: boolean;
  reactions: {
    [key in TEmoji]: boolean;
  };
};

export type TMessageList = {
  [key: string]: TMessage[];
};

export type TEmoji = "like" | "love" | "haha" | "wow" | "sad" | "angry";

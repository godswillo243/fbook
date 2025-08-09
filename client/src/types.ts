export type ToastType = "success" | "error" | "info" | "warning";
export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  friends: string[]; // array of User._id
  emailVerified: boolean;
  createdAt: Date;
}

export interface IPost {
  author: {
    avatarUrl: string;
    name: string;
    _id: string;
  };
  content: string;
  imageUrl?: string;
  likes: string[]; // array of User._id
  saves: string[]; // array of User._id
}

export interface INotification {
  _id: string;
  user: string;
  type: "LIKE" | "COMMENT" | "FRIEND_REQUEST";
  referenceId: string;
  read: boolean;
  message: string;
  createdAt: Date;
}

export interface IFriendRequest {
  _id: string;
  sender: { name: string; email: string; avatarUrl: string; _id: string };
  receiver: { name: string; email: string; avatarUrl: string; _id: string };
  status: "pending" | "accepted" | "rejected";
}

export interface IMessage {
  _id: string;
  sender: string;
  receiver: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface SearchUserProps {
  users?: {
    name: string;
    _id: string;
    email: string;
    avatarUrl: string;
  }[];
}

export type TResults = {
  name: string;
  _id: string;
  email: string;
  avatarUrl: string;
};

export interface SearchStore {
  results: Array<TResults>;
  searchParams: string;
  setSearchParam: (param: string) => void;
}

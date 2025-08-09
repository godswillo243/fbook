import type React from "react";
import type { IMessage } from "../types";
import { formatDate } from "../lib/utils";

interface MessageBubbleProps {
  message: IMessage;
  handleSelectMessage: (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => void;
  isOurMsg: boolean;
}

function MessageBubble({
  message,
  handleSelectMessage,
  isOurMsg,
}: MessageBubbleProps) {
  return (
    <div>
      <div
        className={`chat relative ${isOurMsg ? "chat-end " : "chat-start"} `}
      >
        {isOurMsg && (
          <input
            type="checkbox"
            name="checkbox"
            id="1"
            className="cursor-pointer m-2 w-8!"
            onChange={(e) => handleSelectMessage(e, message._id)}
          />
        )}
        <div
          className={` chat-bubble  ${
            isOurMsg ? "chat-bubble-primary chat-end" : "chat-start"
          }`}
        >
          {" "}
          {message.content}
        </div>
      </div>
      <div
        className={`chat relative ${isOurMsg ? "chat-end " : "chat-start"} `}
      >
        <span className="text-sm text-neutral">{formatDate(message.createdAt)}</span>
      </div>
    </div>
  );
}
export default MessageBubble;

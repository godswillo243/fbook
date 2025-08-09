import { Link, Navigate, useNavigate } from "react-router-dom";
import { useMessageStore } from "../store/messageStore";
import { useGetMessages } from "../lib/react-query/queries";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useUserStore } from "../store/userStore";
import { ArrowLeft, SendHorizontalIcon, Trash2Icon } from "lucide-react";
import { useSendMessage } from "../lib/react-query/mutations";
import { useQueryClient } from "@tanstack/react-query";
import type { IMessage } from "../types";
import MessageBubble from "../components/messageBubble";
import { socket } from "../lib/socket.io";

function MessagesPage() {
  const { selectedChat } = useMessageStore();
  const { friends } = useUserStore();
  const queryClient = useQueryClient();
  const messageInputRef = useRef<HTMLInputElement>(null);
  const { status, data } = useGetMessages(selectedChat as string);
  const friend = friends.find((f) => f._id === selectedChat);
  const navigate = useNavigate();
  // const { data: messages } = useGetMessages(friend?._id as string);
  const [messages, setMessages] = useState<IMessage[]>([]);

  const { status: sendMessageStatus, mutate: sendMessageFn } = useSendMessage();

  useEffect(() => {
    socket.on("message", (message: IMessage) => {
      if (message.sender === selectedChat!) {
        //
        queryClient.invalidateQueries({ queryKey: ["messages"] })
      }
    });
  }, [selectedChat]);

  useEffect(() => {
    if (status === "pending" || status === "error") return;
    if (selectedChat === null || !data) return;
    setMessages((state) => {
      data.map((msg) => {
        if (!state.find((m) => msg._id === m._id)) {
          state.push(msg);
        }
      });
      return state;
    });
  }, [selectedChat, status, data]);

  console.log(messages);

  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const el = messageInputRef.current;
    if (!el) return;
    const message = el.value;
    sendMessageFn(
      { message, id: selectedChat as string },
      {
        onSuccess: (message: IMessage) => {
          queryClient.invalidateQueries({ queryKey: ["messages"] });
          el.value = "";
          if (socket.connected) {
            socket.emit("message", {
              recipient: selectedChat || message.receiver,
              message,
            });
          }
        },
      }
    );
  };
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const handleSelectMessage = (
    e: ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    const checked = e.target.checked;
    setSelectedMessages((state) => {
      if (checked) {
        if (!state.includes(id)) {
          state.push(id);
        }
      } else {
        state = state.filter((uid) => uid === id);
      }
      return state;
    });
  };

  if (!selectedChat || !friend) return <Navigate to={"/"} />;

  return (
    <div className="pt-[10px] w-full h-full max-h-dvh relative">
      <div className="w-full flex items-center justify-between absolute top-0 left-0 bg-base-200 z-10  ">
        <button className="btn-ghost!" onClick={() => navigate(-1)}>
          <ArrowLeft />
        </button>
        <Link to={"/profile/" + friend._id} className="flex-center gap-2">
          <img
            src={friend.avatarUrl?.trim() || "/avatar.avif"}
            className="avatar rounded-full w-10 h-10"
            alt=""
          />
          <span>{friend.name}</span>
        </Link>
        <div>
          {selectedMessages.length > 0 ? (
            <button className="btn-ghost!">
              <Trash2Icon className="text-error" />
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="w-full flex h-full flex-col bg-base-200/30 px-2 pt-12 pb-20 overflow-auto ">
        {data?.map((message, i) => {
          const isOurMsg = message.sender !== friend._id;
          return (
            <MessageBubble
              key={i}
              isOurMsg={isOurMsg}
              message={message}
              handleSelectMessage={handleSelectMessage}
            />
          );
        })}
      </div>
      <form
        className="absolute bottom-8 max-md:bottom-16 left-0 w-[100%] px-2 flex-center flex-row! gap-2!"
        onSubmit={handleSendMessage}
      >
        <input type="text" className="" ref={messageInputRef} />
        <button className="btn-primary text-primary-content!">
          {" "}
          {sendMessageStatus === "pending" ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <SendHorizontalIcon />
          )}{" "}
        </button>
      </form>
    </div>
  );
}
export default MessagesPage;

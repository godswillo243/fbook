import { Link, Outlet, useParams } from "react-router-dom";
// import { useUserStore } from "../store/userStore";
import ChatsList from "../components/chatsList";
import { useMessageStore } from "../store/messageStore";
import { useEffect } from "react";
import { useGetFriends } from "../lib/react-query/queries";
import { useAuthStore } from "../store/authStore";

function ChatsPage() {
  const { user: authUser } = useAuthStore();
  const { selectedChat } = useMessageStore();
  const { id } = useParams();
  const { status: getFriendsStatus, data: friends } = useGetFriends(
    authUser?._id as string
  );
  useEffect(() => {
    useMessageStore.setState((state) => ({ ...state, selectedChat: id }));
  }, [id]);

  if (getFriendsStatus === "pending")
    return (
      <div className="w-full h-full flex-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  if (friends.length === 0) {
    return (
      <div className="w-full h-full flex-center ">
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-lg font-semibold">You dont have any friends yet</p>
          <Link to={"/search"} className="link text-primary text-center">
            Search for new friends
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full h-full grid ${
        selectedChat && "lg:grid-cols-[280px_1fr]"
      } grid-cols-1`}
    >
      <div className={` w-full h-full ${selectedChat && "max-lg:hidden"}`}>
        <ChatsList />
      </div>
      {selectedChat && <div>{<Outlet />}</div>}
    </div>
  );
}
export default ChatsPage;

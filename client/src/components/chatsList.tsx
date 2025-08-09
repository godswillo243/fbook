import { Link } from "react-router-dom";
import { useUserStore } from "../store/userStore";

function ChatsList() {
  const { friends } = useUserStore();

  return (
    <div className="w-full h-fit flex items-start justify-start max-lg:px-2 flex-col py-6 px-1 ">
      {friends.map((friend, i) => {
        return (
          <Link
            to={"/chats/" + friend._id}
            key={i}
            className={`p-2  bg-base-200 w-full  flex items-center  gap-4`}
          >
            <img
              src={ "/avatar.avif"}
              className="rounded-full"
              width={50}
              alt=""
            />
            <span className="text-lg font-semibold">{friend.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
export default ChatsList;

import { useQueryClient } from "@tanstack/react-query";
import {
  useAcceptFriendRequest,
  useRejectFriendRequest,
  useSendFriendRequest,
} from "../lib/react-query/mutations";
import { useAuthStore } from "../store/authStore";
import { useUserStore } from "../store/userStore";
import { Link } from "react-router-dom";

function UserCard({
  user,
}: {
  user: {
    name: string;
    _id: string;
    email: string;
    avatarUrl: string;
  };
}) {
  const { friendRequests, friends } = useUserStore();
  const { user: authUser } = useAuthStore();
  const { mutate: sendFriendRequest, status: requestStatus } =
    useSendFriendRequest();
  const { mutate: acceptFriendRequest, status: acceptRequestStatus } =
    useAcceptFriendRequest();
  const { mutate: rejectFriendRequest, status: rejectRequestStatus } =
    useRejectFriendRequest();

  const queryClient = useQueryClient();

  const isFriend = friends.find((fid) => fid._id === user._id);
  const isOurRequest = friendRequests.find(
    (request) => request.receiver._id === user._id
  );
  const isRequest = friendRequests.find(
    (request) => request.sender._id === user._id
  );
  const reqId = isRequest?._id;
  //   const isLoading =
  //     requestStatus === "pending" || acceptRequestStatus === "pending";

  const handleSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: ["stuff"],
    });
  };

  const handleSendFriendRequest = () => {
    sendFriendRequest(user._id, {
      onSuccess: handleSuccess,
    });
  };
  const handleAcceptFriendRequest = () => {
    acceptFriendRequest(reqId as string, {
      onSuccess: handleSuccess,
    });
  };
  const handleRejectFriendRequest = () => {
    rejectFriendRequest(user._id, {
      onSuccess: handleSuccess,
    });
  };

  if (authUser?._id === user._id) return "";

  return (
    <div className="flex items-center justify-between gap-4 w-full py-1 px-4 hover:bg-base-200 cursor-pointer">
      <Link
        to={"/profile/" + user._id}
        className="flex items-center gap-4 py-2 px-4 hover:bg-base-200 cursor-pointer"
      >
        <div className="avatar">
          <div className="w-12 rounded-full">
            <img src={user.avatarUrl.trim() || "/avatar.avif"} alt="" />
          </div>
        </div>
        <div>
          <p>{user.name}</p>
        </div>
      </Link>
      {isFriend ? (
        <button onClick={() => {}} className="bg-error!">
          {"Unfriend"}
        </button>
      ) : isOurRequest ? (
        <button onClick={() => handleSendFriendRequest()} className="bg-error!">
          {"Cancel"}
        </button>
      ) : isRequest ? (
        <div className="flex gap-2">
          <button
            onClick={() => handleAcceptFriendRequest()}
            className="bg-base-200! border border-primary! text-primary!"
          >
            {acceptRequestStatus === "pending" ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Accept"
            )}
          </button>
          <button
            onClick={() => handleRejectFriendRequest()}
            className="bg-base-200! border border-error! text-error!"
          >
            {rejectRequestStatus === "pending" ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Reject"
            )}
          </button>
        </div>
      ) : (
        <button onClick={() => handleSendFriendRequest()}>
          {requestStatus === "pending" ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "Request"
          )}
        </button>
      )}
    </div>
  );
}
export default UserCard;

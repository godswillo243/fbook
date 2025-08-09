import type { IFriendRequest } from "../types";
import {
  useAcceptFriendRequest,
  useRejectFriendRequest,
} from "../lib/react-query/mutations";
import { useQueryClient } from "@tanstack/react-query";

interface FriendRequestCardProps {
  user: IFriendRequest["sender"];
}

function FriendRequestCard({ user }: FriendRequestCardProps) {
  const { status: acceptRequestStatus, mutate: acceptRequestFn } =
    useAcceptFriendRequest();
  const { status: rejectRequestStatus, mutate: rejectRequestFn } =
    useRejectFriendRequest();
  const queryClient = useQueryClient();
  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["stuff"] });
  };

  const handleAcceptRequest = () => {
    acceptRequestFn(user._id, {
      onSuccess: handleSuccess,
    });
  };
  const handleRejectRequest = () => {
    rejectRequestFn(user._id, {
      onSuccess: handleSuccess,
    });
  };

  return (
    <div className="card h-fit p-2 max-w-[400px] flex-col card-side bg-base-100 shadow-sm">
      <div className="flex gap-2">
        <figure className="overflow-clip px-2">
          <img
            src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
            className="object-cover rounded-full w-[80px]! h-[80px]! aspect-square! "
          />
        </figure>
        <h2 className="card-title">{user.name}</h2>
      </div>
      <div className="w-full flex gap-2 mt-2">
        <button
          className="rounded-full! py-2! text-[16px] w-full"
          onClick={() => handleAcceptRequest()}
        >
          {acceptRequestStatus === "pending" ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "Accept"
          )}
        </button>
        <button
          className="rounded-full! py-2! text-[16px] w-full bg-red-600! "
          onClick={() => handleRejectRequest()}
        >
          {rejectRequestStatus === "pending" ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "Reject"
          )}
        </button>
      </div>
    </div>
  );
}
export default FriendRequestCard;

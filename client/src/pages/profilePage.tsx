import { useLocation, useParams } from "react-router-dom";
import { useGetProfile } from "../lib/react-query/queries";
import { useAuthStore } from "../store/authStore";
import { useEffect, useState } from "react";
import { useUserStore } from "../store/userStore";
import ProfileEditor from "../components/profileEditor";
import {
  useAcceptFriendRequest,
  useRejectFriendRequest,
  useSendFriendRequest,
} from "../lib/react-query/mutations";
import { useQueryClient } from "@tanstack/react-query";
function ProfilePage() {
  const { id } = useParams();
  const { user: authUser } = useAuthStore();
  const { pathname } = useLocation();
  const { data: user, status, refetch } = useGetProfile(id as string);
  const [canEdit, setCanEdit] = useState(false);
  const { friends, friendRequests } = useUserStore();

  const { mutate: sendFriendRequest, status: requestStatus } =
    useSendFriendRequest();
  const { mutate: acceptFriendRequest, status: acceptRequestStatus } =
    useAcceptFriendRequest();
  const { mutate: rejectFriendRequest, status: rejectRequestStatus } =
    useRejectFriendRequest();

  const queryClient = useQueryClient();

  useEffect(() => {
    refetch();
  }, [pathname]);

  if (status === "pending")
    return (
      <div className="flex-center w-full h-full">
        <span className="loading loading-lg loading-spinner"></span>
      </div>
    );
  if (!user || status === "error") {
    return <div> Opps! Something went wrong </div>;
  }

  const isFriend = friends.find((fid) => fid._id === user._id);
  const isOurRequest = friendRequests.find(
    (request) => request.receiver._id === user._id
  );
  const isRequest = friendRequests.find(
    (request) => request.sender._id === user._id
  );
  const reqId = isRequest?._id;

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

  return (
    <div className="w-full h-full p-2 overflow-scroll pb-[75px]">
      <div className="card bg-base-100 w-full  m-auto">
        <figure className="px-10 pt-10 relative ">
          <img
            src={user.avatarUrl?.trim() || "/avatar.avif"}
            alt="Shoes"
            className="rounded-full object-cover aspect-square w-48"
          />
        </figure>
        <div className="card-body items-center text-center gap-4 mt-2">
          <h2 className="card-title">{user.name}</h2>
          <p className="text-neutral-600 -mt-4">{user.email}</p>
          <span className="text-lg font-semibold">Bio:</span>
          <p className="text-neutral-600 -mt-4">
            <span></span> {user.bio}
          </p>
          <div className="card-actions">
            {authUser?._id === user._id ? (
              <button
                className="rounded-full!"
                onClick={() => {
                  setCanEdit(true);
                  setTimeout(() => {
                    document.getElementById("profile-editor")!.scrollIntoView({
                      behavior: "smooth",
                    });
                  }, 100);
                }}
              >
                Edit Profile
              </button>
            ) : isFriend ? (
              <button onClick={() => {}} className="bg-error!">
                {"Unfriend"}
              </button>
            ) : isOurRequest ? (
              <button
                onClick={() => handleSendFriendRequest()}
                className="bg-error!"
              >
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
        </div>
      </div>
      {canEdit && <ProfileEditor closeEditor={() => setCanEdit(false)} />}
    </div>
  );
}
export default ProfilePage;

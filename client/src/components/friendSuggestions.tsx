import { useQueryHook } from "../hooks/useQueryHook";
import { axiosInstance } from "../lib/axios/axiosInstance";
import { useAuthStore } from "../store/authStore";
import type { IUser } from "../types";

function FriendSuggestions() {
  const { user } = useAuthStore();
  const { status, data } = useQueryHook(["friend_suggestions"], async () => {
    if (!user) return null;
    const response = await axiosInstance.get(`/users/suggestions/friends`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token-id")}`,
      },
    });
    return response.data;
  });

  if (status === "pending")
    return (
      <div className="w-full h-full flex-center">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );

  if (status !== "success") return null;

  return (
    <div className=" w-full flex bg- gap-2 overflow-auto m-auto ">
      {data?.map((friend: IUser) => (
        <div
          className=" flex-1 bg-base-200 rounded min-w-[200px] p-4"
          key={friend._id}
        >
          <div className="flex flex-col items-center gap-4 space-x-4">
            <div className="avatar">
              <div className="w-12 rounded-full">
                <img src={friend.avatarUrl?.trim() || "/avatar.avif"} />
              </div>
            </div>
            <div>
              <div className="font-semibold text-[0.95rem]">{friend.name}</div>
              <div className="text-sm opacity-50">{friend.email}</div>
            </div>
          </div>
          <button className="w-full mt-4 btn rounded-full! border-base-content/50 bg-base-100! text-base-content! ">
            Send Request
          </button>
        </div>
      ))}
    </div>
  );
}
export default FriendSuggestions;

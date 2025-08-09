import { useEffect } from "react";
import { useSearchStore } from "../store/searchStore";
import UserCard from "./userCard";
import { useAuthStore } from "../store/authStore";

function UsersList() {
  const { results } = useSearchStore();

  useEffect(() => {
  }, [results]);
  const users = results.filter(
    (user) => user._id !== useAuthStore.getState().user?._id
  );
  return (
    <div>
      <div className="py-4 flex items-center flex-col gap-1 pb-[100px] max-w-[600px] m-auto">
        {users.map((user, i) => (
          <UserCard user={user} key={i} />
        ))}
      </div>
    </div>
  );
}
export default UsersList;

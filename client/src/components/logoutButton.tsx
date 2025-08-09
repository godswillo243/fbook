import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { axiosInstance } from "../lib/axios/axiosInstance";
import { LogOutIcon } from "lucide-react";

function LogoutButton() {
  const queryClient = useQueryClient();
  const { status, mutate: logout } = useMutation({
    mutationFn: async function () {
      try {
        const response = await axiosInstance.delete("/auth/user/session", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token-id")}`,
          },
        });

        return response.data;
      } catch (error) {
        const errData = (error as AxiosError).response?.data;
        const errMsg = (errData as Record<string, string>).message;
        const err = new Error(errMsg);
        throw err;
      }
    },
  });
  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["auth-user"],
        });
        localStorage.removeItem("token-id");
      },
      onError: () => {},
    });
  };
  return (
    <div>
      <button
        className="btn w-full! text-base-content!"
        onClick={() => handleLogout()}
      >
        <LogOutIcon className="text-base-content " />
        {" "}
        {status === "pending" ? "Logging out!" : "Logout"}{" "}
      </button>
    </div>
  );
}
export default LogoutButton;

import { Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "./layouts/authLayout";
import RootLayout from "./layouts/rootLayout";
import {
  ChatPage,
  ChatsPage,
  CreatePage,
  HomePage,
  LoginPage,
  MessagesPage,
  NotificationPage,
  ProfilePage,
  ResetPasswordPage,
  SearchPage,
  SignupPage,
} from "./pages";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./lib/axios/axiosInstance";
import { useAuthStore } from "./store/authStore";
import { ToastContainer } from "./components/toaster/toastContainer";

function App() {
  const { data, status } = useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/auth/user", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token-id")}`,
          },
        });
        return response.data;
      } catch (error) {
        const err = error;
        throw err;
      }
    },
  });
  const { user } = useAuthStore();
  useEffect(() => {
    if (status === "pending") {
      return;
    }
    if (status === "success") {
      useAuthStore.setState((state) => ({
        ...state,
        user: data,
      }));
    }
    if (status === "error") {
      useAuthStore.setState((state) => ({ ...state, user: null }));
    }
  }, [data, status]);

  return (
    <div>
      <Routes>
        <Route element={user ? <RootLayout /> : <Navigate to={"/login"} />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/chats" element={<ChatsPage />}>
            <Route path="/chats/:id" element={<ChatPage />} />
          </Route>
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/notification" element={<NotificationPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="*" element={<Navigate to={"/"} />} />
        </Route>
        <Route element={user ? <Navigate to={"/"} /> : <AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>
      </Routes>

      {status === "pending" && (
        <div className="fixed top-0 right-0 w-screen h-dvh z-10 flex-center">
          <span className="loading loading-spinner text-primary loading-xl scale-150"></span>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
export default App;

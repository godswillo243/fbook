import { Outlet } from "react-router-dom";
import { lazy, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { socket } from "../lib/socket.io";

const Sidebar = lazy(() => import("../components/sidebar"));
const Topbar = lazy(() => import("../components/topbar"));
const Bottombar = lazy(() => import("../components/bottombar"));

function RootLayout() {
  const { user: authUser } = useAuthStore();

  useEffect(() => {
    socket.connect();
    socket.emit("me", { id: authUser?._id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid max-md:grid-cols-[100%] relative grid-cols-[240px_1fr] max-h-dvh h-dvh w-full bg-base-100/80">
      {/* Sidebar */}
      <Sidebar />
      <div className="rounded relative w-full z-1! max-h-dvh h-full  max-md:pt-16">
        {/* Topbar */}
        <Topbar />
        <div className=" h-full w-full overflow-x-hidden ">
          <Outlet />
        </div>
      </div>
      {/* Bottombar */}
      <Bottombar />
    </div>
  );
}
export default RootLayout;

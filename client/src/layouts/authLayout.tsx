import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="w-full h-dvh">
      <Outlet />
    </div>
  );
}
export default AuthLayout;

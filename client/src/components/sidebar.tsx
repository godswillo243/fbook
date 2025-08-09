import { Link, useLocation } from "react-router-dom";
import { navItems } from "../lib/constants";
import { PlusCircleIcon, SettingsIcon } from "lucide-react";
import LogoutButton from "./logoutButton";

function Sidebar() {
  const { pathname } = useLocation();

  return (
    <div className="w-full h-full p-2 bg-transparent  max-md:hidden">
      <div className="w-full h-full bg-base-200/30 rounded flex justify-between flex-col gap-6">
        <div className="w-full py-4 p-4">
          <Link
            to={"/"}
            className="w-full  font-['Playpen_Sans',_Roboto,_sans-serif] font-bold tracking-wider text-3xl"
          >
            Fb<span className="text-primary">oo</span>k
          </Link>
        </div>
        <div>
          <ul className="menu  rounded-box w-56 gap-4">
            {navItems.map(({ icon: Icon, path, title }) => {
              const isActive = pathname === path;
              return (
                <li
                  className={` ${isActive && "text-primary font-bold"}`}
                  key={path}
                >
                  <Link to={path} className="w-full">
                    <Icon className={"size-[1.5em]"} />
                    {title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="flex-center w-full ">
          <ul className="menu  rounded-box w-56 gap-2">
            <li className="">
              <Link
                to="/create"
                className="bg-transparent hover:bg-base-300 p-2"
              >
                <PlusCircleIcon />
                Create Post
              </Link>
            </li>
            <li className="">
              <Link
                to="/settings"
                className="bg-transparent hover:bg-base-300 p-2"
              >
                <SettingsIcon />
                Settings
              </Link>
            </li>
            <LogoutButton />
          </ul>
        </div>
      </div>
    </div>
  );
}
export default Sidebar;

import { MenuIcon, SettingsIcon, XIcon } from "lucide-react";
import LogoutButton from "./logoutButton";
import { Link } from "react-router-dom";
import { useState } from "react";
import { PlusCircleIcon } from "lucide-react";

const Menu = () => {
  return (
    <div className="fixed top-0 ">
      <ul className="menu bg-base-200 rounded-box w-56 gap-2">
        <li className="bg-base-300">
          <Link to="/settings">
            <SettingsIcon />
            Settings
          </Link>
        </li>
        <LogoutButton />
      </ul>
    </div>
  );
};

function Topbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className=" flex justify-between  backdrop-blur-2xl items-center md:hidden absolute top-1 left-1/2 -translate-x-1/2  w-full rounded pt-3 pb-2 px-4">
      <Link
        to={"/"}
        className="w-full  font-['Playpen_Sans',_Roboto,_sans-serif] font-bold tracking-wider text-2xl"
      >
        Fb<span className="text-primary">oo</span>k
      </Link>
      <div className="flex-center gap-2">
        <Link to={"/create"} className="p-2 flex flex-center gap-1 ">
          <PlusCircleIcon className="w-8 h-8 text-primary" />
          <span className="">Create</span>
        </Link>
        <label className="btn btn-circle relative cursor-pointer z-50 swap  swap-rotate">
          <input
            type="checkbox"
            onChange={(e) => setIsMenuOpen(e.target.checked)}
            checked={isMenuOpen}
            hidden
          />
          <XIcon className="text-base-content swap-on absolute top-1/2 left-1/2 -translate-1/2" />
          <MenuIcon className="text-base-content swap-off absolute top-1/2 left-1/2 -translate-1/2" />
        </label>
      </div>

      {isMenuOpen && (
        <>
          <div
            className="fixed top-0 left-0 h-[99dvh] w-screen z-[100] front bg-black/2"
            onClick={() => setIsMenuOpen(false)}
          >
            <Menu />
          </div>
        </>
      )}
    </div>
  );
}
export default Topbar;

//{/* <label className="btn btn-circle swap swap-rotate">

//   <input type="checkbox" />

//   {/* hamburger icon */}
//   <svg
//     className="swap-off fill-current"
//     xmlns="http://www.w3.org/2000/svg"
//     width="32"
//     height="32"
//     viewBox="0 0 512 512">
//     <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
//   </svg>

//   {/* close icon */}
//   <svg
//     className="swap-on fill-current"
//     xmlns="http://www.w3.org/2000/svg"
//     width="32"
//     height="32"
//     viewBox="0 0 512 512">
//     <polygon
//       points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
//   </svg>
// </label> */}

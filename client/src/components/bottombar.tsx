import { Link, useLocation } from "react-router-dom";
import { navItems } from "../lib/constants";

function Bottombar() {
  const { pathname } = useLocation();
  return (
    <div className=" md:hidden fixed bottom-0 left-1/2 -translate-x-1/2 dock dock-md">
      {navItems.map(({ icon: Icon, path, title }) => {
        const isActive = path.split("/")[1] === pathname.split("/")[1];
        return (
          <Link
            to={path}
            key={path}
            className={`${isActive && "dock-active text-primary"}`}
          >
            <Icon className={"size-[1.5em]"} />
            <span className="dock-label">{title}</span>
          </Link>
        );
      })}
    </div>
  );
}
export default Bottombar;

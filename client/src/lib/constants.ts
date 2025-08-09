import {
  BellIcon,
  HomeIcon,
  MessageSquareIcon,
  SearchIcon,
  User2Icon,
} from "lucide-react";

export const navItems = [
  {
    title: "Home",
    path: "/",
    icon: HomeIcon,
  },
  {
    title: "Chats",
    path: "/chats",
    icon: MessageSquareIcon,
  },
  {
    title: "Search",
    path: "/search",
    icon: SearchIcon,
  },
  {
    title: "Notification",
    path: "/notification",
    icon: BellIcon,
  },
  {
    title: "Profile",
    path: "/profile/me",
    icon: User2Icon,
  },
];

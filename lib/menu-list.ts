import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon,
  CircleHelp
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/verified/home",
          label: "Home",
          active: pathname.includes("/verified/home"),
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Contents",
      menus: [
        {
          href: "",
          label: "Products",
          active: pathname.includes("/nothing"),
          icon: SquarePen,
          submenus: [
            // {
            //   href: "/posts",
            //   label: "All Posts",
            //   active: pathname === "/posts"
            // },
            // {
            //   href: "/posts/new",
            //   label: "New Post",
            //   active: pathname === "/posts/new"
            // }
          ],
        },
        // {
        //   href: "/categories",
        //   label: "Categories",
        //   active: pathname.includes("/categories"),
        //   icon: Bookmark,
        //   submenus: []
        // },
      ],
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/verified/settings/account",
          label: "Account",
          active: pathname.includes("/settings/account"),
          icon: Users,
          submenus: [],
        },
        {
          href: "/verified/settings/contact-support",
          label: "Contact Support",
          active: pathname.includes("/settings/contact-support"),
          icon: CircleHelp,
          submenus: [],
        },
      ],
    },
  ];
}

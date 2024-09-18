import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon,
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

export function getAdminList(pathname: string): Group[] {
  return [
    {
      groupLabel: "Admin",
      menus: [
        {
          href: "/verified/admin",
          label: "Admin",
          active: pathname === "/verified/admin",
          icon: Settings,
          submenus: [
            {
              href: "/verified/admin/inventory",
              label: "Inventory",
              active: pathname.includes("/admin/inventory"),
            },
            // {
            //   href: "/posts/new",
            //   label: "New Post",
            //   active: pathname === "/posts/new",
            // },
          ],
        },
      ],
    },
  ];
}

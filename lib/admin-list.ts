import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon,
  Archive,
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
          href: "/verified/admin/inventory",
          label: "Inventory",
          active: pathname === "/verified/admin/inventory",
          icon: Archive,
          submenus: [
            {
              href: "/verified/admin/inventory/flower",
              label: "Flower",
              active: pathname.includes("/admin/inventory/flower"),
            },
            {
              href: "/verified/admin/inventory/condiments",
              label: "Condiments",
              active: pathname.includes("/admin/inventory/condiments"),
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

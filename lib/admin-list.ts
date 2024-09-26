import { ClipboardList, LucideIcon, Archive, Receipt } from "lucide-react";

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
          active: pathname === "/verified/admin/inventory/nothing",
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
          ],
        },
        {
          href: "/verified/admin/orders",
          label: "Orders",
          active: pathname === "/verified/admin/orders/nothing",
          icon: ClipboardList,
          submenus: [
            {
              href: "/verified/admin/orders/history",
              label: "History",
              active: pathname.includes("/admin/orders/history"),
            },
            {
              href: "/verified/admin/orders/new-order",
              label: "New Order",
              active: pathname.includes("/admin/orders/new-order"),
            },
          ],
        },
        // {
        //   href: "/verified/admin/pricing",
        //   label: "Pricing",
        //   active: pathname === "/verified/admin/pricing/nothing",
        //   icon: Receipt,
        //   submenus: [
        //     {
        //       href: "/verified/admin/pricing/flower",
        //       label: "Flower",
        //       active: pathname.includes("/admin/pricing/flower"),
        //     },
        //     {
        //       href: "/verified/admin/pricing/condiments",
        //       label: "Condiments",
        //       active: pathname.includes("/admin/pricing/condiments"),
        //     },
        //   ],
        // },
      ],
    },
  ];
}

"use client";

import * as React from "react";
import {
  IconAddressBook,
  IconBuildingBank,
  IconBuildingEstate,
  IconCamera,
  IconChartBar,
  IconChartLine,
  IconCoinBitcoin,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconLock,
  IconPlus,
  IconReport,
  IconScript,
  IconSearch,
  IconSettings,
  IconUsers,
  IconWallet,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Logo from "./logo";

const data = {
  user: {
    name: "user",
    email: "m@example.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Crypto Wallet",
      url: "/dashboard/crypto",
      icon: IconWallet,
    },
    {
      title: "Assets",
      url: "/dashboard/invest/asset",
      icon: IconBuildingEstate,
    },
    {
      title: "Banking",
      url: "/dashboard/banking",
      icon: IconBuildingBank,
    },
    {
      title: "Trading",
      url: "/dashboard/trading",
      icon: IconChartLine,
    },
  ],

  navSecondary: [
    {
      title: "Privacy Policy",
      url: "/privacy",
      icon: IconLock,
    },
    {
      title: "Terms and Condition",
      url: "/terms",
      icon: IconScript,
    },
    {
      title: "Contact",
      url: "/contact",
      icon: IconAddressBook,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: IconFileWord,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <Logo />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}

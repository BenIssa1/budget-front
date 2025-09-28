"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconSettingsCheck
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/useAuth"
import { useManagerMode } from "@/hooks/useManagerMode"
import { UserRole } from "@/types/auth"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
      roles: ["User", "Admin"],
    },
    {
      title: "Budget",
      url: "/budget",
      icon: IconListDetails,
      roles: ["User", "Admin"],
    },
    {
      title: "Service",
      url: "/service",
      icon: IconChartBar,
      roles: ["User", "Admin"],
    },
    {
      title: "Extension",
      url: "/extension",
      icon: IconFolder,
      roles: ["User", "Admin"],
    },
    {
      title: "Tarifcation",
      url: "#",
      icon: IconUsers,
      roles: ["Admin"],
      items: [
        {
          title: "Gratuit",
          url: "/pricing/free",
          roles: ["Admin"],
        },
        {
          title: "Payant",
          url: "/pricing/paying",
          roles: ["Admin"],
        },
      ]
    },
    {
      title: "Paramètre",
      url: "#",
      icon: IconSettingsCheck,
      roles: ["Admin"],
      items: [
        {
          title: "Utilisateur",
          url: "/user",
          roles: ["Admin"],
        },
        {
          title: "Configuration",
          url: "/config",
          roles: ["Admin"],
        },
      ]
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
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
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  const { effectiveRole } = useManagerMode();

  // Fonction pour vérifier si un menu est accessible
  const isMenuAccessible = (
    menuRoles: UserRole[],
    userRole?: string
  ): boolean => {
    if (!userRole) return false;
    return menuRoles.includes(userRole as UserRole);
  };

  // Fonction pour filtrer les items de menu selon le rôle
  const filterMenuItems = (items: any[]): any[] => {
    return items
      .filter((item) => {
        // Vérifier si l'item principal est accessible
        if (item.roles && !isMenuAccessible(item.roles, effectiveRole)) {
          return false;
        }
        return true;
      })
      .map((item) => {
        // Filtrer les sous-items si ils existent
        if (item.items) {
          return {
            ...item,
            items: item.items.filter((subItem: any) => {
              if (subItem.roles && !isMenuAccessible(subItem.roles, effectiveRole)) {
                return false;
              }
              return true;
            })
          };
        }
        return item;
      })
      .filter((item) => {
        // Si l'item a des sous-items, ne l'afficher que s'il en reste au moins un
        if (item.items && item.items.length === 0) {
          return false;
        }
        return true;
      });
  };

  // Filtrer les items de menu selon le rôle de l'utilisateur
  const accessibleMenuItems = filterMenuItems(data.navMain);

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
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Budget Manager</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={accessibleMenuItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

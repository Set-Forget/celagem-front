"use client"

import {
  ChevronRight,
  LayoutDashboard
} from 'lucide-react';
import * as React from 'react';

import { NavUser } from "@/components/nav-user";
import { CollapsibleContent, Collapsible as CollapsibleRoot, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useGetProfileQuery } from "@/lib/services/auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NavItem, navItems } from '@/lib/nav-items';

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const router = useRouter()

  const { data: userProfile } = useGetProfileQuery()

  const isActive = (item: NavItem): boolean =>
    (item.url !== "#" && pathname.startsWith(item.url)) || (!!item.items && item.items.some(isActive))

  const [openKeys, setOpenKeys] = React.useState<Record<string, boolean>>(() => {
    const keys: Record<string, boolean> = {}
    const traverse = (items: NavItem[], parentKey = "") => {
      items.forEach((item) => {
        if (item.items) {
          const fullKey = parentKey ? `${parentKey}-${item.title}` : item.title
          keys[fullKey] = isActive(item)
          traverse(item.items, fullKey)
        }
      })
    }
    traverse(navItems.navMain)
    return keys
  })

  const renderSubMenu = (items: NavItem[], parentKey = ""): React.ReactElement => (
    <SidebarMenuSub>
      {items.map((item) => {
        const active = isActive(item)
        const fullKey = parentKey ? `${parentKey}-${item.title}` : item.title

        if (item.items) {
          return (
            <CollapsibleRoot
              key={fullKey}
              open={openKeys[fullKey]}
              onOpenChange={(open) => setOpenKeys((prev) => ({ ...prev, [fullKey]: open }))}
              className="group/submenu"
            >
              <SidebarMenuSubItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuSubButton isActive={active} className="cursor-pointer">
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/submenu:rotate-90" />
                  </SidebarMenuSubButton>
                </CollapsibleTrigger>
                <CollapsibleContent>{renderSubMenu(item.items, fullKey)}</CollapsibleContent>
              </SidebarMenuSubItem>
            </CollapsibleRoot>
          )
        }
        return (
          <SidebarMenuSubItem key={fullKey}>
            <SidebarMenuSubButton isActive={active} asChild>
              <Link href={item.url}>
                <p className='truncate'>
                  {item.title}
                </p>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        )
      })}
    </SidebarMenuSub>
  )

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <NavUser user={userProfile?.data} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem key="Dashboard">
              <SidebarMenuButton
                tooltip="Dashboard"
                isActive={pathname === "/dashboard"}
                onClick={() => router.push("/dashboard")}
              >
                <LayoutDashboard />
                Tablero
              </SidebarMenuButton>
            </SidebarMenuItem>
            {navItems.navMain.map((item) => {
              const active = isActive(item)
              if (item.items) {
                return (
                  <CollapsibleRoot
                    key={item.title}
                    open={openKeys[item.title]}
                    onOpenChange={(open) => setOpenKeys((prev) => ({ ...prev, [item.title]: open }))}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton isActive={active} tooltip={item.title}>
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>{renderSubMenu(item.items, item.title)}</CollapsibleContent>
                    </SidebarMenuItem>
                  </CollapsibleRoot>
                )
              }
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton tooltip={item.title} isActive={active} onClick={() => router.push(item.url)}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

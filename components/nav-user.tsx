"use client"

import {
  ChevronsUpDown,
  LogOut
} from "lucide-react"

import {
  Avatar,
  AvatarFallback
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { UserList } from "@/lib/schemas/users"
import { cn, placeholder } from "@/lib/utils"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"

export function NavUser({
  user,
}: {
  user: UserList | undefined
}) {
  const router = useRouter()
  const { isMobile } = useSidebar()

  const handleLogout = () => {
    Cookies.remove('sessionToken');
    router.push('/sign-in');
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className={cn("rounded-lg")}>
                  <span className={cn(!user ? "blur-[4px]" : "blur-none")}>
                    {user ? user.first_name[0] + user.last_name[0] : "CN"}
                  </span>
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className={cn("truncate font-semibold transition-all duration-300", !user ? "blur-[4px]" : "blur-none")}>
                  {!user ? `${placeholder(6)} ${placeholder(9)}` : `${user?.first_name} ${user?.last_name}`}
                </span>
                <span className={cn("truncate text-xs transition-all duration-300", !user ? "blur-[4px]" : "blur-none")}>
                  {!user ? placeholder(18) : user?.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className={cn("rounded-lg")}>
                    <span className={cn(!user ? "blur-[4px]" : "blur-none")}>
                      {user ? user.first_name[0] + user.last_name[0] : "CN"}
                    </span>
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user?.first_name} {user?.last_name}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={handleLogout}
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

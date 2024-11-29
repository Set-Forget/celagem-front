"use client"

import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader
} from "@/components/ui/sidebar"


export function CustomersSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  return (
    <Sidebar className="w-96" variant="inset" side="right" collapsible="none" {...props}>
      <SidebarHeader>
        header
      </SidebarHeader>
      <SidebarContent>
        content
      </SidebarContent>
    </Sidebar>
  )
}

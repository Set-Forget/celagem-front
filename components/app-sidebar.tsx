"use client"

import {
  AudioWaveform,
  Box,
  ChevronRight,
  Command,
  FileText,
  GalleryVerticalEnd,
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart
} from "lucide-react"
import * as React from "react"

import { NavUser } from "@/components/nav-user"
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
  SidebarMenuSubItem
} from "@/components/ui/sidebar"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import Link from "next/link"
import { usePathname } from "next/navigation"

// This is sample data.
const data = {
  user: {
    name: "Agustin Delgado",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Ventas",
      url: "#",
      icon: ShoppingBag,
      isActive: true,
      items: [
        {
          title: "Facturas de venta",
          url: "/sales/invoices",
        },
        {
          title: "Notas de crédito",
          url: "/sales/credit-notes",
        },
        {
          title: "Notas de débito",
          url: "/purchases/debit-notes",
        },
        {
          title: "Clientes",
          url: "/sales/customers",
        },
      ],
    },
    {
      title: "Compras",
      url: "#",
      icon: ShoppingCart,
      items: [
        {
          title: "Solicitudes de pedido",
          url: "/purchases/purchase-requests",
        },
        {
          title: "Ordenes de compra",
          url: "/purchases/purchase-orders",
        },
        {
          title: "Recepciones",
          url: "/purchases/purchase-receipts",
        },
        {
          title: "Facturas",
          url: "/purchases/bills",
        },
        {
          title: "Proveedores",
          url: "/purchases/vendors",
        }
      ],
    },
    {
      title: "Contabilidad",
      url: "#",
      icon: FileText,
      items: [
        {
          title: "Plan de cuentas",
          url: "/accounting/chart-of-accounts",
        },
        {
          title: "Asientos contables",
          url: "/accounting/journal-entries",
        },
        {
          title: "Centros de costos",
          url: "/accounting/cost-centers",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <NavUser user={data.user} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem key="Dashboard">
              <SidebarMenuButton asChild tooltip="Dashboard">
                <Link href="/dashboard">
                  <LayoutDashboard />
                  Tablero
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {data.navMain.map((item) => (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            isActive={pathname.includes(subItem.url)}
                            asChild
                          >
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
            <SidebarMenuItem key="Inventory">
              <SidebarMenuButton asChild tooltip="Inventory">
                <Link href="/inventory">
                  <Box />
                  Inventario
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

"use client"

import {
  AudioWaveform,
  Box,
  ChevronRight,
  Command,
  FileText,
  GalleryVerticalEnd,
  Landmark,
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  Stethoscope
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

const data = {
  user: {
    name: "Agustin Delgado",
    email: "m@example.com",
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
      items: [
        {
          title: "Facturas",
          url: "/sales/invoices",
        },
        {
          title: "Notas de crédito",
          url: "/sales/credit-notes",
        },
        {
          title: "Notas de débito",
          url: "/sales/debit-notes",
        },
        {
          title: "Remitos",
          url: "/sales/delivery-notes",
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
        {
          title: "Cuentas por cobrar",
          url: "/accounting/accounts-receivable",
        },
        {
          title: "Cuentas por pagar",
          url: "/accounting/accounts-payable",
        },
      ],
    },
    {
      title: "Tesorería",
      url: "#",
      icon: Landmark,
      items: [
        {
          title: "Pagos",
          url: "/banking/payments",
        },
        {
          title: "Cobros",
          url: "/banking/receipts",
        },
      ],
    },
    {
      title: "Inventario",
      url: "/inventory",
      icon: Box,
    },
    {
      title: "Gestión médica",
      url: "#",
      icon: Stethoscope,
      items: [
        {
          title: "Agenda",
          url: "/medical-management/scheduler",
        },
        {
          title: "Pacientes",
          url: "/medical-management/patients",
        },
        {
          title: "Plantillas",
          url: "/medical-management/templates",
        }
      ],
    }
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
            {data.navMain.map((item) => {
              const parentIsActive = item.items
                ? item.items.some((subItem) => pathname.includes(subItem.url))
                : pathname.includes(item.url)

              return (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={parentIsActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        isActive={parentIsActive}
                        asChild
                        tooltip={item.title}
                      >
                        <Link href={item.url}>
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                          {item.items && (
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    {item.items && (
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
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
                    )}
                  </SidebarMenuItem>
                </Collapsible>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

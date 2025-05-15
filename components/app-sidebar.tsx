"use client"

import {
  Box,
  ChevronRight,
  FileText,
  Landmark,
  LayoutDashboard,
  type LucideIcon,
  ShoppingBag,
  ShoppingCart,
  Stethoscope,
  Building,
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
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Collapsible as CollapsibleRoot, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { useGetProfileQuery } from "@/lib/services/auth"

export interface NavItem {
  title: string
  url: string
  icon?: LucideIcon
  items?: NavItem[]
}

const data: { navMain: NavItem[] } = {
  navMain: [
    {
      title: "Ventas",
      url: "#",
      icon: ShoppingBag,
      items: [
        { title: "Facturas", url: "/sales/invoices" },
        { title: "Remitos", url: "/sales/delivery-notes" },
        { title: "Clientes", url: "/sales/customers" },
      ],
    },
    {
      title: "Compras",
      url: "#",
      icon: ShoppingCart,
      items: [
        { title: "Solicitudes de pedido", url: "/purchases/purchase-requests" },
        { title: "Ordenes de compra", url: "/purchases/purchase-orders" },
        { title: "Recepciones", url: "/purchases/purchase-receipts" },
        { title: "Facturas", url: "/purchases/bills" },
        { title: "Proveedores", url: "/purchases/vendors" },
      ],
    },
    {
      title: "Contabilidad",
      url: "#",
      icon: FileText,
      items: [
        { title: "Plan de cuentas", url: "/accounting/chart-of-accounts" },
        { title: "Diarios contables", url: "/accounting/journals" },
        { title: "Asientos contables", url: "/accounting/journal-entries" },
        { title: "Centros de costos", url: "/accounting/cost-centers" },
        { title: "Cuentas por cobrar", url: "/accounting/accounts-receivable" },
        { title: "Cuentas por pagar", url: "/accounting/accounts-payable" },
        { title: "Cuentas corrientes", url: "/accounting/current-accounts" },
      ],
    },
    {
      title: "Tesorería",
      url: "#",
      icon: Landmark,
      items: [
        { title: "Pagos", url: "/banking/payments" },
        { title: "Cobros", url: "/banking/receipts" },
      ],
    },
    {
      title: "Hojas de ruta",
      url: "#",
      icon: Building,
      items: [
        { title: "Puestos de trabajo", url: "/register/job-positions" },
        { title: "Servicios", url: "/register/services" },
        { title: "Examenes Medicos", url: "/register/medical-exams" },
        { title: "Materiales", url: "/register/materials" },
        { title: "Actos Clinicos", url: "/register/procedures" },
      ],
    },
    {
      title: "Inventario",
      url: "#",
      icon: Box,
      items: [
        { title: "Materiales", url: "/inventory/materials" },
        { title: "Almacenes", url: "/inventory/warehouses" },
      ],
    },
    {
      title: "Gestión médica",
      url: "#",
      icon: Stethoscope,
      items: [
        { title: "Calendario", url: "/medical-management/calendar" },
        { title: "Pacientes", url: "/medical-management/patients" },
        { title: "Visitas", url: "/medical-management/visits" },
        {
          title: "Maestros",
          url: "#",
          items: [
            { title: "Plantillas", url: "/medical-management/templates" },
            { title: "Secciones", url: "/medical-management/sections" },
          ],
        },
      ],
    },
  ],
}

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
    traverse(data.navMain)
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
              <Link href={item.url}>{item.title}</Link>
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
            {data.navMain.map((item) => {
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

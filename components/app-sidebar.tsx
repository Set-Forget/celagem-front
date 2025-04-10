'use client';

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
  Stethoscope,
  Building,
} from 'lucide-react';
import * as React from 'react';

import { NavUser } from '@/components/nav-user';
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
} from '@/components/ui/sidebar';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { useGetProfileQuery } from "@/lib/services/auth"

const data = {
  navMain: [
    {
      title: 'Ventas',
      url: '#',
      icon: ShoppingBag,
      items: [
        {
          title: 'Facturas',
          url: '/sales/invoices',
        },
        {
          title: 'Remitos',
          url: '/sales/delivery-notes',
        },
        {
          title: 'Clientes',
          url: '/sales/customers',
        },
      ],
    },
    {
      title: 'Compras',
      url: '#',
      icon: ShoppingCart,
      items: [
        {
          title: 'Solicitudes de pedido',
          url: '/purchases/purchase-requests',
        },
        {
          title: 'Ordenes de compra',
          url: '/purchases/purchase-orders',
        },
        {
          title: 'Recepciones',
          url: '/purchases/purchase-receipts',
        },
        {
          title: 'Facturas',
          url: '/purchases/bills',
        },
        {
          title: 'Proveedores',
          url: '/purchases/vendors',
        },
      ],
    },
    {
      title: 'Contabilidad',
      url: '#',
      icon: FileText,
      items: [
        {
          title: 'Plan de cuentas',
          url: '/accounting/chart-of-accounts',
        },
        {
          title: 'Asientos contables',
          url: '/accounting/journal-entries',
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
        {
          title: "Reportes",
          url: "/accounting/reports",
        },
        {
          title: "Tipos de cuentas",
          url: "/accounting/account-types-master",
        },
        {
          title: "Extras",
          url: "/accounting/extras",
        },
      ],
    },
    {
      title: 'Tesorería',
      url: '#',
      icon: Landmark,
      items: [
        {
          title: 'Pagos',
          url: '/banking/payments',
        },
        {
          title: 'Cobros',
          url: '/banking/receipts',
        },
      ],
    },
    {
      title: 'Hojas de ruta',
      url: '#',
      icon: Building,
      items: [
        {
          title: 'Puestos de trabajo',
          url: '/register/job-positions',
        },
        {
          title: 'Servicios',
          url: '/register/services',
        },
        {
          title: 'Examenes Medicos',
          url: '/register/medical-exams',
        },
        {
          title: 'Materiales',
          url: '/register/materials',
        },
        {
          title: 'Actos Clinicos',
          url: '/register/procedures',
        },
      ],
    },
    {
      title: 'Inventario',
      url: '#',
      icon: Box,
      items: [
        {
          title: 'Materiales',
          url: '/inventory/materials',
        },
        {
          title: 'Almacenes',
          url: '/inventory/warehouses',
        },
      ],
    },
    {
      title: 'Gestión médica',
      url: '#',
      icon: Stethoscope,
      items: [
        {
          title: 'Agenda',
          url: '/medical-management/scheduler',
        },
        {
          title: 'Pacientes',
          url: '/medical-management/patients',
        },
        {
          title: "Plantillas",
          url: "/medical-management/templates",
        }
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const router = useRouter()

  const { data: userProfile } = useGetProfileQuery()

  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      {...props}
    >
      <SidebarHeader>
        <NavUser user={userProfile?.data} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem key="Dashboard">
              <SidebarMenuButton
                tooltip="Dashboard"
                onClick={() => router.push("/dashboard")}
              >
                <LayoutDashboard />
                Tablero
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
                        onClick={() => router.push(item.url)}
                        tooltip={item.title}
                      >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        {item.items && (
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    {item.items && (
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem role="button" key={subItem.title}>
                              <SidebarMenuSubButton
                                isActive={pathname.includes(subItem.url)}
                                asChild
                              >
                                <Link href={subItem.url}>
                                  {subItem.title}
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
  );
}

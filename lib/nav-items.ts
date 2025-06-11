import {
  Box,
  ChartPie,
  FileText,
  Landmark,
  LucideIcon,
  Map,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Stethoscope
} from 'lucide-react';

export interface NavItem {
  title: string
  url: string
  icon?: LucideIcon
  items?: NavItem[]
}

const salesItems = [
  {
    title: "Comprobantes",
    url: "/sales/invoices"
  },
  {
    title: "Remitos",
    url: "/sales/delivery-notes"
  },
  {
    title: "Clientes",
    url: "/sales/customers"
  },
]

const purchasesItems = [
  {
    title: "Solicitudes de pedido",
    url: "/purchases/purchase-requests"
  },
  {
    title: "Ordenes de compra",
    url: "/purchases/purchase-orders"
  },
  {
    title: "Recepciones",
    url: "/purchases/purchase-receipts"
  },
  {
    title: "Comprobantes",
    url: "/purchases/bills"
  },
  {
    title: "Proveedores",
    url: "/purchases/vendors"
  }
]

const accountingItems = [
  {
    title: "Plan de cuentas",
    url: "/accounting/chart-of-accounts"
  },
  /*   {
      title: "Diarios contables",
      url: "/accounting/journals"
    }, */
  {
    title: "Asientos contables",
    url: "/accounting/journal-entries"
  },
  {
    title: "Centros de costos",
    url: "/accounting/cost-centers"
  },
]

const reportingItems = [
  {
    title: "Reportes",
    url: "/reporting/reports",
  },
  {
    title: "Tipos de cuentas",
    url: "/reporting/account-types-master",
  },
  {
    title: "Cuentas por cobrar",
    url: "/reporting/accounts-receivable/filter"
  },
  {
    title: "Cuentas por pagar",
    url: "/reporting/accounts-payable/filter"
  },
  {
    title: "Cuentas corrientes",
    url: "/reporting/current-accounts"
  },
]

const treasuryItems = [
  {
    title: "Pagos",
    url: "/banking/payments"
  },
  {
    title: "Cobros",
    url: "/banking/receipts"
  },
]

const administrationItems = [
  {
    title: 'Usuarios',
    url: '/management/users',
  },
  {
    title: 'Roles',
    url: '/management/roles',
  },
  {
    title: 'Compañias',
    url: '/management/companies',
  },
  {
    title: 'Unidades de negocios',
    url: '/management/business-units',
  },
  {
    title: 'Clases',
    url: '/management/classes',
  },
  {
    title: "Extras",
    url: "/management/extras",
  },
]

const registerItems = [
  {
    title: "Puestos de trabajo",
    url: "/register/job-positions"
  },
  {
    title: "Servicios",
    url: "/register/services"
  },
  {
    title: "Examenes Medicos",
    url: "/register/medical-exams"
  },
  {
    title: "Materiales",
    url: "/register/materials"
  },
  {
    title: "Actos Clinicos",
    url: "/register/procedures"
  },
]

const inventoryItems = [
  {
    title: 'Stock',
    url: '/inventory/stock',
  },
  {
    title: 'Almacenes',
    url: '/inventory/warehouses',
  },
  {
    title: 'Locaciones',
    url: '/inventory/locations',
  },
  {
    title: 'Productos',
    url: '/inventory/products',
  },
  {
    title: 'Transferencias internas',
    url: '/inventory/internal-transfers',
  }
]

const medicalManagementItems = [
  {
    title: "Calendario",
    url: "/medical-management/calendar"
  },
  {
    title: "Pacientes",
    url: "/medical-management/patients"
  },
  {
    title: "Visitas",
    url: "/medical-management/visits"
  },
  {
    title: "Maestros",
    url: "#",
    items: [
      {
        title: "Plantillas",
        url: "/medical-management/templates"
      },
      {
        title: "Secciones",
        url: "/medical-management/sections"
      },
    ],
  },
]

export const navItems: { navMain: NavItem[] } = {
  navMain: [
    {
      title: "Ventas",
      url: "#",
      icon: ShoppingBag,
      items: salesItems,
    },
    {
      title: "Compras",
      url: "#",
      icon: ShoppingCart,
      items: purchasesItems,
    },
    {
      title: 'Hojas de ruta',
      url: '#',
      icon: Map,
      items: registerItems,
    },
    {
      title: "Inventario",
      url: "#",
      icon: Box,
      items: inventoryItems,
    },
    {
      title: "Tesorería",
      url: "#",
      icon: Landmark,
      items: treasuryItems
    },
    {
      title: "Contabilidad",
      url: "#",
      icon: FileText,
      items: accountingItems,
    },
    {
      title: "Reportes",
      url: "#",
      icon: ChartPie,
      items: reportingItems,
    },
    {
      title: 'Administracion',
      url: '#',
      icon: Settings,
      items: administrationItems,
    },
    {
      title: "Gestión médica",
      url: "#",
      icon: Stethoscope,
      items: medicalManagementItems,
    },
  ],
}
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import CustomerSidebar from "./components/customer-sidebar";


export default function CustomerLayout({ children }: { children: ReactNode }) {

  return (
    <div>
      {children}
    </div>

  )
}
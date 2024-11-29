import Header from "@/components/header";
import { InvoicesTable } from "./components/invoices-table";
import { Separator } from "@/components/ui/separator";

export default function InvoicesPage() {
  return (
    <div>
      <Header />
      <Separator />
      <div className="flex flex-col gap-4 h-[calc(100svh-135px)] p-4">
        <InvoicesTable />
      </div>
    </div>
  )
}
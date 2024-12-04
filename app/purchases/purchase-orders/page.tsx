import Header from "@/components/header";
import { Separator } from "@/components/ui/separator";
import { PurchaseOrdersTable } from "./components/purchase-orders-table";

export default function PurchaseOrdersPage() {
  return (
    <>
      <Header />
      <Separator />
      <div className="flex flex-col gap-4 h-[calc(100svh-135px)] p-4">
        <PurchaseOrdersTable />
      </div>
    </>
  )
}
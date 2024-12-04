import Header from "@/components/header";
import { Separator } from "@/components/ui/separator";
import { PurchaseRequestsTable } from "./components/purchase-requests-table";

export default function PurchaseRequestsPage() {
  return (
    <>
      <Header />
      <Separator />
      <div className="flex flex-col gap-4 h-[calc(100svh-135px)] p-4">
        <PurchaseRequestsTable />
      </div>
    </>
  )
}
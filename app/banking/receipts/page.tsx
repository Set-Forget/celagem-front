import Header from "@/components/header";
import { Separator } from "@/components/ui/separator";
import { ReceiptsTable } from "./components/receipts-table";

export default function ReceiptsPage() {

  return (
    <>
      <Header title="Cobros" />
      <Separator />
      <div className="flex flex-col gap-4 h-[calc(100svh-135px)] p-4">
        <ReceiptsTable />
      </div>
    </>
  )
}
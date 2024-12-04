import Header from "@/components/header";
import { BillsTable } from "./components/bills-table";
import { Separator } from "@/components/ui/separator";

export default function BillsPage() {
  return (
    <>
      <Header />
      <Separator />
      <div className="flex flex-col gap-4 h-[calc(100svh-135px)] p-4">
        <BillsTable />
      </div>
    </>
  )
}
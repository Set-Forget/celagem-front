import Header from "@/components/header";
import { Separator } from "@/components/ui/separator";
import { PaymentsTable } from "./components/payments-table";

export default function PaymentsPage() {

  return (
    <>
      <Header title="Pagos" />
      <Separator />
      <div className="flex flex-col gap-4 h-[calc(100svh-135px)] p-4">
        <PaymentsTable />
      </div>
    </>
  )
}
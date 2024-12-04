import Header from "@/components/header";
import { CustomersTable } from "./components/customers-table";
import { Separator } from "@/components/ui/separator";

export default function CustomersPage() {

  return (
    <>
      <Header />
      <Separator />
      <div className="flex flex-col gap-4 p-4 h-[calc(100svh-127px)]">
        <CustomersTable />
      </div>
    </>
  )
}
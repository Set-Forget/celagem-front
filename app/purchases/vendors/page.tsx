import Header from "@/components/header";
import { SuppliersTable } from "./components/suppliers-table";
import { Separator } from "@/components/ui/separator";

export default function SuppliersPage() {

  return (
    <>
      <Header />
      <Separator />
      <div className="flex flex-col gap-4 p-4 h-[calc(100svh-127px)]">
        <SuppliersTable />
      </div>
    </>
  )
}
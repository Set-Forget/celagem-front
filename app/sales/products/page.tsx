import Header from "@/components/header";
import { Separator } from "@/components/ui/separator";
import { ProductsTable } from "./components/products-table";

export default function ProductsPage() {
  return (
    <>
      <Header />
      <Separator />
      <div className="flex flex-col gap-4 h-[calc(100svh-135px)] p-4">
        <ProductsTable />
      </div>
    </>
  )
}
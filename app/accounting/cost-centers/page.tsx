import Header from "@/components/header";
import { Separator } from "@/components/ui/separator";
import { CostCentersTable } from "./components/cost-centers-table";
import NewCostCenterDialog from "./components/new-cost-center-dialog";


export default function CostsCenterPage() {

  return (
    <>
      <Header title="Centro de costos" />
      <Separator />
      <div className="flex flex-col gap-4 h-[calc(100svh-135px)] p-4">
        <CostCentersTable />
      </div>
      <NewCostCenterDialog />
    </>
  )
}
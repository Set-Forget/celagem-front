import Header from "@/components/header";
import { Separator } from "@/components/ui/separator";
import { JournalEntriesTable } from "./components/journal-entries-table";

export default function JournalEntriesPage() {

  return (
    <>
      <Header title="Asientos contables" />
      <Separator />
      <div className="flex flex-col gap-4 h-[calc(100svh-135px)] p-4">
        <JournalEntriesTable />
      </div>
    </>
  )
}
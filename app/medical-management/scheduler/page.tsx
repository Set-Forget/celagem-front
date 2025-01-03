import Scheduler from "@/app/medical-management/scheduler/components/scheduler";
import { Suspense } from "react";


export default function SchedulerPage() {

  return (
    <Suspense>
      <Scheduler />
    </Suspense>
  )
}
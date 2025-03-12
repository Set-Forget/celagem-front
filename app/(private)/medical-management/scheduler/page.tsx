import Scheduler from "@/app/(private)/medical-management/scheduler/components/scheduler";
import { Suspense } from "react";

export default function SchedulerPage() {

  return (
    <Suspense>
      <Scheduler />
    </Suspense>
  )
}
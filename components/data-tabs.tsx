import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

export interface TabDefinition {
  value: string
  label: string
  icon?: React.ReactNode
  content: React.ReactNode
}

interface DataTabsProps {
  tabs: TabDefinition[];
  activeTab: string;
  onTabChange: (tabValue: string) => void;
  triggerClassName?: string;
  contentClassName?: string;
  forceMount?: true;
}

export default function DataTabs({
  tabs,
  activeTab,
  onTabChange,
  triggerClassName,
  contentClassName,
  forceMount,
}: DataTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className={triggerClassName}>
      <ScrollArea>
        <TabsList className="relative justify-start !px-4 h-auto w-full gap-1 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="overflow-hidden rounded-b-none border-x border-t border-border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none">
              {tab.icon && <span className="me-1.5">{tab.icon}</span>}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className={cn("m-0", contentClassName)} forceMount={forceMount}>
            {tab.content}
          </TabsContent>
        ))}
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Tabs>
  )
}
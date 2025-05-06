"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronRight } from "lucide-react"
import React, { useState } from "react"


import { useRouter } from "next/navigation"
import Toolbar from "./toolbar"

interface AccountItem {
  id: string
  name: string
  balance: number
  children?: AccountItem[]
}

interface NestedAccountTableProps {
  data: AccountItem[]
}

const NestedAccountTable: React.FC<NestedAccountTableProps> = ({ data }) => {
  const router = useRouter()

  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState("")

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const filterData = (items: AccountItem[], searchTerm: string): AccountItem[] => {
    const lowerSearchTerm = searchTerm.toLowerCase()
    return items.reduce<AccountItem[]>((acc, item) => {
      const matches =
        item.name.toLowerCase().includes(lowerSearchTerm) || item.id.toLowerCase().includes(lowerSearchTerm)
      let children: AccountItem[] | undefined
      if (item.children) {
        children = filterData(item.children, searchTerm)
      }
      if (matches || (children && children.length > 0)) {
        acc.push({
          ...item,
          children,
        })
      }
      return acc
    }, [])
  }

  const filteredData = searchTerm ? filterData(data, searchTerm) : data

  const renderTableRows = (items: AccountItem[], depth = 0): React.ReactNode => {
    return items.map((item) => {
      const isExpanded = expandedRows.has(item.id)
      const hasChildren = item.children && item.children.length > 0
      const currentNumber = item.id

      return (
        <React.Fragment key={item.id}>
          <TableRow className={cn("border-b", isExpanded && "bg-muted")}>
            <TableCell className="p-2 text-sm">
              <div className="flex items-center gap-2">
                <div
                  style={{ width: `${depth * 2}rem` }}
                  className="flex-shrink-0"
                />
                {hasChildren && (
                  <Button size="icon" variant="ghost" className={cn("h-6 w-6")} onClick={() => toggleRow(item.id)}>
                    <ChevronRight className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-90")} />
                  </Button>
                )}
                <span className="font-mono">
                  {currentNumber}
                </span>
              </div>
            </TableCell>
            <TableCell className="p-2 text-sm">
              <Button
                size="sm"
                variant="ghost"
                className="h-6"
                onClick={() => router.push(`/accounting/chart-of-accounts/${currentNumber}`)}
              >
                {item.name}
              </Button>
            </TableCell>
            <TableCell className="p-2 text-sm text-right font-medium">ARS {item.balance.toFixed(2)}</TableCell>
            <TableCell className="p-2 text-sm"></TableCell>
          </TableRow>
          {isExpanded && hasChildren && renderTableRows(item.children!, depth + 1)}
        </React.Fragment>
      )
    })
  }

  return (
    <div className="flex flex-col gap-4 [&_*[data-table='true']]:h-[calc(100svh-209px)]">
      <div className="space-y-4 flex flex-col h-full">
        <Toolbar />
        <div className="overflow-hidden rounded-sm border border-border bg-background shadow-sm">
          <Table className="[&_td]:border-border [&_th]:border-b [&_th]:border-border [&_tr:not(:last-child)_td]:border-b [&_tr]:border-none">
            <TableHeader className="sticky top-0 z-10 bg-accent/90 backdrop-blur-sm">
              <TableRow className="border-b">
                <TableHead className="h-9 text-nowrap">ID</TableHead>
                <TableHead className="h-9 text-nowrap">Cuenta</TableHead>
                <TableHead className="h-9 text-nowrap text-right">Balance</TableHead>
                <TableHead className="h-9 text-nowrap w-6"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{renderTableRows(filteredData)}</TableBody>
          </Table>
        </div>
        <div className="flex justify-between">
          <p className="whitespace-nowrap text-sm text-muted-foreground" aria-live="polite">
            Mostrando{" "}
            <span className="text-foreground">
              {6}
            </span>{" "}
            de{" "}<span className="text-foreground">{22}</span>
            {" "}resultados
          </p>
          <p className="whitespace-nowrap text-sm text-muted-foreground" aria-live="polite">
            <span className="text-foreground font-medium">
              ARS 17,000.00
            </span>{" "}
            en total
          </p>
        </div>
      </div>
    </div>
  )
}

export default NestedAccountTable


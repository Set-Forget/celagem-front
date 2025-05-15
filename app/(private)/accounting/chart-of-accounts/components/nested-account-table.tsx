"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react"
import React, { useState } from "react"

import { useRouter } from "next/navigation"
import Toolbar from "./toolbar"
import { AccountList } from "../schemas/account"
import { useLazyGetAccountingAccountQuery } from "@/lib/services/accounting-accounts"


interface NestedAccountTableProps {
  data?: AccountList[]
  loading?: boolean
}

const NestedAccountTable: React.FC<NestedAccountTableProps> = ({ data, loading }) => {
  const router = useRouter()

  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())
  const [loadedChildren, setLoadedChildren] = useState<Record<number, AccountList[]>>({})
  const [loadingRows, setLoadingRows] = useState<Set<number>>(new Set())

  const [getAccountingAccount] = useLazyGetAccountingAccountQuery()

  const toggleRow = async (id: number) => {
    if (expandedRows.has(id)) {
      setExpandedRows((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    } else {
      try {
        setLoadingRows((prev) => {
          const next = new Set(prev)
          next.add(id)
          return next
        })

        let children = loadedChildren[id] || []
        if (children.length === 0) {
          children = await getAccountChildren(id)
          setLoadedChildren((prev) => ({
            ...prev,
            [id]: children,
          }))
        }

        setExpandedRows((prev) => {
          const next = new Set(prev)
          next.add(id)
          return next
        })
      } catch (error) {
        console.error("Error al cargar los hijos:", error)
      } finally {
        setLoadingRows((prev) => {
          const next = new Set(prev)
          next.delete(id)
          return next
        })
      }
    }
  }

  const getAccountChildren = async (id: number): Promise<AccountList[]> => {
    const response = await getAccountingAccount(String(id)).unwrap()
    if (!response) {
      throw new Error(`Error al obtener los hijos de la cuenta con ID ${id}`)
    }
    return response.childrens || []
  }

  const renderTableRows = (items?: AccountList[], depth = 0): React.ReactNode => {
    return items?.map((item) => {
      const isExpanded = expandedRows.has(item.id)
      const hasChildren = item.has_children
      const currentNumber = item.code || item.id.toString()
      const childrenToRender = loadedChildren[item.id] || []

      return (
        <React.Fragment key={item.id}>
          <TableRow className={cn("border-b", isExpanded && "bg-muted")}>
            <TableCell className="p-2 text-sm">
              <div className="flex items-center gap-2">
                <div style={{ width: `${depth * 2}rem` }} className="flex-shrink-0" />
                <div className="w-6 h-6 flex items-center justify-center">
                  {hasChildren ? (
                    <Button size="icon" variant="ghost" className={cn("h-6 w-6")} onClick={() => toggleRow(item.id)}>
                      {loadingRows.has(item.id) ? (
                        <Loader2 className="animate-spin h-4 w-4" />
                      ) : isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  ) : null}
                </div>
                <span className="font-mono">{currentNumber}</span>
              </div>
            </TableCell>
            <TableCell className="p-2 text-sm">
              <Button
                size="sm"
                variant="ghost"
                className="h-6"
                onClick={() => router.push(`/accounting/chart-of-accounts/${item.id}`)}
              >
                {item.name.toUpperCase()}
              </Button>
            </TableCell>
            <TableCell className="p-2 text-sm text-right font-medium">
              {/* {item.balance !== undefined ? `ARS ${item.balance.toFixed(2)}` : ""} */}
            </TableCell>
            <TableCell className="p-2 text-sm"></TableCell>
          </TableRow>
          {isExpanded && hasChildren && childrenToRender.length > 0 && renderTableRows(childrenToRender, depth + 1)}
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
            <TableHeader
              className="sticky top-0 z-10 bg-sidebar backdrop-blur-sm after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-border rounded-t-sm">
              <TableRow className="border-b">
                <TableHead className="h-9 text-nowrap">ID</TableHead>
                <TableHead className="h-9 text-nowrap">Cuenta</TableHead>
                <TableHead className="h-9 text-nowrap text-right">Balance</TableHead>
                <TableHead className="h-9 text-nowrap w-6"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow className="border-none">
                  <TableCell colSpan={4} className="text-xs text-center h-10 border-b">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Loader2 className="animate-spin" size={14} />
                      Cargando...
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                renderTableRows(data)
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-between">
          <p className="whitespace-nowrap text-sm text-muted-foreground" aria-live="polite">
            Mostrando <span className="text-foreground">{data?.length || 0}</span>{" "}
            resultados
          </p>
          <p className="whitespace-nowrap text-sm text-muted-foreground" aria-live="polite">
            <span className="text-foreground font-medium">ARS 17,000.00</span> en total
          </p>
        </div>
      </div>
    </div>
  )
}

export default NestedAccountTable

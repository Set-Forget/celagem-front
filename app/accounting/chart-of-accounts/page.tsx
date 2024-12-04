import Header from "@/components/header";
import { Separator } from "@/components/ui/separator";
import NestedAccountTable from "./components/nested-account-table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

const sampleData = [
  {
    "id": "1",
    "name": "ACTIVOS",
    "balance": 10000,
    "children": [
      {
        "id": "11",
        "name": "EFECTIVO Y EQUIVALENTES AL EFECTIVO",
        "balance": 4176,
        "children": [
          {
            "id": "1101",
            "name": "EFECTIVO",
            "balance": 2954,
            "children": [
              {
                "id": "110101",
                "name": "CAJA GENERAL",
                "balance": 3241,
                "children": [
                  {
                    "id": "110101061",
                    "name": "CAJA GENERAL BOGOTA",
                    "balance": 1492
                  }
                ]
              },
              {
                "id": "110102",
                "name": "CAJAS MENORES",
                "balance": 3998,
                "children": [
                  {
                    "id": "110102061",
                    "name": "CAJAS MENORES",
                    "balance": 2674
                  },
                  {
                    "id": "110102062",
                    "name": "CAJA MENOR MEDELLIN",
                    "balance": 3449
                  },
                  {
                    "id": "110102063",
                    "name": "CAJA MENOR LEGALES",
                    "balance": 3831
                  },
                  {
                    "id": "110102064",
                    "name": "CAJA MENOR BUCARAMANGA",
                    "balance": 2903
                  },
                  {
                    "id": "110102069",
                    "name": "COMPRAS CAJA MENOR DOC SOPORTE",
                    "balance": 3156
                  }
                ]
              },
              {
                "id": "110103",
                "name": "CAJA MONEDA EXTRANJERA",
                "balance": 3652
              },
              {
                "id": "110104",
                "name": "BANCOS CUENTAS CORRIENTES MONEDA NACIONAL",
                "balance": 4002,
                "children": [
                  {
                    "id": "110104061",
                    "name": "CTA CTE BANCO BBVA CTA No.",
                    "balance": 1496
                  }
                ]
              },
              {
                "id": "110105",
                "name": "BANCOS CUENTAS CORRIENTES MONEDA EXTRANJERA",
                "balance": 2771
              },
              {
                "id": "110106",
                "name": "BANCOS CUENTAS DE AHORRO BANCOS MONEDA NACIONAL",
                "balance": 3206,
                "children": [
                  {
                    "id": "110106061",
                    "name": "CTA AHORRO BANCO DAVIVIENDA CTA No",
                    "balance": 2840
                  },
                  {
                    "id": "110106062",
                    "name": "CTA AHORRO BANCOLOMBIA CTA N. 20100005011",
                    "balance": 3203
                  }
                ]
              }
            ]
          }
        ]
      },
    ]
  },
  {
    "id": "2",
    "name": "PASIVOS",
    "balance": 10000,
    "children": [
      {
        "id": "21",
        "name": "OBLIGACIONES FINANCIERAS",
        "balance": 4653,
        "children": []
      }
    ]
  },

]

export default function ChartOfAccountsPage() {

  return (
    <>
      <Header title="Plan de cuentas">
        <DropdownMenu>
          <DropdownMenuTrigger className="ml-auto" asChild>
            <Button size="sm">
              Crear
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                Nueva cuenta
              </DropdownMenuItem>
              <DropdownMenuItem>
                Nuevo asiento
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </Header>
      <Separator />
      <div className="flex flex-col p-4 h-full justify-between">
        <NestedAccountTable data={sampleData} />
      </div>
    </>
  )
}
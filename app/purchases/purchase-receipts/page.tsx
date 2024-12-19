'use client'

import { DataTable } from "@/components/data-table";
import Header from "@/components/header";
import { usePathname, useRouter } from "next/navigation";
import { columns } from "./components/columns";
import Toolbar from "./components/toolbar";
import { PurchaseReceipt } from "./schemas/purchase-receipts";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

const data: PurchaseReceipt[] = [
  {
    "id": "7e47380d-451c-4d00-b778-350689a7ee1a",
    "purchase_order": "4500009257",
    "supplier": "Miller PLC",
    "created_at": "2024-11-12T18:19:06.137992",
    "received_at": "2024-12-01T18:19:06.138023",
  },
  {
    "id": "5b36b6c2-1393-4ce2-84a4-8225b708b6ca",
    "purchase_order": "4500001308",
    "supplier": "Wheeler-Zuniga",
    "created_at": "2024-11-15T18:19:06.138588",
    "received_at": "2024-11-23T18:19:06.138605",
  },
  {
    "id": "60db61b3-3539-4bf5-9bbe-63f507d90ad7",
    "purchase_order": "4500006129",
    "supplier": "Cox-Schneider",
    "created_at": "2024-11-01T18:19:06.139146",
    "received_at": "2024-11-24T18:19:06.139161",
  },
  {
    "id": "3cc8ccc4-631a-4a50-b5b6-6ad242ac341f",
    "purchase_order": "4500007769",
    "supplier": "Nielsen Inc",
    "created_at": "2024-11-08T18:19:06.139481",
    "received_at": "2024-11-23T18:19:06.139493",
  },
  {
    "id": "a34f2b33-11b1-4255-ade9-0251dedea43d",
    "purchase_order": "4500003812",
    "supplier": "Thomas and Sons",
    "created_at": "2024-11-20T18:19:06.139796",
    "received_at": "2024-11-29T18:19:06.139807",
  },
  {
    "id": "54aec551-79f3-48ef-8a4a-2affb5b41751",
    "purchase_order": "4500008179",
    "supplier": "Willis, Walter and Cardenas",
    "created_at": "2024-11-26T18:19:06.140544",
    "received_at": "2024-11-24T18:19:06.140555",
  },
  {
    "id": "21661fc7-62ad-4a2b-a93e-d89b2c8e4b55",
    "purchase_order": "4500009993",
    "supplier": "Caldwell and Sons",
    "created_at": "2024-11-27T18:19:06.140807",
    "received_at": "2024-11-30T18:19:06.140818",
  },
  {
    "id": "8320090e-e9df-4965-a5fa-063169035a08",
    "purchase_order": "4500002699",
    "supplier": "Johnson PLC",
    "created_at": "2024-11-11T18:19:06.141115",
    "received_at": "2024-11-25T18:19:06.141151",
  },
  {
    "id": "e9dd216a-57e1-46b8-a722-f380ac9681c8",
    "purchase_order": "4500008728",
    "supplier": "Davis, Holt and Carlson",
    "created_at": "2024-11-11T18:19:06.141923",
    "received_at": "2024-11-24T18:19:06.141940",
  },
  {
    "id": "b8a39c4b-6d87-4094-a3b9-b0b99da4fb9b",
    "purchase_order": "4500007224",
    "supplier": "Bell, White and Rose",
    "created_at": "2024-11-18T18:19:06.142405",
    "received_at": "2024-11-30T18:19:06.142413",
  },
  {
    "id": "9b507439-dbb5-448d-8405-170834927738",
    "purchase_order": "4500008544",
    "supplier": "Romero, Tran and Houston",
    "created_at": "2024-11-27T18:19:06.142856",
    "received_at": "2024-11-29T18:19:06.142865",
  },
  {
    "id": "1bd7c2a9-3f19-4142-a653-fced0a83de0c",
    "purchase_order": "4500001272",
    "supplier": "Huffman, Barnett and Kidd",
    "created_at": "2024-11-28T18:19:06.143271",
    "received_at": "2024-11-24T18:19:06.143277",
  },
  {
    "id": "a5682b7d-0366-44d1-bcc4-5d1fd7cc92df",
    "purchase_order": "4500001446",
    "supplier": "Parker, Le and Elliott",
    "created_at": "2024-11-20T18:19:06.143674",
    "received_at": "2024-11-25T18:19:06.143680",
  },
  {
    "id": "19fe1762-3a86-44e4-9be2-0e52c9bd89a5",
    "purchase_order": "4500009019",
    "supplier": "Moore Ltd",
    "created_at": "2024-11-30T18:19:06.143837",
    "received_at": "2024-11-26T18:19:06.143842",
  },
  {
    "id": "e881c6dc-2b07-4603-ad97-0e2f117bcd45",
    "purchase_order": "4500004448",
    "supplier": "Bass, Webb and Nelson",
    "created_at": "2024-11-15T18:19:06.144235",
    "received_at": "2024-12-01T18:19:06.144240",
  },
  {
    "id": "32187c3c-cb57-48b7-b264-3dafa133f6cd",
    "purchase_order": "4500001129",
    "supplier": "Young Inc",
    "created_at": "2024-11-21T18:19:06.144394",
    "received_at": "2024-11-23T18:19:06.144399",
  },
  {
    "id": "4db31fd7-4ded-4edb-aedf-64d2970c4c15",
    "purchase_order": "4500002699",
    "supplier": "Watkins, Stone and Ferguson",
    "created_at": "2024-11-15T18:19:06.144854",
    "received_at": "2024-11-30T18:19:06.144865",
  },
  {
    "id": "29d6fa16-7876-483e-aed7-c0717c1ac685",
    "purchase_order": "4500004973",
    "supplier": "Smith-Kim",
    "created_at": "2024-11-16T18:19:06.145396",
    "received_at": "2024-12-01T18:19:06.145412",

  },
  {
    "id": "3ee1d641-636f-4bdc-a547-de6599034287",
    "purchase_order": "4500003673",
    "supplier": "Kelley-Ward",
    "created_at": "2024-11-11T18:19:06.145891",
    "received_at": "2024-11-21T18:19:06.145909",
  },
  {
    "id": "af21f29a-8d30-4f9b-bf39-8edd21248594",
    "purchase_order": "4500002558",
    "supplier": "Clark, Baker and Hamilton",
    "created_at": "2024-11-26T18:19:06.146500",
    "received_at": "2024-11-30T18:19:06.146511"
  }
]

export default function PurchaseReceiptsPage() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <>
      <Header>
        <Button
          className="ml-auto"
          size="sm"
          asChild
        >
          <Link href="/purchases/purchase-receipts/new">
            <Plus className="w-4 h-4" />
            Crear recepción de compra
          </Link>
        </Button>
      </Header>
      <div className="flex flex-col gap-4 p-4 h-[calc(100svh-99px)]">
        <DataTable
          data={data}
          columns={columns}
          onRowClick={(row) => router.push(`${pathname}/${row.id}`)}
          toolbar={({ table }) => <Toolbar table={table} />}
        />
      </div>
    </>
  )
}
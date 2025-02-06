'use client'

import { DataTable } from "@/components/data-table";
import Header from "@/components/header";
import { Separator } from "@/components/ui/separator";
import { columns } from "./components/columns";
import Toolbar from "./components/toolbar";
import { Supplier } from "./schema/suppliers";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

const data: Supplier[] = [
  {
    "supplier_id": "682b1a79-1b66-487e-9e55-0f2aa927b411",
    "supplier_name": "Mcconnell and Sons",
    "supplier_type": "distributor",
    "status": "active",
    "contact_id": "216a8793-7eb5-44fe-bf11-ba1b3d75e908",
    "contact_name": "Gary Dunn",
    "contact_email": "albertevans@gmail.com",
    "id": "0e92ee95-1103-4e18-bec8-a96669755044",
    "cuit": "25-97719219-6",
    "address": "6257 Christian Ville, New Stacy, IA 08768"
  },
  {
    "supplier_id": "e4fc84c4-0977-4e79-92eb-cf8bdfcced8b",
    "supplier_name": "Pittman-Fisher",
    "supplier_type": "manufacturer",
    "status": "active",
    "contact_id": "cdc86c97-a553-49c0-ab88-3641a35adca7",
    "contact_name": "Christopher Martinez",
    "contact_email": "taylor72@gmail.com",
    "id": "dc387796-5ff7-4bde-ac6c-c3b17f8b8827",
    "cuit": "24-49158288-2",
    "address": "USS Bush, FPO AA 80774"
  },
  {
    "supplier_id": "96c774b2-ae6f-478e-9af9-c22fe8180317",
    "supplier_name": "Thompson, Anderson and Nielsen",
    "supplier_type": "manufacturer",
    "status": "inactive",
    "contact_id": "6ef3ed96-d092-4e30-80ee-0691b776d927",
    "contact_name": "Marcus Meyer",
    "contact_email": "flane@yahoo.com",
    "id": "4fa64abe-1bf4-4477-ac0b-25125ec4e9d7",
    "cuit": "21-82923704-8",
    "address": "7958 Caitlin Court Suite 633, South Donald, PA 84960"
  },
  {
    "supplier_id": "abead258-8417-40bc-bab6-d89ba6adf922",
    "supplier_name": "Hernandez and Sons",
    "supplier_type": "distributor",
    "status": "inactive",
    "contact_id": "b1602c6c-6a0e-47c6-9e17-b5e403a451e9",
    "contact_name": "Christopher Morris",
    "contact_email": "marybaxter@fletcher-schmidt.com",
    "id": "dbedcf0c-3efc-4a26-9684-3e89f46c5858",
    "cuit": "20-61701733-2",
    "address": "2977 Arellano Parks, Charlesborough, LA 96608"
  },
  {
    "supplier_id": "a14cc5ec-e43e-4223-ba67-dbb6bb2c1fa9",
    "supplier_name": "Henson-Moore",
    "supplier_type": "retailer",
    "status": "inactive",
    "contact_id": "7235f258-75ba-40cb-98a9-0bed406a3e56",
    "contact_name": "Stephanie Bennett",
    "contact_email": "fisherraymond@hotmail.com",
    "id": "42e21936-c513-4fe1-8d7a-be0a76cbaf70",
    "cuit": "27-31539056-9",
    "address": "3558 Ashley Plain, Cochranfurt, RI 10868"
  },
  {
    "supplier_id": "b9952294-f575-4204-bebb-69dc0cc71ae6",
    "supplier_name": "Brooks LLC",
    "supplier_type": "distributor",
    "status": "active",
    "contact_id": "3cead451-1fe7-4044-82f4-eeb2667f9cb3",
    "contact_name": "William Pacheco",
    "contact_email": "joannajoyce@yahoo.com",
    "id": "08a73126-89ae-49dc-91ac-f287a004f5c9",
    "cuit": "23-76276388-7",
    "address": "27024 Charles Harbors Apt. 852, Evansstad, NY 26792"
  },
  {
    "supplier_id": "25165f48-2fe2-4021-9283-4b0d41d12967",
    "supplier_name": "Anderson Ltd",
    "supplier_type": "manufacturer",
    "status": "inactive",
    "contact_id": "b90b4ccc-e611-4b62-a05e-5712ec699bcf",
    "contact_name": "Adam Garrett",
    "contact_email": "sydney18@swanson.com",
    "id": "e4eaa15d-7306-4984-8f6c-1d8907a94431",
    "cuit": "26-37327075-6",
    "address": "78625 Walsh Lake Suite 628, Port Julie, SC 72076"
  },
  {
    "supplier_id": "63ffa936-3b84-4abd-a1ec-f41f48ee0e1f",
    "supplier_name": "Dudley Inc",
    "supplier_type": "distributor",
    "status": "inactive",
    "contact_id": "3ed29a13-db94-483f-9b17-ebce0f070aa8",
    "contact_name": "Kathleen Estrada",
    "contact_email": "amanda79@yahoo.com",
    "id": "e9e5b0d7-cd67-4965-8139-013e1bc5a449",
    "cuit": "29-58374448-2",
    "address": "35220 Cynthia Forks Apt. 135, New Cody, WY 37996"
  },
  {
    "supplier_id": "fd7d5b08-0550-4dd5-a402-6d6675b931e5",
    "supplier_name": "Holland-Ramos",
    "supplier_type": "retailer",
    "status": "active",
    "contact_id": "864a80ba-eadf-48cc-a60a-bc7d76a83ff6",
    "contact_name": "Jennifer Mccoy",
    "contact_email": "kyleowens@smith-jones.com",
    "id": "ccab2160-298d-480d-9406-bcd0b840a05c",
    "cuit": "24-12562503-0",
    "address": "3196 Thomas Courts Suite 790, Beckfort, WA 46817"
  },
  {
    "supplier_id": "4281a3c1-4b19-4ad3-8238-3423b4abce14",
    "supplier_name": "Hernandez Group",
    "supplier_type": "distributor",
    "status": "active",
    "contact_id": "a63c0eae-027e-4f50-99ac-0792fa3e3089",
    "contact_name": "Dustin Burton",
    "contact_email": "danielowens@hotmail.com",
    "id": "a6b0168b-f756-419d-ad45-d4ad669f1d19",
    "cuit": "29-87587539-5",
    "address": "062 Smith Street Suite 233, Madisonfurt, MA 47899"
  },
  {
    "supplier_id": "bce996f9-1568-4767-945b-710508a539d1",
    "supplier_name": "Curtis, King and Murray",
    "supplier_type": "distributor",
    "status": "inactive",
    "contact_id": "9d023a02-0975-4308-b7ed-da99782789c8",
    "contact_name": "Zoe Lee",
    "contact_email": "shermanalvin@yahoo.com",
    "id": "8fadd152-a056-4d2e-9f3e-f34da424704a",
    "cuit": "24-86436894-1",
    "address": "5100 Robert Pass, West Lynnburgh, ND 96625"
  },
  {
    "supplier_id": "a2515167-447b-437e-8b36-cac0ad4f4e7a",
    "supplier_name": "Larson-Chaney",
    "supplier_type": "retailer",
    "status": "inactive",
    "contact_id": "5fd0a952-c5fd-46dd-ab2b-314545126934",
    "contact_name": "Candace Castillo",
    "contact_email": "fosterlori@weaver-reyes.com",
    "id": "a9636191-29f6-4b7e-a2cd-4b2e2d084589",
    "cuit": "30-42150649-1",
    "address": "589 Christopher Lane, Bowmanchester, WA 77285"
  },
  {
    "supplier_id": "52e5f95d-bc1f-4348-8b9d-139182adc2c1",
    "supplier_name": "Sullivan LLC",
    "supplier_type": "manufacturer",
    "status": "active",
    "contact_id": "2413b0bc-35b2-4751-8ab7-ebe7e2fcc6ed",
    "contact_name": "Mark Garcia",
    "contact_email": "adamhatfield@gomez.com",
    "id": "2eba2e46-32ef-42ff-ae35-a8af125584ad",
    "cuit": "29-54591881-4",
    "address": "4746 Hall Meadow Suite 437, West Mariahborough, WA 81494"
  },
  {
    "supplier_id": "03c08394-7614-4643-a5f9-624619ed781f",
    "supplier_name": "Robinson-Murray",
    "supplier_type": "distributor",
    "status": "inactive",
    "contact_id": "1cb362b0-4d53-41d2-ab9f-5e4217cbf57d",
    "contact_name": "Jessica Williams",
    "contact_email": "carla81@hurst.info",
    "id": "bf0de6a1-4ff3-4938-83fa-dcb148ff8ad0",
    "cuit": "29-75612859-6",
    "address": "7733 Castillo Drives, North Joseph, MT 22423"
  },
  {
    "supplier_id": "dd52f5f5-1b2c-4483-9627-d945e581f6c8",
    "supplier_name": "Oliver-Morrison",
    "supplier_type": "manufacturer",
    "status": "active",
    "contact_id": "a9344d8e-ac1f-413d-a580-0493cdee1a27",
    "contact_name": "Sean Underwood",
    "contact_email": "wongnicole@dougherty-golden.com",
    "id": "b63f639a-ff01-482f-875f-97fe49e6fa4a",
    "cuit": "26-84700096-7",
    "address": "5502 Catherine Route, Julieshire, DC 28797"
  },
  {
    "supplier_id": "08e3db43-665f-4bb9-8609-39fd9ef2d554",
    "supplier_name": "Garcia PLC",
    "supplier_type": "retailer",
    "status": "inactive",
    "contact_id": "bf872526-6e7e-4a9f-b738-a55da4c6cc1f",
    "contact_name": "Javier Massey",
    "contact_email": "clarkealexis@morris.org",
    "id": "c73aa576-2ee9-4dcf-b1a6-9ee3c8233444",
    "cuit": "27-15431729-4",
    "address": "12893 Michael Cliff, West Catherine, NV 09090"
  },
  {
    "supplier_id": "7f8ff210-e354-4a30-ae43-d93f12ce6d5e",
    "supplier_name": "Morrison, Robinson and Lowe",
    "supplier_type": "retailer",
    "status": "active",
    "contact_id": "4f6990f8-c2f1-4932-823e-2ff39d8ee209",
    "contact_name": "Jessica Gray",
    "contact_email": "wilsonmegan@gmail.com",
    "id": "ddf33e87-858e-40cb-9905-9851a984ff7c",
    "cuit": "30-24316174-5",
    "address": "7208 Crane Burgs Suite 599, Lindachester, WY 66828"
  },
  {
    "supplier_id": "1f4d4ce5-d30b-41f9-9fe7-a7989eca5998",
    "supplier_name": "Rogers PLC",
    "supplier_type": "distributor",
    "status": "inactive",
    "contact_id": "2441c9e3-9245-4b4b-8fdb-e21deea08742",
    "contact_name": "Susan Johnson",
    "contact_email": "bjones@yahoo.com",
    "id": "4e055f60-3e83-4949-9c40-a05839e3df38",
    "cuit": "24-25126270-8",
    "address": "798 Powell Rue Apt. 570, Thompsonside, IL 38352"
  },
  {
    "supplier_id": "72f364ba-59aa-41da-bbb6-d1b543454b19",
    "supplier_name": "Cabrera-Williams",
    "supplier_type": "retailer",
    "status": "active",
    "contact_id": "236cd89e-a255-4770-95de-b869f4a9d469",
    "contact_name": "Andrew Foley",
    "contact_email": "stefaniemcpherson@dudley.com",
    "id": "26079148-ade3-4054-9441-a78d7e1021ce",
    "cuit": "20-48969273-8",
    "address": "584 Sara Ford Apt. 404, North Matthewfurt, AL 62607"
  },
  {
    "supplier_id": "41b70ce6-8bf6-4a13-a817-3137b76be843",
    "supplier_name": "Thompson Inc",
    "supplier_type": "distributor",
    "status": "inactive",
    "contact_id": "b63e1afd-5d82-41a1-9d16-3b5be8e826a7",
    "contact_name": "Jeffrey House",
    "contact_email": "zrose@hill.com",
    "id": "130ce1e3-6520-4dc1-ba41-ee709e300cd3",
    "cuit": "21-70212529-8",
    "address": "173 Ronald Ford Apt. 852, Michellebury, UT 56434"
  }
]

export default function SuppliersPage() {
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
          <Link href="/purchases/vendors/new">
            <Plus className="w-4 h-4" />
            Crear proveedor
          </Link>
        </Button>
      </Header>
      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-225px)]">
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
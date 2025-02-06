'use client'

import { DataTable } from "@/components/data-table";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { columns } from "./components/columns";
import Toolbar from "./components/toolbar";
import { Customer } from "./schema/customers";

const data: Customer[] = [
  {
    "customer_id": "956807-e326c729-1c36-417b-a4ff-42f12b833be9",
    "customer_name": "Jones LLC",
    "customer_type": "legal_entity",
    "status": "inactive",
    "contact_id": "bed6918d-75c6-4c24-955f-371ddcbc1035",
    "contact_name": "Pat Smith",
    "contact_email": "jane@mail.com",
    "id": "9cacbfc7-0102-4415-a744-c51c973c9cb9",
    "cuit": "25-56853403-4",
    "address": "4261 Third Blvd, Rivertown, TX 86861",
    "fiscal_category": "monotax"
  },
  {
    "customer_id": "251181-bc1fe454-a0ce-4912-a4a1-5e814f47a531",
    "customer_name": "Johnson Group",
    "customer_type": "natural_person",
    "status": "inactive",
    "contact_id": "00f1116c-81f7-4703-9c43-462050e2b4dd",
    "contact_name": "Alex Johnson",
    "contact_email": "alex@example.com",
    "id": "ea64e159-4f5f-42c4-80fd-2707e86d9ded",
    "cuit": "26-33398430-8",
    "address": "6022 Main St, Springfield, CA 80108",
    "fiscal_category": "monotax"
  },
  {
    "customer_id": "219129-ebabdc25-2e0c-4efa-b076-a7173fe4c4c5",
    "customer_name": "Jones Corp.",
    "customer_type": "natural_person",
    "status": "active",
    "contact_id": "1cbf6a8f-69d8-44f5-9489-5db833997d64",
    "contact_name": "Pat Johnson",
    "contact_email": "pat@example.com",
    "id": "1ccd8973-6b4e-4e4a-96ef-1c911fd0dca7",
    "cuit": "25-70043933-0",
    "address": "6044 Main St, Springfield, TX 94016",
    "fiscal_category": "responsible_registered"
  },
  {
    "customer_id": "661255-78bae0b7-1887-4496-af45-5cd1a7fac1b4",
    "customer_name": "Williams Corp.",
    "customer_type": "legal_entity",
    "status": "active",
    "contact_id": "e5043a66-3517-46ea-9154-1653864a3c6d",
    "contact_name": "Chris Smith",
    "contact_email": "alex@mail.com",
    "id": "8ddedf09-1ae5-4ac6-b220-7bb488ade56c",
    "cuit": "24-45880737-4",
    "address": "5879 Main St, Hillside, NY 24889",
    "fiscal_category": "monotax"
  },
  {
    "customer_id": "749512-ffa6c54f-181d-4f5b-81f8-2e9238798d25",
    "customer_name": "Brown Corp.",
    "customer_type": "natural_person",
    "status": "inactive",
    "contact_id": "c4c08247-6b4c-42b9-af0c-a97fe7848436",
    "contact_name": "Chris Doe",
    "contact_email": "pat@mail.com",
    "id": "d22a247d-4d39-4408-94f4-6869a88344bf",
    "cuit": "20-21337782-2",
    "address": "9039 Main St, Springfield, NY 70385",
    "fiscal_category": "final_consumer"
  },
  {
    "customer_id": "432977-2500ff70-3aa2-4bcc-8682-cebcb334b544",
    "customer_name": "Jones Solutions",
    "customer_type": "legal_entity",
    "status": "active",
    "contact_id": "7bb82224-9ccc-4970-93aa-a7577351c90b",
    "contact_name": "Chris Doe",
    "contact_email": "john@example.com",
    "id": "3cc9c8e3-398b-428d-9904-7f51519a4e57",
    "cuit": "27-20718729-0",
    "address": "6742 Main St, Springfield, NY 69719",
    "fiscal_category": "responsible_registered"
  },
  {
    "customer_id": "393324-bcc456f1-ca7a-4428-9a4e-2725ff6d4afd",
    "customer_name": "Williams Corp.",
    "customer_type": "legal_entity",
    "status": "inactive",
    "contact_id": "f0d59024-589e-46aa-9d92-24cf948f2030",
    "contact_name": "Jane Johnson",
    "contact_email": "chris@domain.com",
    "id": "4f3be4a5-122f-4446-88a8-f7f1426f5d52",
    "cuit": "23-96228651-5",
    "address": "6537 Third Blvd, Hillside, TX 33113",
    "fiscal_category": "monotax"
  },
  {
    "customer_id": "285795-a2309e0a-148a-4e8f-8548-310c65db2a46",
    "customer_name": "Brown Group",
    "customer_type": "natural_person",
    "status": "inactive",
    "contact_id": "b5701057-2ab2-4700-9c3c-aab1f0371ccd",
    "contact_name": "Jane Brown",
    "contact_email": "alex@domain.com",
    "id": "cf9203c0-50c5-4da8-918c-4ca24a83b1e9",
    "cuit": "29-56674850-2",
    "address": "8828 Third Blvd, Hillside, NY 91389",
    "fiscal_category": "final_consumer"
  },
  {
    "customer_id": "410556-62d4e5e9-5e1b-4bef-b9c7-5e9a1b71f2ad",
    "customer_name": "Smith Corp.",
    "customer_type": "legal_entity",
    "status": "inactive",
    "contact_id": "abfdb325-2801-4fd9-8c09-229b0df17429",
    "contact_name": "Pat Brown",
    "contact_email": "alex@example.com",
    "id": "2a3eb1d4-9687-4bae-8b60-b8bd636f63fe",
    "cuit": "21-28368009-1",
    "address": "8475 Second Ave, Springfield, CA 57580",
    "fiscal_category": "final_consumer"
  },
  {
    "customer_id": "296988-5109d284-086a-4a7f-8328-c9267c11b7a7",
    "customer_name": "Jones Solutions",
    "customer_type": "natural_person",
    "status": "inactive",
    "contact_id": "0618287a-5864-440b-a61c-6d21e66c2036",
    "contact_name": "Jane Johnson",
    "contact_email": "alex@mail.com",
    "id": "caadc6ac-e6b1-4589-8ef4-970e5efb5764",
    "cuit": "20-18196582-2",
    "address": "7418 Main St, Rivertown, NY 51566",
    "fiscal_category": "monotax"
  },
  {
    "customer_id": "597764-b6ce6405-d391-4cb5-9261-abc8ec3bd7f3",
    "customer_name": "Jones Group",
    "customer_type": "legal_entity",
    "status": "active",
    "contact_id": "e448be3f-613d-415a-95c2-ad89a81123ee",
    "contact_name": "John Brown",
    "contact_email": "chris@domain.com",
    "id": "6f801061-afcd-45bb-86cc-853b42019dd9",
    "cuit": "29-54720449-6",
    "address": "7427 Second Ave, Hillside, TX 38031",
    "fiscal_category": "monotax"
  },
  {
    "customer_id": "312353-4a3cbf47-d0ec-42cb-9d36-171c0cf7d9b9",
    "customer_name": "Brown Enterprises",
    "customer_type": "legal_entity",
    "status": "inactive",
    "contact_id": "8110006d-14e6-4340-aafa-6dd312c77daa",
    "contact_name": "Jane Smith",
    "contact_email": "alex@service.com",
    "id": "5f379520-e687-4934-8c32-fb4cc381d124",
    "cuit": "27-31900430-0",
    "address": "5682 Main St, Springfield, NY 18991",
    "fiscal_category": "final_consumer"
  },
  {
    "customer_id": "198563-35f4bc9f-2552-4b53-b042-05eb43ef5ffa",
    "customer_name": "Jones Corp.",
    "customer_type": "legal_entity",
    "status": "inactive",
    "contact_id": "90f53473-9b03-48b0-9b7c-26ef585808c2",
    "contact_name": "Chris Johnson",
    "contact_email": "alex@mail.com",
    "id": "d83882fd-2e5f-4400-a0b6-72817f4522a5",
    "cuit": "20-75901193-5",
    "address": "5097 Second Ave, Springfield, NY 74831",
    "fiscal_category": "final_consumer"
  },
  {
    "customer_id": "611349-b55983f4-6349-4433-acff-6b21f48978df",
    "customer_name": "Brown LLC",
    "customer_type": "legal_entity",
    "status": "active",
    "contact_id": "e8885a1c-b536-4952-8f11-98f950a16681",
    "contact_name": "John Doe",
    "contact_email": "pat@example.com",
    "id": "bc0af500-9e0e-4734-8af3-37eef23cf6a0",
    "cuit": "22-24912374-1",
    "address": "2654 Second Ave, Hillside, CA 49343",
    "fiscal_category": "monotax"
  },
  {
    "customer_id": "891009-8c01210d-2ea9-429e-a311-d78e8b5a1f8a",
    "customer_name": "Johnson Group",
    "customer_type": "legal_entity",
    "status": "inactive",
    "contact_id": "19bd651f-c8e2-4500-8d95-ecaf30122b3f",
    "contact_name": "Chris Johnson",
    "contact_email": "jane@domain.com",
    "id": "6d485695-afe3-443e-ac90-52983953ee83",
    "cuit": "25-59460802-2",
    "address": "2563 Second Ave, Hillside, TX 80907",
    "fiscal_category": "monotax"
  },
  {
    "customer_id": "814225-1bcdbd38-10ab-43a7-bfa4-a696d2f8c449",
    "customer_name": "Jones Corp.",
    "customer_type": "natural_person",
    "status": "active",
    "contact_id": "82cb77f3-d140-4b4e-9745-dae8facef422",
    "contact_name": "Jane Johnson",
    "contact_email": "pat@service.com",
    "id": "4e725e0d-ecb6-435a-9541-6a3801573beb",
    "cuit": "22-50030495-6",
    "address": "8148 Main St, Rivertown, CA 83881",
    "fiscal_category": "responsible_registered"
  },
  {
    "customer_id": "870718-1dc3563c-0e75-4ec0-ba58-effb71aede3e",
    "customer_name": "Johnson Corp.",
    "customer_type": "natural_person",
    "status": "inactive",
    "contact_id": "6d18876a-8510-4604-9a89-2812505bca92",
    "contact_name": "Jane Taylor",
    "contact_email": "alex@domain.com",
    "id": "e4c95795-b9dc-4cf7-b546-c93e802de012",
    "cuit": "20-82040158-5",
    "address": "9310 Second Ave, Rivertown, CA 67639",
    "fiscal_category": "responsible_registered"
  },
  {
    "customer_id": "229308-5ce52800-f702-4d58-b6a2-dfa24ad5b65b",
    "customer_name": "Williams Solutions",
    "customer_type": "natural_person",
    "status": "inactive",
    "contact_id": "cec96d47-705a-4388-ba64-0f7a2479683f",
    "contact_name": "Pat Taylor",
    "contact_email": "jane@example.com",
    "id": "7a5e930e-2254-43c7-b524-5b4cba965ca1",
    "cuit": "22-17276958-2",
    "address": "6514 Main St, Hillside, TX 98472",
    "fiscal_category": "monotax"
  },
  {
    "customer_id": "363811-20da66fd-6bfe-4417-8c58-5e6f362cc720",
    "customer_name": "Smith Solutions",
    "customer_type": "natural_person",
    "status": "inactive",
    "contact_id": "773c1c46-2111-4747-addd-c902db3fa697",
    "contact_name": "Alex Taylor",
    "contact_email": "pat@mail.com",
    "id": "b8280214-2fec-46a7-bdf7-786607b1ab7f",
    "cuit": "24-36107558-2",
    "address": "1377 Third Blvd, Rivertown, NY 29423",
    "fiscal_category": "final_consumer"
  },
  {
    "customer_id": "817924-fcc0b59c-9491-4259-b29e-81ff6f35ea01",
    "customer_name": "Jones Solutions",
    "customer_type": "natural_person",
    "status": "inactive",
    "contact_id": "4727b216-0ee1-4de4-8616-7b34b268eae9",
    "contact_name": "Chris Smith",
    "contact_email": "pat@domain.com",
    "id": "c96f76f9-e081-428a-9133-dd8085b13032",
    "cuit": "30-86436246-6",
    "address": "2310 Second Ave, Hillside, CA 99796",
    "fiscal_category": "monotax"
  }
]

export default function CustomersPage() {
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
          <Link href="/sales/customers/new">
            <Plus className="w-4 h-4" />
            Crear cliente
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
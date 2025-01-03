'use client'

import { DataTable } from "@/components/data-table"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Toolbar from "./components/toolbar"
import { columns } from "./components/columns"

export const PATIENT_DATA = [
  {
    "id": "f735e78e-2a19-483c-9c3d-9a822a1f43b6",
    "id_type": "CC",
    "id_number": 97436627,
    "name": "Megan",
    "lastname": "King",
    "user_type": "Particular",
    "coverage_plan": "PL_NATIVO",
    "date_of_birth": "1979-12-19",
    "genre": "Masculino",
    "marital_status": "Casado",
    "address": "031 Powell Fords Suite 425, East Brian, RI 76420",
    "phone_number": "(049)988-1801x159",
    "occupation": "Government social research officer"
  },
  {
    "id": "81193fef-7c43-453d-8d22-6c022ae397bc",
    "id_type": "PA",
    "id_number": 48367196,
    "name": "Brian",
    "lastname": "Mann",
    "user_type": "Cotizante",
    "coverage_plan": "PL_NATIVO",
    "date_of_birth": "1954-06-03",
    "genre": "Masculino",
    "marital_status": "Casado",
    "address": "661 Washington Manor Apt. 984, Huffland, IA 03053",
    "phone_number": "645-685-8276x748",
    "occupation": "Geographical information systems officer"
  },
  {
    "id": "3566e686-4402-4d09-a504-2183d5a02c7c",
    "id_type": "CC",
    "id_number": 36936096,
    "name": "Jennifer",
    "lastname": "Walker",
    "user_type": "Cotizante",
    "coverage_plan": "PARTICULAR",
    "date_of_birth": "1964-07-18",
    "genre": "Femenino",
    "marital_status": "Viudo",
    "address": "4173 Sheppard Course, Littlebury, MI 80244",
    "phone_number": "+1-815-341-5571x8235",
    "occupation": "Conservation officer, nature"
  },
  {
    "id": "6413eca1-a7dd-40c0-b7fd-f420e0a34483",
    "id_type": "PA",
    "id_number": 46299791,
    "name": "Nicholas",
    "lastname": "Silva",
    "user_type": "Adicional",
    "coverage_plan": "PARTICULAR",
    "date_of_birth": "1956-01-05",
    "genre": "Femenino",
    "marital_status": "Viudo",
    "address": "7510 Derrick Place, West Jessicaport, AZ 02367",
    "phone_number": "(048)848-8417",
    "occupation": "Engineer, manufacturing"
  },
  {
    "id": "fa06b2a7-4c30-4d51-bf61-6c372f95313d",
    "id_type": "PA",
    "id_number": 88699679,
    "name": "Steve",
    "lastname": "Campbell",
    "user_type": "Beneficiario",
    "coverage_plan": "PARTICULAR",
    "date_of_birth": "1961-12-31",
    "genre": "Femenino",
    "marital_status": "Divorciado",
    "address": "PSC 8117, Box 1906, APO AP 69277",
    "phone_number": "001-962-761-5267",
    "occupation": "Engineer, civil (contracting)"
  },
  {
    "id": "ae6abab2-2b93-471f-a28d-2b72ee2f154f",
    "id_type": "CC",
    "id_number": 34764470,
    "name": "Brad",
    "lastname": "Gallegos",
    "user_type": "Adicional",
    "coverage_plan": "PARTICULAR",
    "date_of_birth": "1968-08-26",
    "genre": "Femenino",
    "marital_status": "Union libre",
    "address": "2165 Jenna Pine Suite 013, Russomouth, IN 84349",
    "phone_number": "2498671398",
    "occupation": "Hydrologist"
  },
  {
    "id": "772e5134-2c53-478f-94dd-af5d56b36288",
    "id_type": "PA",
    "id_number": 33275652,
    "name": "Valerie",
    "lastname": "Steele",
    "user_type": "Subsidiado",
    "coverage_plan": "PL_NATIVO",
    "date_of_birth": "1998-06-11",
    "genre": "Femenino",
    "marital_status": "Union libre",
    "address": "558 Kathryn Fords Suite 595, Grayland, NH 90222",
    "phone_number": "+1-498-004-9980x79105",
    "occupation": "Event organiser"
  },
  {
    "id": "45238446-00cc-477e-b836-2eab9ca40d6a",
    "id_type": "CC",
    "id_number": 47827810,
    "name": "Diana",
    "lastname": "Green",
    "user_type": "Subsidiado",
    "coverage_plan": "PL_NATIVO",
    "date_of_birth": "1998-11-10",
    "genre": "Masculino",
    "marital_status": "Divorciado",
    "address": "510 Ellis Camp, Alexanderton, WA 95743",
    "phone_number": "6411851156",
    "occupation": "Electronics engineer"
  },
  {
    "id": "450bf4e7-7c8e-4b3e-95ea-7ca064187c96",
    "id_type": "CC",
    "id_number": 50691293,
    "name": "Kevin",
    "lastname": "Blanchard",
    "user_type": "Subsidiado",
    "coverage_plan": "PARTICULAR",
    "date_of_birth": "1975-08-21",
    "genre": "Femenino",
    "marital_status": "Soltero",
    "address": "890 Karen Forks Apt. 513, Patrickland, KY 64127",
    "phone_number": "(631)811-0883x48111",
    "occupation": "Adult nurse"
  },
  {
    "id": "43775f79-be8f-4cdb-bd11-e682061a32d9",
    "id_type": "PA",
    "id_number": 84105981,
    "name": "Christine",
    "lastname": "Wagner",
    "user_type": "Cotizante",
    "coverage_plan": "PL_NATIVO",
    "date_of_birth": "1951-08-21",
    "genre": "Femenino",
    "marital_status": "Soltero",
    "address": "USNS Robinson, FPO AA 01722",
    "phone_number": "001-986-612-8322x835",
    "occupation": "Advertising art director"
  },
  {
    "id": "434d6e21-0d6e-4dde-b610-94244e6b0e6e",
    "id_type": "CC",
    "id_number": 18133120,
    "name": "Joseph",
    "lastname": "Mcmahon",
    "user_type": "Adicional",
    "coverage_plan": "PL_NATIVO",
    "date_of_birth": "1991-06-14",
    "genre": "Femenino",
    "marital_status": "Viudo",
    "address": "90321 Tamara Mews Apt. 916, North Jessica, SC 55574",
    "phone_number": "+1-169-967-2036x799",
    "occupation": "Plant breeder/geneticist"
  },
  {
    "id": "63ae4bf4-1ff7-4630-8e45-4e4335712388",
    "id_type": "PA",
    "id_number": 28670947,
    "name": "Sean",
    "lastname": "Carter",
    "user_type": "Cotizante",
    "coverage_plan": "PARTICULAR",
    "date_of_birth": "1989-09-13",
    "genre": "Masculino",
    "marital_status": "Divorciado",
    "address": "519 Brian Crossroad Apt. 392, North David, NY 26868",
    "phone_number": "848-748-6510x3439",
    "occupation": "Designer, jewellery"
  },
  {
    "id": "44440d11-4751-45c2-b1b9-bfb48b245f4c",
    "id_type": "PA",
    "id_number": 55464587,
    "name": "Dawn",
    "lastname": "Mccoy",
    "user_type": "Adicional",
    "coverage_plan": "PL_NATIVO",
    "date_of_birth": "1972-04-16",
    "genre": "Masculino",
    "marital_status": "Soltero",
    "address": "823 Kimberly Coves Apt. 580, Jamesbury, NC 95998",
    "phone_number": "6318924035",
    "occupation": "Secretary/administrator"
  },
  {
    "id": "932a9374-5a7b-4c8d-b443-3b89695a0897",
    "id_type": "PA",
    "id_number": 78404205,
    "name": "Kaitlin",
    "lastname": "Harris",
    "user_type": "Subsidiado",
    "coverage_plan": "PARTICULAR",
    "date_of_birth": "1959-03-24",
    "genre": "Masculino",
    "marital_status": "Viudo",
    "address": "PSC 1028, Box 5616, APO AA 08257",
    "phone_number": "001-721-373-7980x228",
    "occupation": "Make"
  },
  {
    "id": "f7dc94c8-acac-47a8-a6c1-04bc3663bbf3",
    "id_type": "PA",
    "id_number": 42383324,
    "name": "Roberta",
    "lastname": "Wilson",
    "user_type": "Beneficiario",
    "coverage_plan": "PL_NATIVO",
    "date_of_birth": "1969-09-28",
    "genre": "Femenino",
    "marital_status": "Union libre",
    "address": "707 Carly Union Suite 465, West Elizabethtown, KY 20829",
    "phone_number": "+1-622-110-0543x681",
    "occupation": "Advertising copywriter"
  },
  {
    "id": "4d576eb5-b846-46ed-8be7-07994cadb86d",
    "id_type": "PA",
    "id_number": 56475916,
    "name": "Robert",
    "lastname": "Huber",
    "user_type": "Beneficiario",
    "coverage_plan": "PL_NATIVO",
    "date_of_birth": "1949-11-26",
    "genre": "Masculino",
    "marital_status": "Soltero",
    "address": "336 Bowman Fields, East Barryberg, MA 14822",
    "phone_number": "(234)091-9022x0801",
    "occupation": "Surveyor, quantity"
  },
  {
    "id": "a6e619d0-c1a9-47db-b4a5-44bfdd7ea388",
    "id_type": "PA",
    "id_number": 43750640,
    "name": "Mark",
    "lastname": "Dunlap",
    "user_type": "Beneficiario",
    "coverage_plan": "PARTICULAR",
    "date_of_birth": "1996-01-16",
    "genre": "Femenino",
    "marital_status": "Union libre",
    "address": "PSC 2254, Box 4094, APO AP 58737",
    "phone_number": "975-829-6184",
    "occupation": "Hotel manager"
  },
  {
    "id": "f7d3d209-e85b-4267-a18b-e83fcc6e0612",
    "id_type": "CC",
    "id_number": 19006693,
    "name": "Mary",
    "lastname": "Cunningham",
    "user_type": "Particular",
    "coverage_plan": "PL_NATIVO",
    "date_of_birth": "1949-09-17",
    "genre": "Masculino",
    "marital_status": "Divorciado",
    "address": "72053 Robert Crossroad, Elliottland, NM 55514",
    "phone_number": "001-138-054-6566x15041",
    "occupation": "Writer"
  },
  {
    "id": "40d8bb6a-09d7-466e-b480-a7156c46fe98",
    "id_type": "PA",
    "id_number": 67676414,
    "name": "Angela",
    "lastname": "Matthews",
    "user_type": "Particular",
    "coverage_plan": "PARTICULAR",
    "date_of_birth": "1971-01-06",
    "genre": "Femenino",
    "marital_status": "Divorciado",
    "address": "2011 Teresa Brook Apt. 267, Morganchester, CO 63349",
    "phone_number": "383.936.3356x4059",
    "occupation": "Volunteer coordinator"
  },
  {
    "id": "3a27f82d-e901-40cb-8b51-bea4eaed83ec",
    "id_type": "CC",
    "id_number": 11742502,
    "name": "Patrick",
    "lastname": "Miller",
    "user_type": "Cotizante",
    "coverage_plan": "PARTICULAR",
    "date_of_birth": "1949-06-29",
    "genre": "Femenino",
    "marital_status": "Union libre",
    "address": "999 Mays Spur Apt. 544, South Catherine, DE 01969",
    "phone_number": "(498)714-1282x28728",
    "occupation": "Radio broadcast assistant"
  }
]

export default function PatientsPage() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <>
      <Header title="Pacientes">
        <Button
          className="ml-auto"
          size="sm"
          asChild
        >
          <Link href="">
            <Plus className="w-4 h-4" />
            Crear paciente
          </Link>
        </Button>
      </Header>
      <div className="flex flex-col gap-4 p-4 h-[calc(100svh-99px)]">
        <DataTable
          data={PATIENT_DATA}
          columns={columns}
          onRowClick={(row) => router.push(`${pathname}/${row.id}`)}
          toolbar={({ table }) => <Toolbar table={table} />}
        />
      </div>
    </>
  )
}
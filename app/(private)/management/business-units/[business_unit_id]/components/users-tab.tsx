// import { useGetPatientQuery } from "@/lib/services/patients";
// import { cn, placeholder } from "@/lib/utils";
// import { useParams } from "next/navigation";
// import { FieldDefinition } from "./general-tab";
// import { useGetBusinessUnitQuery } from "@/lib/services/business-units";
// import { BusinessUnit } from "../../schema/business-units";

// export default function UsersTab() {
//   const params = useParams<{ business_unit_id: string }>();
//   const businessUnitId = params.business_unit_id;

//   const { data: businessUnit, isLoading: isBusinessUnitLoading } = useGetBusinessUnitQuery(businessUnitId);

  

//   return (
//     <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//       {procedureServices.length > 0 && (
//         <>
//           <div className="px-4 flex flex-col gap-4 flex-1">
//             <div className="flex items-center justify-between">
//               <h2 className="text-base font-medium">Servicios</h2>
//             </div>
//             <DataTable
//               data={procedureServices}
//               columns={columnsServices}
//               pagination={false}
//             />
//           </div>
//         </>
//       )}
//     </div>
//   );
// }
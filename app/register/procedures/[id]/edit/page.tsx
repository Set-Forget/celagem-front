import NewProcedurePage from "../../new/page";

export default async function ProcedureEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const procedureId = (await params).id;

  return <div>
    <NewProcedurePage id={procedureId} />  
  </div>;
}

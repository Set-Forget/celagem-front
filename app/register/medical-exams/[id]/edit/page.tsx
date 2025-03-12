import NewMedicalExamsPage from "../../new/page";

export default async function MedicalExamsEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const medicalExamId = (await params).id;

  return (
    <div>
      <NewMedicalExamsPage id={medicalExamId} />
    </div>
  );
}

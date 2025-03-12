import NewJobPositionPage from '../../new/page';

export default async function JobPositionEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const jobPositionId = (await params).id;

  return (
    <div>
      <NewJobPositionPage id={jobPositionId} />
    </div>
  );
}

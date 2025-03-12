import NewServicePage from "../../new/page";

export default async function ServiceEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const serviceId = (await params).id;

  return (
    <div>
      <NewServicePage id={serviceId} />
    </div>
  );
}

import NewMaterialPage from "../../new/page";

export default async function MaterialEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const materialId = (await params).id;

  return <div>
    <NewMaterialPage id={materialId} />
  </div>;
}

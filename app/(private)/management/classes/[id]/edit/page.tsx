import { useRetrieveClassQuery } from "@/lib/services/classes";
import NewClassesPage from "../../new/page";
import { useParams } from "next/navigation";

export default function ClassEditPage() {
  const { id: classId } = useParams();

  const { data, isLoading } = useRetrieveClassQuery({ id: classId as string });

  const classData = data?.data;

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!classData) {
    return <div>Clase no encontrada</div>;
  }

  return (
    <div>
      <NewClassesPage classUnit={classData} />
    </div>
  );
}

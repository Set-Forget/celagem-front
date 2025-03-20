import { useParams } from "next/navigation";
import NewRolePage from "../../new/page";
import { useRetrieveRoleQuery } from "@/lib/services/roles";

export default function RoleEditPage() {
  const { id } = useParams();

  const { data, isLoading } = useRetrieveRoleQuery({ id: id as string });

  const role = data?.data;

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!role) {
    return <div>No se encontró el rol</div>;
  }

  return <div>
    <NewRolePage role={role} />
  </div>;
}

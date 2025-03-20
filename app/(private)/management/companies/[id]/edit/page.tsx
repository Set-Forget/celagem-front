import { useParams } from "next/navigation";
import NewCompanyPage from '../../new/page';
import { useRetrieveCompanyQuery } from "@/lib/services/companies";

export default function CompanyEditPage() {
  const { id } = useParams();

  const { data, isLoading } = useRetrieveCompanyQuery({ id: id as string });

  const company = data?.data;

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!company) {
    return <div>No se encontró la compañia</div>;
  }

  return <div>
    <NewCompanyPage company={company} />
  </div>;
}

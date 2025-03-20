import { useParams } from 'next/navigation';
import NewBusinessUnitPage from '../../new/page';
import { useRetrieveBusinessUnitQuery } from '@/lib/services/business-units';

export default function BusinessUnitEditPage() {
  const { id } = useParams();

  const { data: businessUnit, isLoading } = useRetrieveBusinessUnitQuery({
    Id: id as string,
  });

  if (isLoading) {
    return <div>Cargando...</div>;
  } else if (businessUnit) {
    return (
      <div>
        <NewBusinessUnitPage businessUnit={businessUnit.data} />
      </div>
    );
  } else  {
    return <div>Business unit not found</div>;
  }
}

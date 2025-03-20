import { useParams } from 'next/navigation';
import { useRetrieveUserQuery } from '@/lib/services/users';
import NewPatientsPage from '../../new/page';

export default function PatientsEditPage() {
  const { id: userId } = useParams();

  const { data: userData, isLoading } = useRetrieveUserQuery({ id: userId as string });

  if (isLoading) {
    return <div>Cargando...</div>;
  } else if (!userData) {return <div>No se encontró el usuario</div>;}

  return (
    <div>
      <NewPatientsPage patient={userData?.data} />
    </div>
  );
}

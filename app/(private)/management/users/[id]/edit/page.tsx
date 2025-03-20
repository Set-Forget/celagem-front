import { useParams } from 'next/navigation';
import { useRetrieveUserQuery } from '@/lib/services/users';
import NewUserPage from '../../new/page';

export default function UserEditPage() {
  const { id: userId } = useParams();

  const { data, isLoading } = useRetrieveUserQuery({ id: userId as string });

  const user = data?.data;

  if (isLoading) {
    return <div>Cargando...</div>;
  } else if (!user) {return <div>No se encontró el usuario</div>;}

  return (
    <div>
      <NewUserPage user={user} />
    </div>
  );
}

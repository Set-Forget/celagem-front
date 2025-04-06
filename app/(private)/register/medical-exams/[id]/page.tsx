'use client';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { medicalExamsMock } from '../mocks/medicalExamsMock';

export default function Page() {
  const pathname = usePathname();
  const router = useRouter();

  const { id } = useParams();

  const medicalExam = medicalExamsMock.find(
    (proc) => proc.id === parseInt(id as string)
  );

  return (
    <div>
      <Header
        title={
          medicalExam?.code + ' - ' + medicalExam?.description ||
          'Examen Medico'
        }
      >
        <div className="ml-auto flex gap-2">
          <Button
            type="submit"
            size="sm"
            onClick={() => router.push(`${pathname}/edit`)}
          >
            Editar examen medico
          </Button>
        </div>
      </Header>

      <div className="grid grid-cols-1 gap-4 p-4">
        <div className="p-4 flex flex-col gap-4">
          <h2 className="text-base font-medium">General</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 w-100">
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Código</label>
              <span className="text-sm">{medicalExam?.code}</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Estado</label>
              <span className="text-sm">{medicalExam?.status}</span>
            </div>
            {medicalExam?.cups_code && (
              <div className="flex flex-col gap-1">
                <label className="text-muted-foreground text-sm">
                  Código CUPS
                </label>
                <span className="text-sm">{medicalExam?.cups_code}</span>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">
                Descripción
              </label>
              <span className="text-sm">{medicalExam?.description}</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Costo</label>
              <span className="text-sm">{medicalExam?.cost}</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">
                Costo Unitario
              </label>
              <span className="text-sm">{medicalExam?.unit_cost}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

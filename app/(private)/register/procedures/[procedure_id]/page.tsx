'use client';

import { DataTable } from '@/components/data-table';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { jobPositionsMock } from '../../job-positions/mocks/job-positions-mock';
import { JobPosition } from '../../job-positions/schema/job-positions';
import { materialsMock } from '../../materials/mocks/materials';
import { medicalExamsMock } from '../../medical-exams/mocks/medical-exams-mock';
import { servicesMock } from '../../services/mocks/servicesMock';
import { proceduresMock } from '../mocks/procedures-mock';
import { columnsJobPositions } from './components/columns-job-positions';
import { columnsMaterials } from './components/columns-materials';
import { columnsMedicalExams } from './components/columns-medical-exams';
import { columnsServices } from './components/columns-services';

export default function PurchaseRequestPage() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();

  const procedureId = params.id as string;

  const procedure = proceduresMock.find(
    (procedure) => procedure.id === parseInt(procedureId)
  );

  const procedureJobPositionsIds = procedure?.job_description
    ? procedure?.job_description.map(({ id }) => id)
    : [];

  const procedureJobPositions: JobPosition[] = jobPositionsMock.filter(
    (jobPosition) => procedureJobPositionsIds.includes(jobPosition.id)
  );

  const procedureServicesIds = procedure?.services
    ? procedure?.services.map(({ id }) => id)
    : [];

  const procedureServices = servicesMock.filter((service) =>
    procedureServicesIds.includes(service.id)
  );

  const procedureMedicalExamsIds = procedure?.medical_exams
    ? procedure?.medical_exams.map(({ id }) => id)
    : [];

  const procedureMedicalExams = medicalExamsMock.filter((medicalExam) =>
    procedureMedicalExamsIds.includes(medicalExam.id)
  );

  const procedureMaterialsIds = procedure?.materials
    ? procedure?.materials.map(({ id }) => id)
    : [];

  const procedureMaterials = materialsMock.filter((material) =>
    procedureMaterialsIds.includes(material.id)
  );

  return (
    <>
      <Header title={procedure?.cups_code + ' - ' + procedure?.description}>
        <div className="ml-auto flex gap-2">
          <Button
            type="submit"
            size="sm"
            onClick={() => router.push(`${pathname}/edit`)}
          >
            Editar acto clinico
          </Button>
        </div>
      </Header>
      <div className="flex flex-col gap-4 py-4">
        <div className="px-4 flex flex-col gap-4">
          <h2 className="text-base font-medium">General</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Esquema</label>
              <span className="text-sm">{procedure?.schema}</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">
                Descripcion
              </label>
              <span className="text-sm">{procedure?.description}</span>
            </div>
            {procedure?.cups_code && (
              <div className="flex flex-col gap-1">
                <label className="text-muted-foreground text-sm">
                  Código CUPS
                </label>
                <span className="text-sm">{procedure?.cups_code}</span>
              </div>
            )}
          </div>
        </div>
        <Separator />
        {procedureJobPositions.length && (
          <>
            <div className="px-4 flex flex-col gap-4 flex-1">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-medium">Puestos de trabajo</h2>
              </div>
              <DataTable
                data={procedureJobPositions}
                columns={columnsJobPositions}
                pagination={false}
              />
            </div>
          </>
        )}
        {procedureServices.length && (
          <>
            <div className="px-4 flex flex-col gap-4 flex-1">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-medium">Servicios</h2>
              </div>
              <DataTable
                data={procedureServices}
                columns={columnsServices}
                pagination={false}
              />
            </div>
          </>
        )}
        {procedureMedicalExams.length && (
          <>
            <div className="px-4 flex flex-col gap-4 flex-1">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-medium">Examenes médicos</h2>
              </div>
              <DataTable
                data={procedureMedicalExams}
                columns={columnsMedicalExams}
                pagination={false}
              />
            </div>
          </>
        )}
        {procedureMaterials.length && (
          <>
            <div className="px-4 flex flex-col gap-4 flex-1">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-medium">Materiales</h2>
              </div>
              <DataTable
                data={procedureMaterials}
                columns={columnsMaterials}
                pagination={false}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}

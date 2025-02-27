import Header from '@/components/header';
import { medicalExamsMock } from '../mocks/medicalExamsMock';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const medicalExam = medicalExamsMock.find((proc) => proc.id === parseInt(id));

  return (
    <>
      <Header
        title={medicalExam?.code + ' - ' + medicalExam?.description || 'Examen Medico'}
      >
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="ml-auto" size="sm">
              Crear
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/purchases/purchase-receipts/new">
                  Recepciones
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Registro de pago
              </DropdownMenuItem>
              <DropdownMenuItem>
                Nota de débito
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu> */}
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
            {medicalExam?.cup_code && <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">CUPS</label>
              <span className="text-sm">{medicalExam?.cup_code}</span>
            </div>}
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">
                Descripción
              </label>
              <span className="text-sm">{medicalExam?.description}</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">
                Costo
              </label>
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
    </>
  );
}

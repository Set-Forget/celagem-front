import Header from '@/components/header';

import { jobPositionsMock } from '../mocks/jobPositionsMock';


export default async function JobPositionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const jobPosition = jobPositionsMock.find((proc) => proc.id === parseInt(id));

  return (
    <>
      <Header
        title={jobPosition?.code || 'Puesto de trabajo'}
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
              <span className="text-sm">{jobPosition?.code}</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Costo total</label>
              <span className="text-sm">{jobPosition?.total_cost}</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Unidad</label>
              <span className="text-sm">{jobPosition?.unit}</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">
                Costo por Unidad
              </label>
              <span className="text-sm">{jobPosition?.unit_cost}</span>
            </div>
          </div>
        </div>
        
      </div>
    </>
  );
}

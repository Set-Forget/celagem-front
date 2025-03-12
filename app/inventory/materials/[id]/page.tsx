import Header from '@/components/header';
import { materialsInventoryMock } from '../mocks/materials-inventory';

export default async function MaterialInventoryEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const materialId = (await params).id;

  const materialInventoryEntry = materialsInventoryMock.find(
    (material) => material.id === parseInt(materialId)
  );

  return (
    <>
      <Header
        title={
          materialInventoryEntry?.code + ' - ' + materialInventoryEntry?.name ||
          'Material'
        }
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
        <div className="flex flex-col gap-4">
          <h2 className="text-base font-medium">General</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Código</label>
              <span className="text-sm">{materialInventoryEntry?.code}</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Marca</label>
              <span className="text-sm">{materialInventoryEntry?.brand ?? 'Generico'}</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Fracción</label>
              <span className="text-sm">
                {materialInventoryEntry?.fraction}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">
                Número de lote
              </label>
              <span className="text-sm">
                {materialInventoryEntry?.lot_number}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Cantidad</label>
              <span className="text-sm">{materialInventoryEntry?.qty}</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Ubicación</label>
              <span className="text-sm">
                {materialInventoryEntry?.location}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Stock</label>
              <span className="text-sm">
                {materialInventoryEntry?.qty}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

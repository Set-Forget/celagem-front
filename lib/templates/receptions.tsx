import { PurchaseReceiptDetail } from '@/app/(private)/purchases/purchase-receipts/schemas/purchase-receipts';
import { PDF } from '@/components/pdf-component';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import React from 'react';

const ReceptionPDF: React.FC<{ data: PurchaseReceiptDetail }> = ({ data }) => {
  const formattedScheduledDate = format(data.scheduled_date, 'PP', { locale: es })
  const formattedReceptionDate = format(data.reception_date, 'PP', { locale: es })

  const totalItems = data.items.length
  const totalQuantity = data.items.reduce((sum, item) => sum + item.quantity, 0)
  const totalScheduledQuantity = data.items.reduce((sum, item) => sum + item.product_uom_qty, 0)

  return (
    <PDF
      options={{
        title: `Recepción ${data.number}`,
      }}
    >
      <div className="flex justify-between mb-6 text-xs gap-5">
        <div className="w-full px-3">
          <h1 className="mb-5 text-2xl font-bold">RECEPCIÓN DE MERCANCÍA</h1>
          <div className="flex justify-between">
            <span className="inline-block">Recepción No:</span>
            <span className="font-medium">
              <strong>{data.number}</strong>
            </span>
          </div>
          <div className="flex justify-between">
            <span className="inline-block">Fecha programada:</span>
            <span className="font-medium">
              <strong>{formattedScheduledDate}</strong>
            </span>
          </div>
          <div className="flex justify-between">
            <span className="inline-block">Fecha de recepción:</span>
            <span className="font-medium">
              <strong>{formattedReceptionDate}</strong>
            </span>
          </div>
          <div className="flex justify-between">
            <span className="inline-block">Ubicación destino:</span>
            <span className="font-medium">
              <strong>{data.reception_location}</strong>
            </span>
          </div>
          {data.purchase_orders.length > 0 && (
            <div className="flex justify-between">
              <span className="inline-block">Orden de Compra</span>
              <span className="font-medium">
                <strong>{data.purchase_orders[0].name}</strong>
              </span>
            </div>
          )}
        </div>
        <div className="w-full px-3 mt-12">
          <img src="/celagem-logo.svg" alt="Logo de la empresa" className="block w-[362px] h-[77px]" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 mb-6 text-xs">
        <div className="bg-[#f8f9fa] p-3 rounded-lg">
          <h3 className="mb-4 text-sm font-bold">DATOS DEL PROVEEDOR</h3>
          <div className="flex justify-between">
            <span>Razón Social:</span>
            <span className="font-medium">
              <strong>{data.supplier.name}</strong>
            </span>
          </div>
          <div className="flex justify-between">
            <span>Dirección:</span>
            <span className="font-medium">
              <strong>{data.supplier.address}</strong>
            </span>
          </div>
          <div className="flex justify-between">
            <span>Teléfono:</span>
            <span className="font-medium">
              <strong>{data.supplier.phone}</strong>
            </span>
          </div>
          <div className="flex justify-between">
            <span>Email:</span>
            <span className="font-medium">
              <strong>{data.supplier.email}</strong>
            </span>
          </div>
        </div>
      </div>

      <table className="w-full border-collapse mb-6 text-xs">
        <thead>
          <tr className="bg-[#f8f9fa] text-[12px]">
            <th className="px-3 py-2 text-left">PRODUCTO ID</th>
            <th className="px-3 py-2 text-left">DESCRIPCIÓN</th>
            <th className="px-3 py-2 text-right">CANT. PROGRAMADA</th>
            <th className="px-3 py-2 text-right">CANT. RECIBIDA</th>
            <th className="px-3 py-2 text-left">UNIDAD</th>
            <th className="px-3 py-2 text-left">LOTE</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, index) => (
            <tr key={index} className="border-b border-[#eee]">
              <td className="px-3 py-2">{item.product_id}</td>
              <td className="px-3 py-2">{item.display_name}</td>
              <td className="px-3 py-2 text-right">{item.product_uom_qty.toLocaleString("es-ES")}</td>
              <td className="px-3 py-2 text-right">{item.quantity.toLocaleString("es-ES")}</td>
              <td className="px-3 py-2 text-left">{item.product_uom.name}</td>
              <td className="px-3 py-2 text-left">{item.lot ? item.lot.name : "N/A"}</td>
            </tr>
          ))}
          {data.items.length < 5 &&
            Array(5 - data.items.length)
              .fill(0)
              .map((_, index) => (
                <tr key={`empty-${index}`} className="border-b border-[#eee]">
                  <td className="px-3 py-2">&nbsp;</td>
                  <td className="px-3 py-2">&nbsp;</td>
                  <td className="px-3 py-2">&nbsp;</td>
                  <td className="px-3 py-2">&nbsp;</td>
                  <td className="px-3 py-2">&nbsp;</td>
                  <td className="px-3 py-2">&nbsp;</td>
                </tr>
              ))}
        </tbody>
      </table>

      <div className="grid grid-cols-2 gap-6">
        <div className="text-xs">
          <h3 className="mb-4 text-sm font-bold">NOTAS:</h3>
          {data.note ? <p>{data.note}</p> : <p>Sin notas adicionales</p>}

          <h3 className="mt-5 mb-4 text-sm font-bold">CONDICIONES DE RECEPCIÓN:</h3>
          <ol className="pl-5 m-0 list-decimal">
            <li>Verificar que los productos recibidos coincidan con la orden de compra</li>
            <li>Inspeccionar el estado físico de los productos</li>
            <li>Confirmar las cantidades recibidas</li>
            <li>Registrar cualquier discrepancia o daño</li>
            <li>Almacenar los productos en la ubicación designada</li>
          </ol>
        </div>

        <div className="bg-[#f8f9fa] p-3 rounded-lg">
          <div className="grid grid-cols-[1fr_auto] gap-2 text-right text-xs">
            <span>TOTAL ITEMS:</span>
            <span>
              <strong>{totalItems}</strong>
            </span>
            <span>CANTIDAD PROGRAMADA:</span>
            <span>
              <strong>{totalScheduledQuantity.toLocaleString("es-ES")}</strong>
            </span>
            <span>CANTIDAD RECIBIDA:</span>
            <span>
              <strong>{totalQuantity.toLocaleString("es-ES")}</strong>
            </span>
            <div className="col-span-2 h-px bg-[#eee] my-2"></div>
            <span className="font-bold text-sm">ESTADO:</span>
            <span className="font-bold text-sm">
              {totalQuantity === totalScheduledQuantity ? "COMPLETA" : "PARCIAL"}
            </span>
          </div>
          <p className="mt-2 italic text-right text-xs">Recepción realizada el {format(data.reception_date, 'PP', { locale: es })}</p>
        </div>
      </div>

      <div className="mt-6 flex justify-between gap-6">
        <div className="bg-[#f8f9fa] p-3 rounded-lg flex flex-col w-full justify-between">
          <p className="mb-3 font-bold text-left text-xs">RECIBIDO POR</p>
          <p className="text-xs py-3"></p>
          <hr className="w-full border-t border-black m-0" />
        </div>
        <div className="bg-[#f8f9fa] p-3 rounded-lg flex flex-col w-full justify-between">
          <p className="mb-3 font-bold text-left text-xs">ENTREGADO POR</p>
          <p className="text-xs py-3">{data.supplier.name}</p>
          <hr className="w-full border-t border-black m-0" />
        </div>
      </div>
    </PDF>
  )
}

export default ReceptionPDF

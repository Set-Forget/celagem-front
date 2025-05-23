import { DeliveryNoteDetail } from '@/app/(private)/sales/delivery-notes/schemas/delivery-notes';
import { PDF } from '@/components/pdf-component';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import React from 'react';

const DeliveryNotePDF: React.FC<{ data: DeliveryNoteDetail }> = ({ data }) => {
  const formattedScheduledDate = format(new Date(data.scheduled_date), "PP", { locale: es })
  const formattedDeliveryDate = format(new Date(data.delivery_date), "PP", { locale: es })

  const totalItems = data.items.length
  const totalQuantity = data.items.reduce((sum, item) => sum + item.quantity, 0)
  const totalScheduledQuantity = data.items.reduce((sum, item) => sum + item.product_uom_qty, 0)

  return (
    <PDF
      options={{
        title: `Remito ${data.number}`,
      }}
    >
      <div className="flex justify-between mb-6 text-xs gap-5">
        <div className="w-full px-3">
          <h1 className="mb-5 text-2xl font-bold">REMITO DE ENTREGA</h1>
          <div className="flex justify-between">
            <span className="inline-block">Remito No:</span>
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
            <span className="inline-block">Fecha de entrega:</span>
            <span className="font-medium">
              <strong>{formattedDeliveryDate}</strong>
            </span>
          </div>
          <div className="flex justify-between">
            <span className="inline-block">Ubicación destino:</span>
            <span className="font-medium">
              <strong>{data.delivery_location}</strong>
            </span>
          </div>

        </div>
        <div className="w-full px-3 mt-12">
          <img src="/celagem-logo.svg" alt="Logo de la empresa" className="block w-[362px] h-[77px]" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 mb-6 text-xs">
        <div className="bg-[#f8f9fa] p-3 rounded-lg">
          <h3 className="mb-4 text-sm font-bold">DATOS DEL CLIENTE</h3>
          <div className="flex justify-between">
            <span>Razón Social:</span>
            <span className="font-medium">
              <strong>{data.customer.name}</strong>
            </span>
          </div>
          <div className="flex justify-between">
            <span>Dirección:</span>
            <span className="font-medium">
              <strong>{data.customer.address}</strong>
            </span>
          </div>
          <div className="flex justify-between">
            <span>Teléfono:</span>
            <span className="font-medium">
              <strong>{data.customer.phone}</strong>
            </span>
          </div>
          <div className="flex justify-between">
            <span>Email:</span>
            <span className="font-medium">
              <strong>{data.customer.email}</strong>
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
            <th className="px-3 py-2 text-right">CANT. ENTREGADA</th>
            <th className="px-3 py-2 text-left">UNIDAD</th>
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
                </tr>
              ))}
        </tbody>
      </table>

      <div className="grid grid-cols-2 gap-6">
        <div className="text-xs">
          <h3 className="mb-4 text-sm font-bold">NOTAS:</h3>
          {data.note ? <p>{data.note}</p> : <p>Sin notas adicionales</p>}

          <h3 className="mt-5 mb-4 text-sm font-bold">CONDICIONES DE ENTREGA:</h3>
          <ol className="pl-5 m-0 list-decimal">
            <li>Verificar que los productos entregados coincidan con la orden de venta</li>
            <li>Inspeccionar el estado físico de los productos al momento de la entrega</li>
            <li>Confirmar las cantidades entregadas</li>
            <li>Registrar cualquier discrepancia o daño</li>
            <li>Obtener la firma de conformidad del cliente</li>
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
            <span>CANTIDAD ENTREGADA:</span>
            <span>
              <strong>{totalQuantity.toLocaleString("es-ES")}</strong>
            </span>
            <div className="col-span-2 h-px bg-[#eee] my-2"></div>
            <span className="font-bold text-sm">ESTADO:</span>
            <span className="font-bold text-sm">
              {totalQuantity === totalScheduledQuantity ? "COMPLETA" : "PARCIAL"}
            </span>
          </div>
          <p className="mt-2 italic text-right text-xs">
            Entrega realizada el {format(new Date(data.delivery_date), "PP", { locale: es })}
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-between gap-6">
        <div className="bg-[#f8f9fa] p-3 rounded-lg flex flex-col w-full justify-between">
          <p className="mb-3 font-bold text-left text-xs">ENTREGADO POR</p>
          <p className="text-xs py-3"></p>
          <hr className="w-full border-t border-black m-0" />
        </div>
        <div className="bg-[#f8f9fa] p-3 rounded-lg flex flex-col w-full justify-between">
          <p className="mb-3 font-bold text-left text-xs">RECIBIDO POR</p>
          <p className="text-xs py-3">{data.customer.name}</p>
          <hr className="w-full border-t border-black m-0" />
        </div>
      </div>
    </PDF>
  )
}

export default DeliveryNotePDF

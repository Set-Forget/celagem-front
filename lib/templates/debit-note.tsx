import { PDF } from '@/components/pdf-component';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import React from 'react';
import { toWords } from '../utils';
import { DebitNoteDetail } from '@/app/(private)/[scope]/debit-notes/schemas/debit-notes';

const DebitNotePDF: React.FC<{ data: DebitNoteDetail }> = ({ data }) => {
  const formattedDate = format(data.date, 'PP', { locale: es })
  const formattedDueDate = format(data.due_date, 'PP', { locale: es })
  const formattedCreatedDate = format(data.created_at, 'PP', { locale: es })

  const subtotal = data.items.reduce((sum, item) => sum + item.price_subtotal, 0)
  const taxes = data.items.reduce((sum, item) => sum + item.price_tax, 0)
  const total = subtotal + taxes

  const currencyCode = data.currency.name
  const formattedSubtotal = `${currencyCode} ${subtotal.toFixed(2)}`
  const formattedTaxes = `${currencyCode} ${taxes.toFixed(2)}`
  const formattedTotal = `${currencyCode} ${total.toFixed(2)}`

  const invoiceNumber = data.number ? data.number : `#${data.id}`
  const totalInWords = `${currencyCode} ${toWords(total.toFixed(2))}`

  return (
    <PDF
      options={{
        title: `Factura de Compra ${invoiceNumber}`,
      }}
    >
      <div className="flex justify-between mb-6 text-xs gap-5">
        <div className="w-full px-3">
          <h1 className="mb-5 text-2xl font-bold">NOTA DE DÉBITO</h1>
          <div className="flex justify-between">
            <span className="inline-block">Nota de débito No:</span>
            <span className="font-medium">
              <strong>{invoiceNumber}</strong>
            </span>
          </div>
          <div className="flex justify-between">
            <span>Creado por:</span>
            <span className="font-medium">
              <strong>{data.created_by}</strong>
            </span>
          </div>
          <div className="flex justify-between">
            <span>Fecha de creación:</span>
            <span className="font-medium">
              <strong>{formattedCreatedDate}</strong>
            </span>
          </div>
        </div>
        <div className="w-full px-3 mt-12">
          <img src="/celagem-logo.svg" className="block w-[362px] h-[77px]" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 mb-6 text-xs">
        <div className="bg-[#f8f9fa] p-3 rounded-lg">
          <h3 className="mb-4 text-sm font-bold">DATOS DEL PROVEEDOR</h3>
          <div className="flex justify-between">
            <span>Razón Social:</span>
            <span className="font-medium">
              <strong>{data.partner.name}</strong>
            </span>
          </div>
          <div className="flex justify-between">
            <span>Dirección:</span>
            <span className="font-medium">
              <strong>{data.partner.address}</strong>
            </span>
          </div>
          <div className="flex justify-between">
            <span>Teléfono:</span>
            <span className="font-medium">
              <strong>{data.partner.phone}</strong>
            </span>
          </div>
          <div className="flex justify-between">
            <span>Email:</span>
            <span className="font-medium">
              <strong>{data.partner.email}</strong>
            </span>
          </div>
        </div>
        <div className="bg-[#f8f9fa] p-3 rounded-lg">
          <h3 className="mb-4 text-sm font-bold">DATOS DE PAGO</h3>
          <div className="flex justify-between">
            <span>Moneda:</span>
            <span className="font-medium">
              <strong>{data.currency.name}</strong>
            </span>
          </div>
          <div className="flex justify-between">
            <span>Término de pago:</span>
            <span className="font-medium">
              <strong>{data.payment_term.name}</strong>
            </span>
          </div>
          <div className="flex justify-between">
            <span>Método de pago:</span>
            <span className="font-medium">
              <strong>{data.payment_method.name}</strong>
            </span>
          </div>
          <div className="flex justify-between">
            <span className="inline-block">Fecha de emisión:</span>
            <span className="font-medium">
              <strong>{formattedDate}</strong>
            </span>
          </div>
          <div className="flex justify-between">
            <span className="inline-block">Fecha de vencimiento:</span>
            <span className="font-medium">
              <strong>{formattedDueDate}</strong>
            </span>
          </div>
        </div>
      </div>

      <table className="w-full border-collapse mb-6 text-xs">
        <thead>
          <tr className="bg-[#f8f9fa] text-[12px]">
            <th className="px-3 py-2 text-left">PRODUCTO ID</th>
            <th className="px-3 py-2 text-left">DESCRIPCIÓN</th>
            <th className="px-3 py-2 text-right">CANTIDAD</th>
            <th className="px-3 py-2 text-right">PRECIO UNITARIO</th>
            <th className="px-3 py-2 text-right">SUBTOTAL</th>
            <th className="px-3 py-2 text-right">IMPUESTO</th>
            <th className="px-3 py-2 text-right">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item) => (
            <tr key={item.id} className="border-b border-[#eee]">
              <td className="px-3 py-2">{item.product_id}</td>
              <td className="px-3 py-2">{item.product_name}</td>
              <td className="px-3 py-2 text-right">{item.quantity.toLocaleString("es-ES")}</td>
              <td className="px-3 py-2 text-right">{currencyCode} {item.price_unit.toFixed(2)}</td>
              <td className="px-3 py-2 text-right">{currencyCode} {item.price_subtotal.toFixed(2)}</td>
              <td className="px-3 py-2 text-right">{item.taxes.map((tax) => tax.name).join(', ')}</td>
              <td className="px-3 py-2 text-right">
                {currencyCode} {(item.price_subtotal + item.price_tax).toFixed(2)}
              </td>
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
                  <td className="px-3 py-2">&nbsp;</td>
                </tr>
              ))}
        </tbody>
      </table>

      <div className="grid grid-cols-2 gap-6">
        <div className="text-xs">
          <h3 className="mt-5 mb-4 text-sm font-bold">INFORMACIÓN ADICIONAL:</h3>
          <ul className="pl-5 m-0 list-disc">
            <li>
              Factura asociada: {data.associated_invoice.name} (ID: {data.associated_invoice.id})
            </li>
            <li>Esta nota de débito se emita para ajustar el saldo de la factura asociada</li>
            <li>Los impuestos se calculan sobre el valor creditado</li>
          </ul>

          <h3 className="mt-5 mb-4 text-sm font-bold">TÉRMINOS Y CONDICIONES:</h3>
          <ol className="pl-5 m-0 list-decimal">
            <li>Los productos solicitados deben cumplir con las especificaciones requeridas</li>
            <li>La entrega debe realizarse en el tiempo establecido</li>
            <li>Los productos deben contar con garantía del fabricante</li>
            <li>Se debe entregar la documentación completa de los productos</li>
          </ol>
        </div>

        <div className="bg-[#f8f9fa] p-3 rounded-lg">
          <div className="grid grid-cols-[1fr_auto] gap-2 text-right text-xs">
            <span>SUBTOTAL:</span>
            <span>
              <strong>{formattedSubtotal}</strong>
            </span>
            <span>IMPUESTO:</span>
            <span>
              <strong>{formattedTaxes}</strong>
            </span>
            <div className="col-span-2 h-px bg-[#eee] my-2"></div>
            <span className="font-bold text-sm">TOTAL:</span>
            <span className="font-bold text-sm">{formattedTotal}</span>
          </div>
          <p className="mt-2 italic text-right text-xs">SON: {totalInWords}</p>
        </div>
      </div>

      <div className="mt-6 flex justify-between gap-6">
        <div className="bg-[#f8f9fa] p-3 rounded-lg flex flex-col w-full justify-between">
          <p className="mb-3 font-bold text-left text-xs">APROBADO POR</p>
          <p className="text-xs py-3">{data.created_by}</p>
          <hr className="w-full border-t border-black m-0" />
        </div>
        <div className="bg-[#f8f9fa] p-3 rounded-lg flex flex-col w-full justify-between">
          <p className="mb-3 font-bold text-left text-xs">FIRMA Y SELLO DEL PROVEEDOR</p>
          <p className="text-xs py-3">{data.partner.name}</p>
          <hr className="w-full border-t border-black m-0" />
        </div>
      </div>
    </PDF>
  )
}

export default DebitNotePDF

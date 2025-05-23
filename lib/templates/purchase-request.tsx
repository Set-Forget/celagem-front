import { PurchaseRequestDetail } from "@/app/(private)/purchases/purchase-requests/schemas/purchase-requests"
import { purchaseRequestStatus } from "@/app/(private)/purchases/purchase-requests/utils"
import { PDF } from "@/components/pdf-component"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type React from "react"

const PurchaseRequestPDF: React.FC<{ data: PurchaseRequestDetail }> = ({ data }) => {
  const formattedRequestDate = format(data.request_date, "PP", { locale: es })
  const formattedCreatedDate = format(data.created_at, "PP", { locale: es })

  return (
    <PDF
      options={{
        title: `Solicitud de Pedido ${data.name}`,
      }}
    >
      <div className="flex justify-between mb-6 text-xs gap-5">
        <div className="w-full px-3">
          <h1 className="mb-5 text-2xl font-bold">SOLICITUD DE PEDIDO</h1>
          <div className="flex justify-between">
            <span className="inline-block">Nombre:</span>
            <span className="font-medium">
              <strong>{data.name}</strong>
            </span>
          </div>
          <div className="flex justify-between">
            <span className="inline-block">Fecha de solicitud:</span>
            <span className="font-medium">
              <strong>{formattedRequestDate}</strong>
            </span>
          </div>
        </div>
        <div className="w-full px-3 mt-12">
          <img src="/celagem-logo.svg" alt={data.company.name} className="block w-[362px] h-[77px]" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 mb-6 text-xs">
        <div className="bg-[#f8f9fa] p-3 rounded-lg">
          <h3 className="mb-4 text-sm font-bold">DATOS DE LA SOLICITUD</h3>
          <div className="flex justify-between">
            <span>Creado por:</span>
            <span className="font-medium">
              <strong>{data.created_by.name}</strong>
            </span>
          </div>
          <div className="flex justify-between">
            <span className="inline-block">Estado:</span>
            <span className="font-medium">
              <strong>{purchaseRequestStatus[data.state].label}</strong>
            </span>
          </div>
          {data.purchase_order && (
            <div className="flex justify-between">
              <span className="inline-block">Orden de Compra:</span>
              <span className="font-medium">
                <strong>{data.purchase_order.name}</strong>
              </span>
            </div>
          )}
        </div>
        <div className="bg-[#f8f9fa] p-3 rounded-lg">
          <h3 className="mb-4 text-sm font-bold">DATOS DE LA EMPRESA</h3>
          <div className="flex justify-between">
            <span>Razón Social:</span>
            <span className="font-medium">
              <strong>{data.company.name}</strong>
            </span>
          </div>
          {/*           <div className="flex justify-between">
            <span>Dirección:</span>
            <span className="font-medium">
              <strong>Av. Siempre Viva 123</strong>
            </span>
          </div>
          <div className="flex justify-between">
            <span>PBX:</span>
            <span className="font-medium">
              <strong>7456614</strong>
            </span>
          </div> */}
        </div>
      </div>

      <table className="w-full border-collapse mb-6 text-xs">
        <thead>
          <tr className="bg-[#f8f9fa] text-[12px]">
            <th className="px-3 py-2 text-left">ID</th>
            <th className="px-3 py-2 text-left">PRODUCTO ID</th>
            <th className="px-3 py-2 text-left">DESCRIPCIÓN</th>
            <th className="px-3 py-2 text-right">CANTIDAD</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item) => (
            <tr key={item.id} className="border-b border-[#eee]">
              <td className="px-3 py-2">{item.id}</td>
              <td className="px-3 py-2">{item.product_id}</td>
              <td className="px-3 py-2">{item.product_name}</td>
              <td className="px-3 py-2 text-right">{item.quantity.toLocaleString("es-ES")}</td>
            </tr>
          ))}
          {/* Si hay pocos items, podemos agregar filas vacías para mantener la estructura */}
          {data.items.length < 5 &&
            Array(5 - data.items.length)
              .fill(0)
              .map((_, index) => (
                <tr key={`empty-${index}`} className="border-b border-[#eee]">
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
          <h3 className="mt-5 mb-4 text-sm font-bold">TÉRMINOS Y CONDICIONES:</h3>
          {data.tyc_notes ? (
            <p>{data.tyc_notes}</p>
          ) : (
            <ol className="pl-5 m-0 list-decimal">
              <li>Los productos solicitados deben cumplir con las especificaciones requeridas</li>
              <li>La entrega debe realizarse en el tiempo establecido</li>
              <li>Los productos deben contar con garantía del fabricante</li>
              <li>Se debe entregar la documentación completa de los productos</li>
            </ol>
          )}
        </div>

        <div className="bg-[#f8f9fa] p-3 rounded-lg">
          <div className="grid grid-cols-[1fr_auto] gap-2 text-right text-xs">
            <span>TOTAL ITEMS:</span>
            <span>
              <strong>{data.items.length}</strong>
            </span>
            <span>TOTAL CANTIDAD:</span>
            <span>
              <strong>{data.items.reduce((sum, item) => sum + item.quantity, 0).toLocaleString("es-ES")}</strong>
            </span>
            <div className="col-span-2 h-px bg-[#eee] my-2"></div>
            <span className="font-bold text-sm">ESTADO:</span>
            <span className="font-bold text-sm">
              <strong>{purchaseRequestStatus[data.state].label}</strong>
            </span>
          </div>
          {data.purchase_order && (
            <p className="mt-2 italic text-right text-xs">Orden de compra asociada: {data.purchase_order.name}</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-between gap-6">
        <div className="bg-[#f8f9fa] p-3 rounded-lg flex flex-col w-full justify-between">
          <p className="mb-3 font-bold text-left text-xs">SOLICITADO POR</p>
          <p className="text-xs py-3">{data.created_by.name}</p>
          <hr className="w-full border-t border-black m-0" />
        </div>
        <div className="bg-[#f8f9fa] p-3 rounded-lg flex flex-col w-full justify-between">
          <p className="mb-3 font-bold text-left text-xs">APROBADO POR</p>
          <p className="text-xs py-3"></p>
          <hr className="w-full border-t border-black m-0" />
        </div>
      </div>
    </PDF>
  )
}

export default PurchaseRequestPDF

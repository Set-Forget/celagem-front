import { PDF } from '@/components/pdf-component';
import React from 'react';

export interface PurchaseOrderData {
  orderNumber: string;
}

const PurchaseOrderPDF: React.FC<{ data: PurchaseOrderData }> = ({ data }) => {
  return (
    <PDF options={{
      title: `Orden de Compra ${data.orderNumber}`
    }}>
      <div className="flex justify-between mb-6 text-xs gap-5">
        <div className="w-full px-3">
          <h1 className="mb-5 text-2xl font-bold">ORDEN DE COMPRA</h1>
          <div className="flex justify-between">
            <span className="inline-block">Orden No:</span>
            <span className="font-medium"><strong>1437</strong></span>
          </div>
          <div className="flex justify-between">
            <span className="inline-block">Fecha de orden:</span>
            <span className="font-medium"><strong>15/10/2024</strong></span>
          </div>
          <div className="flex justify-between">
            <span className="inline-block">Fecha de entrega:</span>
            <span className="font-medium"><strong>17/10/2024</strong></span>
          </div>
          <div className="flex justify-between">
            <span className="inline-block">Forma de pago:</span>
            <span className="font-medium"><strong>30 Días</strong></span>
          </div>
        </div>
        <div className="w-full px-3 mt-12">
          <img src="/celagem-logo.svg" alt="CENTRO DE FERTILIDAD REPRONAT S.A.S." className="block w-[362px] h-[77px]" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 mb-6 text-xs">
        <div className="bg-[#f8f9fa] p-3 rounded-lg">
          <h3 className="mb-4 text-sm font-bold">DATOS DEL PROVEEDOR</h3>
          <div className="flex justify-between">
            <span>NIT/CUIT:</span>
            <span className="font-medium"><strong>901029126-4</strong></span>
          </div>
          <div className="flex justify-between">
            <span>Razón Social:</span>
            <span className="font-medium"><strong>PHARMAXIS COLOMBIA SAS</strong></span>
          </div>
          <div className="flex justify-between">
            <span>Dirección:</span>
            <span className="font-medium"><strong>CR 49 94 67</strong></span>
          </div>
          <div className="flex justify-between">
            <span>Ciudad:</span>
            <span className="font-medium"><strong>Bogotá</strong></span>
          </div>
          <div className="flex justify-between">
            <span>Teléfono:</span>
            <span className="font-medium"><strong>6412514</strong></span>
          </div>
        </div>
        <div className="bg-[#f8f9fa] p-3 rounded-lg">
          <h3 className="mb-4 text-sm font-bold">DATOS DE LA EMPRESA</h3>
          <div className="flex justify-between">
            <span>CUIT/NIT:</span>
            <span className="font-medium"><strong>30-12345678-9</strong></span>
          </div>
          <div className="flex justify-between">
            <span>Razón Social:</span>
            <span className="font-medium"><strong>CENTRO DE FERTILIDAD REPRONAT S.A.S.</strong></span>
          </div>
          <div className="flex justify-between">
            <span>Dirección:</span>
            <span className="font-medium"><strong>Av. Siempre Viva 123</strong></span>
          </div>
          <div className="flex justify-between">
            <span>PBX:</span>
            <span className="font-medium"><strong>7456614</strong></span>
          </div>
        </div>
      </div>

      <table className="w-full border-collapse mb-6 text-xs">
        <thead>
          <tr className="bg-[#f8f9fa] text-[12px]">
            <th className="px-3 py-2 text-left">CÓDIGO</th>
            <th className="px-3 py-2 text-left">DESCRIPCIÓN</th>
            <th className="px-3 py-2 text-left">NOMBRE</th>
            <th className="px-3 py-2 text-left">CANTIDAD</th>
            <th className="px-3 py-2 text-right">VALOR UNITARIO</th>
            <th className="px-3 py-2 text-right">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-[#eee]">
            <td className="px-3 py-2">1000000092</td>
            <td className="px-3 py-2">PROGESTERONA 200 mg - CÁPSULA ORAL/VAGINAL (CX30)</td>
            <td className="px-3 py-2 text-left">CAPSULA</td>
            <td className="px-3 py-2 text-left">9,000.00</td>
            <td className="px-3 py-2 text-right">$1,383.33</td>
            <td className="px-3 py-2 text-right">$12,449,970.00</td>
          </tr>
          <tr className="border-b border-[#eee]">
            <td className="px-3 py-2">1000000082</td>
            <td className="px-3 py-2">GOSERELINA DEPOT 3.6 MG X 1JERINGA</td>
            <td className="px-3 py-2 text-left">SOLUCION INYECTABLE</td>
            <td className="px-3 py-2 text-left">20.00</td>
            <td className="px-3 py-2 text-right">$296,039.00</td>
            <td className="px-3 py-2 text-right">$5,920,780.00</td>
          </tr>
          <tr className="border-b border-[#eee]">
            <td className="px-3 py-2">1000000082</td>
            <td className="px-3 py-2">GOSERELINA DEPOT 3.6 MG X 1JERINGA</td>
            <td className="px-3 py-2 text-left">SOLUCION INYECTABLE</td>
            <td className="px-3 py-2 text-left">20.00</td>
            <td className="px-3 py-2 text-right">$296,039.00</td>
            <td className="px-3 py-2 text-right">$5,920,780.00</td>
          </tr>
          <tr className="border-b border-[#eee]">
            <td className="px-3 py-2">1000000082</td>
            <td className="px-3 py-2">GOSERELINA DEPOT 3.6 MG X 1JERINGA</td>
            <td className="px-3 py-2 text-left">SOLUCION INYECTABLE</td>
            <td className="px-3 py-2 text-left">20.00</td>
            <td className="px-3 py-2 text-right">$296,039.00</td>
            <td className="px-3 py-2 text-right">$5,920,780.00</td>
          </tr>
          <tr className="border-b border-[#eee]">
            <td className="px-3 py-2">1000000082</td>
            <td className="px-3 py-2">GOSERELINA DEPOT 3.6 MG X 1JERINGA</td>
            <td className="px-3 py-2 text-left">SOLUCION INYECTABLE</td>
            <td className="px-3 py-2 text-left">20.00</td>
            <td className="px-3 py-2 text-right">$296,039.00</td>
            <td className="px-3 py-2 text-right">$5,920,780.00</td>
          </tr>
          <tr className="border-b border-[#eee]">
            <td className="px-3 py-2">1000000082</td>
            <td className="px-3 py-2">GOSERELINA DEPOT 3.6 MG X 1JERINGA</td>
            <td className="px-3 py-2 text-left">SOLUCION INYECTABLE</td>
            <td className="px-3 py-2 text-left">20.00</td>
            <td className="px-3 py-2 text-right">$296,039.00</td>
            <td className="px-3 py-2 text-right">$5,920,780.00</td>
          </tr>
          <tr className="border-b border-[#eee]">
            <td className="px-3 py-2">1000000082</td>
            <td className="px-3 py-2">GOSERELINA DEPOT 3.6 MG X 1JERINGA</td>
            <td className="px-3 py-2 text-left">SOLUCION INYECTABLE</td>
            <td className="px-3 py-2 text-left">20.00</td>
            <td className="px-3 py-2 text-right">$296,039.00</td>
            <td className="px-3 py-2 text-right">$5,920,780.00</td>
          </tr>
          <tr className="border-b border-[#eee]">
            <td className="px-3 py-2">1000000082</td>
            <td className="px-3 py-2">GOSERELINA DEPOT 3.6 MG X 1JERINGA</td>
            <td className="px-3 py-2 text-left">SOLUCION INYECTABLE</td>
            <td className="px-3 py-2 text-left">20.00</td>
            <td className="px-3 py-2 text-right">$296,039.00</td>
            <td className="px-3 py-2 text-right">$5,920,780.00</td>
          </tr>
          <tr className="border-b border-[#eee]">
            <td className="px-3 py-2">1000000082</td>
            <td className="px-3 py-2">GOSERELINA DEPOT 3.6 MG X 1JERINGA</td>
            <td className="px-3 py-2 text-left">SOLUCION INYECTABLE</td>
            <td className="px-3 py-2 text-left">20.00</td>
            <td className="px-3 py-2 text-right">$296,039.00</td>
            <td className="px-3 py-2 text-right">$5,920,780.00</td>
          </tr>
          <tr className="border-b border-[#eee]">
            <td className="px-3 py-2">1000000082</td>
            <td className="px-3 py-2">GOSERELINA DEPOT 3.6 MG X 1JERINGA</td>
            <td className="px-3 py-2 text-left">SOLUCION INYECTABLE</td>
            <td className="px-3 py-2 text-left">20.00</td>
            <td className="px-3 py-2 text-right">$296,039.00</td>
            <td className="px-3 py-2 text-right">$5,920,780.00</td>
          </tr>
          <tr className="border-b border-[#eee]">
            <td className="px-3 py-2">1000000082</td>
            <td className="px-3 py-2">GOSERELINA DEPOT 3.6 MG X 1JERINGA</td>
            <td className="px-3 py-2 text-left">SOLUCION INYECTABLE</td>
            <td className="px-3 py-2 text-left">20.00</td>
            <td className="px-3 py-2 text-right">$296,039.00</td>
            <td className="px-3 py-2 text-right">$5,920,780.00</td>
          </tr>
          <tr className="border-b border-[#eee]">
            <td className="px-3 py-2">1000000082</td>
            <td className="px-3 py-2">GOSERELINA DEPOT 3.6 MG X 1JERINGA</td>
            <td className="px-3 py-2 text-left">SOLUCION INYECTABLE</td>
            <td className="px-3 py-2 text-left">20.00</td>
            <td className="px-3 py-2 text-right">$296,039.00</td>
            <td className="px-3 py-2 text-right">$5,920,780.00</td>
          </tr>
          <tr className="border-b border-[#eee]">
            <td className="px-3 py-2">1000000082</td>
            <td className="px-3 py-2">GOSERELINA DEPOT 3.6 MG X 1JERINGA</td>
            <td className="px-3 py-2 text-left">SOLUCION INYECTABLE</td>
            <td className="px-3 py-2 text-left">20.00</td>
            <td className="px-3 py-2 text-right">$296,039.00</td>
            <td className="px-3 py-2 text-right">$5,920,780.00</td>
          </tr>
          <tr className="border-b border-[#eee]">
            <td className="px-3 py-2">1000000082</td>
            <td className="px-3 py-2">GOSERELINA DEPOT 3.6 MG X 1JERINGA</td>
            <td className="px-3 py-2 text-left">SOLUCION INYECTABLE</td>
            <td className="px-3 py-2 text-left">20.00</td>
            <td className="px-3 py-2 text-right">$296,039.00</td>
            <td className="px-3 py-2 text-right">$5,920,780.00</td>
          </tr>
          <tr className="border-b border-[#eee]">
            <td className="px-3 py-2">1000000082</td>
            <td className="px-3 py-2">GOSERELINA DEPOT 3.6 MG X 1JERINGA</td>
            <td className="px-3 py-2 text-left">SOLUCION INYECTABLE</td>
            <td className="px-3 py-2 text-left">20.00</td>
            <td className="px-3 py-2 text-right">$296,039.00</td>
            <td className="px-3 py-2 text-right">$5,920,780.00</td>
          </tr>
          <tr className="border-b border-[#eee]">
            <td className="px-3 py-2">1000000082</td>
            <td className="px-3 py-2">GOSERELINA DEPOT 3.6 MG X 1JERINGA</td>
            <td className="px-3 py-2 text-left">SOLUCION INYECTABLE</td>
            <td className="px-3 py-2 text-left">20.00</td>
            <td className="px-3 py-2 text-right">$296,039.00</td>
            <td className="px-3 py-2 text-right">$5,920,780.00</td>
          </tr>
          <tr className="border-b border-[#eee]">
            <td className="px-3 py-2">1000000082</td>
            <td className="px-3 py-2">GOSERELINA DEPOT 3.6 MG X 1JERINGA</td>
            <td className="px-3 py-2 text-left">SOLUCION INYECTABLE</td>
            <td className="px-3 py-2 text-left">20.00</td>
            <td className="px-3 py-2 text-right">$296,039.00</td>
            <td className="px-3 py-2 text-right">$5,920,780.00</td>
          </tr>
          <tr className="border-b border-[#eee]">
            <td className="px-3 py-2">1000000082</td>
            <td className="px-3 py-2">GOSERELINA DEPOT 3.6 MG X 1JERINGA</td>
            <td className="px-3 py-2 text-left">SOLUCION INYECTABLE</td>
            <td className="px-3 py-2 text-left">20.00</td>
            <td className="px-3 py-2 text-right">$296,039.00</td>
            <td className="px-3 py-2 text-right">$5,920,780.00</td>
          </tr>
          <tr className="border-b border-[#eee]">
            <td className="px-3 py-2">1000000082</td>
            <td className="px-3 py-2">GOSERELINA DEPOT 3.6 MG X 1JERINGA</td>
            <td className="px-3 py-2 text-left">SOLUCION INYECTABLE</td>
            <td className="px-3 py-2 text-left">20.00</td>
            <td className="px-3 py-2 text-right">$296,039.00</td>
            <td className="px-3 py-2 text-right">$5,920,780.00</td>
          </tr>
          <tr className="border-b border-[#eee]">
            <td className="px-3 py-2">1000000082</td>
            <td className="px-3 py-2">GOSERELINA DEPOT 3.6 MG X 1JERINGA</td>
            <td className="px-3 py-2 text-left">SOLUCION INYECTABLE</td>
            <td className="px-3 py-2 text-left">20.00</td>
            <td className="px-3 py-2 text-right">$296,039.00</td>
            <td className="px-3 py-2 text-right">$5,920,780.00</td>
          </tr>
          <tr className="border-b border-[#eee]">
            <td className="px-3 py-2">1000000082</td>
            <td className="px-3 py-2">GOSERELINA DEPOT 3.6 MG X 1JERINGA</td>
            <td className="px-3 py-2 text-left">SOLUCION INYECTABLE</td>
            <td className="px-3 py-2 text-left">20.00</td>
            <td className="px-3 py-2 text-right">$296,039.00</td>
            <td className="px-3 py-2 text-right">$5,920,780.00</td>
          </tr>
        </tbody>
      </table>

      <div className="grid grid-cols-2 gap-6">
        <div className="text-xs">
          <h3 className="mb-4 text-sm font-bold">COMENTARIOS:</h3>
          <p>PEDIDO 2 CORTE DE OCTUBRE -FARMACIA BOGOTA</p>
          <h3 className="mt-5 mb-4 text-sm font-bold">CONDICIONES:</h3>
          <ol className="pl-5 m-0 list-decimal">
            <li>Precios Fijos en Pesos</li>
            <li>Registro Sanitario vigente de productos con INVIMA</li>
            <li>Certificado de buenas Prácticas de manufactura aprob. INVIMA</li>
            <li>Ficha técnica de los productos</li>
            <li>Acta de inspección de vigilancia y control expedida por el ente de control con concepto favorable, para fabricantes, importadores y distribuidores</li>
          </ol>
        </div>

        <div className="bg-[#f8f9fa] p-3 rounded-lg">
          <div className="grid grid-cols-[1fr_auto] gap-2 text-right text-xs">
            <span>SUBTOTAL:</span>
            <span><strong>$18,370,750.00</strong></span>
            <span>DESCUENTO:</span>
            <span><strong>$0.00</strong></span>
            <span>IMPUESTO:</span>
            <span><strong>$0.00</strong></span>
            <div className="col-span-2 h-px bg-[#eee] my-2"></div>
            <span className="font-bold text-sm">TOTAL:</span>
            <span className="font-bold text-sm">$18,370,750.00</span>
          </div>
          <p className="mt-2 italic text-right text-xs">
            SON: DIECIOCHO MILLONES TRESCIENTOS SETENTA MIL SETECIENTOS CINCUENTA PESOS M.CTE.
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-between gap-6">
        <div className="bg-[#f8f9fa] p-3 rounded-lg flex flex-col w-full justify-between">
          <p className="mb-3 font-bold text-left text-xs">AUTORIZADOR</p>
          <p className="text-xs py-3">JUAN JOSE MARTINEZ</p>
          <hr className="w-full border-t border-black m-0" />
        </div>
        <div className="bg-[#f8f9fa] p-3 rounded-lg flex flex-col w-full justify-between">
          <p className="mb-3 font-bold text-left text-xs">FIRMA Y SELLO DE ACEPTACIÓN</p>
          <p className="text-xs py-3"></p>
          <hr className="w-full border-t border-black m-0" />
        </div>
      </div>
    </PDF>
  );
};

export default PurchaseOrderPDF;

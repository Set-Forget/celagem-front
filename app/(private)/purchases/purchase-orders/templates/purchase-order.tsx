'use client'

// @ts-expect-error: Workaround temporal mientras se corrige el tipado en Y.
import html2pdf from "html2pdf.js";

export const generatePurchaseOrderPDF = () => {
    const element = document.createElement("div");
    element.innerHTML = `
<div style="padding: 24px; font-family: Arial, sans-serif; max-width: 1000px; margin: 0 auto;">
    <!-- Header Section -->
    <div style="display: flex; justify-content: space-between; margin-bottom: 24px; font-size:12px; gap:20px">
        <div style="width:100%; padding-left:12px; padding-right: 12px">
            <h1 style="margin: 0 0 20px 0; font-size:24px; font-weight:bold">ORDEN DE COMPRA</h1>
            <div style="display:flex; justify-content: space-between;">
                <span style="display: inline-block;">Orden No:</span>
                <span style="font-weight: 500;"><strong>1437</strong></span>
            </div>
            <div style="display:flex; justify-content: space-between;">
                <span style="display: inline-block;">Fecha de orden:</span>
                <span style="font-weight: 500;"><strong>15/10/2024</strong></span>
            </div>
            <div style="display:flex; justify-content: space-between;">
                <span style="display: inline-block;">Fecha de entrega:</span>
                <span style="font-weight: 500;"><strong>17/10/2024</strong></span>
            </div>
            <div style="display:flex; justify-content: space-between;">
                <span style="display: inline-block;">Forma de pago:</span>
                <span style="font-weight: 500;"><strong>30 Días</strong></span>
            </div>
        </div>
        <div style="width:100%; padding-left:12px; padding-right: 12px; margin-top: 48px">
            <img src="/celagem-logo.svg" alt="CENTRO DE FERTILIDAD REPRONAT S.A.S." style="width:362px; height: 77px; display: block;" />
        </div>
    </div>

    <!-- DATOS DEL PROVEEDOR Y DATOS DE LA EMPRESA -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; font-size:12px;">
        <!-- PROVEEDOR -->
        <div style="background-color: #f8f9fa; padding: 12px; border-radius: 8px;">
            <h3 style="margin: 0 0 16px 0; font-size: 14px; font-weight: bold;">
                DATOS DEL PROVEEDOR
            </h3>
            <div style="display: flex; justify-content: space-between;">
                <span>NIT/CUIT:</span>
                <span style="font-weight: 500;"><strong>901029126-4</strong></span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Razón Social:</span>
                <span style="font-weight: 500;"><strong>PHARMAXIS COLOMBIA SAS</strong></span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Dirección:</span>
                <span style="font-weight: 500;"><strong>CR 49 94 67</strong></span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Ciudad:</span>
                <span style="font-weight: 500;"><strong>Bogotá</strong></span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Teléfono:</span>
                <span style="font-weight: 500;"><strong>6412514</strong></span>
            </div>
        </div>

        <!-- EMPRESA -->
        <div style="background-color: #f8f9fa; padding: 12px; border-radius: 8px;">
            <h3 style="margin: 0 0 16px 0; font-size: 14px; font-weight: bold;">
                DATOS DE LA EMPRESA
            </h3>
            <div style="display: flex; justify-content: space-between;">
                <span>CUIT/NIT:</span>
                <span style="font-weight: 500;"><strong>30-12345678-9</strong></span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Razón Social:</span>
                <span style="font-weight: 500;">
                    <strong>CENTRO DE FERTILIDAD REPRONAT S.A.S.</strong>
                </span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Dirección:</span>
                <span style="font-weight: 500;">
                    <strong>Av. Siempre Viva 123</strong>
                </span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>PBX:</span>
                <span style="font-weight: 500;"><strong>7456614</strong></span>
            </div>
        </div>
    </div>

    <!-- Order Table -->
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size:10px">
        <thead>
            <tr style="background-color: #f8f9fa; font-size:12px">
                <th style="padding-left: 12px; padding-right: 12px; padding-top: 8px; padding-bottom: 8px; text-align: left;">CÓDIGO</th>
                <th style="padding-left: 12px; padding-right: 12px; text-align: left; padding-top: 8px; padding-bottom: 8px;">DESCRIPCIÓN</th>
                <th style="padding-left: 12px; padding-right: 12px; text-align: left; padding-top: 8px; padding-bottom: 8px;">NOMBRE</th>
                <th style="padding-left: 12px; padding-right: 12px; text-align: left; padding-top: 8px; padding-bottom: 8px;">CANTIDAD</th>
                <th style="padding-left: 12px; padding-right: 12px; text-align: right; padding-top: 8px; padding-bottom: 8px;">VALOR UNITARIO</th>
                <th style="padding-left: 12px; padding-right: 12px; text-align: right; padding-top: 8px; padding-bottom: 8px;">TOTAL</th>
            </tr>
        </thead>
        <tbody>
            <tr style="border-bottom: 1px solid #eee;" >
                <td style="padding: 8px 12px;">1000000092</td>
                <td style="padding: 8px 12px;">PROGESTERONA 200 mg - CÁPSULA ORAL/VAGINAL (CX30)</td>
                <td style="padding: 8px 12px; text-align: left;">CAPSULA</td>
                <td style="padding: 8px 12px; text-align: leftr;">9,000.00</td>
                <td style="padding: 8px 12px; text-align: right;">$1,383.33</td>
                <td style="padding: 8px 12px; text-align: right;">$12,449,970.00</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px 12px;">1000000082</td>
                <td style="padding: 8px 12px;">GOSERELINA DEPOT 3.6 MG X 1JERINGA</td>
                <td style="padding: 8px 12px; text-align: left;">SOLUCION INYECTABLE</td>
                <td style="padding: 8px 12px; text-align: left;">20.00</td>
                <td style="padding: 8px 12px; text-align: right;">$296,039.00</td>
                <td style="padding: 8px 12px; text-align: right;">$5,920,780.00</td>
            </tr>
        </tbody>
    </table>

    <!-- Footer Section -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
        <!-- Comments and Conditions -->
        <div style="font-size: 10px;">
            <h3 style="margin: 0 0 16px 0; font-size: 14px; font-weight:bold">COMENTARIOS:</h3>
            <p>PEDIDO 2 CORTE DE OCTUBRE -FARMACIA BOGOTA</p>
            <h3 style="margin: 20px 0 16px 0; font-size: 14px; font-weight:bold">CONDICIONES:</h3>
            <ol style="padding-left: 20px; margin: 0; list-style: decimal;">
                <li>Precios Fijos en Pesos</li>
                <li>Registro Sanitario vigente de productos con INVIMA</li>
                <li>Certificado de buenas Prácticas de manufactura aprob. INVIMA</li>
                <li>Ficha técnica de los productos</li>
                <li>Acta de inspección de vigilancia y control expedida por el ente de control con concepto favorable, para fabricantes, importadores y distribuidores</li>
            </ol>
        </div>

        <!-- Totals -->
        <div style="background-color: #f8f9fa; padding: 12px; border-radius: 8px;">
            <div style="display: grid; grid-template-columns: 1fr auto; gap: 8px; text-align: right; font-size:10px">
                <span>SUBTOTAL:</span>
                <span><strong>$18,370,750.00</strong></span>
                <span>DESCUENTO:</span>
                <span><strong>$0.00</strong></span>
                <span>IMPUESTO:</span>
                <span><strong>$0.00</strong></span>
                <div style="grid-column: 1 / -1; height: 1px; background-color: #eee; margin: 8px 0;"></div>
                <span style="font-weight: bold; font-size: 14px; margin:0px">TOTAL:</span>
                <span style="font-weight: bold; font-size: 14px; margin:0px">$18,370,750.00</span>
            </div>
            <p style="margin-top: 8px; font-style: italic; text-align:right; font-size:10px">SON: DIECIOCHO MILLONES TRESCIENTOS SETENTA MIL SETECIENTOS CINCUENTA PESOS M.CTE.</p>
        </div>
    </div>

    <!-- Signature Section -->
    <div style="margin-top: 24px; display: flex; justify-content: space-between; gap:24px">
        <div style="background-color: #f8f9fa; padding: 12px; border-radius: 8px;display:flex; flex-direction:column;width:100%;justify-content: space-between">
             <p style="margin-bottom: 12px; font-weight:bold; text-align:left; margin-top:0;font-size:12px">AUTORIZADOR</p>
            <p style="font-size:12px; margin:12px 0">JUAN JOSE MARTINEZ</p>
            <hr style="width: 100%; border-top: 1px solid #000; margin:0px">
        </div>
        <div style="background-color: #f8f9fa; padding: 12px; border-radius: 8px; display:flex; flex-direction:column;width:100%;justify-content: space-between">
            <p style="margin-bottom: 12px; font-weight:bold; text-align:left; margin-top:0;font-size:12px">FIRMA Y SELLO DE ACEPTACIÓN</p>
            <p style="font-size:12px; margin:12px 0"></p>
            <hr style="width: 100%; border-top: 1px solid #000; margin:0px">
        </div>
    </div>
</div>
  `;

    const options = {
        margin: 0,
        filename: `orden_de_compra.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(options).from(element).save();
};
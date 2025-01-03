'use client'

// @ts-ignore
import html2pdf from "html2pdf.js";

export const generateDebitNotePDF = () => {
    const element = document.createElement("div");
    element.innerHTML = `
<div style="padding: 24px; font-family: Arial, sans-serif; max-width: 1000px; margin: 0 auto;">
    <!-- ENCABEZADO -->
    <div style="display: flex; justify-content: space-between; margin-bottom: 24px; font-size: 12px; gap: 20px;">
        <div style="width:100%; padding-left:12px; padding-right:12px;">
            <!-- TIPO DE NOTA Y NÚMERO -->
            <h1 style="margin: 0 0 20px 0; font-size: 24px; font-weight: bold;">
                NOTA DE DÉBITO TIPO A
            </h1>
            <!-- Número de Nota de Crédito -->
            <div style="display: flex; justify-content: space-between;">
                <span style="display: inline-block;">N° de Nota de Crédito:</span>
                <span style="font-weight: 500;"><strong>0001-00005678</strong></span>
            </div>
            <!-- Fecha de vencimiento (opcional para NC) -->
            <div style="display: flex; justify-content: space-between;">
                <span>Fecha de Vencimiento:</span>
                <span style="font-weight: 500;"><strong>15/12/2024</strong></span>
            </div>

            <div style="display: flex; justify-content: space-between;">
                <span>Orden de compra:</span>
                <span style="font-weight: 500;"><strong>2224</strong></span>
            </div>
        </div>

        <!-- LOGO (OPCIONAL) -->
        <div style="width:100%; padding-left:12px; padding-right: 12px; margin-top: 48px">
            <img src="/celagem-logo.svg" alt="CENTRO DE FERTILIDAD REPRONAT S.A.S." style="width:362px; height: 77px; display: block;" />
        </div>
    </div>

    <!-- DATOS DEL PROVEEDOR Y DE LA EMPRESA -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; font-size:12px;">
        <!-- PROVEEDOR -->
        <div style="background-color: #f8f9fa; padding: 12px; border-radius: 8px;">
            <h3 style="margin: 0 0 16px 0; font-size: 14px; font-weight: bold;">DATOS DEL PROVEEDOR</h3>
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
            <h3 style="margin: 0 0 16px 0; font-size: 14px; font-weight: bold;">DATOS DE LA EMPRESA</h3>
            <div style="display: flex; justify-content: space-between;">
                <span>CUIT/NIT:</span>
                <span style="font-weight: 500;"><strong>30-12345678-9</strong></span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Ing. Brutos:</span>
                <span style="font-weight: 500;"><strong>902-123456-9</strong></span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Inicio de Actividades:</span>
                <span style="font-weight: 500;"><strong>01/01/2023</strong></span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Razón Social:</span>
                <span style="font-weight: 500;"><strong>CENTRO DE FERTILIDAD REPRONAT S.A.S.</strong></span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Dirección:</span>
                <span style="font-weight: 500;"><strong>Av. Siempre Viva 123</strong></span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>PBX:</span>
                <span style="font-weight: 500;"><strong>7456614</strong></span>
            </div>
        </div>
    </div>

    <!-- ITEMS DE LA NOTA DE CRÉDITO -->
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 10px;">
        <thead>
            <tr style="background-color: #f8f9fa; font-size:12px;">
                <th style="padding: 8px 12px; text-align: left;">CÓDIGO</th>
                <th style="padding: 8px 12px; text-align: left;">DESCRIPCIÓN</th>
                <th style="padding: 8px 12px; text-align: right;">CANTIDAD</th>
                <th style="padding: 8px 12px; text-align: right;">VALOR UNITARIO</th>
                <th style="padding: 8px 12px; text-align: right;">TOTAL</th>
            </tr>
        </thead>
        <tbody>
            <!-- EJEMPLO DE FILAS -->
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px 12px;">1000000092</td>
                <td style="padding: 8px 12px;">
                    Devolución PROGESTERONA 200 mg (CX30)
                </td>
                <td style="padding: 8px 12px; text-align: right;">2,000.00</td>
                <td style="padding: 8px 12px; text-align: right;">$1,383.33</td>
                <td style="padding: 8px 12px; text-align: right;">$2,766,660.00</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px 12px;">1000000082</td>
                <td style="padding: 8px 12px;">
                    Ajuste GOSERELINA DEPOT 3.6 MG
                </td>
                <td style="padding: 8px 12px; text-align: right;">5.00</td>
                <td style="padding: 8px 12px; text-align: right;">$296,039.00</td>
                <td style="padding: 8px 12px; text-align: right;">$1,480,195.00</td>
            </tr>
        </tbody>
    </table>

    <!-- TOTALES -->
    <div style="display: flex; justify-content: flex-end; margin-bottom: 24px;">
        <div style="background-color: #f8f9fa; padding: 12px; border-radius: 8px; width: 300px; font-size: 10px;">
            <div style="display: grid; grid-template-columns: 1fr auto; gap: 8px; text-align: right;">
                <span>SUBTOTAL:</span>
                <span><strong>$4,246,855.00</strong></span>
                <span>DESCUENTO:</span>
                <span><strong>$0.00</strong></span>
                <span>IMPUESTO:</span>
                <span><strong>$0.00</strong></span>
                <div style="grid-column: 1 / -1; height: 1px; background-color: #eee; margin: 8px 0;"></div>
                <span style="font-weight: bold; font-size: 14px;">TOTAL:</span>
                <span style="font-weight: bold; font-size: 14px;">$4,246,855.00</span>
            </div>
        </div>
    </div>

    <!-- FOOTER: NOTAS, N° OC, QR, CAE, VENCIMIENTO CAE -->
    <div style="display: flex; justify-content: flex-start; gap: 24px;">
        <div style="flex: 1; background-color: #f8f9fa; padding: 12px; border-radius: 8px; display: flex; flex-direction: column;">
            <!-- Notas -->
            <p style="margin-bottom: 8px; font-weight: bold; font-size: 12px; margin-top: 0;">
                Notas
            </p>
            <p style="font-size: 10px; margin-bottom: 16px;">
                Se genera esta Nota de Débito para adicionar o modificar el importe original.
            </p>

            <!-- Contenedor conjunto (QR, CAE, Vencimiento) -->
            <div style="display: flex; align-items: center; gap: 12px;">
                <!-- QR -->
                <img src="https://via.placeholder.com/100x100?text=QR" alt="QR Nota de Crédito" style="width: 100px; height: 100px; object-fit: contain;" />

                <!-- CAE y Vto. CAE -->
                <div>
                    <p style="margin: 0; font-weight: bold; font-size: 10px;">
                        CAE N°: 61234567890123
                    </p>
                    <p style="margin: 0; font-size: 10px;">
                        Vto. CAE: 20/12/2024
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>
  `;

    const options = {
        margin: 0,
        filename: `nota_de_debito.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(options).from(element).save();
};
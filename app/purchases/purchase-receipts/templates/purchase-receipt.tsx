// @ts-expect-error ts-migrate(7006) FIXME: Parameter 'props' implicitly has an 'any' type.
import html2pdf from "html2pdf.js";

export const generatePurchaseReceiptPDF = () => {
  const element = document.createElement("div");
  element.innerHTML = `
<div style="padding: 24px; font-family: Arial, sans-serif; max-width: 1000px; margin: 0 auto;">
    <!-- Header Section -->
    <div style="display: flex; justify-content: space-between; margin-bottom: 24px; font-size:12px; gap:20px;">
        <div style="width:100%; padding-left:12px; padding-right: 12px;">
            <h1 style="margin: 0 0 20px 0; font-size:24px; font-weight:bold">RECEPCIÓN DE MERCANCÍA</h1>
            <div style="display:flex; justify-content: space-between;">
                <span style="display: inline-block;">Recepción No:</span>
                <span style="font-weight: 500;"><strong>1297</strong></span>
            </div>
            <div style="display:flex; justify-content: space-between;">
                <span style="display: inline-block;">NIT/CUIT:</span>
                <span style="font-weight: 500;"><strong>901068002</strong></span>
            </div>
            <div style="display:flex; justify-content: space-between;">
                <span style="display: inline-block;">Sede:</span>
                <span style="font-weight: 500;"><strong>Sede Asistencial Bogotá</strong></span>
            </div>
            <div style="display:flex; justify-content: space-between;">
                <span style="display: inline-block;">Dirección:</span>
                <span style="font-weight: 500;"><strong>CARRERA 7B BIS 132-38 - Piso 8</strong></span>
            </div>
            <div style="display:flex; justify-content: space-between;">
                <span style="display: inline-block;">Ciudad:</span>
                <span style="font-weight: 500;"><strong>BOGOTA, D.C.</strong></span>
            </div>
        </div>
        <div style="width:100%; padding-left:12px; padding-right: 12px; margin-top: 48px">
            <img src="/celagem-logo.svg" alt="CENTRO DE FERTILIDAD REPRONAT S.A.S." style="width:362px; height: 77px; display: block;" />
        </div>
    </div>

    <!-- Movement Information -->
    <div style="margin-bottom: 24px; font-size:12px;">
        <div style="background-color: #f8f9fa; padding: 12px; border-radius: 8px;">
            <h3 style="margin: 0 0 16px 0; font-size: 14px; font-weight:bold">DATOS DEL MOVIMIENTO</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; column-gap: 16px;">
                <div style="margin-bottom: 8px; display:flex; justify-content: space-between;">
                    <span>Fecha:</span>
                    <span><strong>10/17/2024 8:35 AM</strong></span>
                </div>
                <div style="margin-bottom: 8px; display:flex; justify-content: space-between;">
                    <span>Centro de costos:</span>
                    <span><strong>Unidad de Servicios Farmaceuticos</strong></span>
                </div>
                <div style="margin-bottom: 8px; display:flex; justify-content: space-between;">
                    <span>Tercero:</span>
                    <span><strong>PHARMAXIS COLOMBIA SAS</strong></span>
                </div>
                <div style="margin-bottom: 8px; display:flex; justify-content: space-between;">
                    <span>Médico:</span>
                    <span><strong>N/A</strong></span>
                </div>
                <div style="margin-bottom: 8px; display:flex; justify-content: space-between;">
                    <span>Fórmula control:</span>
                    <span><strong>NO</strong></span>
                </div>
                <div style="margin-bottom: 8px; display:flex; justify-content: space-between;">
                    <span>Tarea:</span>
                    <span><strong>N/A</strong></span>
                </div>
 
                <div style="margin-bottom: 8px; display:flex; justify-content: space-between;">
                    <span>Número anexo:</span>
                    <span><strong>2911</strong></span>
                </div>
                <div style="margin-bottom: 8px; display:flex; justify-content: space-between;">
                    <span>Bodega destino:</span>
                    <span><strong>N/A</strong></span>
                </div>
                <div style="margin-bottom: 8px; display:flex; justify-content: space-between;">
                    <span>Documento tercero:</span>
                    <span><strong>FE430</strong></span>
                </div>
                <div style="margin-bottom: 8px; display:flex; justify-content: space-between;">
                    <span>Ctro ctos contable:</span>
                    <span><strong>Unidad de Servicios Farmaceuticos </strong></span>
                </div>
                <div style="margin-bottom: 8px; display:flex; justify-content: space-between;">
                    <span>Proyecto:</span>
                    <span><strong>Inventarios</strong></span>
                </div>
                <div style="margin-bottom: 8px; display:flex; justify-content: space-between;">
                    <span>Rubro:</span>
                    <span><strong>N/A</strong></span>
                </div>
                <div style="margin-bottom: 8px; display:flex; justify-content: space-between;">
                    <span>Bodega origen:</span>
                    <span><strong>BOGOTA CENTRO LOGISTICO</strong></span>
                </div>
                <div style="margin-bottom: 8px; display:flex; justify-content: space-between;">
                    <span>Proveedor:</span>
                    <span><strong>PHARMAXIS COLOMBIA SAS</strong></span>
                </div>
                <div style="margin-bottom: 8px; display:flex; justify-content: space-between;">
                    <span>Estado:</span>
                    <span><strong>REVISADO</strong></span>
                </div>
                <div style="margin-bottom: 8px; display:flex; justify-content: space-between;">
                    <span>¿Incluye implantes?:</span>
                    <span><strong>No</strong></span>
                </div>
                <div style="margin-bottom: 8px; display:flex; justify-content: space-between;">
                    <span>Código rubro:</span>
                    <span><strong>N/A</strong></span>
                </div>
            </div>
        </div>
    </div>

    <!-- Observation Section -->
    <div style="margin-bottom: 24px; font-size:12px;">
        <h3 style="margin: 0 0 16px 0; font-size: 14px; font-weight:bold">OBSERVACIONES:</h3>
        <p>Todos los artículos han sido revisados y se encuentran en perfecto estado.</p>
    </div>

    <!-- Table Section -->
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size:10px;">
        <thead>
            <tr style="background-color: #f8f9fa; font-size:12px;">
                <th style="padding: 8px; text-align: left;">Artículo</th>
                <th style="padding: 8px; text-align: left;">Lote</th>
                <th style="padding: 8px; text-align: left;">Fecha de vencimiento</th>
                <th style="padding: 8px; text-align: right;">Cantidad</th>
                <th style="padding: 8px; text-align: right;">Precio Unitario</th>
                <th style="padding: 8px; text-align: right;">Total</th>
                <th style="padding: 8px; text-align: left;">Estado</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="padding: 8px;">PROGESTERONA 200 mg - CÁPSULA ORAL/VAGINAL (CX30)</td>
                <td style="padding: 8px;">LF327937</td>
                <td style="padding: 8px;">30/10/2025</td>
                <td style="padding: 8px; text-align: right;">9,000.00</td>
                <td style="padding: 8px; text-align: right;">1,383.33</td>
                <td style="padding: 8px; text-align: right;">12,449,970.00</td>
                <td style="padding: 8px;">Revisado</td>
            </tr>
            <tr>
                <td style="padding: 8px;">GOSERELINA DEPOT 3.6 MG X 1JERINGA</td>
                <td style="padding: 8px;">SN170</td>
                <td style="padding: 8px;">30/09/2026</td>
                <td style="padding: 8px; text-align: right;">20.00</td>
                <td style="padding: 8px; text-align: right;">296,039.00</td>
                <td style="padding: 8px; text-align: right;">5,920,780.00</td>
                <td style="padding: 8px;">Revisado</td>
            </tr>
        </tbody>
    </table>

    <!-- Totals Section -->
    <div style="background-color: #f8f9fa; padding: 12px; border-radius: 8px; font-size:12px; text-align: right;font-weight:bold;font-size:14">
        <p style="margin:0">Total: $18,370,750.00</p>
    </div>
</div>
  `;

  const options = {
    margin: 0,
    filename: `recepcion_de_compra.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  };

  html2pdf().set(options).from(element).save();
};

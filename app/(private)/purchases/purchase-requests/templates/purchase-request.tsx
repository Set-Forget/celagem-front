'use client'

// @ts-expect-error: Workaround temporal mientras se corrige el tipado en Y.
import html2pdf from "html2pdf.js";

export const generatePurchaseRequestPDF = () => {
    const element = document.createElement("div");
    element.innerHTML = `
<div style="padding: 24px; font-family: Arial, sans-serif; max-width: 1000px; margin: 0 auto;">
    <!-- Encabezado / Header -->
    <div style="display: flex; justify-content: space-between; margin-bottom: 24px; font-size:12px; gap:20px;">
        <div style="width:100%; padding-left:12px; padding-right: 12px;">
            <!-- Título principal -->
            <h1 style="margin: 0 0 20px 0; font-size:24px; font-weight:bold;">
                SOLICITUD DE PEDIDO
            </h1>

            <!-- Fecha de requerimiento -->
            <div style="display:flex; justify-content: space-between;">
                <span style="display: inline-block;">Fecha de requerimiento:</span>
                <span style="font-weight: 500;"><strong>15/10/2024</strong></span>
            </div>

        </div>

        <!-- Logo (Opcional) -->
        <div style="width:100%; padding-left:12px; padding-right: 12px; margin-top: 48px">
            <img src="/celagem-logo.svg" alt="CENTRO DE FERTILIDAD REPRONAT S.A.S." style="width:362px; height: 77px; display: block;" />
        </div>
    </div>

    <!-- Sede y proveedor -->
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

    <!-- Items solicitados -->
    <div style="margin-bottom: 24px; font-size:12px;">
        <h3 style="margin: 0 0 16px 0; font-size: 14px; font-weight:bold;">
            Items requeridos
        </h3>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size:10px;">
            <thead>
                <tr style="background-color: #f8f9fa; font-size:12px;">
                    <th style="padding: 8px 12px; text-align: left;">CÓDIGO</th>
                    <th style="padding: 8px 12px; text-align: left;">NOMBRE</th>
                    <th style="padding: 8px 12px; text-align: left;">DESCRIPCIÓN</th>
                    <th style="padding: 8px 12px; text-align: left;">CANTIDAD</th>
                </tr>
            </thead>
            <tbody>
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 8px 12px;">GIF-H180J</td>
                    <td style="padding: 8px 12px;">Guante de nitrilo</td>
                    <td style="padding: 8px 12px;">Guantes talla M libres de látex</td>
                    <td style="padding: 8px 12px;">100</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 8px 12px;">MASC-N95</td>
                    <td style="padding: 8px 12px;">Mascarilla N95</td>
                    <td style="padding: 8px 12px;">Protección respiratoria KN95</td>
                    <td style="padding: 8px 12px;">50</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Observaciones (Opcional) -->
    <div style="font-size: 10px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 16px 0; font-size: 14px; font-weight:bold;">
            Observaciones
        </h3>
        <p style="margin: 0;">
            - Por favor, enviar cotizaciones y plazos de entrega a la mayor brevedad.
        </p>
    </div>

    <!-- Firma / Aprobación -->
    <div style="margin-top: 24px; display: flex; justify-content: space-between; gap:24px;">
        <div style="background-color: #f8f9fa; padding: 12px; border-radius: 8px; display:flex; flex-direction:column; width:100%; justify-content: space-between;">
             <p style="margin-bottom: 12px; font-weight:bold; text-align:left; margin-top:0;font-size:12px">
                SOLICITANTE
            </p>
            <p style="font-size:12px; margin:12px 0;">
                Nombre del solicitante
            </p>
            <hr style="width: 100%; border-top: 1px solid #000; margin:0;">
        </div>
        <div style="background-color: #f8f9fa; padding: 12px; border-radius: 8px; display:flex; flex-direction:column; width:100%; justify-content: space-between;">
             <p style="margin-bottom: 12px; font-weight:bold; text-align:left; margin-top:0;font-size:12px">
                FIRMA Y SELLO DE ACEPTACIÓN
            </p>
            <p style="font-size:12px; margin:12px 0;"></p>
            <hr style="width: 100%; border-top: 1px solid #000; margin:0;">
        </div>
    </div>
</div>
  `;

    const options = {
        margin: 0,
        filename: `solicitud_de_pedido.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(options).from(element).save();
};
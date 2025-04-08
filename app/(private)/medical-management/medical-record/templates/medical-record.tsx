"use client"

// @ts-expect-error: Workaround temporal mientras se corrige el tipado en Y.
import html2pdf from "html2pdf.js"

export const generateMedicalRecordPDF = () => {
    const element = document.createElement("div")
    element.innerHTML = `
<div style="padding: 15px; font-family: Arial, sans-serif; max-width: 1000px; margin: 0 auto; font-size: 10px;">
    <!-- Header Section -->
    <div style="display: flex; justify-content: space-between; margin-bottom: 15px; gap: 15px">
        <div style="width: 100%;">
            <h1 style="margin: 0 0 10px 0; font-size: 18px; font-weight: bold">INFORME DE VISITA</h1>
            <div style="display: flex; justify-content: space-between;">
                <span style="display: inline-block;">Visita No:</span>
                <span style="font-weight: 500;"><strong>36640</strong></span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span style="display: inline-block;">Fecha y hora:</span>
                <span style="font-weight: 500;"><strong>25 Mar 2024 02:15 PM</strong></span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span style="display: inline-block;">Tipo de atención:</span>
                <span style="font-weight: 500;"><strong>Donante de semen</strong></span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span style="display: inline-block;">Modalidad:</span>
                <span style="font-weight: 500;"><strong>Virtual</strong></span>
            </div>
        </div>
        <div style="width: 100%; text-align: right;">
            <img src="/celagem-logo.svg" alt="CENTRO DE FERTILIDAD REPRONAT S.A.S." style="width: 250px; height: auto; display: inline-block;" />
        </div>
    </div>

    <!-- DATOS DEL PACIENTE -->
    <div style="margin-bottom: 15px;">
        <h3 style="margin: 0 0 8px 0; font-size: 12px; font-weight: bold; page-break-after: avoid;">
            DATOS DEL PACIENTE
        </h3>
        <div style="background-color: #f8f9fa; padding: 8px; border-radius: 6px; page-break-inside: avoid;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div>
                    <div style="margin-bottom: 4px;"><strong>Nombre:</strong> Juan Fabricio</div>
                    <div style="margin-bottom: 4px;"><strong>Clase:</strong> Donante de semen</div>
                    <div style="margin-bottom: 4px;"><strong>Sexo biológico:</strong> Masculino</div>
                    <div style="margin-bottom: 4px;"><strong>Fecha de nacimiento:</strong> 14/05/1990</div>
                    <div style="margin-bottom: 4px;"><strong>Edad:</strong> 27 años</div>
                    <div style="margin-bottom: 4px;"><strong>Tipo de documento:</strong> DNI</div>
                    <div style="margin-bottom: 4px;"><strong>Número:</strong> 24324234</div>
                    <div><strong>Discapacidad:</strong> No aplica</div>
                </div>
                <div>
                    <div style="margin-bottom: 4px;"><strong>Teléfono:</strong> 5555123456</div>
                    <div style="margin-bottom: 4px;"><strong>Email:</strong> juan.gonzalez@email.com</div>
                    <div style="margin-bottom: 4px;"><strong>Lugar de nacimiento:</strong></div>
                    <div style="margin-bottom: 8px;">Calle Principal 123, Colonia Centro, Ciudad de México</div>
                    <div style="margin-bottom: 4px;"><strong>Dirección de residencia:</strong></div>
                    <div>Calle Principal 123, Colonia Centro, Ciudad de México</div>
                </div>
            </div>
        </div>
    </div>

    <!-- Consulta de primera vez ip -->
    <div style="margin-bottom: 15px; page-break-inside: avoid;">
        <h3 style="margin: 0 0 8px 0; font-size: 12px; font-weight: bold; page-break-after: avoid;">CONSULTA DE PRIMERA VEZ IP</h3>
        
        <!-- Signos Vitales -->
        <div style="margin-bottom: 10px; page-break-inside: avoid;">
            <h4 style="margin: 0 0 6px 0; font-size: 11px; font-weight: bold;">SIGNOS VITALES</h4>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: #f8f9fa;">
                        <th style="padding: 4px 6px; text-align: left; border: 1px solid #eee;">T.A.S.</th>
                        <th style="padding: 4px 6px; text-align: left; border: 1px solid #eee;">T.A.D.</th>
                        <th style="padding: 4px 6px; text-align: left; border: 1px solid #eee;">F.C.</th>
                        <th style="padding: 4px 6px; text-align: left; border: 1px solid #eee;">F.R.</th>
                        <th style="padding: 4px 6px; text-align: left; border: 1px solid #eee;">IMC</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 4px 6px; border: 1px solid #eee;">120 mmHg</td>
                        <td style="padding: 4px 6px; border: 1px solid #eee;">80 mmHg</td>
                        <td style="padding: 4px 6px; border: 1px solid #eee;">80 lpm</td>
                        <td style="padding: 4px 6px; border: 1px solid #eee;">20 rpm</td>
                        <td style="padding: 4px 6px; border: 1px solid #eee;">23.5 kg/m2</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <!-- Examen Físico -->
        <div style="margin-bottom: 10px; page-break-inside: avoid;">
            <h4 style="margin: 0 0 6px 0; font-size: 11px; font-weight: bold;">EXAMEN FÍSICO</h4>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: #f8f9fa;">
                        <th style="padding: 4px 6px; text-align: left; border: 1px solid #eee;">Cabeza</th>
                        <th style="padding: 4px 6px; text-align: left; border: 1px solid #eee;">Abdomen</th>
                        <th style="padding: 4px 6px; text-align: left; border: 1px solid #eee;">Extremidades</th>
                        <th style="padding: 4px 6px; text-align: left; border: 1px solid #eee;">Neurológico</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 4px 6px; border: 1px solid #eee;">Normal</td>
                        <td style="padding: 4px 6px; border: 1px solid #eee;">Normal</td>
                        <td style="padding: 4px 6px; border: 1px solid #eee;">Normal</td>
                        <td style="padding: 4px 6px; border: 1px solid #eee;">Normal</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Información Clínica -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; page-break-inside: avoid;">
            <div style="background-color: #f8f9fa; padding: 8px; border-radius: 6px;">
                <h4 style="margin: 0 0 4px 0; font-size: 11px; font-weight: bold;">Motivo de la consulta</h4>
                <p style="margin: 0;">Donante de semen</p>
            </div>
            <div style="background-color: #f8f9fa; padding: 8px; border-radius: 6px;">
                <h4 style="margin: 0 0 4px 0; font-size: 11px; font-weight: bold;">Enfermedad Actual</h4>
                <p style="margin: 0;">No presenta enfermedad actual</p>
            </div>
            <div style="background-color: #f8f9fa; padding: 8px; border-radius: 6px;">
                <h4 style="margin: 0 0 4px 0; font-size: 11px; font-weight: bold;">Antecedentes Personales</h4>
                <p style="margin: 0;">No presenta antecedentes personales</p>
            </div>
            <div style="background-color: #f8f9fa; padding: 8px; border-radius: 6px;">
                <h4 style="margin: 0 0 4px 0; font-size: 11px; font-weight: bold;">Antecedentes Familiares</h4>
                <p style="margin: 0;">No presenta antecedentes familiares</p>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <div style="margin-top: 15px; border-top: 1px solid #eee; padding-top: 8px; font-size: 9px; page-break-inside: avoid;">
        <div style="display: flex; justify-content: space-between; align-items: flex-end;">
            <div>
                <p style="margin: 0;">CENTRO DE FERTILIDAD REPRONAT S.A.S.</p>
                <p style="margin: 0;">Informe de Visita Confidencial</p>
                <p style="margin: 0;">Este documento contiene información médica confidencial protegida por la ley.</p>
            </div>
            <div style="text-align: right;">
                <p style="margin: 0;"><strong>Dr. Juan Pérez</strong></p>
                <p style="margin: 0;">Médico Especialista</p>
                <p style="margin: 0;">Firmado: 25 Mar 2024 02:15 PM</p>
            </div>
        </div>
    </div>
</div>
  `

    const options = {
        margin: 5,
        filename: `informe_visita_36640.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "letter", orientation: "portrait" },
    }

    html2pdf().set(options).from(element).save()
}

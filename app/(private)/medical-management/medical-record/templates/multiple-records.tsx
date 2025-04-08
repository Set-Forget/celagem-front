"use client"

// @ts-expect-error: Workaround temporal mientras se corrige el tipado en Y.
import html2pdf from "html2pdf.js"

export const generateMultipleVisitsPDF = () => {
  // Datos de ejemplo para múltiples visitas
  const visits = [
    {
      visitNumber: "36640",
      date: "25 Mar 2024 02:15 PM",
      type: "Donante de semen",
      mode: "Virtual",
      location: "Sede Asistencial Bogotá",
      doctor: "Dr. Juan Pérez",
      signedOn: "25 Mar 2024 02:15 PM",
      vitals: {
        systolicBP: "120 mmHg",
        diastolicBP: "80 mmHg",
        heartRate: "80 lpm",
        respiratoryRate: "20 rpm",
        bmi: "23.5 kg/m2",
      },
      physicalExam: {
        head: "Normal",
        abdomen: "Normal",
        extremities: "Normal",
        neurological: "Normal",
      },
      reason: "Donante de semen",
      currentIllness: "No presenta enfermedad actual",
      personalHistory: "No presenta antecedentes personales",
      familyHistory: "No presenta antecedentes familiares",
    },
    {
      visitNumber: "36720",
      date: "15 Abr 2024 10:30 AM",
      type: "Donante de semen - Seguimiento",
      mode: "Presencial",
      location: "Sede Asistencial Bogotá",
      doctor: "Dra. María Rodríguez",
      signedOn: "15 Abr 2024 10:45 AM",
      vitals: {
        systolicBP: "118 mmHg",
        diastolicBP: "78 mmHg",
        heartRate: "75 lpm",
        respiratoryRate: "18 rpm",
        bmi: "23.2 kg/m2",
      },
      physicalExam: {
        head: "Normal",
        abdomen: "Normal",
        extremities: "Normal",
        neurological: "Normal",
      },
      reason: "Seguimiento donante",
      currentIllness: "No presenta enfermedad actual",
      personalHistory: "No presenta antecedentes personales",
      familyHistory: "No presenta antecedentes familiares",
    },
    {
      visitNumber: "36890",
      date: "10 May 2024 03:45 PM",
      type: "Donante de semen - Control",
      mode: "Presencial",
      location: "Sede Asistencial Bogotá",
      doctor: "Dr. Juan Pérez",
      signedOn: "10 May 2024 04:00 PM",
      vitals: {
        systolicBP: "122 mmHg",
        diastolicBP: "82 mmHg",
        heartRate: "72 lpm",
        respiratoryRate: "19 rpm",
        bmi: "23.0 kg/m2",
      },
      physicalExam: {
        head: "Normal",
        abdomen: "Normal",
        extremities: "Normal",
        neurological: "Normal",
      },
      reason: "Control rutinario",
      currentIllness: "No presenta enfermedad actual",
      personalHistory: "No presenta antecedentes personales",
      familyHistory: "No presenta antecedentes familiares",
    },
  ]

  const element = document.createElement("div")
  element.innerHTML = `
<div style="padding: 15px; font-family: Arial, sans-serif; max-width: 1000px; margin: 0 auto; font-size: 10px;">
    <!-- Header Section -->
    <div style="display: flex; justify-content: space-between; margin-bottom: 15px; gap: 15px">
        <div style="width: 100%;">
            <h1 style="margin: 0 0 10px 0; font-size: 18px; font-weight: bold">INFORME DE VISITAS</h1>
            <div style="display: flex; justify-content: space-between;">
                <span style="display: inline-block;">Fecha de generación:</span>
                <span style="font-weight: 500;"><strong>15 May 2024 10:00 AM</strong></span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span style="display: inline-block;">Total de visitas:</span>
                <span style="font-weight: 500;"><strong>3</strong></span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span style="display: inline-block;">Período:</span>
                <span style="font-weight: 500;"><strong>25 Mar 2024 - 10 May 2024</strong></span>
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

    <!-- Visitas -->
    <div style="margin-bottom: 15px;">
        <h3 style="margin: 0 0 8px 0; font-size: 12px; font-weight: bold; page-break-after: avoid;">
            HISTORIAL DE VISITAS
        </h3>
        
        <!-- Visita 1 -->
        <div style="margin-bottom: 20px; page-break-inside: avoid;">
            <div style="background-color: #f0f4f8; padding: 8px; border-radius: 6px 6px 0 0; border-bottom: 2px solid #ddd;">
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
                    <div><strong>Visita No:</strong> 36640</div>
                    <div><strong>Fecha:</strong> 25 Mar 2024 02:15 PM</div>
                    <div><strong>Médico:</strong> Dr. Juan Pérez</div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 4px;">
                    <div><strong>Tipo:</strong> Donante de semen</div>
                    <div><strong>Modalidad:</strong> Virtual</div>
                </div>
            </div>
            
            <div style="padding: 8px; border: 1px solid #eee; border-top: none; border-radius: 0 0 6px 6px;">
                <!-- Signos Vitales -->
                <div style="margin-bottom: 8px;">
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
                <div style="margin-bottom: 8px;">
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
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <div style="background-color: #f8f9fa; padding: 6px; border-radius: 4px;">
                        <h4 style="margin: 0 0 4px 0; font-size: 10px; font-weight: bold;">Motivo de la consulta</h4>
                        <p style="margin: 0; font-size: 9px;">Donante de semen</p>
                    </div>
                    <div style="background-color: #f8f9fa; padding: 6px; border-radius: 4px;">
                        <h4 style="margin: 0 0 4px 0; font-size: 10px; font-weight: bold;">Enfermedad Actual</h4>
                        <p style="margin: 0; font-size: 9px;">No presenta enfermedad actual</p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Visita 2 -->
        <div style="margin-bottom: 20px; page-break-inside: avoid;">
            <div style="background-color: #f0f4f8; padding: 8px; border-radius: 6px 6px 0 0; border-bottom: 2px solid #ddd;">
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
                    <div><strong>Visita No:</strong> 36720</div>
                    <div><strong>Fecha:</strong> 15 Abr 2024 10:30 AM</div>
                    <div><strong>Médico:</strong> Dra. María Rodríguez</div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 4px;">
                    <div><strong>Tipo:</strong> Donante de semen - Seguimiento</div>
                    <div><strong>Modalidad:</strong> Presencial</div>
                </div>
            </div>
            
            <div style="padding: 8px; border: 1px solid #eee; border-top: none; border-radius: 0 0 6px 6px;">
                <!-- Signos Vitales -->
                <div style="margin-bottom: 8px;">
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
                                <td style="padding: 4px 6px; border: 1px solid #eee;">118 mmHg</td>
                                <td style="padding: 4px 6px; border: 1px solid #eee;">78 mmHg</td>
                                <td style="padding: 4px 6px; border: 1px solid #eee;">75 lpm</td>
                                <td style="padding: 4px 6px; border: 1px solid #eee;">18 rpm</td>
                                <td style="padding: 4px 6px; border: 1px solid #eee;">23.2 kg/m2</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <!-- Examen Físico -->
                <div style="margin-bottom: 8px;">
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
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <div style="background-color: #f8f9fa; padding: 6px; border-radius: 4px;">
                        <h4 style="margin: 0 0 4px 0; font-size: 10px; font-weight: bold;">Motivo de la consulta</h4>
                        <p style="margin: 0; font-size: 9px;">Seguimiento donante</p>
                    </div>
                    <div style="background-color: #f8f9fa; padding: 6px; border-radius: 4px;">
                        <h4 style="margin: 0 0 4px 0; font-size: 10px; font-weight: bold;">Enfermedad Actual</h4>
                        <p style="margin: 0; font-size: 9px;">No presenta enfermedad actual</p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Visita 3 -->
        <div style="margin-bottom: 20px; page-break-inside: avoid;">
            <div style="background-color: #f0f4f8; padding: 8px; border-radius: 6px 6px 0 0; border-bottom: 2px solid #ddd;">
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
                    <div><strong>Visita No:</strong> 36890</div>
                    <div><strong>Fecha:</strong> 10 May 2024 03:45 PM</div>
                    <div><strong>Médico:</strong> Dr. Juan Pérez</div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 4px;">
                    <div><strong>Tipo:</strong> Donante de semen - Control</div>
                    <div><strong>Modalidad:</strong> Presencial</div>
                </div>
            </div>
            
            <div style="padding: 8px; border: 1px solid #eee; border-top: none; border-radius: 0 0 6px 6px;">
                <!-- Signos Vitales -->
                <div style="margin-bottom: 8px;">
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
                                <td style="padding: 4px 6px; border: 1px solid #eee;">122 mmHg</td>
                                <td style="padding: 4px 6px; border: 1px solid #eee;">82 mmHg</td>
                                <td style="padding: 4px 6px; border: 1px solid #eee;">72 lpm</td>
                                <td style="padding: 4px 6px; border: 1px solid #eee;">19 rpm</td>
                                <td style="padding: 4px 6px; border: 1px solid #eee;">23.0 kg/m2</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <!-- Examen Físico -->
                <div style="margin-bottom: 8px;">
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
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <div style="background-color: #f8f9fa; padding: 6px; border-radius: 4px;">
                        <h4 style="margin: 0 0 4px 0; font-size: 10px; font-weight: bold;">Motivo de la consulta</h4>
                        <p style="margin: 0; font-size: 9px;">Control rutinario</p>
                    </div>
                    <div style="background-color: #f8f9fa; padding: 6px; border-radius: 4px;">
                        <h4 style="margin: 0 0 4px 0; font-size: 10px; font-weight: bold;">Enfermedad Actual</h4>
                        <p style="margin: 0; font-size: 9px;">No presenta enfermedad actual</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <div style="margin-top: 15px; border-top: 1px solid #eee; padding-top: 8px; font-size: 9px; page-break-inside: avoid;">
        <div style="display: flex; justify-content: space-between; align-items: flex-end;">
            <div>
                <p style="margin: 0;">CENTRO DE FERTILIDAD REPRONAT S.A.S.</p>
                <p style="margin: 0;">Informe de Visitas Confidencial</p>
                <p style="margin: 0;">Este documento contiene información médica confidencial protegida por la ley.</p>
            </div>
            <div style="text-align: right;">
                <p style="margin: 0;">Página 1 de 1</p>
                <p style="margin: 0;">Generado: 15 May 2024 10:00 AM</p>
            </div>
        </div>
    </div>
</div>
  `

  const options = {
    margin: 5,
    filename: `informe_visitas_paciente.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "letter", orientation: "portrait" },
  }

  html2pdf().set(options).from(element).save()
}

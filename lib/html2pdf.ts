import html2pdf from "html2pdf.js";

export const generatePDF = (element: HTMLElement, filename?: string) => {

  // html2pdf(element, {
  //   margin: 1
  // })

  html2pdf()
    .set({
      margin: 1,
      filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
    })
    .from(element)
    .save();
};
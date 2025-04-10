import html2pdf from "html2pdf.js";

export const generatePDF = (element: HTMLElement, filename?: string) => {

  // html2pdf(element, {
  //   margin: 1
  // })

  html2pdf()
    .from(element)
    .set({
      margin: 1,
      filename,
      image: { type: "pdf", quality: 0.98 },
      html2pdf: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
    })
    .save();
};
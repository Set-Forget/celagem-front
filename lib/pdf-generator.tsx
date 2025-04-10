import { Document, Page, pdf } from '@react-pdf/renderer';
import Html from 'react-pdf-html';
import { renderToString } from 'react-dom/server';

interface PDFGeneratorProps {
  element: React.ReactElement;
  filename?: string;
}

// Component that wraps your content for PDF generation
export const PDFDocument = ({ content }: { content: string }) => (
  <Document>
    <Page size="A4">
      <Html>{content}</Html>
    </Page>
  </Document>
);

// Function to generate PDF
export const generatePDF = async ({ element, filename = 'document.pdf' }: PDFGeneratorProps) => {
  try {
    // Convert React component to HTML string while preserving Tailwind classes
    const htmlContent = renderToString(element);
    
    // Generate PDF
    const blob = await pdf(
      <PDFDocument content={htmlContent} />
    ).toBlob();
    
    // Download PDF
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
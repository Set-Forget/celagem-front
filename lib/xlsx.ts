import * as XLSX from 'xlsx';

export const exportExcel = async (
  data: any[],
  title?: string,
  worksheetname?: string
) => {
  if (data && Array.isArray(data)) {
    const dataToExport = data;
    // Create Excel workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils?.json_to_sheet(dataToExport);
    XLSX.utils.book_append_sheet(workbook, worksheet, worksheetname);
    // Save the workbook as an Excel file
    XLSX.writeFile(workbook, `${title}.xlsx`);
    alert(`Exported data to ${title}.xlsx`);
  } else {
    console.log('#==================Export Error');
  }
};

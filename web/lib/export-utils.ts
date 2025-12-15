import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// Add to the import scope to avoid TS errors if using a specific version
declare module 'jspdf' {
    interface jsPDF {
        lastAutoTable: { finalY: number }; // useful export
    }
}

export const exportToExcel = (fileName: string, data: any[]) => {
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")
    XLSX.writeFile(workbook, `${fileName}.xlsx`)
}

export const exportToPDF = (fileName: string, columns: string[], rows: any[][], title: string) => {
    const doc = new jsPDF()

    // Add unicode font support if possible, but for now we use formatted text
    // doc.addFileToVFS("MyFont.ttf", myFontBase64);
    // doc.addFont("MyFont.ttf", "MyFont", "normal");
    // doc.setFont("MyFont");

    doc.setFontSize(18)
    doc.text(title, 14, 22)

    doc.setFontSize(11)
    doc.setTextColor(100)

    // date
    const dateStr = new Date().toLocaleDateString('tr-TR')
    doc.text(`Rapor Tarihi: ${dateStr}`, 14, 30)

    autoTable(doc, {
        head: [columns],
        body: rows,
        startY: 40,
        styles: {
            fontSize: 9,
            cellPadding: 3,
            overflow: 'linebreak'
        },
        headStyles: {
            fillColor: [76, 175, 80], // Primary color (green-ish)
            textColor: 255
        },
        theme: 'grid'
    })

    doc.save(`${fileName}.pdf`)
}

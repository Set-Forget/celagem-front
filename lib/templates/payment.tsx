import { paymentStatus } from "@/app/(private)/banking/payments/utils"
import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import type React from "react"

// Definiendo los tipos para los datos del pago
export type PaymentDetail = {
  id: number
  sequence_id: string
  amount: number
  date: string
  state: string
  currency: { id: number; name: string }
  partner: { id: number; name: string }
  journal: { id: number; name: string }
  source_account: { id: number; name: string }
  payment_method: { id: number; name: string }
  payment_reference: string
  reconciled_bills: { id: number; sequence_id: string; amount_total: number; type: string }[]
  withholdings: { tax: { id: number; name: string }; account: { id: number; name: string } }[]
  journal_entry_lines: {
    id: number
    name: string
    debit: number
    credit: number
    account: { id: number; name: string }
    partner: { id: number; name: string }
  }[]
  company: { id: number; name: string }
  created_by: { id: number; name: string }
  created_at: string
  invoices: { id: number; sequence_id: string; amount_total: number }[]
}

// Estilos adaptados del ejemplo
const styles = StyleSheet.create({
  page: { fontSize: 9, padding: 0, margin: 0, color: "#333" },
  container: { padding: 30 },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24, gap: 20 },
  headerLeft: { width: "50%", paddingHorizontal: 12 },
  headerRight: { width: "50%", paddingHorizontal: 12, marginTop: 48 },
  title: { fontSize: 20, fontWeight: 700, marginBottom: 20, color: "#111" },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 3 },
  label: { fontWeight: 400 },
  value: { fontWeight: 700 },
  gridContainer: { flexDirection: "row", gap: 20, marginBottom: 24 },
  gridItem: { backgroundColor: "#f8f9fa", padding: 12, borderRadius: 8, width: "50%" },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 6,
  },
  table: { width: "100%", marginBottom: 24 },
  tableHeader: { flexDirection: "row", backgroundColor: "#f1f5f9", borderBottomWidth: 1, borderBottomColor: "#e2e8f0" },
  tableHeaderCell: { padding: 8, fontWeight: 700, fontSize: 8 },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  tableCell: { padding: 8 },
  tableCellRight: { padding: 8, textAlign: "right" },
  bottomSection: { flexDirection: "row" },
  docsSection: { width: "50%" },
  docsTitle: { fontSize: 12, fontWeight: 700, marginTop: 20, marginBottom: 16 },
  docsList: { paddingLeft: 10 },
  docsItem: { marginBottom: 4 },
  summarySection: { backgroundColor: "#f8f9fa", padding: 12, borderRadius: 8, width: "100%" },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  summaryDivider: { height: 1, backgroundColor: "#e2e8f0", marginVertical: 8 },
  summaryTotal: { flexDirection: "row", justifyContent: "space-between", fontSize: 14, fontWeight: 700, color: "#111" },
  signaturesSection: { flexDirection: "row", justifyContent: "space-between", gap: 24, marginTop: 40 },
  signatureBox: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    width: "50%",
    minHeight: 90,
    display: "flex",
    flexDirection: "column",
  },
  signatureTitle: { fontSize: 8, fontWeight: 700, marginBottom: "auto" },
  signatureName: { fontSize: 9, paddingBottom: 4 },
  signatureLine: { borderTopWidth: 1, borderTopColor: "#333" },
  colInvoiceId: { width: "60%" },
  colInvoiceAmount: { width: "40%" },
})

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export const PaymentPDF: React.FC<{ data: PaymentDetail }> = ({ data }) => {
  const formattedPaymentDate = data.date ? format(parseISO(data.date), "PP", { locale: es }) : ""
  const totalDebit = data.journal_entry_lines.reduce((sum, item) => sum + item.debit, 0)
  const totalCredit = data.journal_entry_lines.reduce((sum, item) => sum + item.credit, 0)
  const totalInvoicesAmount = data.invoices.reduce((sum, bill) => sum + bill.amount_total, 0)

  return (
    <Document title={`Comprobante de Pago ${data.sequence_id}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.title}>COMPROBANTE DE PAGO</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Pago No:</Text>
                <Text style={styles.value}>{data.sequence_id}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Fecha de Pago:</Text>
                <Text style={styles.value}>{formattedPaymentDate}</Text>
              </View>
            </View>
            <View style={styles.headerRight}>
              <Image src="/celagem-logo.jpg" />
            </View>
          </View>

          <View style={styles.gridContainer}>
            <View style={styles.gridItem}>
              <Text style={styles.sectionTitle}>DATOS DEL PAGO</Text>
              <View style={styles.row}>
                <Text>Proveedor:</Text>
                <Text style={styles.value}>{data.partner.name}</Text>
              </View>
              <View style={styles.row}>
                <Text>Método de Pago:</Text>
                <Text style={styles.value}>{data.payment_method.name}</Text>
              </View>
              <View style={styles.row}>
                <Text>Referencia:</Text>
                <Text style={styles.value}>{data.payment_reference || "N/A"}</Text>
              </View>
              <View style={styles.row}>
                <Text>Retenciones:</Text>
                <Text style={styles.value}>
                  {data.withholdings.length > 0 ? data.withholdings.map((wh) => wh.tax.name).join(", ") : "N/A"}
                </Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.sectionTitle}>DATOS DE LA EMPRESA</Text>
              <View style={styles.row}>
                <Text>Razón Social:</Text>
                <Text style={styles.value}>{data.company.name}</Text>
              </View>
              <View style={styles.row}>
                <Text>Estado del Pago:</Text>
                <Text style={styles.value}>{paymentStatus?.[data.state as keyof typeof paymentStatus]?.label}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>DOCUMENTOS PAGADOS</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.colInvoiceId]}>FACTURA No.</Text>
              <Text style={[styles.tableHeaderCell, styles.colInvoiceAmount, { textAlign: "right" }]}>MONTO</Text>
            </View>
            {data.invoices.map((bill) => (
              <View key={bill.sequence_id} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.colInvoiceId]}>{bill.sequence_id}</Text>
                <Text style={[styles.tableCellRight, styles.colInvoiceAmount]}>
                  {formatCurrency(bill.amount_total, data.currency.name)}
                </Text>
              </View>
            ))}
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.colInvoiceId, { textAlign: "left", fontWeight: 700 }]}>
                TOTAL:
              </Text>
              <Text style={[styles.tableCellRight, styles.colInvoiceAmount, { fontWeight: 700 }]}>
                {formatCurrency(totalInvoicesAmount, data.currency.name)}
              </Text>
            </View>
          </View>

          <View style={styles.bottomSection}>
            <View style={styles.summarySection}>
              <View style={styles.summaryRow}>
                <Text>Subtotal:</Text>
                <Text style={styles.value}>{formatCurrency(totalDebit, data.currency.name)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text>Retenciones:</Text>
                <Text style={styles.value}>{formatCurrency(totalDebit - data.amount, data.currency.name)}</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryTotal}>
                <Text>TOTAL PAGADO:</Text>
                <Text>{formatCurrency(data.amount, data.currency.name)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.signaturesSection}>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureTitle}>ELABORADO POR</Text>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureName}>{data.created_by.name}</Text>
            </View>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureTitle}>RECIBIDO POR</Text>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureName}>{data.partner.name}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default PaymentPDF

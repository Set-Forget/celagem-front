import type React from "react"
import { Document, Page, View, Text, Image, StyleSheet, Font } from "@react-pdf/renderer"
import type { PurchaseReceiptDetail } from "@/app/(private)/(commercial)/purchases/purchase-receipts/schemas/purchase-receipts"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"

const styles = StyleSheet.create({
  page: {
    fontSize: 8,
    padding: 0,
    margin: 0,
  },
  container: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    fontSize: 8,
    gap: 20,
  },
  headerLeft: {
    width: "50%",
    paddingHorizontal: 12,
  },
  headerRight: {
    width: "50%",
    paddingHorizontal: 12,
    marginTop: 48,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  label: {
    fontWeight: 400,
  },
  value: {
    fontWeight: 700,
  },
  logo: {
    width: 362,
    height: 77,
  },
  supplierSection: {
    marginBottom: 24,
    fontSize: 8,
  },
  supplierItem: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    width: "100%",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 16,
  },
  table: {
    width: "100%",
    marginBottom: 24,
    fontSize: 8,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    fontSize: 8,
  },
  tableHeaderCell: {
    padding: 8,
    fontWeight: 700,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tableCell: {
    padding: 8,
  },
  tableCellRight: {
    padding: 8,
    textAlign: "right",
  },
  tableCellLeft: {
    padding: 8,
    textAlign: "left",
  },
  colProductId: { width: "15%" },
  colDescription: { width: "30%" },
  colScheduled: { width: "15%" },
  colReceived: { width: "15%" },
  colUnit: { width: "12%" },
  colLot: { width: "13%" },
  bottomSection: {
    flexDirection: "row",
    gap: 24,
  },
  notesSection: {
    width: "50%",
    fontSize: 8,
  },
  notesTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 16,
  },
  conditionsTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginTop: 20,
    marginBottom: 16,
  },
  conditionsList: {
    paddingLeft: 20,
  },
  conditionsItem: {
    marginBottom: 4,
  },
  summarySection: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    width: "50%",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
    fontSize: 8,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 8,
  },
  summaryTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 12,
    fontWeight: 700,
  },
  summaryNote: {
    marginTop: 8,
    fontSize: 8,
    fontStyle: "italic",
    textAlign: "right",
  },
  signaturesSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 24,
    marginTop: 24,
  },
  signatureBox: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    width: "50%",
    minHeight: 80,
  },
  signatureTitle: {
    fontSize: 8,
    fontWeight: 700,
    marginBottom: 12,
  },
  signatureName: {
    fontSize: 8,
    paddingVertical: 12,
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: "#000",
    marginTop: "auto",
  },
})

const ReceptionPDF: React.FC<{ data: PurchaseReceiptDetail }> = ({ data }) => {
  const formattedScheduledDate = data.scheduled_date && format(parseISO(data.scheduled_date), "PP", { locale: es })
  const formattedReceptionDate = data.reception_date && format(parseISO(data.reception_date), "PP", { locale: es })

  const totalItems = data.items.length
  const totalQuantity = data.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Document title={`Recepción ${data.sequence_id}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.title}>RECEPCIÓN</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Recepción No:</Text>
                <Text style={styles.value}>{data.sequence_id}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Fecha programada:</Text>
                <Text style={styles.value}>{formattedScheduledDate}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Fecha de recepción:</Text>
                <Text style={styles.value}>{formattedReceptionDate}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Ubicación destino:</Text>
                <Text style={styles.value}>{data?.reception_location?.name}</Text>
              </View>
              {data?.purchase_order && (
                <View style={styles.row}>
                  <Text style={styles.label}>Orden de Compra:</Text>
                  <Text style={styles.value}>{data.purchase_order.sequence_id}</Text>
                </View>
              )}
            </View>
            <View style={styles.headerRight}>
              <Image src="/celagem-logo.jpg" />
            </View>
          </View>

          {/* Supplier Section */}
          <View style={styles.supplierSection}>
            <View style={styles.supplierItem}>
              <Text style={styles.sectionTitle}>DATOS DEL PROVEEDOR</Text>
              <View style={styles.row}>
                <Text>Razón Social:</Text>
                <Text style={styles.value}>{data.supplier.name}</Text>
              </View>
              <View style={styles.row}>
                <Text>Dirección:</Text>
                <Text style={styles.value}>{data.supplier.address}</Text>
              </View>
              <View style={styles.row}>
                <Text>Teléfono:</Text>
                <Text style={styles.value}>{data.supplier.phone}</Text>
              </View>
              <View style={styles.row}>
                <Text>Email:</Text>
                <Text style={styles.value}>{data.supplier.email}</Text>
              </View>
            </View>
          </View>

          {/* Table */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.colProductId]}>PRODUCTO ID</Text>
              <Text style={[styles.tableHeaderCell, styles.colDescription]}>DESCRIPCIÓN</Text>
              <Text style={[styles.tableHeaderCell, styles.colReceived, { textAlign: "right" }]}>CANT. RECIBIDA</Text>
              <Text style={[styles.tableHeaderCell, styles.colUnit]}>UNIDAD</Text>
              <Text style={[styles.tableHeaderCell, styles.colLot]}>LOTE</Text>
            </View>
            {data.items.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.colProductId]}>{item.product_id}</Text>
                <Text style={[styles.tableCell, styles.colDescription]}>{item.display_name}</Text>
                <Text style={[styles.tableCellRight, styles.colReceived]}>
                  {item.quantity.toLocaleString("es-ES")}
                </Text>
                <Text style={[styles.tableCellLeft, styles.colUnit]}>{item.product_uom.name}</Text>
                <Text style={[styles.tableCellLeft, styles.colLot]}>{item.lot ? item.lot.name : "N/A"}</Text>
              </View>
            ))}
            {/* Empty rows */}
            {data.items.length < 5 &&
              Array(5 - data.items.length)
                .fill(0)
                .map((_, index) => (
                  <View key={`empty-${index}`} style={styles.tableRow}>
                    <Text style={[styles.tableCell, styles.colProductId]}> </Text>
                    <Text style={[styles.tableCell, styles.colDescription]}> </Text>
                    <Text style={[styles.tableCell, styles.colScheduled]}> </Text>
                    <Text style={[styles.tableCell, styles.colReceived]}> </Text>
                    <Text style={[styles.tableCell, styles.colUnit]}> </Text>
                    <Text style={[styles.tableCell, styles.colLot]}> </Text>
                  </View>
                ))}
          </View>

          {/* Bottom Section */}
          <View style={styles.bottomSection}>
            <View style={styles.notesSection}>
              <Text style={styles.notesTitle}>NOTAS:</Text>
              <Text>{data.note ? data.note : "Sin notas adicionales"}</Text>

              <Text style={styles.conditionsTitle}>CONDICIONES DE RECEPCIÓN:</Text>
              <View style={styles.conditionsList}>
                <Text style={styles.conditionsItem}>
                  1. Verificar que los productos recibidos coincidan con la orden de compra
                </Text>
                <Text style={styles.conditionsItem}>2. Inspeccionar el estado físico de los productos</Text>
                <Text style={styles.conditionsItem}>3. Confirmar las cantidades recibidas</Text>
                <Text style={styles.conditionsItem}>4. Registrar cualquier discrepancia o daño</Text>
                <Text style={styles.conditionsItem}>5. Almacenar los productos en la ubicación designada</Text>
              </View>
            </View>

            <View style={styles.summarySection}>
              <View style={styles.summaryRow}>
                <Text>TOTAL ITEMS:</Text>
                <Text style={styles.value}>{totalItems}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text>CANTIDAD RECIBIDA:</Text>
                <Text style={styles.value}>{totalQuantity.toLocaleString("es-ES")}</Text>
              </View>
              <View style={styles.summaryDivider} />
              <Text style={styles.summaryNote}>
                Recepción realizada el {format(data.reception_date, "PP", { locale: es })}
              </Text>
            </View>
          </View>

          {/* Signatures */}
          <View style={styles.signaturesSection}>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureTitle}>RECIBIDO POR</Text>
              <Text style={styles.signatureName}> </Text>
              <View style={styles.signatureLine} />
            </View>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureTitle}>ENTREGADO POR</Text>
              <Text style={styles.signatureName}>{data.supplier.name}</Text>
              <View style={styles.signatureLine} />
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default ReceptionPDF

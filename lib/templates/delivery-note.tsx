import type React from "react"
import { Document, Page, View, Text, Image, StyleSheet, Font } from "@react-pdf/renderer"
import type { DeliveryNoteDetail } from "@/app/(private)/sales/delivery-notes/schemas/delivery-notes"
import { format } from "date-fns"
import { es } from "date-fns/locale"
/* 
Font.register({
  family: "Geist",
  fonts: [
    {
      src: "/Geist-Regular.ttf",
      fontWeight: 400,
    },
    {
      src: "/Geist-Medium.ttf",
      fontWeight: 500,
    },
    {
      src: "/Geist-Semibold.ttf",
      fontWeight: 700,
    },
    {
      fontWeight: 400,
      fontStyle: "italic",
      src: "/Geist-Regular.ttf",
    }
  ],
}) */

const styles = StyleSheet.create({
  page: {
    //fontFamily: "Geist",
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
  gridContainer: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 24,
    fontSize: 8,
  },
  gridItem: {
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
  // Columnas para la tabla de remito de entrega (5 columnas)
  colProductId: { width: "15%" },
  colDescription: { width: "35%" },
  colScheduled: { width: "18%" },
  colDelivered: { width: "17%" },
  colUnit: { width: "15%" },
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

const DeliveryNotePDF: React.FC<{ data: DeliveryNoteDetail }> = ({ data }) => {
  const formattedScheduledDate = format(new Date(data.scheduled_date), "PP", { locale: es })
  const formattedDeliveryDate = format(new Date(data.delivery_date), "PP", { locale: es })

  const totalItems = data.items.length
  const totalQuantity = data.items.reduce((sum, item) => sum + item.quantity, 0)
  const totalScheduledQuantity = data.items.reduce((sum, item) => sum + item.product_uom_qty, 0)

  return (
    <Document title={`Remito ${data.number}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.title}>REMITO DE ENTREGA</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Remito No:</Text>
                <Text style={styles.value}>{data.number}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Fecha programada:</Text>
                <Text style={styles.value}>{formattedScheduledDate}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Fecha de entrega:</Text>
                <Text style={styles.value}>{formattedDeliveryDate}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Ubicación destino:</Text>
                <Text style={styles.value}>{data.delivery_location}</Text>
              </View>
            </View>
            <View style={styles.headerRight}>
              <Image src="/celagem-logo.jpg" />
            </View>
          </View>

          {/* Customer Section */}
          <View style={styles.gridContainer}>
            <View style={styles.gridItem}>
              <Text style={styles.sectionTitle}>DATOS DEL CLIENTE</Text>
              <View style={styles.row}>
                <Text>Razón Social:</Text>
                <Text style={styles.value}>{data.customer.name}</Text>
              </View>
              <View style={styles.row}>
                <Text>Dirección:</Text>
                <Text style={styles.value}>{data.customer.address}</Text>
              </View>
              <View style={styles.row}>
                <Text>Teléfono:</Text>
                <Text style={styles.value}>{data.customer.phone}</Text>
              </View>
              <View style={styles.row}>
                <Text>Email:</Text>
                <Text style={styles.value}>{data.customer.email}</Text>
              </View>
            </View>
          </View>

          {/* Table */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.colProductId]}>PRODUCTO ID</Text>
              <Text style={[styles.tableHeaderCell, styles.colDescription]}>DESCRIPCIÓN</Text>
              <Text style={[styles.tableHeaderCell, styles.colScheduled, { textAlign: "right" }]}>
                CANT. PROGRAMADA
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colDelivered, { textAlign: "right" }]}>CANT. ENTREGADA</Text>
              <Text style={[styles.tableHeaderCell, styles.colUnit]}>UNIDAD</Text>
            </View>
            {data.items.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.colProductId]}>{item.product_id}</Text>
                <Text style={[styles.tableCell, styles.colDescription]}>{item.display_name}</Text>
                <Text style={[styles.tableCellRight, styles.colScheduled]}>
                  {item.product_uom_qty.toLocaleString("es-ES")}
                </Text>
                <Text style={[styles.tableCellRight, styles.colDelivered]}>
                  {item.quantity.toLocaleString("es-ES")}
                </Text>
                <Text style={[styles.tableCellLeft, styles.colUnit]}>{item.product_uom.name}</Text>
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
                    <Text style={[styles.tableCell, styles.colDelivered]}> </Text>
                    <Text style={[styles.tableCell, styles.colUnit]}> </Text>
                  </View>
                ))}
          </View>

          {/* Bottom Section */}
          <View style={styles.bottomSection}>
            <View style={styles.notesSection}>
              <Text style={styles.notesTitle}>NOTAS:</Text>
              <Text>{data.note ? data.note : "Sin notas adicionales"}</Text>

              <Text style={styles.conditionsTitle}>CONDICIONES DE ENTREGA:</Text>
              <View style={styles.conditionsList}>
                <Text style={styles.conditionsItem}>
                  1. Verificar que los productos entregados coincidan con la orden de venta
                </Text>
                <Text style={styles.conditionsItem}>
                  2. Inspeccionar el estado físico de los productos al momento de la entrega
                </Text>
                <Text style={styles.conditionsItem}>3. Confirmar las cantidades entregadas</Text>
                <Text style={styles.conditionsItem}>4. Registrar cualquier discrepancia o daño</Text>
                <Text style={styles.conditionsItem}>5. Obtener la firma de conformidad del cliente</Text>
              </View>
            </View>

            <View style={styles.summarySection}>
              <View style={styles.summaryRow}>
                <Text>TOTAL ITEMS:</Text>
                <Text style={styles.value}>{totalItems}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text>CANTIDAD PROGRAMADA:</Text>
                <Text style={styles.value}>{totalScheduledQuantity.toLocaleString("es-ES")}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text>CANTIDAD ENTREGADA:</Text>
                <Text style={styles.value}>{totalQuantity.toLocaleString("es-ES")}</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryTotal}>
                <Text>ESTADO:</Text>
                <Text>{totalQuantity === totalScheduledQuantity ? "COMPLETA" : "PARCIAL"}</Text>
              </View>
              <Text style={styles.summaryNote}>
                Entrega realizada el {format(new Date(data.delivery_date), "PP", { locale: es })}
              </Text>
            </View>
          </View>

          {/* Signatures */}
          <View style={styles.signaturesSection}>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureTitle}>ENTREGADO POR</Text>
              <Text style={styles.signatureName}> </Text>
              <View style={styles.signatureLine} />
            </View>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureTitle}>RECIBIDO POR</Text>
              <Text style={styles.signatureName}>{data.customer.name}</Text>
              <View style={styles.signatureLine} />
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default DeliveryNotePDF

import { STATUS_STYLES } from "@/components/status-badge"
import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import type React from "react"
import { AdaptedPurchaseRequestDetail } from "../adapters/purchase-requests"

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
    fontSize: 8,
  },
  value: {
    fontWeight: 700,
    fontSize: 8,
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
    width: "50%",
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
  col1: { width: "15%" },
  col2: { width: "20%" },
  col3: { width: "45%" },
  col4: { width: "20%" },
  bottomSection: {
    flexDirection: "row",
    gap: 24,
  },
  termsSection: {
    width: "50%",
    fontSize: 8,
  },
  termsTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginTop: 20,
    marginBottom: 16,
  },
  termsList: {
    paddingLeft: 20,
  },
  termsItem: {
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

export const PurchaseRequestPDF: React.FC<{ data: AdaptedPurchaseRequestDetail }> = ({ data }) => {
  const formattedRequestDate = data.request_date
  const formattedCreatedDate = data.created_at

  return (
    <Document title={`Solicitud de Pedido ${data.sequence_id}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.title}>SOLICITUD DE PEDIDO</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Pedido No:</Text>
                <Text style={styles.value}>{data.sequence_id}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Fecha de solicitud:</Text>
                <Text style={styles.value}>{formattedCreatedDate}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Fecha de requerimiento:</Text>
                <Text style={styles.value}>{formattedRequestDate}</Text>
              </View>
            </View>
            <View style={styles.headerRight}>
              <Image src="/celagem-logo.jpg" />
            </View>
          </View>

          {/* Grid Section */}
          <View style={styles.gridContainer}>
            <View style={styles.gridItem}>
              <Text style={styles.sectionTitle}>DATOS DE LA SOLICITUD</Text>
              <View style={styles.row}>
                <Text>Creado por:</Text>
                <Text style={styles.value}>{data.created_by.name}</Text>
              </View>
              <View style={styles.row}>
                <Text>Estado:</Text>
                <Text style={styles.value}>{STATUS_STYLES[data.status].label}</Text>
              </View>
              {data.purchase_order && (
                <View style={styles.row}>
                  <Text>Orden de Compra:</Text>
                  <Text style={styles.value}>{data.purchase_order.sequence_id}</Text>
                </View>
              )}
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.sectionTitle}>DATOS DE LA EMPRESA</Text>
              <View style={styles.row}>
                <Text>Razón Social:</Text>
                <Text style={styles.value}>{data.company.name}</Text>
              </View>
            </View>
          </View>

          {/* Table */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.col1]}>ITEM</Text>
              <Text style={[styles.tableHeaderCell, styles.col2]}>CÓDIGO</Text>
              <Text style={[styles.tableHeaderCell, styles.col3]}>DESCRIPCIÓN</Text>
              <Text style={[styles.tableHeaderCell, styles.col4, { textAlign: "right" }]}>CANTIDAD</Text>
            </View>
            {data.items.map((item, idx) => (
              <View key={item.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.col1]}>{idx + 1}</Text>
                <Text style={[styles.tableCell, styles.col2]}>{item.product_code}</Text>
                <Text style={[styles.tableCell, styles.col3]}>{item.product_name}</Text>
                <Text style={[styles.tableCellRight, styles.col4]}>{item.quantity.toLocaleString("es-ES")}</Text>
              </View>
            ))}
            {/* Empty rows */}
            {data.items.length < 5 &&
              Array(5 - data.items.length)
                .fill(0)
                .map((_, index) => (
                  <View key={`empty-${index}`} style={styles.tableRow}>
                    <Text style={[styles.tableCell, styles.col1]}> </Text>
                    <Text style={[styles.tableCell, styles.col2]}> </Text>
                    <Text style={[styles.tableCell, styles.col3]}> </Text>
                    <Text style={[styles.tableCell, styles.col4]}> </Text>
                  </View>
                ))}
          </View>

          {/* Bottom Section */}
          <View style={styles.bottomSection}>
            <View style={styles.termsSection}>
              <Text style={styles.termsTitle}>TÉRMINOS Y CONDICIONES:</Text>
              {data.tyc_notes ? (
                <Text>{data.tyc_notes}</Text>
              ) : (
                <View style={styles.termsList}>
                  <Text style={styles.termsItem}>
                    1. Los productos solicitados deben cumplir con las especificaciones requeridas
                  </Text>
                  <Text style={styles.termsItem}>2. La entrega debe realizarse en el tiempo establecido</Text>
                  <Text style={styles.termsItem}>3. Los productos deben contar con garantía del fabricante</Text>
                  <Text style={styles.termsItem}>4. Se debe entregar la documentación completa de los productos</Text>
                </View>
              )}
            </View>

            <View style={styles.summarySection}>
              <View style={styles.summaryRow}>
                <Text>TOTAL ITEMS:</Text>
                <Text style={styles.value}>{data.items.length}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text>TOTAL CANTIDAD:</Text>
                <Text style={styles.value}>
                  {data.items.reduce((sum, item) => sum + item.quantity, 0).toLocaleString("es-ES")}
                </Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryTotal}>
                <Text>ESTADO:</Text>
                <Text>{STATUS_STYLES[data.status].label}</Text>
              </View>
              {data.purchase_order && (
                <Text style={styles.summaryNote}>Orden de compra asociada: {data.purchase_order.sequence_id}</Text>
              )}
            </View>
          </View>

          {/* Signatures */}
          <View style={styles.signaturesSection}>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureTitle}>SOLICITADO POR</Text>
              <Text style={styles.signatureName}>{data.created_by.name}</Text>
              <View style={styles.signatureLine} />
            </View>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureTitle}>APROBADO POR</Text>
              <Text style={styles.signatureName}> </Text>
              <View style={styles.signatureLine} />
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default PurchaseRequestPDF

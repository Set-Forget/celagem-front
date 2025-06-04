import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type React from "react";
import { AdaptedDebitNoteDetail } from "../adapters/debit-notes";
import { toWords } from "../utils";

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
  // Columnas para la tabla de nota de débito (7 columnas)
  colProductId: { width: "12%" },
  colDescription: { width: "25%" },
  colQuantity: { width: "10%" },
  colUnitPrice: { width: "15%" },
  colSubtotal: { width: "13%" },
  colTax: { width: "10%" },
  colTotal: { width: "15%" },
  bottomSection: {
    flexDirection: "row",
    gap: 24,
  },
  infoSection: {
    width: "50%",
    fontSize: 8,
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginTop: 20,
    marginBottom: 16,
  },
  infoList: {
    paddingLeft: 20,
  },
  infoItem: {
    marginBottom: 4,
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
});

const DebitNotePDF: React.FC<{ data: AdaptedDebitNoteDetail }> = ({ data }) => {
  const formattedDate = format(data.date, "PP", { locale: es });
  const formattedDueDate = format(data.due_date, "PP", { locale: es });
  const formattedCreatedDate = format(data.created_at, "PP", { locale: es });

  const subtotal = data.items.reduce((sum, item) => sum + item.price_subtotal, 0);
  const taxes = data.items.reduce((sum, item) => sum + item.price_tax, 0);
  const total = subtotal + taxes;

  const currencyCode = data.currency.name;
  const formattedSubtotal = `${currencyCode} ${subtotal.toFixed(2)}`;
  const formattedTaxes = `${currencyCode} ${taxes.toFixed(2)}`;
  const formattedTotal = `${currencyCode} ${total.toFixed(2)}`;

  const invoiceNumber = data.custom_sequence_number || data.sequence_id;
  const totalInWords = `${currencyCode} ${toWords(total.toFixed(2))}`;

  return (
    <Document title={`Nota de Débito ${invoiceNumber}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.title}>NOTA DE DÉBITO</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Nota de débito No:</Text>
                <Text style={styles.value}>{invoiceNumber}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Creado por:</Text>
                <Text style={styles.value}>{data.created_by.name}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Fecha de creación:</Text>
                <Text style={styles.value}>{formattedCreatedDate}</Text>
              </View>
            </View>
            <View style={styles.headerRight}>
              <Image src="/celagem-logo.jpg" alt="Celagem logo" />
            </View>
          </View>

          {/* Grid Section */}
          <View style={styles.gridContainer}>
            <View style={styles.gridItem}>
              <Text style={styles.sectionTitle}>DATOS DEL PROVEEDOR</Text>
              <View style={styles.row}>
                <Text>Razón Social:</Text>
                <Text style={styles.value}>{data.partner.name}</Text>
              </View>
              <View style={styles.row}>
                <Text>Dirección:</Text>
                <Text style={styles.value}>{data.partner.address}</Text>
              </View>
              <View style={styles.row}>
                <Text>Teléfono:</Text>
                <Text style={styles.value}>{data.partner.phone}</Text>
              </View>
              <View style={styles.row}>
                <Text>Email:</Text>
                <Text style={styles.value}>{data.partner.email}</Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.sectionTitle}>DATOS DE PAGO</Text>
              <View style={styles.row}>
                <Text>Moneda:</Text>
                <Text style={styles.value}>{data.currency.name}</Text>
              </View>
              <View style={styles.row}>
                <Text>Término de pago:</Text>
                <Text style={styles.value}>{data.payment_term.name}</Text>
              </View>
              <View style={styles.row}>
                <Text>Método de pago:</Text>
                <Text style={styles.value}>{data.payment_method.name}</Text>
              </View>
              <View style={styles.row}>
                <Text>Fecha de emisión:</Text>
                <Text style={styles.value}>{formattedDate}</Text>
              </View>
              <View style={styles.row}>
                <Text>Fecha de vencimiento:</Text>
                <Text style={styles.value}>{formattedDueDate}</Text>
              </View>
            </View>
          </View>

          {/* Table */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.colProductId]}>PRODUCTO ID</Text>
              <Text style={[styles.tableHeaderCell, styles.colDescription]}>DESCRIPCIÓN</Text>
              <Text
                style={[styles.tableHeaderCell, styles.colQuantity, { textAlign: "right" }]}
              >
                CANTIDAD
              </Text>
              <Text
                style={[styles.tableHeaderCell, styles.colUnitPrice, { textAlign: "right" }]}
              >
                PRECIO UNITARIO
              </Text>
              <Text
                style={[styles.tableHeaderCell, styles.colSubtotal, { textAlign: "right" }]}
              >
                SUBTOTAL
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colTax, { textAlign: "right" }]}>
                IMPUESTO
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colTotal, { textAlign: "right" }]}>
                TOTAL
              </Text>
            </View>
            {data.items.map((item) => (
              <View key={item.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.colProductId]}>{item.product_id}</Text>
                <Text style={[styles.tableCell, styles.colDescription]}>
                  {item.product_name}
                </Text>
                <Text style={[styles.tableCellRight, styles.colQuantity]}>
                  {item.quantity.toLocaleString("es-ES")}
                </Text>
                <Text style={[styles.tableCellRight, styles.colUnitPrice]}>
                  {currencyCode} {item.price_unit.toFixed(2)}
                </Text>
                <Text style={[styles.tableCellRight, styles.colSubtotal]}>
                  {currencyCode} {item.price_subtotal.toFixed(2)}
                </Text>
                <Text style={[styles.tableCellRight, styles.colTax]}>
                  {item.taxes.map((tax) => tax.name).join(", ")}
                </Text>
                <Text style={[styles.tableCellRight, styles.colTotal]}>
                  {currencyCode} {(item.price_subtotal + item.price_tax).toFixed(2)}
                </Text>
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
                    <Text style={[styles.tableCell, styles.colQuantity]}> </Text>
                    <Text style={[styles.tableCell, styles.colUnitPrice]}> </Text>
                    <Text style={[styles.tableCell, styles.colSubtotal]}> </Text>
                    <Text style={[styles.tableCell, styles.colTax]}> </Text>
                    <Text style={[styles.tableCell, styles.colTotal]}> </Text>
                  </View>
                ))}
          </View>

          {/* Bottom Section */}
          <View style={styles.bottomSection}>
            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>INFORMACIÓN ADICIONAL:</Text>
              <View style={styles.infoList}>
                {data?.associated_invoice?.sequence_id && (
                  <Text style={styles.infoItem}>
                    • Factura asociada: {data.associated_invoice.sequence_id} (ID:{" "}
                    {data.associated_invoice.id})
                  </Text>
                )}
                <Text style={styles.infoItem}>
                  • Esta nota de débito se emite para ajustar el saldo de la factura
                  asociada
                </Text>
                <Text style={styles.infoItem}>
                  • Los impuestos se calculan sobre el valor debitado
                </Text>
              </View>

              <Text style={styles.termsTitle}>TÉRMINOS Y CONDICIONES:</Text>
              <View style={styles.termsList}>
                <Text style={styles.termsItem}>
                  1. Los productos solicitados deben cumplir con las especificaciones
                  requeridas
                </Text>
                <Text style={styles.termsItem}>
                  2. La entrega debe realizarse en el tiempo establecido
                </Text>
                <Text style={styles.termsItem}>
                  3. Los productos deben contar con garantía del fabricante
                </Text>
                <Text style={styles.termsItem}>
                  4. Se debe entregar la documentación completa de los productos
                </Text>
              </View>
            </View>

            <View style={styles.summarySection}>
              <View style={styles.summaryRow}>
                <Text>SUBTOTAL:</Text>
                <Text style={styles.value}>{formattedSubtotal}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text>IMPUESTO:</Text>
                <Text style={styles.value}>{formattedTaxes}</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryTotal}>
                <Text>TOTAL:</Text>
                <Text>{formattedTotal}</Text>
              </View>
              <Text style={styles.summaryNote}>SON: {totalInWords}</Text>
            </View>
          </View>

          {/* Signatures */}
          <View style={styles.signaturesSection}>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureTitle}>APROBADO POR</Text>
              <Text style={styles.signatureName}>{data.created_by.name}</Text>
              <View style={styles.signatureLine} />
            </View>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureTitle}>FIRMA Y SELLO DEL PROVEEDOR</Text>
              <Text style={styles.signatureName}>{data.partner.name}</Text>
              <View style={styles.signatureLine} />
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default DebitNotePDF;

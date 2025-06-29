import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

// Styles PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    borderBottomStyle: "solid",
    paddingVertical: 4,
  },
  cell: {
    flex: 1,
    paddingRight: 8,
  },
  image: {
    width: 50,
    height: 50,
  },
});

// Komponen PDF
const BarangReport = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>LAPORAN BARANG</Text>
      <View style={styles.tableRow}>
        <Text style={[styles.cell, { fontWeight: "bold" }]}>Nama</Text>
        <Text style={[styles.cell, { fontWeight: "bold" }]}>Merk</Text>
        <Text style={[styles.cell, { fontWeight: "bold" }]}>Foto</Text>
      </View>
      {data.map((item, idx) => (
        <View style={styles.tableRow} key={idx}>
          <Text style={styles.cell}>{item.nama || ""}</Text>
          <Text style={styles.cell}>{item.merk || ""}</Text>
          <View style={styles.cell}>
            {item.fotoBase64 ? (
              <Image src={item.fotoBase64} style={styles.image} />
            ) : (
              <Text>Tidak Ada Foto</Text>
            )}
          </View>
        </View>
      ))}
    </Page>
  </Document>
);

export default BarangReport;

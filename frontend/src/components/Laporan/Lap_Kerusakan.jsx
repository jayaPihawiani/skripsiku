import {
  Document,
  Page,
  PDFDownloadLink,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  header: {
    flexDirection: "row", // sejajar (logo kiri, judul kanan)
    alignItems: "center", // vertikal tengah
    justifyContent: "center", // biar konten di tengah halaman
    marginBottom: 4,
  },

  // logo: {
  //   // width: 50,
  //   height: 25,
  //   marginRight: 10,
  // },
  hr: {
    borderBottomWidth: 2, // tebal garis
    borderBottomColor: "#000", // warna garis
    marginVertical: 4, // jarak atas bawah
  },
  page: { padding: 20 },
  title: { fontSize: 14, textAlign: "center", marginBottom: 5 },
  table: { display: "table", width: "auto", marginTop: 10 },

  row: { flexDirection: "row" },

  // header cell
  colHeader: {
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 0, // kanan default 0, kecuali kolom terakhir
    padding: 4,
    fontSize: 10,
    backgroundColor: "#3c9ff0",
    textAlign: "center",
  },

  // isi cell
  col: {
    borderTopWidth: 0,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 0, // kolom terakhir kasih borderRight
    padding: 4,
    fontSize: 10,
  },

  // kolom terakhir  ada garis kanan
  lastColHeader: { borderRightWidth: 1 },
  lastCol: { borderRightWidth: 1 },

  // lebar tiap kolom
  colNo: { width: "5%", textAlign: "center" },
  colKode: { width: "18%" },
  colNama: { width: "15%" },
  colSebab: { width: "20%" },
  colStatus: { width: "22%" },
  colLokasi: { width: "20%" },
});

const LaporanKerusakan = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        {/* <Image src={"/intanlogo.png"} style={styles.logo} /> */}
        <Text style={styles.title}>
          {`Rincian Data Kerusakan Barang\nPT. AIR MINUM INTAN BANJAR`}
        </Text>
      </View>
      <View style={styles.hr} />
      <View style={styles.table}>
        {/* Header tabel */}
        <View style={styles.row}>
          <Text style={[styles.colHeader, styles.colNo]}>No</Text>
          <Text style={[styles.colHeader, styles.colKode]}>Kode Unit</Text>
          <Text style={[styles.colHeader, styles.colNama]}>Nama Barang</Text>
          <Text style={[styles.colHeader, styles.colSebab]}>
            Sebab Kerusakan
          </Text>
          <Text style={[styles.colHeader, styles.colStatus]}>Status</Text>
          <Text
            style={[styles.colHeader, styles.colLokasi, styles.lastColHeader]}
          >
            Lokasi
          </Text>
        </View>

        {data &&
          data.map((item, idx) => (
            <View style={styles.row} key={idx}>
              <Text style={[styles.col, styles.colNo]}>{idx + 1}</Text>
              <Text style={[styles.col, styles.colKode]}>
                {item.barang_unit?.kode_barang ?? "-"}
              </Text>
              <Text style={[styles.col, styles.colNama]}>
                {item.barang_unit?.barang?.name ?? "-"}
              </Text>
              <Text style={[styles.col, styles.colSebab]}>
                {item.sebab_kerusakan}
              </Text>
              <Text style={[styles.col, styles.colStatus]}>
                {item.status_perbaikan}
              </Text>
              <Text style={[styles.col, styles.colLokasi, styles.lastCol]}>
                {item.barang_unit?.loc_barang?.name ?? "-"}
              </Text>
            </View>
          ))}
      </View>
    </Page>
  </Document>
);

export const PDFButton = ({ document }) => {
  return (
    <PDFDownloadLink document={document} fileName="laporan-kerusakan.pdf">
      {({ loading }) =>
        loading ? (
          <button className="btn btn-secondary ms-1 mt-3">
            Menyiapkan PDF...
          </button>
        ) : (
          <button className="btn btn-primary ms-1 mt-3">Download PDF</button>
        )
      }
    </PDFDownloadLink>
  );
};

export default LaporanKerusakan;

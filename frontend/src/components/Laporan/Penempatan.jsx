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
  title: { fontSize: 14, textAlign: "center" },
  subtitle: {
    fontSize: 11,
    textAlign: "center",
    marginBottom: 5,
  },
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
  colKode: { width: "15%" },
  colNama: { width: "15%" },
  colAsal: { width: "16%" },
  coltujuan: { width: "13%" },
  colPenerima: { width: "13%" },
  colKet: { width: "10%" },
  colTgl: { width: "13%" },
});

const LaporanPenempatan = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>
        {`LAPORAN PENEMPATAN INVENTARIS BARANG\nPT. AIR MINUM INTAN BANJAR`}
      </Text>
      <Text style={styles.subtitle}>
        Jl. Pangeran Hidayatullah No.24, Loktabat Utara, Banjarbaru 70711
      </Text>
      <View style={styles.hr} />
      <View style={styles.table}>
        {/* Header tabel */}
        <View style={styles.row}>
          <Text style={[styles.colHeader, styles.colNo]}>No</Text>
          <Text style={[styles.colHeader, styles.colKode]}>Kode Unit</Text>
          <Text style={[styles.colHeader, styles.colNama]}>Nama Barang</Text>
          <Text style={[styles.colHeader, styles.colAsal]}>Asal Barang</Text>
          <Text style={[styles.colHeader, styles.coltujuan]}>Penempatan</Text>
          <Text style={[styles.colHeader, styles.colPenerima]}>Penerima</Text>
          <Text style={[styles.colHeader, styles.colKet]}>Keterangan</Text>
          <Text style={[styles.colHeader, styles.colTgl, styles.lastColHeader]}>
            Tanggal Penempatan
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
                {item.barang_unit.barang?.name ?? "-"}
              </Text>
              <Text style={[styles.col, styles.colAsal]}>
                {item.pindah_from?.name ?? "-"}
              </Text>
              <Text style={[styles.col, styles.coltujuan]}>
                {item.pindah_to?.name ?? ""}
              </Text>
              <Text style={[styles.col, styles.colPenerima]}>
                {item.user?.username ?? ""}
              </Text>
              <Text style={[styles.col, styles.colKet]}>
                {item?.desc ?? ""}
              </Text>
              <Text style={[styles.col, styles.colTgl]}>
                {item.tgl_pindah?.slice(0, 10) ?? ""}
              </Text>
            </View>
          ))}
      </View>
    </Page>
  </Document>
);

export const PDFButton = ({ document }) => {
  return (
    <PDFDownloadLink document={document} fileName="laporan-penempatan.pdf">
      {({ loading }) =>
        loading ? (
          <button className="btn btn-secondary ms-1">Menyiapkan PDF...</button>
        ) : (
          <button className="btn btn-primary ms-1">Download PDF</button>
        )
      }
    </PDFDownloadLink>
  );
};

export default LaporanPenempatan;

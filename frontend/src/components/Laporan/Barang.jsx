import {
  Document,
  Image,
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
  colKet: { width: "18%" },
  colNama: { width: "20%" },
  colJumlah: { width: "15%" },
  colTglBeli: { width: "17%" },
  colHarga: { width: "25%" },
});

const LaporanBarang = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>
        {`LAPORAN DATA INVENTARIS BARANG\nPT. AIR MINUM INTAN BANJAR`}
      </Text>
      <Text style={styles.subtitle}>
        Jl. Pangeran Hidayatullah No.24, Loktabat Utara, Banjarbaru 70711
      </Text>
      <View style={styles.hr} />
      <View style={styles.table}>
        {/* Header tabel */}
        <View style={styles.row}>
          <Text style={[styles.colHeader, styles.colNo]}>No</Text>
          <Text style={[styles.colHeader, styles.colNama]}>Nama Barang</Text>
          <Text style={[styles.colHeader, styles.colKet]}>Keterangan</Text>
          <Text style={[styles.colHeader, styles.colJumlah]}>Jumlah</Text>
          <Text style={[styles.colHeader, styles.colTglBeli]}>
            Tanggal Beli
          </Text>
          <Text style={[styles.colHeader, styles.colTglBeli]}>Merk</Text>
          <Text style={[styles.colHeader, styles.colTglBeli]}>Foto</Text>
          <Text
            style={[styles.colHeader, styles.colHarga, styles.lastColHeader]}
          >
            Harga / Unit
          </Text>
        </View>

        {data &&
          data.map((item, idx) => (
            <View style={styles.row} key={idx}>
              <Text style={[styles.col, styles.colNo]}>{idx + 1}</Text>
              <Text style={[styles.col, styles.colNama]}>
                {item?.name ?? "-"}
              </Text>
              <Text style={[styles.col, styles.colKet]}>
                {item?.desc ?? "-"}
              </Text>
              <Text style={[styles.col, styles.colJumlah]}>
                {item?.qty ?? ""}
              </Text>
              <Text style={[styles.col, styles.colTglBeli]}>
                {item?.tgl_beli.slice(0, 10) ?? ""}
              </Text>
              <Text style={[styles.col, styles.colTglBeli]}>
                {item.merk_brg?.name ?? ""}
              </Text>
              <Image
                style={[styles.col, styles.colTglBeli]}
                src={item?.url ?? ""}
              />
              <Text style={[styles.col, styles.colHarga, styles.lastCol]}>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(item?.harga ?? "-")}
              </Text>
            </View>
          ))}
      </View>
    </Page>
  </Document>
);

export const PDFButton = ({ document }) => {
  return (
    <PDFDownloadLink document={document} fileName="laporan-barang.pdf">
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

export default LaporanBarang;

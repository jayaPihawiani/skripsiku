import {
  Document,
  Page,
  PDFDownloadLink,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { formatTahunBulan } from "../kriteriaPengurangEstimasi";

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
  colNilBuku: { width: "13%" },
  colTgl: { width: "13%" },
  colKet: { width: "10%" },
  colStatus: { width: "13%" },
});

const LaporanPenghapusan = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>
        {`LAPORAN PENGHAPUSAN INVENTARIS BARANG\nPT. AIR MINUM INTAN BANJAR`}
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
          <Text style={[styles.colHeader, styles.colAsal]}>Asal Ruangan</Text>
          <Text style={[styles.colHeader, styles.colNilBuku]}>Nilai Buku</Text>
          <Text style={[styles.colHeader, styles.colTgl]}>
            Tanggal Penghapusan
          </Text>
          <Text style={[styles.colHeader, styles.colKet]}>
            Alasan Penghapusan
          </Text>
          <Text
            style={[styles.colHeader, styles.colStatus, styles.lastColHeader]}
          >
            Status
          </Text>
        </View>

        {data &&
          data.map((item, idx) => (
            <View style={styles.row} key={idx}>
              <Text style={[styles.col, styles.colNo]}>{idx + 1}</Text>
              <Text style={[styles.col, styles.colKode]}>
                {item?.kode_barang ?? "-"}
              </Text>
              <Text style={[styles.col, styles.colNama]}>
                {item.barang?.name ?? "-"}
              </Text>
              <Text style={[styles.col, styles.colAsal]}>
                {item.loc_barang?.name ?? "-"}
              </Text>
              <Text style={[styles.col, styles.colNilBuku]}>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(item.nilai_buku)}
              </Text>
              <Text style={[styles.col, styles.colTgl]}>
                {item.penghapusan?.tgl_hapus.slice(0, 10) ?? ""}
              </Text>
              <Text style={[styles.col, styles.colKet]}>
                {item.penghapusan?.desc ?? ""}
              </Text>
              <Text
                style={[styles.col, styles.colStatus, styles.lastColHeaders]}
              >
                {item.penghapusan?.status ?? ""}
              </Text>
            </View>
          ))}
      </View>
    </Page>
  </Document>
);

export const PDFButton = ({ document }) => {
  return (
    <PDFDownloadLink document={document} fileName="laporan-penghapusan.pdf">
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

export default LaporanPenghapusan;

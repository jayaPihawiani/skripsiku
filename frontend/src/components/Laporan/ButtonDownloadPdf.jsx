import { PDFDownloadLink } from "@react-pdf/renderer";
import BarangReport from "./Laporan";

const DownloadPdfBButton = ({ dataBarang }) => {
  return (
    <PDFDownloadLink
      document={<BarangReport data={dataBarang} />}
      fileName="laporan_barang.pdf"
      className="btn btn-primary"
    >
      {({ loading }) => (loading ? "Loading..." : "Cetak Laporan Inventaris")}
    </PDFDownloadLink>
  );
};

export default DownloadPdfBButton;

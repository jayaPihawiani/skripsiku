import cron from "node-cron";
import BarangUnitModel from "../models/BarangUnitModel.js";
import Kategori from "../models/KategoriModel.js";
import Barang from "../models/BarangModel.js";

// Cron: jalan tiap 2 hari sekali jam 08:00 pagi
// Format cron: "0 8 */2 * *"  → menit=0, jam=8, setiap 2 hari
cron.schedule("0 8 */2 * *", async () => {
  console.log("🔔 Cron job cek masa pakai barang...");

  try {
    const unitList = await BarangUnitModel.findAll({
      include: [
        {
          model: Kategori,
          as: "kategori_brg",
          attributes: ["masa_ekonomis"],
        },
        {
          model: Barang,
        },
      ],
    });

    const bulanPerTahun = 12;
    const now = new Date();

    for (const unit of unitList) {
      const masaEkonomis = unit.kategori_brg?.masa_ekonomis || 0;
      if (!unit.tanggal_perolehan || masaEkonomis === 0) continue;

      const tanggalPerolehan = new Date(unit.tanggal_perolehan);
      const totalBulan = masaEkonomis * bulanPerTahun;

      const umurBarangBulan =
        (now.getFullYear() - tanggalPerolehan.getFullYear()) * 12 +
        (now.getMonth() - tanggalPerolehan.getMonth());

      const sisaMasaPakai = totalBulan - umurBarangBulan;

      // Jika sisa masa pakai tinggal 1 bulan, buat notifikasi
      if (sisaMasaPakai === 1) {
        console.log(
          `Barang ${unit.barang.name} (ID: ${unit.id}) akan habis masa pakai dalam 1 bulan`
        );

        // TODO: Simpan notifikasi ke tabel Notifikasi
        // await Notifikasi.create({
        //   barangUnitId: unit.id,
        //   pesan: `Barang ${unit.nama_unit} akan masuk daftar penghapusan (sisa 1 bulan).`,
        //   status: "pending"
        // });
      }
    }
  } catch (error) {
    console.error("❌ Error saat menjalankan cron job:", error);
  }
});

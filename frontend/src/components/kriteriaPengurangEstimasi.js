export const riwayatPemeliharaan = [
  { jenis: "Baru Beli", deskripsi: "Pembelian unit masih baru.", bobot: 0 },
  {
    jenis: "Pemeliharaan Rutin",
    deskripsi: "Pengecekan dan pembersihan berkala sesuai jadwal",
    bobot: 0,
  },
  {
    jenis: "Perbaikan Kerusakan Ringan",
    deskripsi: "Perbaikan kecil tanpa penggantian komponen utama",
    bobot: 1,
  },
  {
    jenis: "Perbaikan Kerusakan Berat",
    deskripsi:
      "Kerusakan yang memerlukan servis besar atau penggantian komponen inti",
    bobot: 3,
  },
  {
    jenis: "Pembersihan Khusus Menyeluruh",
    deskripsi: "Pembersihan menyeluruh di luar perawatan harian",
    bobot: 0,
  },
  {
    jenis: "Upgrade / Penggantian Komponen",
    deskripsi:
      "Penggantian atau peningkatan performa alat tanpa menunggu rusak",
    bobot: 0,
  },
];

export const kondisiBarang = [
  {
    jenis: "BAIK",
    bobot: 1,
  },
  {
    jenis: "SEDANG",
    bobot: 2,
  },
  {
    jenis: "TIDAK LAYAK PAKAI",
    bobot: 3,
  },
];

export const penyebabKerusakan = [
  {
    id: 1,
    jenis: "Kesalahan Pengguna",
    deskripsi: [
      { id: 1, desc: "Penggunaan Berlebihan", pengurang: 10 },
      { id: 2, desc: "Salah Konfigurasi", pengurang: 10 },
      { id: 3, desc: "Barang Terjatuh", pengurang: 15 },
      { id: 4, desc: "Penggunaan tidak sesuai buku panduan", pengurang: 10 },
    ],
  },
  {
    id: 2,
    jenis: "Lingkungan Tidak Mendukung",
    deskripsi: [
      { id: 1, desc: "Ruangan terlalu panas/dingin", pengurang: 10 },
      { id: 2, desc: "Tempat Berdebu", pengurang: 10 },
      { id: 3, desc: "Paparan Sinar Matahari Langsung", pengurang: 15 },
    ],
  },
  {
    id: 3,
    jenis: "Kualitas Barang Kurang Baik",
    deskripsi: [
      { id: 1, desc: "Produk KW / imitasi", pengurang: 20 },
      { id: 2, desc: "Komponen internal murah", pengurang: 15 },
      { id: 3, desc: "Barang cacat bawaan dari awal", pengurang: 20 },
    ],
  },
  {
    id: 4,
    jenis: "Usia Pemakaian Terlalu Lama",
    deskripsi: [
      { id: 1, desc: "<5 Tahun", pengurang: 0 },
      { id: 2, desc: "<10 Tahun", pengurang: 10 },
      { id: 3, desc: ">10 Tahun", pengurang: 20 },
    ],
  },
  {
    id: 5,
    jenis: "Tidak Ada Pemeliharaan",
    deskripsi: [
      { id: 1, desc: "Tidak pernah dibersihkan", pengurang: 10 },
      { id: 2, desc: "Tidak pernah dicek rutin", pengurang: 15 },
      { id: 3, desc: "Tidak ada catatan perawatan", pengurang: 10 },
    ],
  },
  {
    id: 6,
    jenis: "Kesalahan Instalasi/Pemasangan",
    deskripsi: [
      { id: 1, desc: "Salah prosedur instalasi", pengurang: 15 },
      { id: 2, desc: "Pemasangan oleh bukan teknisi", pengurang: 20 },
      { id: 3, desc: "Tanpa uji coba setelah instalasi", pengurang: 10 },
    ],
  },
];

// format masa ekonomis
export function formatTahunBulan(masaEkonomis) {
  const tahun = Math.floor(masaEkonomis);
  const desimal = masaEkonomis - tahun;

  // Konversi desimal ke bulan
  const bulan = Math.round(desimal * 12);

  if (desimal === 0) {
    return `${tahun} tahun`;
  }

  return `${tahun} tahun ${bulan} bulan`;
}

// kondisi
export const kondisi = (key) => {
  switch (key) {
    case 1:
      return "BAIK";
    case 2:
      return "SEDANG";
    case 3:
      return "TIDAK LAYAK PAKAI";

    default:
      return "-";
  }
};

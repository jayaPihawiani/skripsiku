import BarangMasuk from "./BarangMasuk.js";
import Barang from "./BarangModel.js";
import BrgRusak from "./BarangRusakModel.js";
import Divisi from "./DivisiModel.js";
import Kategori from "./KategoriBarang.js";
import Lokasi from "./LokasiModel.js";
import MerkBrg from "./MerkModel.js";
import Pemindahan from "./Pemindahan.js";
import Penghapusan from "./PenghapusanModel.js";
import Permintaaan from "./Permintaan.js";
import SatuanBrg from "./SatuanModel.js";
import User from "./UserModels.js";

// user divisi
Divisi.hasMany(User, {
  foreignKey: "divisi",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
User.belongsTo(Divisi, {
  foreignKey: "divisi",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

// user permintaan
User.hasMany(Permintaaan, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Permintaaan.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// satuan
SatuanBrg.hasMany(Barang, {
  foreignKey: "satuan",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
Barang.belongsTo(SatuanBrg, {
  foreignKey: "satuan",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

// pemindahan
Lokasi.hasMany(Pemindahan, {
  foreignKey: "from",
  as: "pindah_from",
  onDelete: "SET NULL",
});
Lokasi.hasMany(Pemindahan, {
  foreignKey: "to",
  as: "pindah_to",
  onUpdate: "CASCADE",
});

Pemindahan.belongsTo(Lokasi, {
  foreignKey: "from",
  as: "pindah_from",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
Pemindahan.belongsTo(Lokasi, {
  foreignKey: "to",
  as: "pindah_to",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

Barang.hasMany(Pemindahan, {
  foreignKey: "barangId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Pemindahan.belongsTo(Barang, {
  foreignKey: "barangId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "nama_barang",
});

// kerusakan
Barang.hasMany(BrgRusak, {
  foreignKey: "barangId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
BrgRusak.belongsTo(Barang, {
  foreignKey: "barangId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// kateori
Kategori.hasMany(Barang, {
  foreignKey: "kategori",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
Barang.belongsTo(Kategori, {
  foreignKey: "kategori",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

// Merk
MerkBrg.hasMany(Barang, {
  foreignKey: "merk",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
Barang.belongsTo(MerkBrg, {
  foreignKey: "merk",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

// penghapusan
Barang.hasMany(Penghapusan, {
  foreignKey: "barangId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Penghapusan.belongsTo(Barang, {
  foreignKey: "barangId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
//

// Barang masuk
Barang.hasMany(BarangMasuk, {
  foreignKey: "barangId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
BarangMasuk.belongsTo(Barang, {
  foreignKey: "barangId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

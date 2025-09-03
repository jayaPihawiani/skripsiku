import Barang from "./BarangModel.js";
import BrgRusak from "./BarangRusakModel.js";
import BarangUnitModel from "./BarangUnitModel.js";
import Kategori from "./KategoriBarang.js";
import {
  DetailKerusakan,
  KategoriKerusakan,
} from "./KategoriKerusakanModel.js";
import Lokasi from "./LokasiModel.js";
import MerkBrg from "./MerkModel.js";
import Pemindahan from "./Pemindahan.js";
import Pengajuan from "./Pengajuan.js";
import Penghapusan from "./PenghapusanModel.js";
import Permintaan from "./Permintaan.js";
import User from "./UserModels.js";

// user lokasi
Lokasi.hasMany(User, {
  foreignKey: "lokasiId",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
User.belongsTo(Lokasi, {
  foreignKey: "lokasiId",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
  as: "loc_user",
});

// user pengajuan
User.hasMany(Pengajuan, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Pengajuan.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// user permintaan
User.hasMany(Permintaan, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Permintaan.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// barang permintaan
Barang.hasMany(Permintaan, {
  foreignKey: "barangId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Permintaan.belongsTo(Barang, {
  foreignKey: "barangId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// barang -> barang unit
Barang.hasMany(BarangUnitModel, {
  foreignKey: "barangId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
BarangUnitModel.belongsTo(Barang, {
  foreignKey: "barangId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// lokasi -> barang unit
Lokasi.hasMany(BarangUnitModel, {
  foreignKey: "lokasi_barang",
  onDelete: "SET NULL",
  as: "loc_barang",
});
BarangUnitModel.belongsTo(Lokasi, {
  foreignKey: "lokasi_barang",
  as: "loc_barang",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
Lokasi.hasMany(BarangUnitModel, {
  foreignKey: "lokasi_asal",
  onUpdate: "CASCADE",
  as: "loc_asal",
});
BarangUnitModel.belongsTo(Lokasi, {
  foreignKey: "lokasi_asal",
  as: "loc_asal",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

// detail kerusakan -> kategori kerusakan
KategoriKerusakan.hasMany(DetailKerusakan, {
  foreignKey: "kategoriKerusakanId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
DetailKerusakan.belongsTo(KategoriKerusakan, {
  foreignKey: "kategoriKerusakanId",
  onDelete: "CASCADE",
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

User.hasMany(Pemindahan, {
  foreignKey: "userId",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
Pemindahan.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

// barang unit -> pemindahan
BarangUnitModel.hasMany(Pemindahan, {
  foreignKey: "barangUnitId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Pemindahan.belongsTo(BarangUnitModel, {
  foreignKey: "barangUnitId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// barang unit -> kerusakan
BarangUnitModel.hasOne(BrgRusak, {
  foreignKey: "barangUnitId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
BrgRusak.belongsTo(BarangUnitModel, {
  foreignKey: "barangUnitId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// lokasi barang
Lokasi.hasMany(Barang, {
  foreignKey: "lokasi_barang",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
Barang.belongsTo(Lokasi, {
  foreignKey: "lokasi_barang",
  onDelete: "SET NULL",
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

Kategori.hasMany(BarangUnitModel, {
  foreignKey: "kategori",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
BarangUnitModel.belongsTo(Kategori, {
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
BarangUnitModel.hasOne(Penghapusan, {
  foreignKey: "barangUnitId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Penghapusan.belongsTo(BarangUnitModel, {
  foreignKey: "barangUnitId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
//

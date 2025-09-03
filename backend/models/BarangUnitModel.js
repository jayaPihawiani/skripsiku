import { DataTypes } from "sequelize";
import db from "../config/database/db.js";

const BarangUnitModel = db.define(
  "barang_unit",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    kode_barang: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    barangId: DataTypes.UUID,
    tgl_beli: DataTypes.DATE,
    harga: DataTypes.INTEGER,
    kondisi: DataTypes.STRING,
    riwayat_pemeliharaan: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    kategori: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    umur_ekonomis: DataTypes.DOUBLE,
    biaya_penyusutan: DataTypes.DOUBLE,
    penyusutan_berjalan: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    nilai_buku: {
      type: DataTypes.DOUBLE,
    },
    lokasi_barang: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    lokasi_asal: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    desc: DataTypes.STRING,
    sebab_kerusakan: DataTypes.STRING,
    status_perbaikan: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM(["rusak", "baik"]),
      defaultValue: "baik",
    },
    status_penghapusan: {
      type: DataTypes.ENUM(["null", "diusul", "disetujui", "ditolak"]),
      defaultValue: "null",
    },
  },
  { freezeTableName: true }
);

export default BarangUnitModel;

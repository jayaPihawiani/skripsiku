import { DataTypes } from "sequelize";
import db from "../config/database/db.js";

const Barang = db.define(
  "barang",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: DataTypes.STRING(50),
    desc: DataTypes.STRING,
    qty: DataTypes.INTEGER,
    tgl_beli: DataTypes.DATE,
    harga: DataTypes.INTEGER,
    kondisi: DataTypes.STRING(50),
    riwayat_pemeliharaan: DataTypes.STRING(50),
    penyebab_rsk: { type: DataTypes.STRING(50), allowNull: true },
    stts_perbaikan: { type: DataTypes.STRING(50), allowNull: true },
    tipe: { type: DataTypes.STRING(50), allowNull: true },
    satuan: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    merk: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    kategori: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    umur_ekonomis: DataTypes.DOUBLE,
    image: DataTypes.STRING,
    url: DataTypes.STRING,
  },
  { freezeTableName: true }
);

export default Barang;

import { DataTypes } from "sequelize";
import db from "../config/database/db.js";

const BarangMasuk = db.define(
  "barang_masuk",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    qty: DataTypes.INTEGER,
    desc: DataTypes.STRING,
    barangId: DataTypes.UUID,
    tgl_masuk: DataTypes.DATE,
    sisa_stok: DataTypes.INTEGER,
    umur_ekonomis: DataTypes.DOUBLE,
    biaya_penyusutan: DataTypes.DOUBLE,
    penyusutan_berjalan: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    nilai_buku: {
      type: DataTypes.DOUBLE,
    },
  },
  { freezeTableName: true }
);

export default BarangMasuk;

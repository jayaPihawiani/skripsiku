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
  },
  { freezeTableName: true }
);

export default BarangMasuk;

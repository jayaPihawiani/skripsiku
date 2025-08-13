import { DataTypes } from "sequelize";
import db from "../config/database/db.js";

const BrgRusak = db.define(
  "brg_rusak",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    desc: DataTypes.STRING,
    riwayat_pemeliharaan: DataTypes.DOUBLE,
    sebab_kerusakan: DataTypes.STRING,
    status_perbaikan: DataTypes.STRING,
    sisa_stok: DataTypes.INTEGER,
    barangUnitId: DataTypes.UUID,
  },
  { freezeTableName: true }
);

export default BrgRusak;

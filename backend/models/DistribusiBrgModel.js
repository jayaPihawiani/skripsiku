import { DataTypes } from "sequelize";
import db from "../config/database/db.js";

const Distribusi = db.define(
  "distribusi_barang",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    barangId: DataTypes.UUID,
    lokasiId: DataTypes.UUID,
    userId: DataTypes.UUID,
    qty: DataTypes.INTEGER,
  },
  { freezeTableName: true }
);

export default Distribusi;

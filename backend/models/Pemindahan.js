import { DataTypes } from "sequelize";
import db from "../config/database/db.js";

const Pemindahan = db.define(
  "pemindahan",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    desc: DataTypes.STRING,
    from: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    to: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    tgl_pindah: DataTypes.DATE,
    barangUnitId: DataTypes.UUID,
    userId: DataTypes.UUID,
  },
  { freezeTableName: true }
);

export default Pemindahan;

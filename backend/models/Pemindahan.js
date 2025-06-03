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
    qty: DataTypes.INTEGER,
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
  },
  { freezeTableName: true }
);

export default Pemindahan;

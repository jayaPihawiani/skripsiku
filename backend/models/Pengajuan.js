import { DataTypes } from "sequelize";
import db from "../config/database/db.js";

const Pengajuan = db.define(
  "pengajuan",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: DataTypes.STRING(50),
    desc: DataTypes.STRING,
    qty: DataTypes.INTEGER,
    file: DataTypes.STRING(50),
    url: DataTypes.STRING,
  },
  { freezeTableName: true }
);

export default Pengajuan;

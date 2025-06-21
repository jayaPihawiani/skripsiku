import { DataTypes } from "sequelize";
import db from "../config/database/db.js";

const Penghapusan = db.define(
  "penghapusan",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    desc: DataTypes.STRING,
    qty: DataTypes.INTEGER,
    tgl_hapus: DataTypes.DATE,
    file: DataTypes.STRING,
    url: DataTypes.STRING,
  },
  { freezeTableName: true }
);

export default Penghapusan;

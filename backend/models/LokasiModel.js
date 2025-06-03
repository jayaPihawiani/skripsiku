import { DataTypes } from "sequelize";
import db from "../config/database/db.js";

const Lokasi = db.define(
  "lokasi_unit",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: DataTypes.STRING(50),
    desc: DataTypes.STRING(50),
  },
  { freezeTableName: true }
);

export default Lokasi;

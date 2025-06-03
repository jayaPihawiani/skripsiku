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
    qty: DataTypes.INTEGER,
  },
  { freezeTableName: true }
);

export default BrgRusak;

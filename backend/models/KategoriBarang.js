import { DataTypes } from "sequelize";
import db from "../config/database/db.js";

const Kategori = db.define(
  "kategori_brg",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: DataTypes.STRING(50),
    desc: DataTypes.STRING,
  },
  { freezeTableName: true }
);

export default Kategori;

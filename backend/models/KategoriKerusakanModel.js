import { DataTypes } from "sequelize";
import db from "../config/database/db.js";

const KategoriKerusakan = db.define(
  "kategori_kerusakan",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    jenis: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

const DetailKerusakan = db.define(
  "detail_kerusakan",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    desc: DataTypes.STRING,
    pengurang: DataTypes.INTEGER,
    kategoriKerusakanId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  { freezeTableName: true }
);

export { KategoriKerusakan, DetailKerusakan };

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
    sisa_stok: DataTypes.INTEGER,
    kondisi: DataTypes.STRING,
    umur_ekonomis: DataTypes.DOUBLE,
    biaya_penyusutan: DataTypes.DOUBLE,
    penyusutan_berjalan: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    nilai_buku: {
      type: DataTypes.DOUBLE,
    },
    barangId: DataTypes.UUID,
    barangUnitId: DataTypes.UUID,
    userId: DataTypes.UUID,
  },
  { freezeTableName: true }
);

export default Pemindahan;

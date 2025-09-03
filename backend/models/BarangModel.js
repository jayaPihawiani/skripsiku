import { DataTypes } from "sequelize";
import db from "../config/database/db.js";

const Barang = db.define(
  "barang",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: DataTypes.STRING(50),
    desc: DataTypes.STRING,
    qty: DataTypes.INTEGER,
    tgl_beli: DataTypes.DATE,
    harga: DataTypes.INTEGER,
    kondisi: DataTypes.STRING,
    merk: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    kategori: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    umur_ekonomis: DataTypes.DOUBLE,
    biaya_penyusutan: DataTypes.DOUBLE,
    penyusutan_berjalan: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    nilai_buku: {
      type: DataTypes.DOUBLE,
    },
    lokasi_barang: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    image: DataTypes.STRING,
    url: DataTypes.STRING,
  },
  { freezeTableName: true }
);

export default Barang;

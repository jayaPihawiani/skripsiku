import { DataTypes } from "sequelize";
import db from "../config/database/db.js";

const SatuanBrg = db.define(
  "satuan_brg",
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

export default SatuanBrg;

import { DataTypes } from "sequelize";
import db from "../config/database/db.js";

const Permintaan = db.define(
  "permintaan",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    barangId: DataTypes.UUID,
    userId: DataTypes.UUID,
    qty: DataTypes.INTEGER,
    status: DataTypes.ENUM(["disetujui", "belum disetujui", "ditolak"]),
  },
  { freezeTableName: true }
);

export default Permintaan;

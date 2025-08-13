import { DataTypes } from "sequelize";
import db from "../config/database/db.js";

const User = db.define(
  "users",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nip: DataTypes.STRING(50),
    username: {
      type: DataTypes.STRING(50),
      unique: true,
    },
    password: DataTypes.STRING,
    lokasiId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    role: DataTypes.ENUM(["admin", "user"]),
  },
  { freezeTableName: true }
);

export default User;

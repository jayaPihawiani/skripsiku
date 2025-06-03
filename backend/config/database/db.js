import { Sequelize } from "sequelize";
import { config } from "dotenv";

config();

const db = new Sequelize({
  database: process.env.DB,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  dialect: "mysql",
  timezone: "+07:00",
});

export default db;

import SequelizeStore from "connect-session-sequelize";
import cors from "cors";
import { config } from "dotenv";
import express from "express";
import fileUpload from "express-fileupload";
import session from "express-session";
import db from "./config/database/db.js";
import "./models/associations.js";
import authRoute from "./routes/AuthRoute.js";
import barangRoute from "./routes/BarangRoute.js";
import brgRusakRoute from "./routes/BrgRusakRoute.js";
import divisiRoute from "./routes/DivisiRoute.js";
import kategoriRoute from "./routes/KategoriRoute.js";
import lokasiRoute from "./routes/LokasiRoute.js";
import merkRoute from "./routes/MerkRoute.js";
import pemindahanRoute from "./routes/PemindahanRoute.js";
import penghapusanRoute from "./routes/PenghapusanRoute.js";
import permintaanRoute from "./routes/PermintaanRoute.js";
import satuanRoute from "./routes/SatuanRoute.js";
import userRoute from "./routes/UserRoute.js";

config();

// DATABASE SYNC
(async () => {
  try {
    await db.authenticate();
    // await db.sync({ alter: true });
    console.log("Database connected...");
  } catch (error) {
    console.log("ERROR " + error.message);
  }
})();

const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({ db });

const port = process.env.PORT;

const app = express();

// SESSION SETUP
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    store,
    saveUninitialized: false,
    cookie: { secure: "auto", maxAge: 1000 * 60 * 60 * 8, httpOnly: true },
  })
);

app.use(cors({ origin: process.env.ORIGIN, credentials: true }));

app.use(express.json());
app.use(fileUpload());

// routes
app.use("/user", userRoute);
app.use("/divisi", divisiRoute);
app.use("/auth", authRoute);
app.use("/lokasi", lokasiRoute);
app.use("/merk", merkRoute);
app.use("/satuan", satuanRoute);
app.use("/barang", barangRoute);
app.use("/kategori", kategoriRoute);
app.use("/rusak", brgRusakRoute);
app.use("/pindah", pemindahanRoute);
app.use("/permintaan", permintaanRoute);
app.use("/penghapusan", penghapusanRoute);

// SESSION STORE SYNC
// store.sync();

// SERVER START
app.listen(port, () => console.log("Server running on port " + port));

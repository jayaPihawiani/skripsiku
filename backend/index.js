import SequelizeStore from "connect-session-sequelize";
import cors from "cors";
import { config } from "dotenv";
import express from "express";
import fileUpload from "express-fileupload";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import db from "./config/database/db.js";
import "./models/associations.js";
import Barang from "./models/BarangModel.js";
import BrgRusak from "./models/BarangRusakModel.js";
import authRoute from "./routes/AuthRoute.js";
import brgMasukRoute from "./routes/BarangMasukRoute.js";
import barangRoute from "./routes/BarangRoute.js";
import brgRusakRoute from "./routes/BrgRusakRoute.js";
import divisiRoute from "./routes/DivisiRoute.js";
import kategoriRoute from "./routes/KategoriRoute.js";
import laporanRouter from "./routes/LaporanRoute.js";
import lokasiRoute from "./routes/LokasiRoute.js";
import merkRoute from "./routes/MerkRoute.js";
import pemindahanRoute from "./routes/PemindahanRoute.js";
import penghapusanRoute from "./routes/PenghapusanRoute.js";
import permintaanRoute from "./routes/PermintaanRoute.js";
import satuanRoute from "./routes/SatuanRoute.js";
import userRoute from "./routes/UserRoute.js";

// direktori
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

app.set("view engine", "ejs");

app.get("/html", async (req, res) => {
  res.render("../views/kerusakan.ejs", {
    response: await BrgRusak.findAll({ include: { model: Barang } }),
    url: process.env.SERVER,
  });
});

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
app.use(express.static(path.join(__dirname, "public")));

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
app.use("/masuk", brgMasukRoute);

// print laporan
app.use("/print", laporanRouter);

// SESSION STORE SYNC
// store.sync();

// SERVER START
app.listen(port, () => console.log("Server running on port " + port));

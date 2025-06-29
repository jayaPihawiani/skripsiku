import axios from "axios";
import ejs from "ejs";
import puppeteer from "puppeteer";
import Barang from "../models/BarangModel.js";
import BrgRusak from "../models/BarangRusakModel.js";
import MerkBrg from "../models/MerkModel.js";
import Penghapusan from "../models/PenghapusanModel.js";

async function urlToBase64(url) {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const base64 = Buffer.from(response.data, "binary").toString("base64");
    const contentType = response.headers["content-type"];
    return `data:${contentType};base64,${base64}`;
  } catch (err) {
    console.error("Gagal konversi gambar:", err.message);
    return null;
  }
}

class LaporanController {
  url = process.env.SERVER;
  constructor({ model, path, fileName }) {
    this.model = model;
    this.path = path;
    this.fileName = fileName;
  }

  printLaporan = async (req, res) => {
    try {
      const response = await this.model();

      const html = await ejs.renderFile(`${this.path}`, {
        response,
        url: this.url,
      });
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      await page.setContent(html, {
        waitUntil: "domcontentloaded",
        timeout: 0,
      });

      const buffer = await page.pdf({
        format: "A4",
        printBackground: true,

        margin: {
          top: "2cm",
          bottom: "2cm",
          left: "2cm",
          right: "2cm",
        },
      });

      await browser.close();

      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=${this.fileName}`,
        "Content-Length": buffer.length,
      });

      res.send(buffer);
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };
}

export class LaporanBarang extends LaporanController {
  constructor() {
    super({});
  }

  printLaporan = async (req, res) => {
    try {
      const response = await Barang.findAll({ include: { model: MerkBrg } });

      // konversi gambar
      const withBase64 = await Promise.all(
        response.map(async (item) => {
          const fotoBase64 = item.url ? await urlToBase64(item.url) : null;

          return {
            ...item.toJSON(),
            fotoBase64,
          };
        })
      );

      const html = await ejs.renderFile(`./views/barang.ejs`, {
        response: withBase64,
        url: this.url,
      });
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      await page.setContent(html, {
        waitUntil: "domcontentloaded",
        timeout: 0,
      });

      const buffer = await page.pdf({
        format: "A4",
        printBackground: true,

        margin: {
          top: "2cm",
          bottom: "2cm",
          left: "2cm",
          right: "2cm",
        },
      });

      await browser.close();

      res.set({
        "Content-Type": "application/pdf",

        "Content-Disposition": `attachment; filename=barang.pdf`,
        "Content-Length": buffer.length,
      });

      res.send(buffer);
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };
}

export class LaporanKerusakan extends LaporanController {
  constructor() {
    super({
      model: async () => {
        return await BrgRusak.findAll({ include: { model: Barang } });
      },
      path: "./views/kerusakan.ejs",
      fileName: "kerusakan.pdf",
    });
  }
}

export class LaporanPenghapusan extends LaporanController {
  constructor() {
    super({
      model: async () => {
        return await Penghapusan.findAll({ include: { model: Barang } });
      },
      path: "./views/penghapusan.ejs",
      fileName: "penghapusan.pdf",
    });
  }
}

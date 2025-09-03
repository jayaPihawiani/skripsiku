import { Op } from "sequelize";
import BarangUnitModel from "../models/BarangUnitModel.js";
import Lokasi from "../models/LokasiModel.js";
import BaseService from "./BaseService.js";
import Pemindahan from "../models/Pemindahan.js";
import Barang from "../models/BarangModel.js";

class LokasiController extends BaseService {
  constructor() {
    super({
      model: Lokasi,
      isExistMsg: "Data lokasi sudah ada!",
      isEmptyMsg: "Data lokasi tidak ditemukan!",
      subName: "Lokasi",
    });
  }

  getService = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 0;
    const search = req.query.search || "";
    const offset = limit * page;
    let totalPage;

    try {
      const count = await this.model.count({
        where: {
          name: { [Op.like]: `%${search}%` },
        },
      });

      totalPage = Math.ceil(count / limit);
      const result = await this.model.findAll({
        where: {
          name: { [Op.like]: `%${search}%` },
        },
        include: {
          model: BarangUnitModel,
          as: "loc_barang",
          attributes: ["id", "kode_barang"],
          include: [{ model: Barang, attributes: ["name"] }],
        },
        limit,
        offset,
        order: [["createdAt", "ASC"]],
      });

      res.status(200).json({ page, limit, totalPage, count, result });
    } catch (error) {
      res.status(500).json({ msg: "ERROR " + error.message });
    }
  };
}

export default LokasiController;

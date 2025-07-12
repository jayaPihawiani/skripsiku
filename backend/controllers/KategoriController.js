import Kategori from "../models/KategoriBarang.js";
import BaseService from "./BaseService.js";

class KategoriController extends BaseService {
  constructor() {
    super({
      model: Kategori,
      isExistMsg: "Data kategori sudah ada!",
      isEmptyMsg: "Data kategori tidak ditemukan!",
      subName: "Kategori",
    });
  }

  createService = async (req, res) => {
    const { name, desc, masa_ekonomis } = req.body;

    if (!name || !desc || !masa_ekonomis) {
      return res
        .status(400)
        .json({ msg: "Data ada yang kosong! Harap isi semua data!" });
    }
    try {
      const checkData = await this.model.findOne({ where: { name } });
      if (checkData) {
        return res.status(400).json({ msg: this.isExistMsg });
      }

      await this.model.create({
        name,
        desc,
        masa_ekonomis: masa_ekonomis,
      });

      res.status(201).json({ msg: `Berhasil menambah data ${this.subName}.` });
    } catch (error) {
      res.status(500).json({ msg: "ERROR " + error.message });
    }
  };

  updateService = async (req, res) => {
    const { name, desc, masa_ekonomis } = req.body;

    if (!name || !desc || !masa_ekonomis) {
      return res
        .status(400)
        .json({ msg: "Data ada yang kosong! Harap isi semua data!" });
    }
    try {
      const checkData = await this.model.findByPk(req.params.id);

      if (!checkData) {
        return res.status(404).json({ msg: this.isEmptyMsg });
      }

      await this.model.update(
        { name, desc, masa_ekonomis },
        { where: { id: checkData.id } }
      );
      res
        .status(200)
        .json({ msg: `Berhasil mengupdate data ${this.subName}.` });
    } catch (error) {
      res.status(500).json({ msg: "ERROR " + error.message });
    }
  };
}

export default KategoriController;

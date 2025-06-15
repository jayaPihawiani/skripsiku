import { Op } from "sequelize";

class BaseService {
  constructor({ model, isExistMsg, isEmptyMsg, subName }) {
    this.model = model;
    this.isExistMsg = isExistMsg;
    this.isEmptyMsg = isEmptyMsg;
    this.subName = subName;
  }
  // ADD
  createService = async (req, res) => {
    const { name, desc } = req.body;

    if (!name || !desc) {
      return res
        .status(400)
        .json({ msg: "Data ada yang kosong! Harap isi semua data!" });
    }
    try {
      const checkData = await this.model.findOne({ where: { name } });
      if (checkData) {
        return res.status(400).json({ msg: this.isExistMsg });
      }

      await this.model.create({ name, desc });

      res.status(201).json({ msg: `Berhasil menambah data ${this.subName}.` });
    } catch (error) {
      res.status(500).json({ msg: "ERROR " + error.message });
    }
  };

  //   GET
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
        limit,
        offset,
        order: [["createdAt", "ASC"]],
      });
      res.status(200).json({ page, limit, totalPage, count, result });
    } catch (error) {
      res.status(500).json({ msg: "ERROR " + error.message });
    }
  };

  getAllService = async (req, res) => {
    try {
      const response = await this.model.findAll();
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ msg: "ERROR " + error.message });
    }
  };

  //   GET BY ID
  getServiceById = async (req, res) => {
    try {
      const checkData = await this.model.findByPk(req.params.id);
      if (!checkData) {
        return res.status(404).json({ msg: this.isEmptyMsg });
      }
      res.status(200).json(checkData);
    } catch (error) {
      res.status(500).json({ msg: "ERROR " + error.message });
    }
  };

  //   DELETE
  deleteService = async (req, res) => {
    try {
      const checkData = await this.model.findByPk(req.params.id);
      if (!checkData) {
        return res.status(404).json({ msg: this.isEmptyMsg });
      }

      await this.model.destroy({ where: { id: checkData.id } });

      res.status(200).json({ msg: `Berhasil menghapus data ${this.subName}.` });
    } catch (error) {
      res.status(500).json({ msg: "ERROR " + error.message });
    }
  };

  // UPDATE
  updateService = async (req, res) => {
    const { name, desc } = req.body;

    if (!name || !desc) {
      return res
        .status(400)
        .json({ msg: "Data ada yang kosong! Harap isi semua data!" });
    }
    try {
      const checkData = await this.model.findByPk(req.params.id);

      if (!checkData) {
        return res.status(404).json({ msg: this.isEmptyMsg });
      }

      await this.model.update({ name, desc }, { where: { id: checkData.id } });
      res
        .status(200)
        .json({ msg: `Berhasil mengupdate data ${this.subName}.` });
    } catch (error) {
      res.status(500).json({ msg: "ERROR " + error.message });
    }
  };
}

export default BaseService;

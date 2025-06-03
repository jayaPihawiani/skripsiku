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
    try {
      const checkData = await this.model.findAll({
        order: [["createdAt", "ASC"]],
      });
      res.status(200).json(checkData);
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

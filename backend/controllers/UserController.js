import User from "../models/UserModels.js";
import Divisi from "../models/DivisiModel.js";
import argon2 from "argon2";
import { Op } from "sequelize";

class UserController {
  // CREATE USER
  createUser = async (req, res) => {
    const { nip, username, password, divisi, role } = req.body;

    if (!nip || !username || !password || !role) {
      return res
        .status(400)
        .json({ msg: "Data ada yang kosong! Harap isi semua data!" });
    }

    try {
      const checkUser = await User.findOne({ where: { username } });

      //   kondisi
      if (checkUser) {
        return res.status(400).json({
          msg: "Username sudah ada, silahkan gunakan username yang lain!",
        });
      }
      if (password.length < 8) {
        return res.status(400).json({
          msg: "Password terlalu pendek! Password panjang minimal 8 karakter!",
        });
      }

      const hashedPassword = await argon2.hash(password);
      await User.create({
        nip,
        username,
        password: hashedPassword,
        divisi,
        role,
      });

      res.status(201).json({ msg: "Akun user berhasil dibuat." });
    } catch (error) {
      res.status(500).json({ msg: "ERROR " + error.message });
    }
  };

  //   GET USER
  getUser = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 0;
    const search = req.query.search || "";
    const offset = limit * page;
    let totalPage;
    try {
      const count = await User.count({
        where: {
          [Op.or]: [
            { username: { [Op.like]: `%${search}%` } },
            { nip: { [Op.like]: `%${search}%` } },
          ],
        },
      });

      totalPage = Math.ceil(count / limit);

      const user = await User.findAll({
        include: {
          model: Divisi,
          attributes: ["name", "desc"],
        },
        attributes: ["id", "nip", "username", "role", "createdAt", "updatedAt"],
        where: {
          [Op.or]: [
            { username: { [Op.like]: `%${search}%` } },
            { nip: { [Op.like]: `%${search}%` } },
          ],
        },
        limit,
        offset,
        order: [["createdAt", "ASC"]],
      });
      res.status(200).json({ limit, page, totalPage, count, user });
    } catch (error) {
      res.status(500).json({ msg: "ERROR " + error.message });
    }
  };

  // Delete user
  deleteUser = async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({ msg: "Data akun user tidak ditemukan!" });
      }

      await User.destroy({ where: { id: user.id } });

      res.status(200).json({ msg: "Berhasil menghapus akun user!" });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };
}

export default UserController;

import User from "../models/UserModels.js";

const verifyUser = async (req, res, next) => {
  if (!req.session.uid) {
    return res
      .status(401)
      .json({ msg: "ERROR: Sesi telah habis! Harap login kembali!" });
  }

  const user = await User.findByPk(req.session.uid);
  if (!user) {
    return res.status(404).json({ msg: "Akun tidak ditemukan!" });
  }

  req.uid = user.id;
  req.role = user.role;

  next();
};

const isAdmin = async (req, res, next) => {
  if (req.role !== "admin") {
    return res.status(403).json({ msg: "FORBIDDEN ACCESS" });
  }

  next();
};

export { verifyUser, isAdmin };

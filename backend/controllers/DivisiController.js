import Divisi from "../models/DivisiModel.js";
import BaseService from "./BaseService.js";

class DivisiController extends BaseService {
  constructor() {
    super({
      model: Divisi,
      isExistMsg: "Data divisi sudah ada!",
      isEmptyMsg: "Data divisi tidak ditemukan!",
      subName: "Divisi",
    });
  }
}

export default DivisiController;

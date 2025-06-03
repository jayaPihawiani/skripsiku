import MerkBrg from "../models/MerkModel.js";
import BaseService from "./BaseService.js";

class MerkController extends BaseService {
  constructor() {
    super({
      model: MerkBrg,
      isExistMsg: "Data merk sudah ada!",
      isEmptyMsg: "Data merk tidak ditemukan!",
      subName: "Merk",
    });
  }
}

export default MerkController;

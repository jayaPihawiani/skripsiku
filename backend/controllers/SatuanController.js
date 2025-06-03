import SatuanBrg from "../models/SatuanModel.js";
import BaseService from "./BaseService.js";

class SatuanController extends BaseService {
  constructor() {
    super({
      model: SatuanBrg,
      isExistMsg: "Data satuan sudah ada!",
      isEmptyMsg: "Data satuan tidak ditemukan!",
      subName: "Satuan",
    });
  }
}

export default SatuanController;

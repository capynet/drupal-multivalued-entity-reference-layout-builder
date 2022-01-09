import configFile from "../../config.json"
import { injectable } from "inversify";

@injectable()
class AppParams {
  private readonly configFile: {}

  constructor() {
    this.configFile = configFile
  }

  get(key) {
    return this.configFile[key]
  }
}

export default AppParams

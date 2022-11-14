import {ConsoleColors} from "../../utils/consoleColors";
import {Geometry} from "../geometry/geometry";
import {getColorKeyValue} from "../../utils/log";
import Architecture from "./architecture";

class Obj {
  architecture: Architecture;
  meta: string;
  id: string;
  idParent: string;
  name: string;
  kind: string;
  hierarchyLevel: number;
  geometry: Geometry;

  constructor(meta: string, architecture: Architecture) {
    this.architecture = architecture;
    this.meta = meta;
    this.id = meta['yamlId'];
    this.name = meta['name'];
    this.kind = meta['kind'];

    if (meta['kind'] == this.architecture.kinds[0]) {
      this.idParent = architecture.id;
      this.hierarchyLevel = 1;

    } else {
      this.idParent = meta['parentYamlId'];
      this.hierarchyLevel = this.architecture.getObjectById(this.idParent).hierarchyLevel + 1;
    }
  }

  public toSimpleString(): string {
    return `
  ${getColorKeyValue("{ id", this.id, ConsoleColors.red)}
  ${getColorKeyValue("  idParent", this.idParent, ConsoleColors.red)}
  ${getColorKeyValue("  kind", this.kind, ConsoleColors.magenta)}
  ${getColorKeyValue("  name", this.name, ConsoleColors.green)}
  ${getColorKeyValue("  hierarchyLevel", this.hierarchyLevel, ConsoleColors.blue)}
  ${getColorKeyValue("  geometry", this.geometry, ConsoleColors.white)}  }`;
  }
}

export {Obj}
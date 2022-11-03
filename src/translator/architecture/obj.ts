import {ConsoleColors} from "../../utils/consoleColors";
import {Geometry} from "../geometry/geometry";
import {getColorKeyValue} from "../../utils/log";

class Obj {
  id: string;
  idParent: string;
  name: string;
  kind: string;
  hierarchyLevel: number;
  geometry: Geometry;

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
import Architecture from "./architecture";
import {ConsoleColors} from "../../utils/consoleColors";
import {IYAMLElements} from "./iYAML";
import {Obj} from "./obj";
import {getDefaultColorKeyValue} from "../../utils/log";

class Layer extends Obj {
  architecture: Architecture;
  meta: IYAMLElements;
  layers: Layer[] = [];

  constructor(meta: IYAMLElements, architecture: Architecture) {
    super();
    this.architecture = architecture;
    this.meta = meta;
    this.id = meta.yamlId;
    this.name = meta.name;
    this.kind = meta.kind;

    if (meta.kind == this.architecture.kinds[0]) {
      this.idParent = architecture.id;
      this.hierarchyLevel = 1;

    } else {
      this.idParent = meta.parentYamlId;
      this.hierarchyLevel = this.architecture.getObjectById(this.idParent).hierarchyLevel + 1;
      (<Layer>this.architecture.getObjectById(this.idParent)).layers.push(this);
    }
  }

  public toString() {
    const offset = this.hierarchyLevel * 2;
    return `
${getDefaultColorKeyValue(offset, "{ id", this.id, ConsoleColors.red)}
${getDefaultColorKeyValue(offset, "  idParent", this.idParent, ConsoleColors.red)}
${getDefaultColorKeyValue(offset, "  kind", this.kind, ConsoleColors.magenta)}
${getDefaultColorKeyValue(offset, "  name", this.name, ConsoleColors.green)}
${getDefaultColorKeyValue(offset, "  hierarchyLevel", this.hierarchyLevel, ConsoleColors.magenta)}
${getDefaultColorKeyValue(offset, "  layer", `[${this.layers}]`, ConsoleColors.white)}`;
  }
}

export {Layer};
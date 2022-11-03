import settings from "../settings.json";
import { IYAMLRoot } from "./iYAML";
import { Layer } from "./layer";
import { Obj } from "./obj";

export default class Architecture {
  id = "THIS_DIAGRAM";
  layers: Layer[] = [];
  objects: Obj[] = [];
  kinds: string[] = [];
  private meta: IYAMLRoot;

  constructor(meta: IYAMLRoot) {
    this.meta = meta;
    this.setKinds();

    if (this.meta.elements) {
      this.addLayerObjects();
    }
  }

  private addLayerObjects() {
    for (let kind of this.kinds) {
      this.addLayer(kind);
    }
  }

  private setKinds(id?: string) {
    const elements = id
      ? this.meta.elements.filter(o => o.parentYamlId == id)
      : this.meta.elements.filter(o => !o.parentYamlId);

    for (let element of elements) {
      if (this.kinds.indexOf(element.kind) < 0) {
        this.kinds.push(element.kind);
      }

      this.setKinds(element.yamlId);
    }

    if (elements.length == 0) {
      return;
    }
  }


  private addLayer(kind: string) {
    const mLayerObjects = this.meta.elements.filter(o => o.kind == kind);

    if (!mLayerObjects) {
      return;
    }

    for (let mLayer of mLayerObjects) {
      const layer = new Layer(mLayer, this);
      this.layers.push(layer);
      this.objects.push(layer);
    }
  }


  public getObjectById(id: string): Obj {
    return this.objects.find((o) => o.id == id);
  }

  public getObjectByKind(): Map<string, Obj[]> {
    let map: Map<string, Obj[]> = new Map<string, Obj[]>();

    for (let obj of this.objects) {
      if (!map.get(obj.kind)) {
        map.set(obj.kind, [obj]);
      } else {
        map.get(obj.kind).push(obj);
      }
    }
    return map;
  }

  public getObjectsByLevel(): Map<number, Obj[]> {
    let map: Map<number, Obj[]> = new Map<number, Obj[]>();

    for (let obj of this.objects) {
      if (!map.get(obj.hierarchyLevel)) {
        map.set(obj.hierarchyLevel, [obj]);
      } else {
        map.get(obj.hierarchyLevel).push(obj);
      }
    }
    return map;
  }

  public getMaxHierarchyLevel() {
    return Math.max(...this.objects.map((o) => o.hierarchyLevel));
  }

  public getChildren(parent: Obj) {
    return this.objects.filter((o) => o.idParent == parent.id)
  }

  public getLayerChildren(parent: Obj) {
    return this.getChildren(parent).filter((o) =>
      this.kinds.some(e => e == o.kind)).sort(
      ((a, b) => b.geometry.layout.marginWidth - a.geometry.layout.marginWidth));
  }

  public getObjectsOnLevel(level: number) {
    return this.getObjectsByLevel().get(level);
  }

  public getKindStatistic() {
    let result = "";
    for (let entry of this.getObjectByKind().entries()) {
      result = `${result + entry[1].length} ${entry[0]}
`;
    }
    return result;
  }

  public getLevelStatistic() {
    let result = "";
    for (let entry of this.getObjectsByLevel().entries()) {
      result = `${result + entry[1].length} on ${entry[0]}th level
`;
    }
    return result;
  }

  public log() {
    if (settings.log_architecture) console.log(this.toString());
    if (settings.log_architecture_statistic) {
      console.log(this.getKindStatistic());
      console.log(this.getLevelStatistic());
    }
  }

  public toString() {
    return `
layer:[${this.layers.filter(o => o.kind == this.kinds[0])}]   
objects:[${this.objects.map((o: Obj) => o.toSimpleString()).reduce((a, b) => a + "," + b, "")}]`
  }
}

import { Obj } from "./obj";

export default class Architecture {
  id = "DIAGRAM";
  objects: Obj[] = [];
  kinds: string[] = [];
  meta: string;

  constructor(meta: string) {
    this.meta = JSON.parse(meta);
    this.setKinds();

    if (this.meta['elements']) {
      this.kinds.forEach((kind) => this.addObject(kind));
    }
  }

  private setKinds(id?: string) {
    const elements = id
      ? this.meta['elements'].filter((o) => o.idParent == id)
      : this.meta['elements'].filter((o) => !o.idParent);

    for (const element of elements) {
      if (this.kinds.indexOf(element.kind) < 0) {
        this.kinds.push(element.kind);
      }

      this.setKinds(element.id);
    }

    if (elements.length == 0) {
      return;
    }
  }

  private addObject(kind: string) {
    this.meta['elements']
      .filter((o) => o.kind == kind)
      .forEach((mObject) => this.objects.push(new Obj(mObject, this)));
  }


  public getObjectById(id: string): Obj {
    return this.objects.find((o) => o.id == id);
  }

  public getObjectsByKind(): Map<string, Obj[]> {
    const map: Map<string, Obj[]> = new Map<string, Obj[]>();

    for (const obj of this.objects) {
      if (!map.get(obj.kind)) {
        map.set(obj.kind, [obj]);
      } else {
        map.get(obj.kind).push(obj);
      }
    }
    return map;
  }

  public getObjectsByLevel(): Map<number, Obj[]> {
    const map: Map<number, Obj[]> = new Map<number, Obj[]>();

    for (const obj of this.objects) {
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
      this.kinds.some((e) => e == o.kind)).sort(
      ((a, b) => b.geometry.layout.marginWidth - a.geometry.layout.marginWidth));
  }

  public getKindStatistic() {
    return [...this.getObjectsByKind().entries()]
      .map((entry) => `${entry[1].length} ${entry[0]}\n`)
      .reduce((e1, e2) => e1 + e2)
  }

  public getLevelStatistic() {
    return [...this.getObjectsByKind().entries()]
      .map((entry) => `${entry[1].length} on ${entry[0]}th level\n`)
      .reduce((e1, e2) => e1 + e2)
  }

  public log() {
    if (this.meta['settings']['log_architecture']) console.log(this.toString());
    if (this.meta['settings']['log_architecture_statistic']) {
      console.log(this.getKindStatistic());
      console.log(this.getLevelStatistic());
    }
  }

  public toString() {
    return `
objects:[${this.objects.map((o: Obj) => o.toSimpleString()).reduce((a, b) => a + "," + b, "")}]`
  }
}

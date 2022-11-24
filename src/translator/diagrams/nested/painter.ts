import Architecture from "../../architecture/architecture";
import {Drawio} from "../../drawio/drawio";
import {Obj} from "../../architecture/obj";
import Architect from "./architect";

export default class Painter {
  private architecture: Architecture;

  private formatter: Drawio = new Drawio();
  private drawXML = '';

  constructor(architect: Architect) {
    this.architecture = architect.architecture;
  }

  public draw() {
    this.drawDiagram();
    this.drawLevelObjects(this.architecture.getMaxHierarchyLevel());

    return this.getWithHeader('Diagram-1').replace(
      '$ROOT', this.drawXML);
  }

  private drawLevelObjects(level: number) {
    if (level < 1) return;

    const objects = this.architecture.getObjectsByLevel().get(level).filter((o) => o.geometry);

    for (const obj of objects) {
      this.drawLayer(obj);
    }

    this.drawLevelObjects(--level);
  }

  private drawDiagram() {
    this.add('');
    this.add(this.formatter.getDiagram(this.getDiagramId()));
    this.add(this.formatter.getCanvas(this.getCanvasId(), this.getDiagramId()));
  }

  private drawLayer(obj: Obj) {
    if (!this.architecture.meta['settings']['geometry'][obj.kind]) {
      obj.geometry.layout.x = -2 * obj.geometry.layout.width;
      this.add(this.formatter.getElement(
        obj.id,
        this.getCanvasId(),
        obj.name,
        `${this.architecture.meta['settings']['geometry']['Default'].style}`,
        obj.geometry.layout));
      return;
    }

    if (obj.geometry.nameFormat) {
      this.add(this.formatter.getRelativeElement(
        obj.id,
        obj.idParent,
        getComponentValue(obj.name, getProperties()),
        getImage(
          `${obj.geometry.style}`,
          obj.meta[this.architecture.meta['settings']['type_field_name']]),
        obj.geometry.layout));
    } else {
      this.add(this.formatter.getRelativeElement(
        obj.id,
        obj.idParent,
        obj.name,
        this.architecture.meta['settings']['geometry'][obj.kind].style, obj.geometry.layout));
    }

    function getProperties() {
      const properties: string[][] = [];
      let i = 0;
      while (obj.geometry.nameFormat.properties[i + 1]) {
        const property = obj.geometry.nameFormat.properties[i + 1];
        properties.push(
          [
            property,
            obj.meta[property]
              ? typeof obj.meta[property] === 'number'
                ? (0 + obj.meta[property])
                  .toLocaleString()
                  .replace(',', ' ')
                  .replace(',', ' ')
                  .replace(',', ' ')
                : obj.meta[property]
              : ''
          ]
        )
        ++i;
      }
      return properties;
    }

    function getComponentValue(title: string, properties: string[][]) {
      let i = 0;
      let str = '<p style="margin: 6px 0 0 7px">' + title + '<br></p><hr>';
      while (properties[i]) {
        str = str +
          '<p style=" margin: 0 0 0 8px;">' +
          properties[i][0] + ': <b>' +
          properties[i][1] +
          '</b><br></p>';
        ++i;
      }
      return str;
    }

    function getImage(style: string, typeTechnology: string) {
      return style.replace(
        "$IMAGE",
        obj.architecture.meta['settings']['image'][typeTechnology ?? 'UNDEFINED']['url']);
    }
  }


  private add(element: string) {
    this.drawXML += element + '\n';
  }

  private getWithHeader(diagram_id: string) {
    return this.formatter.getHeader('app.diagrams.net', '',
      '', '-lJEG1eLUpV0zzp1f58H', 'false', '14.6.11',
      'device', diagram_id, 'Diagram', '2012', '1241',
      "1", "10", "1", "1", "1", "1", "1", "1",
      "1", "1169", "827", "0", "0");
  }

  private getDiagramId() {
    return `${this.getCanvasId()}-d`;
  }

  private getCanvasId() {
    return `${this.architecture.id}`;
  }

}

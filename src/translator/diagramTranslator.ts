import Architect from "./diagrams/nested/architect";
import Architecture from "./architecture/architecture";
import Painter from "./diagrams/nested/painter";

export class DiagramTranslator {
  public getDiagram(doc: string) {
    return new Painter(
      new Architect(
        new Architecture(doc))).draw();
  }
}


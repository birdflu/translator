import * as Meta from "./architecture/iYAML";
import * as yaml from "js-yaml";
import Architect from "./diagrams/nested/architect";
import Architecture from "./architecture/architecture";
import Painter from "./diagrams/nested/painter";

export class DiagramTranslator {
  public getDiagram(doc: string) {
    return new Painter(
      new Architect(
        new Architecture(
          <Meta.IYAMLRoot>yaml.load(doc)))).draw();
  }
}


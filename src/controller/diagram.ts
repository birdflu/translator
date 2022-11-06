import * as express from 'express';
import * as fs from "fs";
import { DiagramTranslator } from "../translator/diagramTranslator";
import { compress } from "../utils/compress";

export default class Diagram {
  public path = '/diagram';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(this.path, this.createAPost);
  }

  createAPost = (request: express.Request, response: express.Response) => {
    const result = new DiagramTranslator().getDiagram(request.body);
    const viewerUrl = 'https://viewer.diagrams.net/';
    const parameters = 'tags=%7B%7D&highlight=0000ff&edit=_blank&layers=1&nav=1&title=diagram';
    const url = `${viewerUrl}?${parameters}#R${encodeURIComponent(compress(result))}`;
    writeToFile('./data/diagram.xml', result);
    writeToFile('./data/url.txt', url);
    response.send(url);

    function writeToFile(path: string, data: any) {
      fs.writeFile(path, data, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("\nfile " + path + " is created");
        }
      });
    }
  }
}

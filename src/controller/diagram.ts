import * as express from 'express';
import {DiagramTranslator} from "../translator/diagramTranslator";

export enum DiagramType {NESTED}

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
    const translator = new DiagramTranslator();
    const result = translator.getDocument(request.body, DiagramType.NESTED);
    writeToFile('./data/diagram.xml', result);
    response.send("OK\n");

    function writeToFile(path: string, data: any) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const fs = require('fs');

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

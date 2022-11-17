import express from 'express';

class App {
  public app: express.Application;
  public port: number;

  constructor(controllers, port) {
    this.app = express();
    this.port = port;

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  private initializeMiddlewares() {
    const options = {
      inflate: true,
      limit: "32mb",
      type: "text/x-yaml"
    };
    this.app.use(express.raw(options));
  }

  private initializeControllers(controllers) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Translator listening on the port ${this.port}`);
    });
  }
}

export default App;
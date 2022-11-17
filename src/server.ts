
import App from './app';
import Diagram from './controller/diagram';

const app = new App(
  [
    new Diagram(),
  ],
  5000,
);

app.listen();
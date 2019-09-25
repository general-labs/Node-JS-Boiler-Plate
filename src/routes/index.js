import { default as config } from "../config";
import cors from 'cors';
import errorHandler from '../boot/error_handler';
import logHandler from '../boot/log_handler';
import slideshow from '../modules/sample/template';
import helloWorld from '../modules/hello';
import test from '../modules/test';

export function routes(app) {

  // cors
  const corsOptions = {
    allowedHeaders: ['X-Requested-With', 'Content-Type'],
    origin: '*',
  };

  app.use(cors(corsOptions));
  app.use(logHandler);

  // application routes
  app.get('/', (req, res) => res.send('Hello World!'), errorHandler);
  app.get(
    '/hello',
    (req, res) => res.send('Hello World!'),
    errorHandler,
  );

  app.all('/another_route', helloWorld, errorHandler);
  app.all('/test', test, errorHandler);
  app.all('/slideshow', slideshow, errorHandler);
}

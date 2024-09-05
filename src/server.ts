import express from 'express';
import { createYoga } from 'graphql-yoga';
import helmet from 'helmet';
import config from './config';
import { createContext } from './context';
import { schema } from './schema';

export default class Server {
  public server: express.Application;

  public graphQlRouter: express.Router;

  constructor() {
    this.server = express();
    this.graphQlRouter = express.Router();
  }

  async register() {
    const yoga = createYoga({
      graphqlEndpoint: '/graphql',
      schema,
      context: createContext,
    });

    this.graphQlRouter.use(yoga);
    this.graphQlRouter.use(helmet(config.helmet));

    this.server.use(yoga.graphqlEndpoint, this.graphQlRouter);
    this.server.use(helmet());
  }

  async start() {
    this.server.listen(config.port, () => {
      console.log(`running at http://localhost:${config.port}/graphql`);
    });
  }
}

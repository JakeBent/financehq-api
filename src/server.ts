import express from 'express';
import { createYoga } from 'graphql-yoga';

export default class Server {
  public server: express.Application;

  constructor() {
    this.server = express();
  }

  async register() {
    const yoga = createYoga({
      graphqlEndpoint: '/',
    });
    this.server.use(yoga.graphqlEndpoint, yoga);
  }

  async start() {
    this.server.listen(3000, () => {
      console.log('running at /graphql');
    });
  }
}

import express from 'express';
import { createYoga } from 'graphql-yoga';

const server = express();

const yoga = createYoga({
  graphqlEndpoint: '/',
});

server.use(yoga.graphqlEndpoint, yoga);

server.listen(3000, () => {
  console.log('running at /graphql');
});

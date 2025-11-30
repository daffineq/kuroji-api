import { readFileSync } from 'fs';
import { createSchema, createYoga } from 'graphql-yoga';
import { join } from 'path';
import { resolvers } from './resolvers';

const typeDefs = readFileSync(join(__dirname, 'schema.graphql'), 'utf-8');

const schema = createSchema({
  typeDefs,
  resolvers
});

export const yoga = createYoga({
  schema,
  graphqlEndpoint: '/graphql',
  landingPage: true,
  cors: {
    origin: '*',
    credentials: true
  }
});

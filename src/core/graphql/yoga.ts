import { readFileSync } from 'fs';
import { createSchema, createYoga } from 'graphql-yoga';
import { join } from 'path';
import { resolvers } from './resolvers';
import { createLoaders, type Loaders } from './loaders';

export interface GraphQLContext {
  loaders: Loaders;
}

const typeDefs = readFileSync(join(__dirname, 'schema.graphql'), 'utf-8');

const schema = createSchema<GraphQLContext>({
  typeDefs,
  resolvers
});

export const yoga = createYoga<GraphQLContext>({
  schema,
  graphqlEndpoint: '/graphql',
  landingPage: true,
  cors: {
    origin: '*',
    credentials: true
  },
  context: () => ({
    loaders: createLoaders()
  })
});

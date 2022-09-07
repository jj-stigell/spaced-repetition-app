/**
 * Join all the typedefs files to a single file
 * Make new executable schema from typedefs and resolvers
 */
import { join } from 'path';
import { readdirSync, readFileSync } from 'fs';
import { makeExecutableSchema } from '@graphql-tools/schema';

const gqlFiles = readdirSync(join(__dirname, './typedefs'));

let typeDefs = '';

gqlFiles.forEach((file) => {
  typeDefs += readFileSync(join(__dirname, './typedefs', file), {
    encoding: 'utf8',
  });
});

const schema = makeExecutableSchema({
  typeDefs,
  // resolvers pending...
});

export default schema;

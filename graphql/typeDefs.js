const { gql } = require("apollo-server-express");

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Subscription {
    newBlocks: String
  }
  type Query {
    hello: String
  }
`;

module.exports = typeDefs;

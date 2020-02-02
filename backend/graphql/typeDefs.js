const { gql } = require("apollo-server-express");

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }

  type Block {
    hash: String!
    height: Int!
    time: Int!
    nTx: Int!
    miner: String!
    rewards: Float!
  }

  type TxMeta {
    txid: String!
    blockhash: String!
    time: Int!
  }

  type Vin {
    vin_txid: String!
    txid: String!
    vin_n: Int!
  }

  type Vout {
    txid: String!
    val: Float!
    addr: String!
    vout_n: Int!
  }
`;

module.exports = typeDefs;

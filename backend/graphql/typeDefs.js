const { gql } = require("apollo-server-express");

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    latestBlocks(total: Int): [Block]
    getBlockByHash(hash: String!): Block
    getBlockByHeight(height: Int!): Block
    getTxByID(txid: String!): Tx
    getBlocksBetweenDate(from: Int!, to: Int!, offset: Int, limit: Int): [Block]
    getTxByBlockHash(hash: String!, offset: Int, limit: Int): [Tx]
    getWalletIncome(addr: String!): [Income]
    getVin(txid: String!, offset: Int, limit: Int): [Vin]
    getVout(txid: String!, offset: Int, limit: Int): [Vout]
    latestMonitorData: [Monitor]
  }

  type Block {
    hash: String!
    height: Int!
    time: Int!
    nTx: Int!
    miner: String!
    rewards: Float!
    transactions: [Tx]
  }

  type Income {
    time: Int!
    val: Float!
  }
 
  type Tx {
    txid: String!
    blockhash: String!
    time: Int!
    nVin: Int!
    nVout: Int!
    vin: [Vin]
    vout: [Vout]
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

  type Monitor {
    time: Int!
    gini_index: Float!
    max_hash_rate: Float!
  }
`;

module.exports = typeDefs;

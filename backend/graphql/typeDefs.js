const { gql } = require("apollo-server-express");

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    latestBlocks(total: Int): [Block]
    getBlockByHash(hash: String!): Block
    getBlockByHeight(height: Int!): Block
    getTxByID(txid: String!): Tx
    getTxByBlockHash(hash: String!, offset: Int, limit: Int): [TxMeta]
    getWalletIncome(addr: String!, offset: Int, limit: Int): [Income]
    getVin(txid: String!, offset: Int, limit: Int): [Vin]
    getVout(txid: String!, offset: Int, limit: Int): [Vout]
  }

  type Block {
    hash: String!
    height: Int!
    time: Int!
    nTx: Int!
    miner: String!
    rewards: Float!
    transactions: [TxMeta]
  }

  type TxMeta {
    txid: String!
    blockhash: String!
    time: Int!
  }

  type Income {
    time: Int!
    val: Float!
  }
 
  type Tx {
    txid: String!
    blockhash: String!
    time: Int!
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
`;

module.exports = typeDefs;

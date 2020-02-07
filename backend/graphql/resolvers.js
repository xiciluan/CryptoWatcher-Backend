const tx_meta = require('./mysql/accessors/tx_meta')
const block = require('./mysql/accessors/block')
const vin = require('./mysql/accessors/vin')
const vout = require('./mysql/accessors/vout')
const wallet = require('./mysql/accessors/wallet')

const LIMIT = 50;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    getBlockByHash: (_, { hash }) => block.getByHash(hash),
    getBlockByHeight: (_, { height }) => block.getByHeight(height),
    getTxByID: (_, { txid }) => tx_meta.getByID(txid),
    getTxByBlockHash: (_, {hash, offset, limit}) => (
      tx_meta.getByBlockHash(hash, offset ? offset : 0, limit ? limit : LIMIT)
    ),
    getWalletIncome: (_, {addr, offset, limit}) => (
      wallet.getIncome(addr, offset ? offset : 0, limit ? limit : LIMIT)
    ),
    getVin: (_, {txid, offset, limit}) => (
      vin.getByTxID(txid, offset ? offset : 0, limit ? limit : LIMIT)
    ),
    getVout: (_, {txid, offset, limit}) => (
      vout.getByTxID(txid, offset ? offset : 0, limit ? limit : LIMIT)
    ),
  },
  Block: {
    transactions: root => tx_meta.getByBlockHash(root.hash, 0, LIMIT),
  },
  Tx: {
    vin: root => vin.getByTxID(root.txid, 0, LIMIT),
    vout: root => vout.getByTxID(root.txid, 0, LIMIT),
  },
};

module.exports = resolvers;

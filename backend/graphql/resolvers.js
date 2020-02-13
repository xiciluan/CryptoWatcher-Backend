const tx_meta = require('./mysql/accessors/tx_meta')
const block = require('./mysql/accessors/block')
const vin = require('./mysql/accessors/vin')
const vout = require('./mysql/accessors/vout')
const wallet = require('./mysql/accessors/wallet')
const monitor = require('./mysql/accessors/monitor')

const LIMIT = 5;
const TOTAL = 5;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    latestBlocks: (_, { total }) => block.getLatest(total ? total : TOTAL),
    getBlockByHash: (_, { hash }) => block.getByHash(hash),
    getBlockByHeight: (_, { height }) => block.getByHeight(height),
    getBlocksBetweenDate: (_, {from, to, offset, limit}) => (
      block.getBetweenDate(from, to, offset ? offset : 0, limit ? limit : LIMIT)
    ),
    getTxByID: (_, { txid }) => tx_meta.getByID(txid),
    getTxByBlockHash: (_, {hash, offset, limit}) => (
      tx_meta.getByBlockHash(hash, offset ? offset : 0, limit ? limit : LIMIT)
    ),
    getWalletIncome: (_, {addr}) => (
      wallet.getIncome(addr)
    ),
    getVin: (_, {txid, offset, limit}) => (
      vin.getByTxID(txid, offset ? offset : 0, limit ? limit : LIMIT)
    ),
    getVout: (_, {txid, offset, limit}) => (
      vout.getByTxID(txid, offset ? offset : 0, limit ? limit : LIMIT)
    ),
    latestMonitorData: () => monitor.getMonitorData(),
  },
  Block: {
    transactions: root => tx_meta.getByBlockHash(root.hash, 0, LIMIT),
  },
  Tx: {
    nVin: root => vin.getCountByTxID(root.txid),
    nVout: root => vout.getCountByTxID(root.txid),
    vin: root => vin.getByTxID(root.txid, 0, LIMIT),
    vout: root => vout.getByTxID(root.txid, 0, LIMIT),
  },
};

module.exports = resolvers;

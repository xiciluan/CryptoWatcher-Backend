import { gql } from "apollo-boost";

export const LATEST_BLOCK_TIME = gql`
  query latest($total: Int) {
    latestBlocks(total: $total) {
      time
    }
  }
`

export const BLOCKS_BETWEEN_DATES = gql`
  query blocks($from: Int!, $to: Int!, $offset: Int, $limit: Int) {
    getBlocksBetweenDate(from: $from, to: $to, offset: $offset, limit: $limit) {
      hash
      height
      nTx
      miner
      time
    }
  }
`
export const BLOCK_BY_HASH = gql`
  query block_by_hash($hash: String!) {
    getBlockByHash(hash: $hash) {
      time
      nTx
      miner
      hash
      transactions {
        txid
        time
        nVin
        nVout
        vout {
          val
          addr
        }
      }
    }
  }
`

export const BLOCK_BY_HEIGHT = gql`
  query block_by_height($height: Int!) {
    getBlockByHeight(height: $height) {
      time
      nTx
      miner
      hash
      transactions {
        txid
        time
        nVin
        nVout
      }
    }
  }
`

export const TX_BY_HASH = gql`
  query txByHash($hash: String!, $offset: Int, $limit: Int) {
    getTxByBlockHash(hash: $hash, offset: $offset, limit: $limit) {
      txid
      time
      nVin
      nVout
    }
  }
`

export const TX_BY_ID = gql`
  query txByID($hash: String!, $offset: Int, $limit: Int) {
    getTxByID(hash: $hash, offset: $offset, limit: $limit) {
      txid
      time
    }
  }
`

export const INCOME = gql`
  query income($addr: String!) {
    getWalletIncome(addr: $addr) {
      time
      val
    }
  }
`

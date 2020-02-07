const knex = require('../mysqlClient')

const TABLE = 'btc_tx_meta'

module.exports = {
    getByID: async txid => {
        const rslt = await knex.select().from(TABLE).where('txid', txid)
            .timeout(10000, {cancel: true})
        if (rslt.length === 0) return null;
        return rslt[0]
    },
    getByBlockHash: async (hash, offset, limit) => {
        const rslt = await knex.select().from(TABLE).where('blockhash', hash)
            .offset(offset).limit(limit)
            .timeout(10000, {cancel: true})
        return rslt
    }
}
const knex = require('../mysqlClient')

const TABLE = 'btc_vout'

module.exports = {
    getByTxID: async (txid, offset, limit) => {
        const rslt = await knex.select().from(TABLE).where('txid', txid)
            .offset(offset).limit(limit)
            .timeout(10000, {cancel: true})
        return rslt
    }
}
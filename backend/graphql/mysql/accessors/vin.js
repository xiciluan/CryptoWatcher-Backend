const knex = require('../mysqlClient')

const TABLE = 'btc_vin'

module.exports = {
    getByTxID: async (txid, offset, limit) => {
        const rslt = await knex.select().from(TABLE).where('txid', txid)
            .offset(offset).limit(limit)
            .timeout(10000, {cancel: true})
        return rslt
    },
    getCountByTxID: async txid => {
        const rslt = await knex.count('vin_n').from(TABLE).where('txid', txid)
            .timeout(10000, {cancel: true})
        return Object.values(rslt[0])[0]
    }
}
const knex = require('../mysqlClient')

const VOUT_TABLE = 'btc_vout'
const META_TABLE = 'btc_tx_meta'

module.exports = {
    getIncome: async (addr) => {
        const rslt = await knex.select().from(VOUT_TABLE)
            .leftJoin(META_TABLE, VOUT_TABLE+'.txid', META_TABLE+'.txid')
            .where('addr', addr).timeout(10000, {cancel: true})
        return rslt
    }
}
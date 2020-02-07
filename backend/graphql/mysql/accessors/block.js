const knex = require('../mysqlClient')

const TABLE = 'btc_block'

module.exports = {
    getByHash: async hash => {
        const rslt = await knex.select().from(TABLE).where('hash', hash)
            .timeout(10000, {cancel: true})
        if (rslt.length === 0) return null;
        return rslt[0]
    },
    getByHeight: async height => {
        const rslt = await knex.select().from(TABLE).where('height', height)
            .timeout(10000, {cancel: true})
        if (rslt.length === 0) return null;
        return rslt[0]
    },
    getLatest: async total => {
        const rslt = await knex.select().from(TABLE).orderBy('height', 'desc')
            .limit(total).timeout(10000, {cancel: true})
        return rslt
    }
}
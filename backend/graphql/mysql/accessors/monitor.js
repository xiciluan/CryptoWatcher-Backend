const knex = require('../mysqlClient')

const TABLE = 'monitor_data'
const MAX_SIZE = 5

module.exports = {
    getMonitorData: async () => {
        const rslt = await knex.select().from(TABLE)
            .orderBy('time', 'desc').limit(MAX_SIZE)
            .timeout(10000, {cancel: true})
        
        return rslt
    }
}
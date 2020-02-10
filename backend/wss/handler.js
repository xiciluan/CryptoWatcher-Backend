const WebSocket = require('ws');
const consumerGroupBuilder = require('../kafka/consumerGroup')
const knex = require('../graphql/mysql/mysqlClient')

module.exports = server => {
  const wss = new WebSocket.Server({ server });

  const blockConsumerGroup = consumerGroupBuilder('btc_block')
  const TABLE = 'monitor_data'

  blockConsumerGroup.on("message", msg => {
    console.log(msg)
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        const payload = {
          ...msg,
          source: 'block'
        }
        client.send(JSON.stringify(payload));
      }
    })
  })

  setInterval(() => {
    knex
      .select()
      .table(TABLE)
      .orderBy('time', 'desc')
      .limit(1)
      .then(rows => {
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            const payload = {
              ...rows,
              source: 'monitor_data'
            }
            client.send(JSON.stringify(payload));
          }
        })
      })
  }, 10000)

}
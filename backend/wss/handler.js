const WebSocket = require('ws');
const consumerGroupBuilder = require('../kafka/consumerGroup')

const BATCH_WINDOW = 2000

module.exports = server => {
  const wss = new WebSocket.Server({ server });

  const blockConsumerGroup = consumerGroupBuilder('btc_block')

  blockConsumerGroup.on("message", msg => {
    console.log(msg)
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(msg));
      }
    })
  })

}
const WebSocket = require('ws');
const consumerGroupBuilder = require('../kafka/consumerGroup')

module.exports = server => {
  const wss = new WebSocket.Server({ server });

  const blockConsumerGroup = consumerGroupBuilder('btc_block')
  const metaConsumerGroup = consumerGroupBuilder('btc_meta')

  blockConsumerGroup.on("message", msg => {
    console.log(msg)
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    })
  })

  metaConsumerGroup.on("message", msg => {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    })
  })
}
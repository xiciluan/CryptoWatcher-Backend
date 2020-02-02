const { ConsumerGroup } = require('kafka-node')
const options = require('./options')

module.exports = topic => new ConsumerGroup(options, topic);

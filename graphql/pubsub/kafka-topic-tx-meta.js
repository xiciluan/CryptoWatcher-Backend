const { KafkaPubSub } = require("graphql-kafka-subscriptions");

module.exports = new KafkaPubSub({
  topic: "btc_tx_meta",
  host: "44.228.141.231:9092,34.223.63.157:9092,34.222.187.52:9092"
});

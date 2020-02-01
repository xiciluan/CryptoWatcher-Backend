const topicPubsub = require("./pubsub/kafka-topic-block");
const txMetaPubsub = require("./pubsub/kafka-topic-tx-meta");

const TOPIC_BLOCK = "BLOCK";
const TOPIC_TX_META = "TX_META";

// Provide resolver functions for your schema fields
const resolvers = {
  Subscription: {
    newBlocks: {
      subscribe: () => topicPubsub.asyncIterator(TOPIC_BLOCK)
    }
  },
  Query: {
    hello: () => "Hello world!"
  }
};

module.exports = resolvers;

module.exports = {
  kafkaHost: '10.0.0.48:9092,10.0.0.15:9092,10.0.0.128:9092', // connect directly to kafka broker (instantiates a KafkaClient)
  groupId: 'Z0wEuoPaR9mD_yUnGGm7Hw',
  sessionTimeout: 15000,
  protocol: ['roundrobin'],
  fromOffset: 'latest', // default
  commitOffsetsOnFirstJoin: true, // on the very first time this consumer group subscribes to a topic, record the offset returned in fromOffset (latest/earliest)
};
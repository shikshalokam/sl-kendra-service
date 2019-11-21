//dependencies
const kafka = require('kafka-node');

var connect = function (config) {

  Producer = kafka.Producer
  KeyedMessage = kafka.KeyedMessage
  client = new kafka.KafkaClient({
    kafkaHost: config.host
  })

  client.on('error', function (error) {
    debugLogger.error("kafka connection error!");
  });

  producer = new Producer(client)

  producer.on('ready', function () {
    debugLogger.info('Connected to Kafka');
  });

  producer.on('error', function (err) {
    debugLogger.error("kafka producer creation error!");
  })

  // Consumer = kafka.Consumer;
  sendToKafkaConsumers(config.topics["notificationsTopic"], true);
  sendToKafkaConsumers(config.topics["languagesTopic"], true);
  sendToKafkaConsumers(config.topics["emailTopic"], false);

  return {
    kafkaProducer: producer,
    kafkaConsumer: kafka.Consumer,
    kafkaClient: client,
    kafkaKeyedMessage: KeyedMessage
  };

};

var sendToKafkaConsumers = function (topic, commit = false) {

  let Consumer = kafka.Consumer;

  if (topic && topic != "") {

    let consumer = new Consumer(
      client,
      [
        { topic: topic, offset: 0, partition: 0 }
      ],
      {
        autoCommit: commit
      }
    );

    consumer.on('message', async function (message) {

      if (topic === process.env.LANGUAGE_TOPIC) {
        languagesConsumer.messageReceived(message)
      } else if (topic === process.env.EMAIL_TOPIC) {
        emailConsumer.messageReceived(message, consumer)
      } else {
        notificationsConsumer.messageReceived(message)
      }
    });

    consumer.on('error', async function (error) {

      if (topic === process.env.LANGUAGE_TOPIC) {
        languagesConsumer.errorTriggered(error);
      } else if (topic === process.env.EMAIL_TOPIC) {
        emailConsumer.errorTriggered(message, consumer)
      }
      else {
        notificationsConsumer.errorTriggered(error);
      }
    });

  }
};

module.exports = connect;

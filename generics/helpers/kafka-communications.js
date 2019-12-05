const kafkaCommunicationsOnOff = (!process.env.KAFKA_COMMUNICATIONS_ON_OFF || process.env.KAFKA_COMMUNICATIONS_ON_OFF != "OFF") ? "ON" : "OFF";
const notificationsKafkaTopic = (process.env.NOTIFICATIONS_TOPIC && process.env.NOTIFICATIONS_TOPIC != "OFF") ? process.env.NOTIFICATIONS_TOPIC : "sl-notifications-dev";
const languagesTopic = (process.env.LANGUAGE_TOPIC && process.env.LANGUAGE_TOPIC != "OFF") ? process.env.LANGUAGE_TOPIC : "sl-languages-dev";
const emailTopic = (process.env.EMAIL_TOPIC && process.env.EMAIL_TOPIC != "OFF") ? process.env.EMAIL_TOPIC : "sl-email-dev";

const pushNotificationsDataToKafka = function (message) {
  return new Promise(async (resolve, reject) => {
    try {

      let kafkaPushStatus = await pushMessageToKafka([{
        topic: notificationsKafkaTopic,
        messages: JSON.stringify(message)
      }])

      return resolve(kafkaPushStatus)

    } catch (error) {
      return reject(error);
    }
  })
}

const pushLanguagesToKafka = function (language) {
  return new Promise(async (resolve, reject) => {
    try {

      let kafkaPushStatus = await pushMessageToKafka([{
        topic: languagesTopic,
        messages: JSON.stringify(language)
      }])

      return resolve(kafkaPushStatus)

    } catch (error) {
      return reject(error);
    }
  })
}

const pushEmailToKafka = function (email) {
  return new Promise(async (resolve, reject) => {
    try {

      let kafkaPushStatus = await pushMessageToKafka([{
        topic: emailTopic,
        messages: JSON.stringify(email)
      }])

      return resolve(kafkaPushStatus)

    } catch (error) {
      return reject(error);
    }
  })
}

const pushMessageToKafka = function (payload) {
  return new Promise((resolve, reject) => {

    if (kafkaCommunicationsOnOff != "ON") {
      throw reject("Kafka configuration is not done")
    }

    kafkaConnectionObject.kafkaProducer.send(payload, (err, data) => {
      if (err) {
        return reject("Kafka push to topic " + payload[0].topic + " failed.")
      } else {
        debugLogger.info("Pushed to kafka");
        return resolve(data)
      }
    })

  }).then(result => {

    if (result[payload[0].topic][0] > 0) {
      return {
        status: "success",
        message: "Kafka push to topic " + payload[0].topic + " successful with number - " + result[payload[0].topic][0]
      }
    }

  }).catch((err) => {
    return {
      status: "failed",
      message: err
    }
  })
}

module.exports = {
  pushNotificationsDataToKafka: pushNotificationsDataToKafka,
  pushLanguagesToKafka: pushLanguagesToKafka,
  pushEmailToKafka: pushEmailToKafka
};


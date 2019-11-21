//dependencies
const { Client } = require('@elastic/elasticsearch');
let slackClient = require("../generics/helpers/slack-communications");

var connect = function (config) {

  const elasticSearchClient = new Client({
    node: config.host,
    maxRetries: 5,
    requestTimeout: 60000,
    sniffOnStart: true
  })

  elasticSearchClient.ping({
  }, function (error) {
    if (error) {
      debugLogger.error(error);

      let errorData = {
        slackErrorName: "sl-kendra-service",
        color: "#ed2f21",
        host: config.host,
        message: 'Elasticsearch cluster is down!'
      }

      slackClient.sendErrorMessageToSlack(errorData);
      // slackClient.elasticSearchErrorAlert(errorData);
      debugLogger.error('Elasticsearch cluster is down!');
    } else {
      debugLogger.info('Elasticsearch connection established.');
    }
  });

  return {
    client: elasticSearchClient
  };

};

module.exports = connect;

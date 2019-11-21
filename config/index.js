/**
 * Project          : Shikshalokam-Kendra
 * Module           : Configuration
 * Source filename  : index.js
 * Description      : Environment related configuration variables
 */

let db_connect = function (configData) {
  global.database = require("./db-config")(
    configData.db.connection.mongodb
  );
  global.ObjectId = database.ObjectId;
  global.Abstract = require("../generics/abstract");
};

let kafka_connect = function (configData) {
  global.kafkaConnectionObject = require("./kafka-config")(
    configData.Kafka_Config
  );
};


let elasticsearch_connect = function (configData) {
  global.elasticsearch = require("./elastic-search-config")(
    configData.Elasticsearch_Config
  );
};


let smtp_connect = function (smtpConfigdata) {
  global.smtpServer = require("./smtp-config")(
    smtpConfigdata
  );
};

const configuration = {
  root: require("path").normalize(__dirname + "/.."),
  app: {
    name: "sl-kendra"
  },
  host: process.env.HOST || "http://localhost",
  port: process.env.PORT || 4401,
  log: process.env.LOG || "debug",
  db: {
    connection: {
      mongodb: {
        host: process.env.MONGODB_URL || "mongodb://localhost:27017",
        user: "",
        pass: "",
        database: process.env.DB || "sl-assessment",
        options: {
          useNewUrlParser: true
        }
      }
    },
    plugins: {
      timestamps: true,
      elasticSearch: false,
      softDelete: true,
      autoPopulate: false,
      timestamps_fields: {
        createdAt: "createdAt",
        updatedAt: "updatedAt"
      }
    }
  },
  Kafka_Config: {
    host: process.env.KAFKA_URL,
    topics: {
      notificationsTopic: process.env.NOTIFICATIONS_TOPIC || "sl-notifications-dev",
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
      languagesTopic: process.env.LANGUAGE_TOPIC || "sl-languages-dev",
      emailTopic: process.env.EMAIL_TOPIC || "sl-email-dev"
=======
      languagesTopic: process.env.LANGUAGE_TOPIC || "sl-languages-dev"
>>>>>>> 3c64cb988648e1b78e7b0073174dbc39b2585717
=======
      languagesTopic: process.env.LANGUAGE_TOPIC || "sl-languages-dev"
>>>>>>> 3c64cb988648e1b78e7b0073174dbc39b2585717
=======
      languagesTopic: process.env.LANGUAGE_TOPIC || "sl-languages-dev"
>>>>>>> 3c64cb988648e1b78e7b0073174dbc39b2585717
    }
  },
  Elasticsearch_Config: {
    host: process.env.ELASTICSEARCH_HOST_URL || "http://10.160.0.3:9092"
  },
  SMTP_Config: {
    host: process.env.SMTP_SERVICE_HOST,
    port: process.env.SMTP_SERVICE_PORT,
    secure: process.env.SMTP_SERVICE_SECURE,
    user: process.env.SMTP_USER_NAME,
    password: process.env.SMTP_USER_PASSWORD,
  },
  version: "1.0.0",
  URLPrefix: "/api/v1",
  webUrl: "https://dev.shikshalokam.org"
};

db_connect(configuration);

kafka_connect(configuration);

elasticsearch_connect(configuration);

smtp_connect(configuration.SMTP_Config)

module.exports = configuration;

let authenticator = require(ROOT_PATH + "/generics/middleware/authenticator");
let slackClient = require(ROOT_PATH + "/generics/helpers/slack-communications");
let pagination = require(ROOT_PATH + "/generics/middleware/pagination");
const fs = require("fs");
const inputValidator = require(ROOT_PATH + "/generics/middleware/validator");
const setLanguage = require(ROOT_PATH + "/generics/middleware/set-language");
const listOfLanguages = require(ROOT_PATH + "/generics/languages");

module.exports = function (app) {

  const applicationBaseUrl = process.env.APPLICATION_BASE_URL || "/kendra/"

  if (process.env.NODE_ENV !== "testing") {
    app.use(applicationBaseUrl, authenticator);
  }

  app.use(applicationBaseUrl, pagination);
  app.use(applicationBaseUrl, setLanguage);

  var router = async function (req, res, next) {

    if (req.translationLanguage) {
      req.i18n.changeLanguage(listOfLanguages[req.translationLanguage]);
    }

    if (!req.params.version) next();
    else if (!controllers[req.params.version]) next();
    else if (!controllers[req.params.version][req.params.controller]) next();
    else if (!(controllers[req.params.version][req.params.controller][req.params.method] || controllers[req.params.version][req.params.controller][req.params.file][req.params.method])) next();
    else if (req.params.method.startsWith("_")) next();
    else {

      try {

        let validationError = req.validationErrors();

        if (validationError.length)
          throw { status: 400, message: validationError }

        let result

        if (req.params.file) {
          result = await controllers[req.params.version][req.params.controller][req.params.file][req.params.method](req);
        } else {
          result = await controllers[req.params.version][req.params.controller][req.params.method](req);
        }


        if (result.isResponseAStream == true) {
          // Check if file specified by the filePath exists 
          fs.exists(result.fileNameWithPath, function (exists) {

            if (exists) {

              res.setHeader('Content-disposition', 'attachment; filename=' + result.fileNameWithPath.split('/').pop());
              res.set('Content-Type', 'application/octet-stream');
              fs.createReadStream(result.fileNameWithPath).pipe(res);

            } else {

              throw {
                status: 500,
                message: "Oops! Something went wrong!"
              };

            }

          });

        } else {
          res.status(result.status ? result.status : 200).json({
            message: result.message,
            status: result.status ? result.status : 200,
            result: result.data,
            result: result.result,
            additionalDetails: result.additionalDetails,
            pagination: result.pagination,
            totalCount: result.totalCount,
            total: result.total,
            count: result.count,
            failed: result.failed
          });
        }

        debugLogger.info("Response:", result);
      }
      catch (error) {
        res.status(error.status ? error.status : 400).json({
          status: error.status ? error.status : 400,
          message: error.message
        });

        let customFields = {
          appDetails: '',
          userDetails: "NON_LOGGED_IN_USER"
        }

        if (req.userDetails) {
          customFields = {
            appDetails: req.headers["user-agent"],
            userDetails: req.userDetails.firstName + " - " + req.userDetails.lastName + " - " + req.userDetails.email
          }
        }

        const toLogObject = {
          slackErrorName: "sl-kendra-service",
          color: "#ed2f21",
          method: req.method,
          url: req.url,
          body: req.body && !_.isEmpty(req.body) ? req.body : "not provided",
          errorMsg: "not provided",
          errorStack: "not provided"
        }

        if (error.message) {
          toLogObject["errorMsg"] = JSON.stringify(error.message);
        } else if (error.errorObject) {
          toLogObject["errorMsg"] = error.errorObject.message;
          toLogObject["errorStack"] = error.errorObject.stack;
        }

        slackClient.sendErrorMessageToSlack(_.merge(toLogObject, customFields));

        debugLogger.error("Error Response:", error);
      };
    }
  };

  app.all(applicationBaseUrl + "api/:version/:controller/:method", inputValidator, router);

  app.all(applicationBaseUrl + "api/:version/:controller/:file/:method", inputValidator, router);

  app.all(applicationBaseUrl + "api/:version/:controller/:method/:_id", inputValidator, router);
  app.all(applicationBaseUrl + "api/:version/:controller/:file/:method/:_id", inputValidator, router);


  app.use((req, res, next) => {
    res.status(404).send("Not found!");
  });
};


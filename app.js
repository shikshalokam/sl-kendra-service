require("dotenv").config();
//config and routes
global.config = require("./config");
require("./config/globals")();
require("./generics/scheduler");
require("./logger")();

let router = require("./routes");

//express
const express = require("express");
let app = express();

//required modules
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const cors = require("cors");
var fs = require("fs");
var path = require("path");
var expressValidator = require('express-validator');

//To enable cors
app.use(cors());
app.use(expressValidator())


//health check
app.get("/ping", (req, res) => {
  res.send("pong!");
});

app.use(fileUpload());
app.use(bodyParser.json({ limit: '50MB' }));
app.use(bodyParser.urlencoded({ limit: '50MB', extended: false }));
app.use(express.static("public"));

fs.existsSync("logs") || fs.mkdirSync("logs");

const serviceBaseUrl = process.env.APPLICATION_BASE_URL || "/assessment/";

const observationSubmissionsHtmlPath = process.env.OBSERVATION_SUBMISSIONS_HTML_PATH ? process.env.OBSERVATION_SUBMISSIONS_HTML_PATH : "observationSubmissions"
app.use(express.static(observationSubmissionsHtmlPath));
app.get(serviceBaseUrl + observationSubmissionsHtmlPath + "/*", (req, res) => {
  let urlArray = req.path.split("/")
  urlArray.splice(0, 3)
  res.sendFile(path.join(__dirname, "/public/" + observationSubmissionsHtmlPath + "/" + urlArray.join("/")));
});

//API documentation (apidoc)
if (process.env.NODE_ENV == "development" || process.env.NODE_ENV == "local") {
  app.use(express.static("apidoc"));
  if (process.env.NODE_ENV == "local") {
    app.get("/apidoc", (req, res) => {
      res.sendFile(path.join(__dirname, "/public/apidoc/index.html"));
    });
  } else {
    app.get(serviceBaseUrl + "apidoc/*", (req, res) => {
      let urlArray = req.path.split("/")
      urlArray.splice(0, 3)
      res.sendFile(path.join(__dirname, "/public/apidoc/" + urlArray.join("/")));
    });
  }
}


app.get(serviceBaseUrl + "web2/*", function (req, res) {
  res.sendFile(path.join(__dirname, "/public" + serviceBaseUrl + "web2/index.html"));
});


// i18next implementation
var i18next = require("i18next");
var i18NextMiddleware = require("i18next-express-middleware");
let nodeFsBackend = require('i18next-node-fs-backend');

i18next.use(nodeFsBackend).init({
  fallbackLng: global.locales[0],
  lowerCaseLng: true,
  preload: global.locales,
  backend: {
    loadPath: __dirname + '/locales/{{lng}}.json',
  },
  saveMissing: true
});


app.use(
  i18NextMiddleware.handle(i18next, {
    removeLngFromUrl: false
  })
);

// End of i18Next

app.all("*", (req, res, next) => {
  // if (ENABLE_BUNYAN_LOGGING === "ON") {


  debugLogger.info("Requests:", {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body
  })

  next();
});

//add routing
router(app);

//listen to given port
app.listen(config.port, () => {

  debugLogger.info("Environment: " +
    (process.env.NODE_ENV ? process.env.NODE_ENV : "development"));

  debugLogger.info("Application is running on the port:" + config.port);

});

module.exports = app;

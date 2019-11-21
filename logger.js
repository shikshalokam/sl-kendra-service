var bunyan = require("bunyan"),
    bunyanFormat = require('bunyan-format'),
    formatOut = bunyanFormat({ outputMode: 'short' });

var path = require("path");

module.exports = function () {

    global.debugLogger = bunyan.createLogger({
        name: 'information',
        level: "debug",
        streams: [{
            stream: formatOut
        }, {
            type: "rotating-file",
            path: path.join(__dirname + "/logs/" + process.pid + "-aman.log"),
            period: "1d", // daily rotation
            count: 3 // keep 3 back copies
        }]
    });
}


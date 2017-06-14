'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const platforms = {'DEV':{'node':1, 'ip':'127.0.0.1'},'Stage':{'node':2, 'ip':'127.0.0.2'},'Support':{'node':2, 'ip':'127.0.0.3'},'Production':{'node':2, 'ip':'127.0.0.3'}};

const restService = express();
restService.use(bodyParser.json());

restService.post('/hook', function (req, res) {

    console.log('hook request');

    try {
        var speech = 'empty speech';

        if (req.body) {
            var requestBody = req.body;

            if (requestBody.result) {
                speech = '';

                if (requestBody.result.fulfillment) {
                    speech += requestBody.result.fulfillment.speech;
                    speech += ' ';
                }

                if ('ask.platform' === requestBody.result.action) {
                    if (requestBody.result.parameters) {
                        if (requestBody.result.parameters.Platform) {
                            speech += 'Your ask for platform ' + requestBody.result.parameters.Platform;
                            speech += '\n Here is some information about it : ' + platforms[requestBody.result.parameters.Platform];
                        }
                    }
                }


            }
        }

        console.log('result: ', speech);

        return res.json({
            speech: speech,
            displayText: speech,
            source: 'apiai-webhook-sample'
        });
    } catch (err) {
        console.error("Can't process request", err);

        return res.status(400).json({
            status: {
                code: 400,
                errorType: err.message
            }
        });
    }
});

restService.listen((process.env.PORT || 5000), function () {
    console.log("Server listening");
});
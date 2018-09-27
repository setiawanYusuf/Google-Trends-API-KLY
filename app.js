//NPM PLUGIN
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const googleTrends = require('google-trends-api');

//PORTING SERVER
const port = process.env.PORT || 5000;

//CUSTOM PLUGIN
const stringHelpers = require('./helpers/string');
const googleTrendHelpers = require('./helpers/googleTrend');

// Init App
const app = express();

//Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

// Home Route
app.get('/', function (req, res) {
    if (req.query.keywords) {
        var keyword = req.query.keywords;
        var temp = stringHelpers.parseKeywords(keyword);
        keyword = temp['keywords'];
        var dataLength = temp['dataLength'];

        main(res, keyword, dataLength);
    } else {
        res.render('index', {
            title: 'Google Trends Trial',
        });
    }
});

app.post('/engage', function (req, res) {
    var keyword = req.body.keyword;
    var temp = stringHelpers.parseKeywords(keyword);
    keyword = temp['keywords'];
    var dataLength = temp['dataLength'];

    main(res, keyword, dataLength);
});

function main(res, keyword, dataLength)
{
    googleTrends.interestOverTime({
        keyword: keyword,
        startTime: new Date(Date.now() - (1 * 60 * 60 * 1000)),
        endTime: new Date(Date.now()),
        geo: 'ID',
        granularTimeResolution: true,
    }, function (err, results) {
        if (err) console.log('oh no error!', err);
        else
            var finalResult = googleTrendHelpers.parseDataGoogleTrend(dataLength, results);

        res.render('result', {
            title: 'Google Trends Trial',
            keyword: keyword,
            dataLength: dataLength,
            values: finalResult['values'],
            times: finalResult['times'],
            averageFirst: finalResult['averageFirst'],
            averageLast: finalResult['averageLast'],
            finalAverage: finalResult['finalAverage']
        });
    });
}

//Start Server
app.listen(port, function () {
    console.log(`Server started on port ${port}`);
});
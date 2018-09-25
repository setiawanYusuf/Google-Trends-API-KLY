const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const googleTrends = require('google-trends-api');
const port = process.env.PORT || 5000;

// Init App
const app = express();

//Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

// Home Route
app.get('/', function (req, res) {
    res.render('index', {
        title: 'Google Trends Trial',
    });
});

app.post('/engage', function (req, res) {
    var keyword = req.body.keyword;

    googleTrends.interestOverTime({
        keyword: keyword,
        startTime: new Date(Date.now() - (1 * 60 * 60 * 1000)),
        endTime: new Date(Date.now()),
        geo: 'ID',
        granularTimeResolution: true,
    }, function (err, results) {
        if (err) console.log('oh no error!', err);
        else
            var finalResult = parseDataGoogleTrend(results);

            res.render('result', {
                title: 'Google Trends Trial',
                keyword: keyword,
                values: Object.values(finalResult['values']),
                times: Object.values(finalResult['times']),
                averageFirst: finalResult['averageFirst'],
                averageLast: finalResult['averageLast'],
                finalAverage: finalResult['finalAverage']
            });
    });
});

//Start Server
app.listen(port, function () {
    console.log('Server started on port 3001...');
});

function parseDataGoogleTrend(results)
{
    var arr = JSON.parse(results);
    var data = arr['default']['timelineData'];
    var values = [];
    var times = [];
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            var value = parseInt(data[key]['formattedValue'][0]);
            var time = data[key]['formattedTime'];
            values.push(value);
            times.push(time);
        }
    }

    var averageFirst = (values.slice(0, 10).reduce(add)) / 10;
    var length = values.length;
    var lengthMinTen = (values.length) - 10;
    var averageLast = (values.slice(lengthMinTen, length).reduce(add)) / 10;
    var finalAverage = (averageLast / averageFirst).toFixed(2);

    var finalResult = new Array();
    finalResult['values'] = values;
    finalResult['times'] = times;
    finalResult['averageFirst'] = averageFirst;
    finalResult['averageLast'] = averageLast;
    finalResult['finalAverage'] = finalAverage;

    return finalResult;
}

function add(a, b) {
    return a + b;
}

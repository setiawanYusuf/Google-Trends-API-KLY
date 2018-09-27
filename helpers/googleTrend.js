const arrayHelpers = require('./array');
const mathHelpers = require('./math');

//GOOGLE TRENDS
exports.parseDataGoogleTrend = function (dataLength, results) {
    var arr = JSON.parse(results);
    var data = arr['default']['timelineData'];
    var times = [];
    var values = []
    if (dataLength > 1) {
        var values = arrayHelpers.create2DArray(data.length, dataLength);
    }

    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            if (dataLength > 1) {
                values[key] = [];
                for (i = 0; i < dataLength; i++) {
                    var value = data[key]['value'][i];
                    values[key][i] = value;
                }
            } else {
                var value = data[key]['value'][0];
                values.push(value);
            }
            var time = data[key]['formattedTime'];
            times.push(time);
        }
    }

    var finalResult = operateResults(dataLength, values, times);
    return finalResult;
}

function operateResults(dataLength, values, times) {
    if (dataLength > 1) {
        var finalResult = [];
        var valuesArray = [];
        var timesArray = [];
        var averageFirstArray = [];
        var averageLastArray = [];
        var finalAverageArray = [];

        for (i = 0; i < dataLength; i++) {
            var tempArray = new Array();

            for (key in values) {
                tempArray.push(values[key][i]);
            }
            var averageFirst = (tempArray.slice(0, 10).reduce(mathHelpers.add)) / 10;
            var length = tempArray.length;
            var lengthMinTen = (tempArray.length) - 10;
            var averageLast = (tempArray.slice(lengthMinTen, length).reduce(mathHelpers.add)) / 10;
            var finalAverage = (averageLast / averageFirst).toFixed(2);

            valuesArray[i] = tempArray;
            averageFirstArray[i] = averageFirst;
            averageLastArray[i] = averageLast;
            finalAverageArray[i] = finalAverage;
        }
        timesArray = times;

        finalResult['values'] = valuesArray;
        finalResult['times'] = timesArray;
        finalResult['averageFirst'] = averageFirstArray;
        finalResult['averageLast'] = averageLastArray;
        finalResult['finalAverage'] = finalAverageArray;
    } else {
        var averageFirst = (values.slice(0, 10).reduce(mathHelpers.add)) / 10;
        var length = values.length;
        var lengthMinTen = (values.length) - 10;
        var averageLast = (values.slice(lengthMinTen, length).reduce(mathHelpers.add)) / 10;
        var finalAverage = (averageLast / averageFirst).toFixed(2);

        var finalResult = new Array();
        finalResult['values'] = Object.values(values);
        finalResult['times'] = Object.values(times);
        finalResult['averageFirst'] = averageFirst;
        finalResult['averageLast'] = averageLast;
        finalResult['finalAverage'] = finalAverage;
    }

    return finalResult;
}
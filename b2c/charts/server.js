var express = require('express');
var app = express();

var CONFIG = {
	POINTS: {
		QTY: 100,					// number of points
		MIN: -100,					// minimum value of a point
		MAX: 100,					// maximum value of a point
		UPDATE_INTERVAL: 20			// interval between points update (ms)
	}
};

var points;
function getRandom(min, max) {
	return Math.round(Math.random() * (max - min) + min);
}
function initPoints() {
	points = [];
	for (var pointIndex = 0; pointIndex < CONFIG.POINTS.QTY; pointIndex++) {
		points[pointIndex] = getRandom(CONFIG.POINTS.MIN, CONFIG.POINTS.MAX);
	}
}
function updatePoints() {
	points.shift();
	points.push(getRandom(CONFIG.POINTS.MIN, CONFIG.POINTS.MAX));
}
initPoints();
setInterval(updatePoints, CONFIG.POINTS.UPDATE_INTERVAL);

app.use(express.static('public'));

app.get('/api/v1/config', function (req, res) {
	res.json(CONFIG);
});
app.get('/api/v1/points', function (req, res) {
	res.json(points);
});


/* for bonus task */

var CONFIG_BONUS = {
    POINTS: {
        QTY: 100,					// number of points
        MIN: -180,					// minimum value of a point
        MAX: 180,					// maximum value of a point
        UPDATE_INTERVAL: 200			// interval between points update (ms)
    }
};

var pointsBonus, pointsBonus2, pointsBonus3;
function getRandomBonus(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}
function initPointsBonus() {
    pointsBonus = [];
    pointsBonus2 = [];
    pointsBonus3 = [];
    for (var pointIndex = 0; pointIndex < CONFIG_BONUS.POINTS.QTY; pointIndex++) {
        pointsBonus[pointIndex] = getRandomBonus(CONFIG_BONUS.POINTS.MIN, CONFIG_BONUS.POINTS.MAX);
        pointsBonus2[pointIndex] = getRandomBonus(CONFIG_BONUS.POINTS.MIN, CONFIG_BONUS.POINTS.MAX);
        pointsBonus3[pointIndex] = getRandomBonus(CONFIG_BONUS.POINTS.MIN, CONFIG_BONUS.POINTS.MAX);
    }
}
function updatePointsBonus() {
    pointsBonus.shift();
    pointsBonus.push(getRandom(CONFIG_BONUS.POINTS.MIN, CONFIG_BONUS.POINTS.MAX));

    pointsBonus2.shift();
    pointsBonus2.push(getRandom(CONFIG_BONUS.POINTS.MIN, CONFIG_BONUS.POINTS.MAX));

    pointsBonus3.shift();
    pointsBonus3.push(getRandom(CONFIG_BONUS.POINTS.MIN, CONFIG_BONUS.POINTS.MAX));
}
initPointsBonus();
setInterval(updatePointsBonus, CONFIG_BONUS.POINTS.UPDATE_INTERVAL);


app.get('/api/v2/config', function (req, res) {
	res.json(CONFIG_BONUS);
});
app.get('/api/v2/points', function (req, res) {
	res.json(pointsBonus);
});
app.get('/api/v3/points', function (req, res) {
	res.json(pointsBonus2);
});
app.get('/api/v4/points', function (req, res) {
    res.json(pointsBonus3);
});
/* end for bonus task */


app.listen(3000, function () {
	console.log('listening on port 3000');
});

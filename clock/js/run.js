

window.requestAnimFrame = ( function() {
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function (callback, element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();


var speed = 1;
var showSpeedFrames = 60 * 20;
var hasSpedUp = false;
var hasMaxSped = false;


$(document).on('keydown', function(e) {
    var ratio = 1.618033988;
    if (e.which === 38) {


        if (speed === -1) {
            speed = 1;
        }
        else if (speed < 0) {
            speed = Math.ceil(speed / ratio);
            if (speed > -1) speed = -1;
        }
        else {
            speed = Math.ceil(speed * ratio);
            if (speed > 10000000) {
                speed = 10000000;

                if (!hasMaxSped) {
                    _gaq.push(['_trackEvent', 'Event', 'SpeedMax', '']);
                    hasMaxSped = true;
                }
            }


            if (!hasSpedUp) {
                _gaq.push(['_trackEvent', 'Event', 'SpeedUp', '']);
                hasSpedUp = true;
            }
        }

        showSpeedFrames = 60 * 10;

    }

    // downpress
    else if (e.which === 40) {

        if (speed === 1) {
            // go negative
            speed = -1;
        }
        else if (speed < 0) {
            speed = Math.floor(speed * ratio);
            if (speed < -10000000) {
                speed = -10000000;
            }
        }
        // normal downpress, just slow down
        else {
            speed = Math.floor(speed / ratio);
            if (speed < 1) speed = 1;
        }


        showSpeedFrames = 60 * 10;
    }

    // space = back to 1
    else if (e.which === 32) {
        speed = 1;
    }

    // r = reset
    else if (e.which === 82) {
        time = 0;
        speed = 1;
    }
    else if (e.which === 71) {
        Gong.play(4);
    }
    else if (e.which === 84) {
        showTimeText = !showTimeText;
        localStorage.setItem('showTimeText', showTimeText);
    }
    else if (e.which === 80) {
        showPlanets = !showPlanets;
        localStorage.setItem('showPlanets', showPlanets);
    }
    else if (e.which === 67) {
        inColor = !inColor;
        Draw.setColorMode(inColor);
        localStorage.setItem('inColor', inColor);
    }
    else {
        console.log(e.which);
    }
});

$(document).on('mousemove', function() {
    showSpeedFrames = 60 * 10;
});

var time = 0;
var observer;
var showTimeText = (function() {
    var s = localStorage.getItem('showTimeText');
    if (typeof s === 'string') {
        return s == 'true';
    }
    return false;
})();

var showPlanets = (function() {
    return true;
    var s = localStorage.getItem('showPlanets');
    if (typeof s === 'string') {
        return s == 'true';
    }
    return false;
})();

var inColor = (function() {
    return true;
    var s = localStorage.getItem('inColor');
    if (typeof s === 'string') {
        return s == 'true';
    }
    return false;
})();


$(function() {

    // *** Bind to canvas and take fullscreen ***
    var width, height;

    var canvas = document.getElementById('blazingpixel');
    var ctx = canvas.getContext('2d');

    var fullscreen = function() {

        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        var pixelRatio = window.devicePixelRatio || 1; /// get pixel ratio of device

        width = windowWidth * pixelRatio;
        height = windowHeight * pixelRatio;

        canvas.width = width;   /// resolution of canvas
        canvas.height = height;

        canvas.style.width = windowWidth + 'px';   /// CSS size of canvas
        canvas.style.height = windowHeight + 'px';

        Draw.setSize(width, height);
    };

    fullscreen();

    $(window).resize(function() {
        fullscreen();
    });


    var draw = function (date, times) {

        observer.setDate(date);

        var sunData = doSun(observer,0);
        var moonData = doMoon(observer,0);

        Draw.drawAll(ctx, sunData, moonData, times, date, speed, showTimeText);

    };




    // *** Create the location ***
    var locaction = new place("GB:Greenwich","51:28:38",0,"00:00:00",0,0,"","");

    observer = new observatory(locaction);
    observer.setDate(new Date());

    var last = new Date();
    var drawDate = last;
    var times = null;

    var elapse = 0;
    var needsDraw = true;

    // try to get the geo location
    var position = null;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(value) {
            position = value;
        });
    }

    var calcReshTimes = function(date) {
        var p = position || fallbackPosition;
        if (typeof p === 'undefined' || p == null) return null;
        return SunCalc.getTimes(date, p.coords.latitude, p.coords.longitude);
    };

    var advanceTime = function() {
        var now = new Date();

        // always draw after advancing the time
        needsDraw = true;

        if (speed > 1 || speed < 0) {
            elapse = now.getTime() - last.getTime();
            time += elapse * (speed-1);
        }

        drawDate = new Date(now.getTime() + time);

        times = calcReshTimes(drawDate);

        // advance
        last = now;
    };

    var lastResh = [0, 0, 0, 0];

    // normal ticks, 2 per second
    setInterval(function() {
        if (speed > 1) return;

        advanceTime();


        if (times) {
            // determine if its gong time
            var reshTimes = [times.dawn, times.solarNoon, times.sunset, times.nadir];

            for (var i = 0; i < reshTimes.length; i++) {
                var diff = drawDate - reshTimes[i];
                if (diff > 0 && diff < 1000*60) {
                    if (lastResh[i] == 0 || reshTimes[i] - lastResh[i] > 0) {
                        Gong.play(4);
                        lastResh[i] = reshTimes[i];
                    }
                }
            }
        }



    }, 1000 / 2);

    var drawCycle = function() {
        requestAnimFrame(drawCycle);

        // high speed, draw at will
        if (speed > 1 || speed < 0) advanceTime();

        if (needsDraw) {

            draw(drawDate, times);
            needsDraw = false;
        }

        if (showSpeedFrames > 0) {
            showSpeedFrames--;
        }

    };

    // start the draw sequence
    drawCycle();
});

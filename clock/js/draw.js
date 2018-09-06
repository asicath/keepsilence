var Draw = (function() {
    var my = {};

    var width, height, maxRadius, angleOffset;
    var earthRadius, moonRadius, earthSize, moonSize, kmPerPixel, earthPos;
    var sunRadius, pixelsPerAu;
    var planetRadii, maxPlanetRadius;
    var lineWidth, fixedRadius, outerRadius, innerRadius;

    my.setSize = function(width_a, height_a) {
        width = width_a;
        height = height_a;

        // The maximum distance from the center that we can draw in a circle
        maxRadius = Math.min(width, height) / 2;

        // rotate everything 90°
        angleOffset = Math.PI * 1.5;

        // Determine earth/moon proportions
        earthRadius = maxRadius / 72;
        moonRadius = earthRadius * 0.273;
        earthSize = 6371;   // km
        moonSize = 1737.10; // km
        kmPerPixel = earthSize / earthRadius;
        earthPos = {
            x: width / 2,
            y: height / 2
        };

        // Determine sun/earth proportions
        sunRadius = earthRadius * 109;
        pixelsPerAu = maxRadius * 0.8; // sun is ~1 au, so this should place the sun out at the limit of the screen

        // Determine wandering star proportions
        maxPlanetRadius = maxRadius * 0.935;
        planetRadii = {
            Mercury: 0.3829 * earthRadius,
            Venus: 0.9499 * earthRadius,
            Mars: 0.533 * earthRadius,
            Jupiter: 11.209 * earthRadius,
            Saturn: 9.4492 * earthRadius
        };


        lineWidth = maxRadius / 175;
        fixedRadius = maxRadius * 0.1;
        outerRadius = maxRadius - lineWidth*2;
        innerRadius = outerRadius - fixedRadius;

    };

    var getColor = function (r, g, b, a) {
        return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
    };

    // Convert to Roman Numerals
    // copyright 25th July 2005, by Stephen Chapman http://javascript.about.com
    // permission to use this Javascript on your web page is granted
    // provided that all of the code (including this copyright notice) is
    // used exactly as shown
    function roman(n,s) {var r = '';var d; var rn = new Array('IIII','V','XXXX','L','CCCC','D','MMMM'); for (var i=0; i< rn.length; i++) {var x = rn[i].length+1;var d = n%x; r= rn[i].substr(0,d)+r;n = (n-d)/x;} if (s) {r=r.replace(/DCCCC/g,'CM');r=r.replace(/CCCC/g,'CD');r=r.replace(/LXXXX/g,'XC');r=r.replace(/XXXX/g,'XL');r=r.replace(/VIIII/g,'IX');r=r.replace(/IIII/g,'IV');} return r;}


    var imgZodiac = [];
    for (var z = 0; z < 12; z++) {
        imgZodiac[z] = new Image();
        var s = '' + z;
        if (s.length == 1) s = '0' + s;
        imgZodiac[z].src = 'images/astro/' + s + '.png';
    }

    var imgSun = new Image();
    imgSun.src = 'images/astro/sun.png';

    var imgMoon = new Image();
    imgMoon.src = 'images/astro/moon.png';

    var planetImage = {
        Jupiter: {
            src: "images/planet/jupiter.png"

        },
        Saturn: {
            src: "images/planet/saturn.png",
            offset: {
                left:339,
                right:343,
                top:100,
                bottom:122
            }
        },
        Sun: {
            src: "images/planet/sun.png"
        },
        Venus: {
            src: "images/planet/venus.png"
        },
        Mars: {
            src: "images/planet/mars.png"
        }
    };

    for (var name in planetImage) {
        planetImage[name].img = new Image();
        planetImage[name].img.src = planetImage[name].src;
    }

    var imgResh = [];
    imgResh[0] = new Image();
    imgResh[0].src = 'images/resh/ra.png';
    imgResh[1] = new Image();
    imgResh[1].src = 'images/resh/hathoor.png';
    imgResh[2] = new Image();
    imgResh[2].src = 'images/resh/tum.png';
    imgResh[3] = new Image();
    imgResh[3].src = 'images/resh/kephra.png';


    var drawEarth = function(ctx) {
        // draw earth
        ctx.beginPath();
        ctx.arc(width/2, height/2, earthRadius, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'blue';
        ctx.fill();
    };

    var drawSun = function(ctx, sunAscension, sunDistance) {
        // draw the sun
        var radiusCenter = pixelsPerAu * Math.abs(sunDistance) + sunRadius;
        var angle = angleOffset;
        var sunPos = {
            x: Math.cos(angle) * radiusCenter + earthPos.x,
            y: Math.sin(angle) * radiusCenter + earthPos.y
        };

        //var sunRadius = earthRadius * 109;

        var img = planetImage["Sun"].img;
        ctx.drawImage(img, 0, 0, img.width, img.height, sunPos.x - sunRadius, sunPos.y - sunRadius, sunRadius * 2, sunRadius * 2);


        return;


        ctx.beginPath();
        ctx.arc(sunPos.x, sunPos.y, sunRadius, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'orange';
        ctx.fill();
    };

    var drawMoon = function(ctx, moonAscension, moonDistance, angleOffsetDueToSun) {
        // draw the moon
        var radiusCenter = moonDistance / kmPerPixel; // distance proportionate to size
        var angle = angleOffset - (moonAscension / 24) * Math.PI * 2 + angleOffsetDueToSun;
        var moonPos = {
            x: Math.cos(angle) * radiusCenter + earthPos.x,
            y: Math.sin(angle) * radiusCenter + earthPos.y
        };

        ctx.beginPath();
        ctx.arc(moonPos.x, moonPos.y, moonRadius*10, 0, 2 * Math.PI, false);
        ctx.fillStyle = getColor(128, 128, 128, 0.5);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(moonPos.x, moonPos.y, moonRadius, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'white';
        ctx.fill();
    };

    var drawPlanet = function(ctx, ascension, name, angleOffsetDueToSun) {

        //radiusCenter = Math.abs(data.distance) * pixelsPerAu;
        var radiusCenter = maxPlanetRadius; //pixelsPerAu + earthRadius * 2 * i;
        var angle = angleOffset - (ascension / 24) * Math.PI * 2 + angleOffsetDueToSun;

        var planetRadius = planetRadii[name]; // earthRadius;

        var x = Math.cos(angle) * radiusCenter + earthPos.x;
        var y = Math.sin(angle) * radiusCenter + earthPos.y;

        if (planetImage[name]) {
            var img = planetImage[name].img;
            if (planetImage[name].offset) {
                var offset = planetImage[name].offset;
                var resize = {
                    widthScale: img.width / (img.width - offset.left - offset.right),
                    heightScale: img.height / (img.height - offset.top - offset.bottom)
                };

                resize.drawWidth = planetRadius * 2 * resize.widthScale;
                resize.drawHeight = planetRadius * 2 * resize.heightScale;


                ctx.drawImage(img, 0, 0, img.width, img.height, x - resize.drawWidth / 2, y - resize.drawHeight / 2, resize.drawWidth, resize.drawHeight);
            }
            else {
                ctx.drawImage(img, 0, 0, img.width, img.height, x - planetRadius, y - planetRadius, planetRadius * 2, planetRadius * 2);
            }

        }
        else {
            ctx.beginPath();
            ctx.arc(x, y, planetRadius, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
            ctx.fill();

            //ctx.fillStyle = '#808080';
            //ctx.font = "16px Arial";
            //ctx.fillText(data.name, x, y);
        }



    };

    var drawFixedStarRing = function(ctx, angleOffsetDueToSun) {
        // outer
        ctx.beginPath();
        ctx.arc(width/2, height/2, outerRadius, 0, 2 * Math.PI, false);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = 'grey';
        ctx.stroke();

        // inner
        ctx.beginPath();
        ctx.arc(width/2, height/2, innerRadius, 0, 2 * Math.PI, false);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = 'grey';
        ctx.stroke();

        for (var z = 0; z < 12; z++) {
            var r = angleOffset + angleOffsetDueToSun - Math.PI*2 *z/12;
            var x1 = Math.cos(r) * outerRadius + width / 2;
            var y1 = Math.sin(r) * outerRadius + height / 2;
            var x2 = Math.cos(r) * innerRadius + width / 2;
            var y2 = Math.sin(r) * innerRadius + height / 2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = 'grey';
            ctx.stroke();
        }

        for (var z = 0; z < 12; z++) {

            r = angleOffsetDueToSun - Math.PI*2 * ((z+0.5)/12);

            ctx.save();
            ctx.translate(width/2,height/2);
            ctx.rotate(r);

            // draw the image
            var size = fixedRadius;
            ctx.drawImage(imgZodiac[z], 0, 0, imgZodiac[z].width, imgZodiac[z].height, -size/2, -outerRadius, size, size);

            // we’re done with the rotating so restore the unrotated context
            ctx.restore();
        }
    };


    my.drawAll = function(ctx, sunData, moonData, times, date, speed, showTimeText) {
        ctx.imageSmoothingEnabled = true;

        // clear the canvas
        ctx.clearRect(0, 0, width, height);


        // draw the sun
        drawSun(ctx, sunData.rightAscension, sunData.distance);

        // all other angles will be modified by this
        var angleOffsetDueToSun = (sunData.rightAscension / 24) * Math.PI * 2;

        // draw moon
        drawMoon(ctx, moonData.rightAscension, moonData.distance, angleOffsetDueToSun);

        // draw the planets
        if (showPlanets) {
            var pl = doPlanets(observer, 0);
            for (var i = pl.length -1; i >= 0; i--) {
                var data = pl[i];
                drawPlanet(ctx, data.rightAscension, data.name, angleOffsetDueToSun);
            }
        }

        // draw the resh times if provided
        if (times) {
            var insideRadius = innerRadius * 0.666;
            var outsideRadius = innerRadius;

            drawTime(ctx, times.dawn, times.solarNoon, null, outsideRadius, insideRadius, imgResh[0], 1.8);
            drawTime(ctx, times.solarNoon, times.solarNoon, null, outsideRadius, insideRadius, imgResh[1], 1.5);
            drawTime(ctx, times.sunset, times.solarNoon, null, outsideRadius, insideRadius, imgResh[2], 1.8);
            drawTime(ctx, times.nadir, times.solarNoon, null, outsideRadius, insideRadius, imgResh[3], 1.3, Math.PI);

            if (speed < 200000) {
                drawTimeArc(ctx, date, times.solarNoon, '#fff', outsideRadius, 0);

                if (showTimeText)
                drawTimeText(ctx, date, Math.PI  * 1.5, -outerRadius * 0.05);
            }

        }

        // draw the ring of fixed stars
        drawFixedStarRing(ctx, angleOffsetDueToSun);

        // draw the earth
        drawEarth(ctx);





        var x, y;

        var determineHouseIndex = function(hour) {
            return Math.floor(hour * 15 / 30);
        };
        var determineDegree = function(hour) {
            return Math.floor((hour * 15) % 30);
        };

        var size = fixedRadius;

        var houseIndex = determineHouseIndex(sunData.rightAscension);
        var imgSign = imgZodiac[houseIndex];
        x = width / 2 - maxRadius + size * 0.5;
        y = height / 2 + maxRadius - size*3.5;
        ctx.drawImage(imgSun, 0, 0, imgSun.width, imgSun.height, x, y, size, size);
        y += size;
        ctx.drawImage(imgSign, 0, 0, imgSign.width, imgSign.height, x, y, size, size);
        y += size;

        var degree = determineDegree(sunData.rightAscension) + "";
        var digit0 = degree.length == 1 ? "0" : degree.substr(0, 1);
        var digit1 = degree.substr(degree.length - 1, 1);
        var colorFill = 'rgba(128, 128, 128, 1)';
        var colorStroke = null;
        var scale = 0.02 * (maxRadius / 350);
        JSFont.draw(ctx, vollkorn, digit0, scale, x, y, size/2, size, colorStroke, colorFill, false);
        JSFont.draw(ctx, vollkorn, digit1, scale, x + size/2, y, size/2, size, colorStroke, colorFill, false);

        houseIndex = determineHouseIndex(moonData.rightAscension);
        imgSign = imgZodiac[houseIndex];
        x = width / 2 + maxRadius - size*1.5;
        y = height / 2 + maxRadius - size*3.5;
        ctx.drawImage(imgMoon, 0, 0, imgMoon.width, imgMoon.height, x, y, size, size);
        y += size;
        ctx.drawImage(imgSign, 0, 0, imgSign.width, imgSign.height, x, y, size, size);
        y += size;

        degree = determineDegree(moonData.rightAscension) + "";
        digit0 = degree.length == 1 ? "0" : degree.substr(0, 1);
        digit1 = degree.substr(degree.length - 1, 1);
        colorFill = 'rgba(128, 128, 128, 1)';
        colorStroke = null;
        scale = 0.02 * (maxRadius / 350);
        JSFont.draw(ctx, vollkorn, digit0, scale, x, y, size/2, size, colorStroke, colorFill, false);
        JSFont.draw(ctx, vollkorn, digit1, scale, x + size/2, y, size/2, size, colorStroke, colorFill, false);




        // Thelemic year
        var house = determineHouseIndex(sunData.rightAscension);
        var year = date.getUTCFullYear() - 1904;
        var month = date.getUTCMonth();
        if (house >= 9 && month < 3) year--;
        x = width / 2 + maxRadius - size*2.7;
        y = height / 2 - maxRadius + size*0.6;
        var siz = drawText(ctx, 'AN', x, y);


        var yearText = (function() {

            var y0 = Math.floor(year / 22);
            var y1 = year % 22;



            return roman(y0,1) + roman(y1,1).toLowerCase();
        })();

        drawText(ctx, yearText, x, y+siz * 0.7);

        if(showSpeedFrames > 0)
            drawDebugInfo(ctx, times, date);

    };

    var drawText = function(ctx, text, x, y) {

        // stolen from below
        var fixedRadius = maxRadius * 0.12;
        var size = fixedRadius;

        var letterWidth = size * 0.45;

        var colorFill = 'rgba(128, 128, 128, 1)';
        var colorStroke = null;
        var scale = 0.019 * (maxRadius / 350);

        for (var i = 0; i < text.length; i++) {
            JSFont.draw(ctx, vollkorn, text.substr(i, 1).toString(), scale, x + letterWidth * i, y, size/2, size, colorStroke, colorFill, false);
        }

        return size;
    };

    var drawTimeText = function(ctx, time, angle, radius) {

        // stolen from below
        var fixedRadius = maxRadius * 0.1;
        var size = fixedRadius;

        var letterWidth = size * 0.35;

        var hour = time.getHours().toString();
        var ms = time.getMinutes().toString();
        if (hour.length == 1) hour = "0" + hour;
        if (ms.length == 1) ms = "0" + ms;

        var colorFill = 'rgba(128, 128, 128, 1)';
        var colorStroke = null;
        var scale = 0.015 * (maxRadius / 350);

        var x = Math.cos(angle) * radius + width / 2 - letterWidth * 2;
        var y = Math.sin(angle) * radius + height / 2 - size / 2;

        JSFont.draw(ctx, vollkorn, hour.substr(0, 1).toString(), scale, x, y, size/2, size, colorStroke, colorFill, false);
        JSFont.draw(ctx, vollkorn, hour.substr(1, 1).toString(), scale, x + letterWidth, y, size/2, size, colorStroke, colorFill, false);
        JSFont.draw(ctx, vollkorn, ms.substr(0, 1).toString(), scale, x + letterWidth * 2, y, size/2, size, colorStroke, colorFill, false);
        JSFont.draw(ctx, vollkorn, ms.substr(1, 1).toString(), scale, x + letterWidth * 3, y, size/2, size, colorStroke, colorFill, false);
    };





    // gets the angle of a time relative to solar noon
    var getAngle = function(time, solarNoon) {
        var t0 = solarNoon.getHours() * 60 * 60 + solarNoon.getMinutes() * 60 + solarNoon.getSeconds();
        var t1 = time.getHours() * 60 * 60 + time.getMinutes() * 60 + time.getSeconds();
        var t2 = 24 * 60 * 60;
        return angleOffset - (t1 - t0) / t2 * Math.PI * 2;
    };

    // for drawing the time hand
    var drawTimeArc = function(ctx, time, solarNoon, color, outerRadius, innerRadius, img) {
        var angle = getAngle(time, solarNoon);
        var angle0 = angle + Math.PI * 2 * 0.0005;
        var angle1 = angle - Math.PI * 2 * 0.0005;

        var x = Math.cos(angle) * innerRadius + width / 2;
        var y = Math.sin(angle) * innerRadius + height / 2;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(width/2, height/2, outerRadius, angle0, angle1, true);
        ctx.closePath();
        ctx.fillStyle = color || getColor(128, 128, 128, 0.5);
        ctx.fill();

        if (img) {
            var size = maxRadius * 0.15;

            var x2 = Math.cos(angle) * (innerRadius - size*0.6) + width / 2;
            var y2 = Math.sin(angle) * (innerRadius - size*0.6) + height / 2;

            ctx.imageSmoothingEnabled = true;
            ctx.drawImage(img, 0, 0, img.width, img.height, x2 - size/2, y2 - size/2, size, size);


        }
    };

    var drawTime = function(ctx, time, solarNoon, color, outerRadius, innerRadius, img, timePercent, forceAngle) {
        var angle = getAngle(time, solarNoon);
        if (typeof forceAngle !== 'undefined') angle = angleOffset + forceAngle;

        var x1 = Math.cos(angle) * outerRadius + width / 2;
        var y1 = Math.sin(angle) * outerRadius + height / 2;

        var x0 = width/2;
        var y0 = height/2;
        if (innerRadius) {
            x0 = Math.cos(angle) * innerRadius + width / 2;
            y0 = Math.sin(angle) * innerRadius + height / 2;
        }

        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color || getColor(128, 128, 128, 1);
        ctx.stroke();

        if (img) {
            var size = maxRadius * 0.15;

            var x2 = Math.cos(angle) * (innerRadius - size*0.6) + width / 2;
            var y2 = Math.sin(angle) * (innerRadius - size*0.6) + height / 2;

            ctx.imageSmoothingEnabled = true;
            ctx.drawImage(img, 0, 0, img.width, img.height, x2 - size/2, y2 - size/2, size, size);

            if (showTimeText)
                drawTimeText(ctx, time, angle, innerRadius - size*timePercent);
        }
    };

    var drawDebugInfo = function(ctx, times, date) {

        var y;
        // draw speed info
        ctx.fillStyle = 'white';
        ctx.font = "16px Arial";
        ctx.fillText("speed: " + speed + "x", 20, 20);

        ctx.fillText("up/down arrows to change speed", 20, 40);
        ctx.fillText("'r' to reset", 20, 60);
        ctx.fillText("'t' to toggle time", 20, 80);
        ctx.fillText("'p' to toggle planets", 20, 100);
        ctx.fillText("'g' to sound gong", 20, 120);

        ctx.fillText(date.toLocaleString(), 20, 140);
        ctx.fillText(width + "x" + height, 20, 160);

        if (times) {
            y = 180;
            ctx.fillText("Dawn: " + times.dawn.toLocaleTimeString(), 20, y);
            y+=20;
            ctx.fillText("Sunrise: " + times.sunrise.toLocaleTimeString(), 20, y);
            y+=20;
            ctx.fillText("Solar Noon: " + times.solarNoon.toLocaleTimeString(), 20, y);
            y+=20;
            ctx.fillText("Sunset: " + times.sunset.toLocaleTimeString(), 20, y);
            y+=20;
            ctx.fillText("Dusk: " + times.dusk.toLocaleTimeString(), 20, y);
            y+=20;
            ctx.fillText("Nadir: " + times.nadir.toLocaleTimeString(), 20, y);
        }

    };

    return my;
})();
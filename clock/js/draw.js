var Draw = (function() {
    var my = {};

    var width, height, maxRadius, angleOffset;
    var earthRadius, moonRadius, earthSize, moonSize, kmPerPixel, earthPos;
    var sunRadius, pixelsPerAu;
    var planetRadii, maxPlanetRadius;
    var lineWidth, fixedRadius, outerRadius, innerRadius;

    let inColor = true;

    my.setColorMode = function(b) {
        inColor = b;
    };

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
        imgZodiac[z] = {};
        imgZodiac[z].g = new Image();
        imgZodiac[z].w = new Image();
        var s = '' + z;
        if (s.length == 1) s = '0' + s;
        imgZodiac[z].g.src = 'images/equinox/' + s + '.png';
        imgZodiac[z].w.src = 'images/equinox/' + s + '-w.png';
    }

    var imgEarth = new Image();
    imgEarth.src = 'images/planet/earth.png';

    var imgSun = new Image();
    imgSun.src = 'images/equinox/sun.png';

    var imgMoon = new Image();
    imgMoon.src = 'images/equinox/moon.png';

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
    imgResh[0] = {w: new Image(), c:new Image()};
    imgResh[1] = {w: new Image(), c:new Image()};
    imgResh[2] = {w: new Image(), c:new Image()};
    imgResh[3] = {w: new Image(), c:new Image()};

    imgResh[0].w.src = 'images/resh/ra.png';
    imgResh[1].w.src = 'images/resh/hathoor.png';
    imgResh[2].w.src = 'images/resh/tum.png';
    imgResh[3].w.src = 'images/resh/kephra.png';

    imgResh[0].c.src = 'images/resh/ra-color.png';
    imgResh[1].c.src = 'images/resh/hathoor-color.png';
    imgResh[2].c.src = 'images/resh/tum-color.png';
    imgResh[3].c.src = 'images/resh/kephra-color.png';


    var drawEarth = function(ctx) {
        // draw earth
        /*
        ctx.beginPath();
        ctx.arc(width/2, height/2, earthRadius, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'blue';
        ctx.fill();
        */

        let x = width/2;
        let y = height/2;

        ctx.drawImage(imgEarth, 0, 0, imgEarth.width, imgEarth.height, x - earthRadius, y - earthRadius, earthRadius * 2, earthRadius * 2);
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


    let colors = [
        [0xed,0x20,0x00], // ed2000
        [0xff,0x4e,0x00], // FF4E00
        [0xff,0x6d,0x00], // FF6D00

        [0xff,0xb7,0x34], // ffb734
        [0xe5,0xd7,0x08], // E5D708
        [0x59,0xb9,0x34], // 59B934

        [0x00,0xa5,0x50], // 00A550
        [0x00,0x95,0x8d], // 00958d
        [0x00,0x85,0xca], // 0085ca

        [0x00,0x14,0x89], // 001489
        [0x5c,0x00,0xcc], // 5c00cc
        [0xae,0x0e,0x36]  // AE0E36
    ];

    var drawFixedStarRing = function(ctx, angleOffsetDueToSun) {

        // calculate
        let lines = [];
        for (var z = 0; z < 12; z++) {
            var r = angleOffset + angleOffsetDueToSun - Math.PI*2 *z/12;
            var x1 = Math.cos(r) * outerRadius + width / 2;
            var y1 = Math.sin(r) * outerRadius + height / 2;
            var x2 = Math.cos(r) * innerRadius + width / 2;
            var y2 = Math.sin(r) * innerRadius + height / 2;

            // save for later
            lines.push({
                r: r,
                outer: {x:x1,y:y1},
                inner: {x:x2,y:y2},
            });
        }

        // now fill in each space
        let highlight = -1;
        let lineColor = 'grey';
        for (var z = 0; z < 12; z++) {
            let a = lines[z];
            let b = lines[(z+1)%12];

            ctx.beginPath();
            ctx.moveTo(a.inner.x, a.inner.y);
            ctx.arc(width/2, height/2, innerRadius, a.r, b.r, true);
            //ctx.lineTo(b.inner.x, b.inner.y); // replace with arc
            ctx.lineTo(b.outer.x, b.outer.y);
            ctx.arc(width/2, height/2, outerRadius, b.r, a.r, false);
            //ctx.lineTo(a.outer.x, a.outer.y); // replace with arc
            ctx.closePath();

            let color = colors[z];



            let alpha = '0.25';
            let topAngle = Math.PI*2 / 12;
            if ((a.r+Math.PI/2) % (Math.PI *2) < topAngle) {
                alpha = 0.75;
                highlight = z;
                //lineColor = `rgba(${color[0]*0.9}, ${color[1]*0.9}, ${color[2]*0.9}, 1)`;
            }
            //if (topAngle > a.r && topAngle < b.r) alpha = 1;
            ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
            if (inColor) ctx.fill();
        }

        // outer ring
        ctx.beginPath();
        ctx.arc(width/2, height/2, outerRadius, 0, 2 * Math.PI, false);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = lineColor;
        ctx.stroke();

        // inner ring
        ctx.beginPath();
        ctx.arc(width/2, height/2, innerRadius, 0, 2 * Math.PI, false);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = lineColor;
        ctx.stroke();

        // the border lines
        for (var z = 0; z < 12; z++) {
            let a = lines[z];
            ctx.beginPath();
            ctx.moveTo(a.outer.x, a.outer.y);
            ctx.lineTo(a.inner.x, a.inner.y);
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = lineColor;
            ctx.stroke();
        }



        // draw the images
        for (var z = 0; z < 12; z++) {

            r = angleOffsetDueToSun - Math.PI*2 * ((z+0.5)/12);

            ctx.save();
            ctx.translate(width/2,height/2);
            ctx.rotate(r);

            // draw the image
            var size = fixedRadius;

            let img = (z === highlight) ? imgZodiac[z].w : imgZodiac[z].g;


            ctx.drawImage(img, 0, 0, img.width, img.height, -size/2, -outerRadius, size, size);

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

        // draw the planets
        if (showPlanets) {
            var pl = doPlanets(observer, 0);
            for (var i = pl.length -1; i >= 0; i--) {
                var data = pl[i];
                drawPlanet(ctx, data.rightAscension, data.name, angleOffsetDueToSun);
            }
        }

        drawTimeTics(ctx);

        // draw moon
        drawMoon(ctx, moonData.rightAscension, moonData.distance, angleOffsetDueToSun);

        // draw the resh times if provided
        if (times) {
            var insideRadius = innerRadius * 0.666;
            var outsideRadius = innerRadius;

            if (speed < 200000) {
                //drawTimeArc(ctx, date, times.solarNoon, '#fff', outsideRadius, 0);
                drawTimePointer(ctx, date, times.solarNoon, outsideRadius);

                if (showTimeText)
                    drawTimeText(ctx, date, Math.PI  * 1.5, -outerRadius * 0.05);
            }

            let imgType = inColor ? 'c' : 'w';
            drawTime(ctx, times.dawn, times.solarNoon, getColor(0xfe, 0xe7, 0x4d, 0.5), outsideRadius, insideRadius, imgResh[0][imgType], 1.8);
            drawTime(ctx, times.solarNoon, times.solarNoon, getColor(0xff, 0x2a, 0x00, 0.5), outsideRadius, insideRadius, imgResh[1][imgType], 1.5);
            drawTime(ctx, times.sunset, times.solarNoon, getColor(0x02, 0x46, 0xbc, 0.5), outsideRadius, insideRadius, imgResh[2][imgType], 1.8);
            drawTime(ctx, times.nadir, times.solarNoon, getColor(0x00, 0xA5, 0x50, 0.5), outsideRadius, insideRadius, imgResh[3][imgType], 1.3, Math.PI);
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


        // *** SUN INFO, lower left ***
        var houseIndex = determineHouseIndex(sunData.rightAscension);
        var imgSign = imgZodiac[houseIndex].g;
        x = width / 2 - maxRadius + size * 0.5;
        y = height / 2 + maxRadius - size*3.5;
        ctx.drawImage(imgSun, 0, 0, imgSun.width, imgSun.height, x, y, size, size);
        y += size;
        ctx.drawImage(imgSign, 0, 0, imgSign.width, imgSign.height, x, y, size, size);
        y += size;

        var degree = determineDegree(sunData.rightAscension).toString();
        var digit0 = degree.length == 1 ? "0" : degree.substr(0, 1);
        var digit1 = degree.substr(degree.length - 1, 1);
        var colorFill = 'rgba(128, 128, 128, 1)';
        var colorStroke = null;
        var scale = 0.02 * (maxRadius / 350);
        JSFont.draw(ctx, vollkorn, digit0, scale, x, y, size/2, size, colorStroke, colorFill, false);
        JSFont.draw(ctx, vollkorn, digit1, scale, x + size/2, y, size/2, size, colorStroke, colorFill, false);

        // draw the min/sec
        ctx.fillStyle = 'rgba(64, 64, 64, 1)';
        let fontSize = (500*scale);
        ctx.font = fontSize.toString() + "px Arial";
        let exact = (sunData.rightAscension * 15) % 30;
        exact -= Math.floor(exact);
        let minutes = Math.floor(60*exact);
        exact = 60*exact - minutes;
        let seconds = Math.floor(60*exact);

        minutes = minutes.toString();
        seconds = seconds.toString();
        if (minutes.length < 2) minutes = "0" + minutes;
        if (seconds.length < 2) seconds = "0" + seconds;

        ctx.fillText(minutes + "'", x + fontSize*4, y + fontSize*2.5);
        ctx.fillText(seconds + '"', x + fontSize*5.5, y + fontSize*2.5);

        // *** MOON INFO, lower right ***
        houseIndex = determineHouseIndex(moonData.rightAscension);
        imgSign = imgZodiac[houseIndex].g;
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
        return angleOffset - ((t0 - t1) / t2) * Math.PI * 2;
    };

    var drawTimePointer = function(ctx, time, solarNoon, outerRadius) {
        var angle = getAngle(time, solarNoon);

        ctx.save();
        ctx.translate(width/2,height/2);
        ctx.rotate(angle - Math.PI/2);

        let off = outerRadius/150;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-off, outerRadius*0.95);
        ctx.lineTo(0, outerRadius-2);
        ctx.lineTo(off, outerRadius*0.95);

        ctx.closePath();
        ctx.fillStyle = getColor(255, 255, 255, 1);
        ctx.fill();

        ctx.restore();
    };

    var drawTimeTics = function(ctx) {

        let ticCount = 24;

        var colorFill = 'rgba(64, 64, 64, 1)';
        var colorStroke = null;
        var scale = 0.010 * (maxRadius / 350);
        var fixedRadius = maxRadius * 0.1;
        var size = fixedRadius/2;
        var letterWidth = size * 0.35;

        for (var z = 0; z < ticCount; z++) {

            let hour = ((z+18)%24).toString();
            if (hour.length < 2) hour = "0" + hour;

            var r = Math.PI*2 * (z / ticCount);
            var x1 = Math.cos(r) * (innerRadius * 0.95) + width / 2;
            var y1 = Math.sin(r) * (innerRadius * 0.95) + height / 2;
            var x2 = Math.cos(r) * innerRadius + width / 2;
            var y2 = Math.sin(r) * innerRadius + height / 2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineWidth = lineWidth/2;
            ctx.strokeStyle = 'rgba(64, 64, 64, 1)';
            if (hour !== "00" && hour !== "12") ctx.stroke();

            ctx.save();
            ctx.translate(width/2,height/2);


            var x3 = Math.cos(r) * (innerRadius * 0.92);
            var y3 = Math.sin(r) * (innerRadius * 0.92);

            if (hour !== "00" && hour !== "12") {
                JSFont.draw(ctx, vollkorn, hour.substr(0, 1).toString(), scale, x3 - letterWidth/2, y3, size/2, size, colorStroke, colorFill, false, true);
                JSFont.draw(ctx, vollkorn, hour.substr(1, 1).toString(), scale, x3 + letterWidth/2, y3, size/2, size, colorStroke, colorFill, false, true);
            }

            ctx.restore();
        }

    };

    var drawTime = function(ctx, time, solarNoon, color, outerRadius, innerRadius, img, timePercent, forceAngle) {
        var angle = getAngle(time, solarNoon);
        if (typeof forceAngle !== 'undefined') angle = angleOffset + forceAngle;

        /*
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
        ctx.strokeStyle = inColor ? color : getColor(128, 128, 128, 1);
        ctx.stroke();
        */


        // draw the fancy hand
        ctx.save();
        ctx.translate(width/2,height/2);
        ctx.rotate(angle - Math.PI/2);

        let off = outerRadius/150;
        ctx.beginPath();
        ctx.moveTo(0, innerRadius);
        ctx.lineTo(-off, outerRadius*0.95);
        ctx.lineTo(0, outerRadius-2);
        ctx.lineTo(off, outerRadius*0.95);

        ctx.closePath();
        ctx.fillStyle = inColor ? color : getColor(128, 128, 128, 1);
        ctx.fill();

        ctx.restore();

        // draw the hieroglyph
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
        ctx.fillText("'c' to toggle color mode", 20, 140);

        ctx.fillText(date.toLocaleString(), 20, 160);
        ctx.fillText(width + "x" + height, 20, 180);

        if (times) {
            y = 200;
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
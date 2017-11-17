

var Color = function () {

    var TrimPercent = function (percent) {
        while (percent > 1.0) { percent -= 1.0; }
        return percent;
    }

    var percentCache = {};

    var ByPercent = function (percent, full) {

        // trim it
        percent = TrimPercent(percent);

        // narrow down to just a handful of possible values
        var key = "K" + Math.floor(percent * 1000);

        // Try to pull from cache
        if (typeof percentCache[key] !== 'undefined') {
            return percentCache[key];
        }

        var max = 6;
        var total = full * max; // Max num of colors that can be generated

        // The number representing the color that will be returned
        var i = Math.round(total * percent);

        //var full = 170;
        var empty = 0;
        var between = 0; //parseInt(parseFloat(full) * percent);

        var r = empty;
        var g = empty;
        var b = empty;
        var a = 1; // No alpha

        if (percent < 1.0 / max) {
            // #FF++00 = FF0000 -> FFFF00
            between = i - full * 0;
            r = full;
            g = between;
            b = empty;
        } else if (percent < 2.0 / max) {
            // #--FF00
            between = i - full * 1;
            r = full - between;
            g = full;
            b = empty;
        } else if (percent < 3.0 / max) {
            // #00FF++
            between = i - full * 2;
            r = empty;
            g = full;
            b = between;
        } else if (percent < 4.0 / max) {
            // #00--FF = 00FFFF -> 0000FF
            between = i - full * 3;
            r = empty;
            g = full - between;
            b = full;
        } else if (percent < 5.0 / max) {
            // #++00FF = 0000FF -> FF00FF
            between = i - full * 4;
            r = between;
            g = empty;
            b = full;
        } else if (percent <= 6.0 / max) {
            // #FF00-- = FF00FF -> FF0000
            between = i - full * 5;
            r = full;
            g = empty;
            b = full - between;
        }

        // create the color
        color = 'rgba(' + r + ',' + g + ',' + b + ', ' + a + ')';

        percentCache[key] = color;

        return color;

    };

    var ByNumber = function (number, max) {
        while (number > max) { number -= max; }
        return ByPercent(number / max, 170);
    };

    return {
        ByNumber: ByNumber
    };

} ();

var DrawSealToCanvas = function (id, colorOffset) {
    
    if (!colorOffset) {colorOffset = 0;}

    var canvas = $(id);
    var context = canvas[0].getContext('2d');

    

    context.webkitImageSmoothingEnabled = true;

    var width = canvas.attr('width');
    var height = canvas.attr('height');

    context.clearRect (0, 0, width, height);

    var center = {
        x: width / 2,
        y: height / 2
    };

    var z = Math.min(width, height) / 300.0;

    // Set the initial outer radius
    var outerRadius = Math.min(width, height) / 2;

    var reduceOuterRadius = function (amount) {
        outerRadius -= amount * z;
    };

    reduceOuterRadius(5);

    // Draw the outer circle
    var drawCircle = function (amount) {

        var lineWidth = amount * z;
        var radius = outerRadius - lineWidth / 2;

        context.beginPath();
        context.arc(center.x, center.y, radius, 0, 2 * Math.PI, false);
        context.lineWidth = lineWidth;
        context.strokeStyle = '#000';
        context.stroke();

        outerRadius -= lineWidth;
    };

    function drawTextAlongCircle(str, centerX, centerY, radius, start) {
        var len = str.length, s;
        var angle = Math.PI * 2;
        context.save();
        context.translate(centerX, centerY);

        context.rotate(start);
        for (var n = 0; n < len; n++) {

            context.save();
            context.translate(0, -1 * radius);
            s = str[n];

            context.fillStyle = 'rgba(0, 0, 0, 1)';
            context.fillText(s, 0, 0);
            context.restore();

            context.rotate(angle / len);
        }
        context.restore();
    }

    var drawStar = function (amount) {

        var lineWidth = amount * z;
        var points = [];
        var angle = Math.PI / 2;
        var delta = Math.PI * 2 / 7;
        var radius = outerRadius - lineWidth / 2;

        for (var i = 0; i < 7; i++) {
            points.push({
                x: Math.cos(angle) * radius + center.x,
                y: Math.sin(angle) * radius + center.y
            });
            angle += delta * 2;
        }

        // miter line join (left)
        var point = points[points.length - 1];
        context.beginPath();
        context.moveTo(point.x, point.y);
        for (var i = 0; i < points.length; i++) {
            point = points[i];
            context.lineTo(point.x, point.y);
        }
        context.lineJoin = 'miter';
        context.lineWidth = lineWidth;
        context.closePath();
        context.stroke();
    };

    var drawStarSegments = function (amount) {

        // Find the points
        var lineWidth = amount * z;
        var outerPoints = [];
        var innerPoints = [];
        var angle = Math.PI / 2;
        var delta = Math.PI * 2 / 7;
        var innerRadius = outerRadius - lineWidth;
        for (var i = 0; i < 7; i++) {
            outerPoints.push({
                x: Math.cos(angle) * outerRadius + center.x,
                y: Math.sin(angle) * outerRadius + center.y
            });
            innerPoints.push({
                x: Math.cos(angle) * innerRadius + center.x,
                y: Math.sin(angle) * innerRadius + center.y
            });
            angle += delta * 2;
        }

        context.lineWidth = 1;

        // miter line join (left)
        var cells = [];
        var cellsPerSegment = 100;
        for (var i = 0; i < 7; i++) {
            var indexStart = i;
            var indexEnd = (i + 1) % 7;

            // Outer endpoints
            var o1 = outerPoints[indexStart];
            var o2 = outerPoints[indexEnd];

            // Inner end points
            var i1 = innerPoints[indexStart];
            var i2 = innerPoints[indexEnd];

            // Deltas
            var oD = {
                x: (o2.x - o1.x) / cellsPerSegment,
                y: (o2.y - o1.y) / cellsPerSegment
            };
            var iD = {
                x: (i2.x - i1.x) / cellsPerSegment,
                y: (i2.y - i1.y) / cellsPerSegment
            };

            // Start at one end
            var last = {
                ix: i1.x,
                iy: i1.y,
                ox: o1.x,
                oy: o1.y
            };

            for (var s = 0; s < cellsPerSegment; s++) {
                
                // default to o2 and i2 if this is the last, otherwise calculate it!
                var next = {
                    ix: last.ix + iD.x,
                    iy: last.iy + iD.y,
                    ox: last.ox + oD.x,
                    oy: last.oy + oD.y,
                };

                cells.push({
                    color: 'black',
                    points: [
                    { x: last.ix, y: last.iy },
                    { x: last.ox, y: last.oy },
                    { x: next.ox, y: next.oy },
                    { x: next.ix, y: next.iy }
                    ]
                });

                last = next;
            }



        }

        $.each(cells, function (index, cell) {
            var number = (index + colorOffset) % cells.length;
            cell.color = Color.ByNumber(number, cells.length);

        });

        var drawCell = function(cell) {
            
            context.fillStyle = cell.color;
            context.strokeStyle = cell.color;
            context.lineJoin = 'miter';

            context.beginPath();
            context.moveTo(cell.points[0].x, cell.points[0].y);
            context.lineTo(cell.points[1].x, cell.points[1].y);
            context.lineTo(cell.points[2].x, cell.points[2].y);
            context.lineTo(cell.points[3].x, cell.points[3].y);
            context.lineTo(cell.points[0].x, cell.points[0].y);
            context.closePath();

            
            context.stroke();
            context.fill();
        };


        var first = Math.floor(cellsPerSegment / 2);
        var second = cellsPerSegment - first;

        // Draw the first halfs
        for (var n = 0; n < 7; n++) {
            var i = cellsPerSegment * n;

            for (var j = 0; j < first; j++) {
                drawCell(cells[i+j]);
            }
        }

        // Draw the second halfs
        for (var n = 0; n < 7; n++) {
            var i = cellsPerSegment * n + first;

            for (var j = 0; j < second; j++) {
                drawCell(cells[i+j]);
            }
        }


//        $.each(cells, function (index, cell) {
//            
//            
//            drawCell(cell);

//        });






    };



    drawCircle(2);
    reduceOuterRadius(4);
    drawCircle(2);


    var drawCircleStar = function (amount) {

        var lineWidth = amount * z;
        var radius = 12 * z;

        var star = {
            x: center.x,
            y: center.y - outerRadius + 11 * z
        };

        // Draw the circle
        context.beginPath();
        context.arc(star.x, star.y, radius, 0, 2 * Math.PI, false);
        context.lineWidth = lineWidth;
        context.strokeStyle = '#000';
        context.stroke();

        context.beginPath();
        for (var i = 0; i < 8; i++) {
            var angle = Math.PI * 2 * (i / 8);
            context.moveTo(star.x, star.y);
            var edge = {
                x: Math.cos(angle) * radius + star.x,
                y: Math.sin(angle) * radius + star.y
            };

            context.lineTo(edge.x, edge.y);
        }
        context.lineWidth = lineWidth;
        context.stroke();


    };

    drawCircleStar(2);


    reduceOuterRadius(22);

    var fontSize = 18 * z;
    context.font = 'bold ' + fontSize + 'pt "Vollkorn"';
    context.textAlign = 'center';
    drawTextAlongCircle('   SPEECH FROM GOD  ', center.x, center.y, outerRadius + 2.5 * z, 0);



    drawCircle(2);
    reduceOuterRadius(4);
    drawCircle(2);
    reduceOuterRadius(9);

    drawStarSegments(10);

    reduceOuterRadius(35);

    fontSize = 13 * z;
    context.strokeStyle = '#000';
    context.font = 'bold ' + fontSize + 'pt "Vollkorn"';
    drawTextAlongCircle('ΛΟΓΑΕΤΗ', center.x, center.y, outerRadius + 2 * z, Math.PI / 7);


    (function (amount) {
        var lineWidth = amount * z;
        var radius = 50 * z;
        var xOffset = 9 * z;
        var yOffset = 30 * z;
        var xStrech = 35 * z;
        var yStrech = 25 * z;

        // The curved A

        var lowerLeft = {
            x: center.x - xOffset,
            y: center.y + yOffset
        };

        var lowerRight = {
            x: center.x + xOffset,
            y: center.y + yOffset
        };

        var upperCenter = {
            x: center.x,
            y: center.y - yOffset
        };

        context.beginPath();

        // Start in lower left
        context.moveTo(lowerLeft.x, lowerLeft.y);

        // Move to upper center
        context.quadraticCurveTo(
                    center.x - xStrech * 0.9,
                    center.y - yOffset + yStrech,
                    upperCenter.x,
                    upperCenter.y
                    );

        // Now to lower right
        context.quadraticCurveTo(
                    center.x + xStrech * 0.9,
                    center.y - yOffset + yStrech,
                    lowerRight.x,
                    lowerRight.y
                    );

        // Move back to center
        context.quadraticCurveTo(
                    center.x + xStrech * 0.7,
                    center.y - yOffset + yStrech,
                    upperCenter.x,
                    upperCenter.y
                    );

        context.quadraticCurveTo(
                    center.x - xStrech * 0.7,
                    center.y - yOffset + yStrech,
                    lowerLeft.x,
                    lowerLeft.y
                    );

        //context.quadraticCurveTo(center.x + xStrech * 0.8, center.y - yOffset + yStrech, lowerRight.x, lowerRight.y);

        context.lineJoin = 'miter';
        context.lineWidth = lineWidth * 0.75;
        context.stroke();

        context.fillStyle = '#000';
        context.fill();

        // The line

        var right = {
            x: center.x + 26 * z,
            y: center.y
        };

        // The x
        var offset = 4 * z;
        context.beginPath();
        context.moveTo(right.x - offset, right.y - offset);
        context.lineTo(right.x + offset, right.y + offset);
        context.moveTo(right.x + offset, right.y - offset);
        context.lineTo(right.x - offset, right.y + offset);
        context.lineWidth = lineWidth * 0.8;
        context.stroke();

        var left = {
            x: center.x - (right.x + offset - center.x),
            y: center.y
        };

        // Now draw the line
        context.beginPath();
        context.moveTo(left.x, left.y);
        context.lineTo(right.x, right.y);
        context.lineWidth = lineWidth;
        context.stroke();


        // 77 on top
        fontSize = 16 * z;
        context.font = 'bold ' + fontSize + 'pt "Vollkorn"';
        context.textAlign = 'center';
        context.fillText('77', center.x, center.y - 38 * z);

        // 7 on left
        context.fillText('7', left.x - 7 * z, left.y + 3 * z);

        // 7 on left
        context.fillText('77', right.x + offset + 11 * z, right.y + 3 * z);

        // 7 on lower left
        context.fillText('7', lowerLeft.x, lowerLeft.y + 15 * z);

        // 7 on lower right
        context.fillText('7', lowerRight.x, lowerRight.y + 15 * z);

        // Last X
        var offset = 4 * z;
        var lowerCenter = {
            x: center.x,
            y: lowerRight.y + 13 * z
        };
        context.beginPath();
        context.moveTo(lowerCenter.x - offset, lowerCenter.y - offset);
        context.lineTo(lowerCenter.x + offset, lowerCenter.y + offset);
        context.moveTo(lowerCenter.x + offset, lowerCenter.y - offset);
        context.lineTo(lowerCenter.x - offset, lowerCenter.y + offset);
        context.lineWidth = lineWidth * 0.8;
        context.stroke();

    })(2.5);
};

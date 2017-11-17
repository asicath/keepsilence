
var TableDraw = (function() {

    var my = {
        recalcNeeded: true,
        font: vollkorn
        //font: enochian
    };

    var cells;
    var canvas, lines;
    var tableWidth, tableHeight, cellWidth, cellHeight;
    var xOffset, yOffset;

    var columns = 12*2+1;
    var rows = 13*2+1;

    // Get a cell object by position
    my.getCell = function(xPos, yPos) {

        var x = Math.floor((xPos - xOffset) / cellWidth);
        var y = Math.floor((yPos - yOffset) / cellHeight);

        var cell = _.find(cells, function(c) {
            return c.x == x && c.y == y;
        });

        return cell;
    };

    my.initTableUI = function(tableCells) {

        cells = tableCells;

        // Get the canvas object and its parent

        calcSizes();
    };

    var calcSizes = function() {
        canvas = document.getElementById("table");

        var container = $(canvas).parent();

        // Get the width of parent, we will use all of this
        var maxWidth = container.width();

        var maxHeight = $(window).innerHeight();



        // dynamic for now...
        //var canvasWidth = canvas.width();
        //var canvasHeight = canvas.height();

        xOffset = 10;
        yOffset = 10;


        // try to maximize width first
        var canvasWidth = maxWidth;
        tableWidth = canvasWidth - xOffset * 2;
        cellWidth = (1/columns) * tableWidth;

        // Now calc the height based on the width for square cells
        cellHeight = cellWidth;
        tableHeight = cellHeight * rows;
        var canvasHeight = tableHeight + yOffset * 2;


        // Determine if valid...
        if (canvasHeight > maxHeight) {

            // reverse it
            canvasHeight = maxHeight;
            tableHeight = canvasHeight - yOffset * 2;
            cellHeight = (1/rows) * tableHeight;

            // now width
            cellWidth = cellHeight;
            tableWidth = cellWidth * columns;
            canvasWidth = tableWidth + xOffset * 2;

        }


        // Set width and height
        if ($(canvas).attr('width') != canvasWidth) { $(canvas).attr('width', canvasWidth); }
        if ($(canvas).attr('height') != canvasHeight) { $(canvas).attr('height', canvasHeight); }

        lines = initLines(tableWidth, tableHeight);

    };

    my.drawTable = function(spirits, highlightCell) {

        //var start = new Date();

        if (my.recalcNeeded) {
            calcSizes();
            my.recalcNeeded = false;
        }


        var context = canvas.getContext('2d');
        //context.webkitImageSmoothingEnabled = true;

        context.clearRect(0, 0, tableWidth + xOffset * 2, tableHeight + yOffset * 2);

        context.save();
        context.translate(xOffset,yOffset);







        // highlight a cell
        //var highlightCell = false;
        //if (highlightCell) {
        //    var x = highlightCell.x * cellWidth;
        //    var y = highlightCell.y * cellHeight;

            /*
            context.fillStyle = "rgba(0, 0, 0, 0.2)";
            context.beginPath();
            context.rect(x, y, cellWidth, cellHeight);
            context.fill();
            */

            /*
            context.strokeStyle = "rgba(0, 0, 0, 1)";
            context.beginPath();
            context.lineWidth = 3;//index * 2 + 3;
            context.rect(x, y, cellWidth, cellHeight);
            context.stroke();
            */
        //}

        drawSpiritGrid(context);

        // Draw the highlighted spirits
        if (spirits) {



            // Fill the squares
            _.each(spirits, function(spirit) {
                if (spirit.backgroundColor != null) {
                    fillSpirit(context, spirit);
                }
            });

            //drawLines(context);
            drawGrid(context);

            // draw the sigils
            _.each(spirits, function(spirit) {
                if (spirit.sigilColor != null) {
                    drawSpirit(context, spirit);
                }
            });
        }
        else {
            //drawLines(context);
            drawGrid(context);
        }

        drawText(context, highlightCell);


        context.restore();

        //var end = new Date();

        //console.log(end - start);
    };

    var drawText = function(context, highlightCell) {

        var scalePercent = 0.02;

        var maxLetterHeight = 0;
        var maxLetterWidth = 0;

        _.each(cells, function(cell) {
            var b = JSFont.getGlyphBounds(cell.val);
            if (b) {
                if (b.max.x > maxLetterWidth) maxLetterWidth = b.max.x;
                if (Math.abs(b.min.y) > maxLetterHeight) maxLetterHeight = Math.abs(b.min.y);
            }
        });

        scalePercent = Math.min((cellWidth * 0.9) / maxLetterWidth, (cellHeight * 0.9) / maxLetterHeight);


        _.each(cells, function(cell) {
            var x = (cell.x / columns) * tableWidth;
            var y = (cell.y / rows) * tableHeight;

            if (cell == highlightCell) {
                var colorFill = 'rgba(0, 0, 0, 1)';
                var colorStroke = 'rgba(255, 255, 255, 1)';
                JSFont.draw(context, my.font, cell.val, scalePercent, x, y, cellWidth, cellHeight, colorStroke, colorFill, cell.displayBackwards);
            }
            else {

                var colorFill = 'rgba(0, 0, 0, 1)';
                JSFont.draw(context, my.font, cell.val, scalePercent, x, y, cellWidth, cellHeight, null, colorFill, cell.displayBackwards);
            }

        });
    };

    var drawGrid = function(ctx) {
        var width = tableWidth;
        var height = tableHeight;
        var baseLineWidth = tableWidth * 0.002;
        var cellWidth = (1/columns) * width;
        var cellHeight = (1/rows) * height;

        ctx.lineWidth = baseLineWidth;

        ctx.strokeStyle = "rgba(0, 0, 0, 1)";

        // Draw outline
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(columns * cellWidth, 0);
        ctx.lineTo(columns * cellWidth, rows * cellHeight);
        ctx.lineTo(0, rows * cellHeight);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.stroke();

        // Horizontal
        for (var row = 1; row < rows; row++) {
            // All at the same y
            var y = (row / rows) * height;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(columns * cellWidth, y);
            ctx.stroke();
        }

        // Vertical
        for (var col = 1; col < columns; col++) {
            // All at the same x
            var x = (col / columns) * width;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, rows * cellHeight);
            ctx.stroke();
        }




    };

    var drawSpiritGrid = function(ctx) {

        var width = tableWidth;
        var height = tableHeight;
        var baseLineWidth = tableWidth * 0.002;
        var cellWidth = (1/columns) * width;
        var cellHeight = (1/rows) * height;

        var pad = baseLineWidth * 2.5;

        var drawSolid = function(x1, y1, x2, y2) {
            var px1 = x1 * cellWidth;
            var px2 = (x2 + 1) * cellWidth;
            var py1 = y1 * cellHeight;
            var py2 = (y2 + 1) * cellHeight;

            ctx.beginPath();
            ctx.moveTo(px1, py1);
            ctx.lineTo(px2, py1);
            ctx.lineTo(px2, py2);
            ctx.lineTo(px1, py2);
            ctx.lineTo(px1, py1);
            ctx.closePath();

            ctx.fill();
        };

        var drawInner = function(x1, y1, x2, y2) {

            var px1 = x1 * cellWidth;
            var px2 = (x2 + 1) * cellWidth;
            var py1 = y1 * cellHeight;
            var py2 = (y2 + 1) * cellHeight;

            ctx.beginPath();
            ctx.moveTo(px1, py1);
            ctx.lineTo(px2, py1);
            ctx.lineTo(px2, py2);
            ctx.lineTo(px1, py2);
            ctx.lineTo(px1, py1);
            ctx.lineTo(px1+pad, py1+pad);
            ctx.lineTo(px1+pad, py2-pad);
            ctx.lineTo(px2-pad, py2-pad);
            ctx.lineTo(px2-pad, py1+pad);
            ctx.lineTo(px1+pad, py1+pad);
            ctx.lineTo(px1, py1);
            ctx.closePath();

            ctx.fill();
        };



        // Black cross
        ctx.fillStyle = 'rgba(204, 204, 204, 1)';
        drawSolid(0, 13, 24, 13);
        drawSolid(12, 0, 12, 26);



        ctx.fillStyle = defaultHighlightColor;

        drawInner(0, 13, 24, 13);
        drawInner(12, 0, 12, 26);

        // now the quarters

        var drawQuarter = function(xOffset, yOffset) {
            // draw senior
            drawInner(5+xOffset, 0+yOffset, 6+xOffset, 12+yOffset);
            drawInner(0+xOffset, 6+yOffset, 11+xOffset, 6+yOffset);

            drawCross(xOffset, yOffset);
            drawCross(xOffset+7, yOffset);
            drawCross(xOffset, yOffset+7);
            drawCross(xOffset+7, yOffset+7);
        };

        var drawCross = function(xOffset, yOffset) {
            drawInner(2+xOffset, 0+yOffset, 2+xOffset, 5+yOffset);
            drawInner(0+xOffset, 1+yOffset, 4+xOffset, 1+yOffset);
        };

        drawQuarter(0, 0);
        drawQuarter(13, 0);
        drawQuarter(0, 14);
        drawQuarter(13, 14);
    };

    var drawLines = function(context) {
        // Draw the lines
        context.lineCap = 'round';
        _.each(lines, function(line) {
            context.beginPath();
            context.moveTo(line.x1, line.y1);
            context.lineTo(line.x2, line.y2);

            // set line color
            context.strokeStyle = "rgba(0, 0, 0, 1)";
            context.lineWidth = line.lineWidth;
            context.stroke();
        });
    };

    var fillSpirit = function(context, spirit) {
        _.each(spirit.sigilLines, function(segment) {
            context.beginPath();
            _.each(segment, function(cellIndex, i) {
                var cell = spirit.cells[cellIndex];
                var x = cell.x * cellWidth;
                var y = cell.y * cellHeight;

                context.fillStyle = spirit.backgroundColor;
                context.beginPath();
                context.rect(x, y, cellWidth, cellHeight);
                context.fill();
            });
        });
    };



    var drawSpirit = function(context, spirit) {

        _.each(spirit.sigilLines, function(segment) {
            context.beginPath();
            _.each(segment, function(cellIndex, i) {
                var cell = spirit.cells[cellIndex];
                var x = (cell.x + 0.5) * cellWidth;
                var y = (cell.y + 0.5) * cellHeight;

                if (i == 0) {
                    context.moveTo(x, y);
                }
                else {
                    context.lineTo(x, y);
                }
            });
            context.strokeStyle = spirit.sigilColor;
            context.lineWidth = spirit.lineWidth * cellWidth;
            context.stroke();
        });

    };

    var initLines = function(width, height) {

        var lines = [];
        var lineWidth = 1;

        var cellWidth = (1/columns) * width;
        var cellHeight = (1/rows) * height;

        // create the lines

        // Horizontal
        for (var row = 0; row <= rows; row++) {

            // All at the same y
            var y = (row / rows) * height;

            for (var col = 0; col < columns; col++) {

                var line = {
                    x1: cellWidth * col,
                    y1: y,
                    x2: cellWidth * (col + 1),
                    y2: y,
                    lineWidth: lineWidth * 0.5
                };



                // black cross
                if (col != 12) {
                    if (row == 13 || row == 14) {
                        line.lineWidth = lineWidth * 3;
                    }
                    if (row == 0 || row == rows) {
                        line.lineWidth = lineWidth * 3;
                    }
                }

                // seniors
                if (col != 12) {
                    if (row == 6 || row == 7 || row == 20 || row == 21) {
                        line.lineWidth = lineWidth * 2.5;
                    }
                }

                // quarter crosses
                if (
                    row == 1 || row == 2
                    || row == 8 || row == 9
                    || row == 15 || row == 16
                    || row == 22 || row == 23
                    ) {

                    if (col <= 4
                        || col >= 7 && col <= 11
                        || col >= 13 && col <= 17
                        || col >= 20
                        ) {
                        line.lineWidth = lineWidth * 2;
                    }

                }

                lines.push(line);

            }

        }

        // Vertical
        for (var col = 0; col <= columns; col++) {

            // All at the same x
            var x = (col / columns) * width;

            for (var row = 0; row < rows; row++) {

                var line = {
                    x1: x,
                    y1: cellHeight * row,
                    x2: x,
                    y2: cellHeight * (row + 1),
                    lineWidth: lineWidth * 0.5
                };



                if (row != 13) {

                    // black cross
                    if (col == 12 || col == 13)
                        line.lineWidth = lineWidth * 3;
                    if (col == 0 || col == columns) {
                        line.lineWidth = lineWidth * 3;
                    }

                    // seniors
                    if (col == 5 || col == 6 || col == 7
                        || col == 18 || col == 19 || col == 20)
                        line.lineWidth = lineWidth * 2.5;
                }

                // quarter crosses
                if (col == 2 || col == 3
                    || col == 9 || col == 10
                    || col == 15 || col == 16
                    || col == 22 || col == 23
                    ) {

                    if (row >= 0 && row <= 5
                        || row >= 7 && row <= 12
                        || row >= 14 && row <= 19
                        || row >= 21 && row <= 26
                        ) {
                        line.lineWidth = lineWidth * 2;
                    }

                }


                lines.push(line);
            }
        }

        return lines;
    };






    return my;
})();
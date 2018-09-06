
var JSFont = (function() {
    var exports = {};




    exports.getGlyphBounds = function(char) {
        var glyph = getGlyphCached(vollkorn, char, 1);
        if (!glyph) return null;
        return glyph.bounds;
    };

    exports.draw = function(ctx, font, char, scalePercent, x, y, width, height, colorStroke, colorFill, displayBackwards) {

        var glyph = getGlyphCached(font, char, scalePercent);

        if (!glyph) {
            console.log('Glyph not found :(');
            return;
        }

        if (!glyph.centered) {
            // Now center
            var actions = glyph.actions;
            var b = glyph.bounds;
            glyph.centered = translate(actions, (width - b.max.x) / 2, height - (height - Math.abs(b.min.y)) / 2);
        }

        var renderKey = char;
        if (displayBackwards) renderKey += "MM";
        if (colorStroke) {
            renderKey += "#" + colorStroke;
        }
        if (colorFill) {
            renderKey += "$" + colorFill;
        }

        if (!glyph.rendered) glyph.rendered = {};

        if (!glyph.rendered[renderKey]) {

            var actionsToRender = glyph.centered;
            if (displayBackwards) {
                actionsToRender = mirror(actionsToRender);
            }

            // Create canvas, size it, get the context
            var buffer = document.createElement('canvas');
            buffer.width = width;
            buffer.height = height;
            var ctxBuffer = buffer.getContext('2d');

            ctxBuffer.beginPath();

            renderActions(ctxBuffer, actionsToRender, 0, 0);

            if (colorStroke) {
                ctxBuffer.strokeStyle = colorStroke;
                ctxBuffer.lineWidth = 3;
                ctxBuffer.stroke();
            }

            if (colorFill) {
                ctxBuffer.fillStyle = colorFill;
                ctxBuffer.fill();
            }

            glyph.rendered[renderKey] = buffer;
        }

        // Draw the letter

        ctx.drawImage(glyph.rendered[renderKey], x, y);

    };







    var glyphCache = {};

    var getGlyphCached = function(face, char, scalePercent) {
        var key = 'sp' + scalePercent;
        if (!glyphCache[key]) {
            glyphCache[key] = {};
        }

        var cache = glyphCache[key];

        if (!cache[char]) {
            var glyph = {};

            glyph.actions = getGylphActions(face, char);

            if (glyph.actions == null) {return null;}

            trim(glyph.actions);
            flip(glyph.actions);

            if (scalePercent != 1) {
                scale(glyph.actions, scalePercent);
            }

            // Get the bounds
            glyph.bounds = getBounds(glyph.actions);

            cache[char] = glyph;
        }

        return cache[char];
    };

    var translate = function(actions, x, y) {
        var translated = [];
        for (var i = 0; i < actions.length; i++) {

            translated[i] = {};

            var action = actions[i];

            translated[i].x = action.x + x;
            translated[i].y = action.y + y;
            translated[i].actionType = action.actionType;

            switch(action.actionType) {
                case 'q':
                    translated[i].cpx = action.cpx + x;
                    translated[i].cpy = action.cpy + y;
                    break;
                case 'b':
                    // action.cp1x
                    // action.cp1y
                    // action.cp2x
                    // action.cp2y
                    console.log('error');
                    break;
            }
        }
        return translated;
    };

    var scale = function(actions, scale) {
        for (var i = 0; i < actions.length; i++) {

            var action = actions[i];

            action.x = action.x * scale;
            action.y = action.y * scale;

            switch(action.actionType) {
                case 'q':
                    action.cpx = action.cpx * scale;
                    action.cpy = action.cpy * scale;
                    break;
                case 'b':
                    // action.cp1x
                    // action.cp1y
                    // action.cp2x
                    // action.cp2y
                    console.log('error');
                    break;
            }
        }
    };

    // Get rid of empty space before and below
    var trim = function(actions) {
        var b = getBounds(actions);

        for (var i = 0; i < actions.length; i++) {

            var action = actions[i];

            action.x = action.x - b.min.x;
            action.y = action.y - b.min.y;

            switch(action.actionType) {
                case 'q':
                    action.cpx = action.cpx - b.min.x;
                    action.cpy = action.cpy - b.min.y;
                    break;
                case 'b':
                    //ctx.bezierCurveTo(action.cp1x, action.cp1y, action.cp2x, action.cp2y, action.x, action.y);
                    console.log('error');
                    break;
            }
        }
    };

    var flip = function(actions) {
        var b = getBounds(actions);

        for (var i = 0; i < actions.length; i++) {

            var action = actions[i];

            action.y = action.y * -1;


            switch(action.actionType) {
                case 'q':
                    action.cpy = action.cpy * -1;
                    //ctx.quadraticCurveTo(action.x, action.y, action.cpx, action.cpy);
                    break;
                case 'b':
                    console.log('error');
                    //ctx.bezierCurveTo(action.cp1x, action.cp1y, action.cp2x, action.cp2y, action.x, action.y);
                    break;
            }
        }

    };

    var mirror = function(actions) {
        var b = getBounds(actions);

        var translated = [];
        for (var i = 0; i < actions.length; i++) {

            translated[i] = {};

            var action = actions[i];

            translated[i].x = b.max.x - action.x + b.min.x;
            translated[i].y = action.y;
            translated[i].actionType = action.actionType;

            switch(action.actionType) {
                case 'q':
                    translated[i].cpx = b.max.x - action.cpx + b.min.x;
                    translated[i].cpy = action.cpy;
                    break;
                case 'b':
                    // action.cp1x
                    // action.cp1y
                    // action.cp2x
                    // action.cp2y
                    console.log('error');
                    break;
            }
        }
        return translated;
    };

    var getGylphActions = function(face, char) {

        var glyph = face.glyphs[char];

        if (!glyph.o) {
            return null;
        }

        // Parse the string
        if (!glyph.outline) {
            glyph.outline = glyph.o.split(' ');
        }

        // Now convert to actions
        glyph.actions = [];

        var outline = glyph.outline;
        var outlineLength = outline.length;
        for (var i = 0; i < outlineLength; ) {

            var actionType = outline[i++];

            switch(actionType) {
                case 'm':
                    glyph.actions.push({
                        actionType: 'm',
                        x: parseInt(outline[i++]),
                        y: parseInt(outline[i++])
                    });
                    break;
                case 'l':
                    glyph.actions.push({
                        actionType: 'l',
                        x: parseInt(outline[i++]),
                        y: parseInt(outline[i++])
                    });
                    break;

                case 'q':
                    glyph.actions.push({
                        actionType: 'q',
                        cpx: parseInt(outline[i++]),
                        cpy: parseInt(outline[i++]),
                        x: parseInt(outline[i++]),
                        y: parseInt(outline[i++])
                    });
                    break;

                case 'b':

                    //cp1x,cp1y,cp2x,cp2y
                    glyph.actions.push({
                        actionType: 'b',
                        x: parseInt(outline[i++]),
                        y: parseInt(outline[i++]),
                        cp1x: parseInt(outline[i++]),
                        cp1y: parseInt(outline[i++]),
                        cp2x: parseInt(outline[i++]),
                        cp2y: parseInt(outline[i++])
                    });
                    break;
            }
        }

        return glyph.actions;
    };

    var renderActions = function(ctx, actions) {

        for (var i = 0; i < actions.length; i++) {

            var action = actions[i];

            switch(action.actionType) {
                case 'm':
                    ctx.moveTo(action.x, action.y);
                    break;
                case 'l':
                    ctx.lineTo(action.x, action.y);
                    break;
                case 'q':
                    ctx.quadraticCurveTo(action.x, action.y, action.cpx, action.cpy);
                    break;
                case 'b':
                    alert('error');
                    //ctx.bezierCurveTo(action.cp1x, action.cp1y, action.cp2x, action.cp2y, action.x, action.y);
                    break;
            }
        }

    };

    var getBounds = function(actions) {

        var b = {
            min: {
                x: null,
                y: null
            },
            max: {
                x: null,
                y: null
            }
        };

        for (var i = 0; i < actions.length; i++) {
            var action = actions[i];

            // always do this
            if (b.min.x == null || action.x < b.min.x) b.min.x = action.x;
            if (b.min.y == null || action.y < b.min.y) b.min.y = action.y;
            if (b.max.x == null || action.x > b.max.x) b.max.x = action.x;
            if (b.max.y == null || action.y > b.max.y) b.max.y = action.y;

        }

        return b;
        //http://html5tutorial.com/how-to-draw-n-grade-bezier-curve-with-canvas-api/#quadratic-curves
        // q
        //For t = 0 to 1
        //x = (1-t)^2 * p0.x + 2 * (1-t) * p1.x + t^2 * p2.x
        //y = (1-t)^2 * p0.y + 2 * (1-t) * p1.y + t^2 * p2.y

    };

    return exports;

})();
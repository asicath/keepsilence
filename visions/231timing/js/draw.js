let state = null;

function fullscreenCanvas(id) {

    // get canvas and parent
    let canvas = $(id)
    let container = $(canvas).parent();

    // Get the width of parent, we will use all of this
    let maxWidth = container.width();
    let maxHeight = $(window).innerHeight() - 20;

    let size = Math.min(maxWidth, maxHeight);

    // Set width and height
    if ($(canvas).attr('width') !== size) { $(canvas).attr('width', size); }
    if ($(canvas).attr('height') !== size) { $(canvas).attr('height', size); }
}

function init() {
    state = {};
    state.config = Object.assign(
        {
            background: '#ffffff'
        },
        words.resh,
        times.first
    );

    // init the audio
    state.audio = {
        low: {url:'./low.mp3'},
        high: {url:'./high.mp3'}
    };
    for (let key in state.audio) {
        let o = state.audio[key];
        o.index = 0;
        o.audioArray = [];
        for (let i = 0; i < 10; i++) {
            o.audioArray.push(new Audio(o.url));
        }
    }

    $('body').css('background-color', state.config.background);

    // get the total count
    state.partCount = state.config.parts.reduce((total, part) => {
        return total + part.count;
    }, 0);

    // create the timer
    state.timer = new BeatTimer(state.config);

    state.timer.on('beat', beat => {
        //console.log(`${beat.text}\t${(beat.duration/1000)}`);

        if (beat.audio) {
            let name = beat.audio;
            let o = state.audio[name];
            o.audioArray[o.index].play();
            o.index = (o.index + 1) % o.audioArray.length;
        }

    });
    state.timer.on('tick', beat => {
        //console.log(` .`);
    });

    state.timer.onTick();
}


function draw(id) {

    fullscreenCanvas(id);

    if (state === null) return;

    state.timer.onTick();
    
    // get the canvas and init
    let canvas = $(id)[0];
    let context = canvas.getContext('2d');
    context.webkitImageSmoothingEnabled = true;

    //let outerRadius = Math.min(width, height) / 2;

    // clear the whole field
    let width = canvas.width;
    let height = canvas.height;
    context.clearRect(0, 0, width, height);

    // now the actual draw

    // draw the text and circle
    drawNameCircle(canvas, context, state.config.parts);
}

function getTrimmedLetter(letter) {
    // find preferred font size/name
    let fontSize = 40;
    let fontName = 'Times New Roman';
    if (letter === 'ⲝ') {
        //fontName = 'Noto Sans Coptic';
        //fontName = 'Antinoou';

        // this has the best version
        fontName = 'CS Pishoi';
        //fontName = 'CS Copt';
        letter = 'x';
    }
    else if (letter === 'Ⲉ') {
        //fontName = 'CS Pishoi';
        //letter = 'E';

        fontName = 'Antinoou';
    }
    else if (letter.match(/[a-z]/i)) {
        fontName = 'ColdstyleRoman';
    }

    // generate the letter image
    return getMinimumSizeImage(letter, fontName, fontSize);
}

function drawNameCircle(canvas, ctx, parts) {

    // calc center
    let center = {x: canvas.width / 2, y: canvas.height / 2};

    // calc radius
    let radius = {
        max: canvas.height / 2
    };

    // find the top and bottom of text draw area
    radius.textTop = radius.max * 0.915; // should be aligned with the UV template lip
    radius.textBottom = radius.max * 0.7; // allow for the text plus margins
    let innerCircleWidth = 6;
    radius.innerCircle = radius.textBottom - innerCircleWidth;

    // draw the line
    (() => {
        ctx.save();
        ctx.translate(center.x, center.y);

        let max = radius.textTop;
        let angle = Math.PI * 2 * state.timer.linePercent -Math.PI/2;
        let x0 = Math.cos(angle) * max * 0.2;
        let y0 = Math.sin(angle) * max * 0.2;
        let x1 = Math.cos(angle) * max;
        let y1 = Math.sin(angle) * max;

        ctx.strokeStyle = 'rgba(0,0,0,1)';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();

        ctx.restore();
    })();


    // draw the parts
    let anglePerCount = (Math.PI * 2) / state.partCount;
    let angle = 0;

    // find the draw position of all letters


    for (let i = 0; i < state.config.parts.length; i++) {

        ctx.save();
        ctx.translate(center.x, center.y);

        ctx.rotate(angle);

        let part = parts[i];

        let text = part.text;

        for (let i = 0; i < text.length; i++) {
            let letter = text[i];

            // generate the letter image
            let trimmed = getTrimmedLetter(letter);

            // draw the pre generated trimmed letter image
            let x = 0;
            let y = -1 * (radius.textTop + radius.textBottom) / 2;
            x -= trimmed.width / 2;
            y -= trimmed.height / 2;
            ctx.drawImage(trimmed.image, x, y, trimmed.width, trimmed.height);

            ctx.rotate(Math.PI * 2 / 70);
        }


        // advance the angle
        let advanceAngle = anglePerCount * part.count;
        angle += advanceAngle;

        ctx.restore();
    }



    // draw the circles

    ctx.save();
    ctx.translate(center.x, center.y);

    // inner circle
    ctx.beginPath();
    ctx.arc(0, 0, radius.textTop, 0, 2 * Math.PI, false);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, radius.textBottom, 0, 2 * Math.PI, false);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000';
    ctx.stroke();

    ctx.restore();

}

function drawPartsOnCircle({context, outerRadius, center}) {
    context.save();
    context.translate(center.x, center.y);

    let radius = outerRadius * 0.9;
    let angleOffset = -1 * Math.PI / 2;

    // draw the hand
    let angle = Math.PI * 2 * state.timer.linePercent + angleOffset;
    let x0 = Math.cos(angle) * radius * 0.2;
    let y0 = Math.sin(angle) * radius * 0.2;
    let x1 = Math.cos(angle) * radius;
    let y1 = Math.sin(angle) * radius;

    context.strokeStyle = 'rgba(0,0,0,1)';
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.stroke();

    // remaining time
    let timeRemaining = Math.ceil(state.timer.timeRemaining / 1000);
    let minutes = Math.floor(timeRemaining / 60);
    let seconds = (timeRemaining - minutes * 60).toString();
    if (seconds.length === 1) seconds = "0" + seconds;
    context.fillText(`${minutes}:${seconds}`, 0, -30);

    // time per rotation
    let lineDuration = Math.floor(state.timer.lineDuration / 100) / 10;
    context.fillText(lineDuration.toString(), 0, 30);

    // draw the words
    let fontSize = 18;
    let anglePerCount = (Math.PI * 2) / state.partCount;
    angle = 0;
    for (let i = 0; i < state.config.parts.length; i++) {
        let part = state.config.parts[i];

        context.fillStyle = 'rgba(0, 0, 0, 1)';
        let x = Math.cos(angle + angleOffset) * radius;
        let y = Math.sin(angle + angleOffset) * radius + fontSize / 2;
        context.fillText(part.text, x, y);

        angle += anglePerCount * part.count;
    }

    context.restore();
}





let minImageCache = {};

function getMinimumSizeImage(text, fontName, fontSize) {

    let key = `${fontName}_${text}_${fontSize}`;
    if (key in minImageCache) {
        return minImageCache[key];
    }

    // create the canvas/ctx
    let width = Math.ceil(fontSize*3);
    let height = width;
    //let canvas = createCanvas(width, height);
    let canvas = new OffscreenCanvas(width, height);
    let ctx = canvas.getContext('2d');
    ctx.textAlign = 'center';

    //ctx.fillStyle = "#ffffff";
    //ctx.fillRect(0, 0, canvas.width, canvas.height);

    // set the font
    ctx.font = `${fontSize}pt "${fontName}"`;
    ctx.textAlign = 'center';

    let value = {
        yMin: height,
        yMax: 0,
        xMin: width,
        xMax: 0,
        xDraw: Math.floor(width/2),
        yDraw: Math.floor(height/2)
    };

    // draw the text
    ctx.fillStyle = "#000000";
    ctx.fillText(text, value.xDraw, value.yDraw);

    // export to file
    //await exportCanvasToImage(canvas, "letter");

    // get the pixels
    let idata = ctx.getImageData(0, 0, width, height);

    // find min/max
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let index = (x + y * width) * 4;
            let pixel = {
                r: idata.data[index],
                g: idata.data[index+1],
                b: idata.data[index+2],
                a: idata.data[index+3]
            };

            // a non-white pixel
            //if (pixel.r < 255 || pixel.g < 255 || pixel.b < 255) {
            if (pixel.a > 0) {
                if (y > value.yMax) value.yMax = y;
                if (y < value.yMin) value.yMin = y;
                if (x > value.xMax) value.xMax = x;
                if (x < value.xMin) value.xMin = x;
            }
        }
    }

    value.width = value.xMax - value.xMin;
    value.height = value.yMax - value.yMin;

    // give a margin
    let margin = 2;
    value.width += margin * 2;
    value.height += margin * 2;
    value.xMin -= margin;
    value.yMin -= margin;
    value.xMax += margin;
    value.yMax += margin;

    // now create the min sized image?
    value.image = new OffscreenCanvas(value.width, value.height);
    let ctxOutput = value.image.getContext('2d');
    ctxOutput.drawImage(canvas,
        value.xMin, value.yMin, value.width, value.height,
        0, 0, value.width, value.height);

    minImageCache[key] = value;

    return value;
}
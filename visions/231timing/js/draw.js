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

function init(wordConfig, timeConfig) {
    state = {};
    state.config = Object.assign(
        {
            background: '#ffffff'
        },
        wordConfig,
        timeConfig
    );

    // init the audio
    state.audio = {
        low: {url:'./sound/low2.mp3'},
        high: {url:'./sound/high2-short.mp3'},
        beep: {url:'./sound/beep.wav'},
    };
    for (let key in state.audio) {
        let o = state.audio[key];
        o.index = 0;
        o.audioArray = [];
        for (let i = 0; i < 30; i++) {
            o.audioArray.push(new Audio(o.url));
        }
    }

    let synthConfig = {
        envelope: {
            attack: 0.005,
            decay: 0.1,
            sustain: 0.1,
            release: 0.1,
        }
    };

    // now the alt synth
    const synth1 = new Tone.Synth(synthConfig).toDestination();
    const synth2 = new Tone.Synth(synthConfig).toDestination();

    $('body').css('background-color', state.config.background);

    // get the total count
    state.partCount = state.config.parts.reduce((total, part) => {
        return total + part.count;
    }, 0);

    // create the timer
    state.timer = new BeatTimer(state.config);

    state.drumsEnabled = getQSBool('drums', true);
    state.timer.on('beat', beat => {
        //console.log(`${beat.text}\t${(beat.duration/1000)}`);

        if (beat.audio && state.drumsEnabled) {
            let name = beat.audio;

            //let o = state.audio[name];
            //o.audioArray[o.index].play();
            //o.index = (o.index + 1) % o.audioArray.length;

            if (name === 'low') {
                synth1.triggerAttackRelease("C3", 0.1);
            }
            else if (name === 'high') {
                synth2.triggerAttackRelease("C4", 0.005);
            }
            //play a middle 'C' for the duration of an 8th note

        }

    });

    state.beepsEnabled = getQSBool('beeps', false);
    state.lastCount = 10;
    state.timer.on('tick', beat => {
        //console.log(` .`);

        if (!state.beepsEnabled) return;
        let countDown = Math.ceil(state.timer.countDown / 1000);
        if (countDown > 2 && state.lastCount !== countDown) {
            let o = state.audio.beep;
            o.audioArray[o.index].play();
            o.index = (o.index + 1) % o.audioArray.length;

            state.lastCount = countDown;
        }
    });

    state.img = new Image();
    state.img.onload = function(){
        //ctx.drawImage(img,0,0);
    };
    //state.img.src = './img/XIX.png';
    //state.img.src = './img/XII.png';
    state.img.src = './img/XVI.png';
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


let maxSize = {};

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

    // draw the image
    (() => {
        ctx.save();
        ctx.translate(center.x, center.y);

        // max size should be innerCircle / 2
        //let imgRadius = state.img.height / 2;
        let imgRadius = Math.sqrt(Math.pow(state.img.width, 2) + Math.pow(state.img.height, 2)) / 2;

        let imgScale = (radius.textBottom) / imgRadius;
        imgScale *= 0.5;
        let scaledWidth = state.img.width*imgScale;
        let scaledHeight = state.img.height*imgScale;

        ctx.drawImage(state.img,
            0,0,state.img.width,state.img.height,
            -scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);
        ctx.restore();
    })();

    // draw the line
    (() => {
        ctx.save();
        ctx.translate(center.x, center.y);

        let max = radius.textBottom;
        let angle = Math.PI * 2 * state.timer.linePercent -Math.PI/2;
        let x0 = Math.cos(angle) * max * 0.5;
        let y0 = Math.sin(angle) * max * 0.5;
        let x1 = Math.cos(angle) * max;
        let y1 = Math.sin(angle) * max;

        ctx.strokeStyle = 'rgba(0,0,0,1)';
        ctx.lineWidth = 3;
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

            // little line as a tick
            if (i === 0) {
                ctx.strokeStyle = 'rgba(0,0,0,1)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(0, -radius.textBottom*0.9);
                ctx.lineTo(0, -radius.textBottom*1.05);
                ctx.stroke();
            }

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


    (() => {


        drawTimeLine(canvas, ctx, -1 * (radius.textTop-10), radius.textTop - 160, 100, 100);

        // remaining time
        let fontSize = 50;
        let fontName = 'consolas';
        ctx.font = `${fontSize}pt "${fontName}"`;

        if (state.timer.countDown > 0) {
            // "start"
            ctx.font = `${fontSize/2}pt "${fontName}"`;
            ctx.fillText("starts in:", radius.textTop-fontSize*4, -radius.textTop + fontSize*0.5);

            // now the actual timer
            ctx.font = `${fontSize}pt "${fontName}"`;
            let countDownText = `${Math.ceil(state.timer.countDown/1000)}`;
            ctx.textAlign = 'left';
            ctx.fillText(countDownText, radius.textTop, -radius.textTop + fontSize);
        }

        // dont draw if over
        if (typeof state.timer.timeRemaining === 'undefined') {

            //this.totalTime
            //this.initialDuration

            //return;
        }

        let timeRemaining = state.timer.timeRemaining || state.timer.totalTime;
        let timeRemainingNeg = timeRemaining < 0 ? "-" : "";
        timeRemaining = Math.ceil(Math.abs(timeRemaining) / 1000);
        let minutes = Math.floor(timeRemaining / 60);
        let seconds = (timeRemaining - minutes * 60).toString();
        if (seconds.length === 1) seconds = "0" + seconds;

        let remainingText = `${timeRemainingNeg}${minutes}:${seconds}`;
        ctx.textAlign = 'right';
        ctx.fillText(remainingText, radius.textTop, radius.textTop);

        // time per rotation
        let lineDuration = state.timer.lineDuration || state.timer.initialDuration;
        lineDuration = Math.floor(lineDuration / 100) / 10;

        let lineDurationText = lineDuration.toString();
        if (lineDurationText.indexOf(".") === -1) lineDurationText = lineDurationText + ".0";
        ctx.textAlign = 'left';
        ctx.fillText(lineDurationText, -radius.textTop, radius.textTop);


    })();


    ctx.restore();
}

function getMaxSize(key, value) {
    if (key in maxSize) {
        maxSize[key] = Math.max(value, maxSize[key]);
    }
    else {
        maxSize[key] = 0;
    }
    return maxSize[key];
}

function drawTimeLine(canvas, ctx, x, y, width, height) {

    //generate x/y points

    //EasingFunctions
    let points = [];
    let pointCount = 50;
    for (let i = 0; i < pointCount; i++) {
        let x = i / pointCount;
        let y = state.config.easingFunction(x);
        points.push({x, y});
    }

    //let scale = 100;
    ctx.beginPath();
    ctx.moveTo(points[0].x * width + x, points[0].y * height + y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x * width + x, points[i].y * height + y);
    }
    ctx.lineWidth = 2;
    ctx.stroke();

    //draw the current state
    let p = typeof state.timer.percentLinear !== 'undefined' ? state.timer.percentLinear : 0;
    let index = Math.floor(p * pointCount);
    let xI = points[index].x * width + x;
    let yI = points[index].y * height + y;

    ctx.beginPath();
    ctx.arc(xI, yI, 4, 0, Math.PI*2);
    ctx.fill();




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

let minImageCache = {};

function getMinimumSizeImage(text, fontName, fontSize) {

    let key = `${fontName}_${text}_${fontSize}`;
    if (key in minImageCache) {
        return minImageCache[key];
    }

    // create the canvas/ctx
    let width = Math.ceil(fontSize*3 * text.length);
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
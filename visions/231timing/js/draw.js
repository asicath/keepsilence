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
        times.short2
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
    let canvas = $(id);
    let context = canvas[0].getContext('2d');
    context.webkitImageSmoothingEnabled = true;
    let width = canvas.attr('width');
    let height = canvas.attr('height');
    let outerRadius = Math.min(width, height) / 2;

    context.clearRect(0, 0, width, height);
    let center = { x: width / 2, y: height / 2 };

    const a = {
        context,
        canvas,
        center,
        outerRadius
    };

    // init the font
    let fontSize = 18;
    context.font = 'bold ' + fontSize + 'pt "Vollkorn"';
    context.textAlign = 'center';



    drawCircle(a);
    drawPartsOnCircle(a);
}

// Draw the outer circle
function drawCircle ({context, outerRadius, center}) {

    let lineWidth = 3;
    let radius = outerRadius - lineWidth - 2;

    context.beginPath();
    context.arc(center.x, center.y, radius, 0, 2 * Math.PI, false);
    context.lineWidth = lineWidth;
    context.strokeStyle = '#000';
    context.stroke();
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

const { createCanvas, loadImage } = require('canvas');
const {paths, cards} = require('./data');

const pipPlacement = {
    1: {
        type: 'onCircle',
        radiusPercent: 0,
        startAngle: 0
    },
    2: {
        type: 'onCircle',
        radiusPercent: 0.5,
        startAngle: 0
    },
    3: {
        type: 'onCircle',
        radiusPercent: 0.666,
        startAngle: 0
    },
    4: {
        type: 'onCircle',
        radiusPercent: 0.5,
        startAngle: 0
    },
    5: {
        type: 'onCircle',
        radiusPercent: 0.666,
        startAngle: 0
    },
    6: {
        type: 'onCircle',
        radiusPercent: 0.666,
        startAngle: 0
    },
    7: {
        type: 'onCircle',
        radiusPercent: 0.666,
        startAngle: 0
    },
    8: {
        type: 'onCircle',
        radiusPercent: 0.666,
        startAngle: 0
    },
    9: {
        type: 'onCircle',
        radiusPercent: 0.666,
        startAngle: 0
    },
    10: {
        type: 'onCircle',
        radiusPercent: 0.75,
        startAngle: 0
    }
};

let images = {};

(async () => {
    //await loadImages();
    await drawCards();
})();

async function loadImages() {
    let fileNames = ["tatva-fire.png", "tatva-water.png", "tatva-air.png", "tatva-earth.png"];
    fileNames.forEach(async filename => {
        let image = await loadImage(__dirname + "/" + filename);
        //ctx.drawImage(image, 50, 0, 70, 70)
        images[filename] = image;
    });
}

async function drawCards() {
    for (let key in cards) {
        let card = cards[key];
        card.key = key;

        //if (!key.match(/^[2345]_/)) continue;
        if (!key.match(/t\d\d/)) continue;
        //if (!key.match(/t21/)) continue;
        //if (!key.match(/_[wc]10/)) continue;

        let pipImage = null;
        if (key.match(/w\d\d/)) pipImage = "tatva-fire.png";
        else if (key.match(/c\d\d/)) pipImage = "tatva-water.png";
        else if (key.match(/s\d\d/)) pipImage = "tatva-air.png";
        else if (key.match(/d\d\d/)) pipImage = "tatva-earth.png";

        await drawCard(card, pipImage);
    }
}

async function drawCard(card, pipImage) {

    let layerCount = 4;
    //let outerSize = 2400;
    let outerSize = 999;
    let width = 999;

    let ratio = outerSize / 1200;
    let layerSize = 150 * ratio;

    const canvas = [];
    for (let n = 0; n < layerCount; n++) {
        let size = outerSize - layerSize * n;
        let cWidth = n === 0 ? width : size;
        canvas.push(createCanvas(cWidth, size));
    }

    card.paths.forEach((pathKey, pathCount) => {

        let path = paths[pathKey];

        for (let i = 0; i < layerCount; i++) {
            if (i > 0) continue;

            let color = path.colors[3 - i];

            let targetCanvas = canvas[i];

            if (pathCount === 1) {
                targetCanvas = createCanvas(targetCanvas.width, targetCanvas.height);
            }

            // draw a whole field to this canvas
            drawSquare(targetCanvas, color, layerSize);

            // draw half to the current canvas if this is the secondary
            if (pathCount === 1) {
                combineHalf(targetCanvas, canvas[i]);
            }
        }

    });

    // draw the pips
    drawPips(canvas[3], card, pipImage);

    let outputCanvas = canvas[0];
    for (let n = 1; n < layerCount; n++) {
        combineCanvas(canvas[n], outputCanvas);
    }

    await exportCanvasToImage(outputCanvas, "background/" + card.key);
}

function combineCanvas(src, dest) {
    let x = (dest.width - src.width)/2;
    let y = (dest.height - src.height)/2;

    //grab the context from your destination canvas
    let destCtx = dest.getContext('2d');

    //call its drawImage() function passing it the source canvas directly
    destCtx.drawImage(src, x, y);
}

function combineHalf(src, dest) {
    let dx = 0;
    let dy = dest.height / 2;
    let dWidth = dest.width;
    let dHeight = dest.height / 2;

    let sx = 0;
    let sy = src.height / 2;
    let sWidth = src.width;
    let sHeight = src.height / 2;

    // make it the lower


    //grab the context from your destination canvas
    let destCtx = dest.getContext('2d');

    //call its drawImage() function passing it the source canvas directly
    destCtx.drawImage(src, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
}

function exportCanvasToImage(canvas, name) {
    return new Promise((resolve, reject) => {
        const fs = require('fs');
        const filename = `${__dirname}/output/${name}.jpg`;
        const out = fs.createWriteStream(filename);
        //const stream = canvas.createPNGStream();
        const stream  = canvas.createJPEGStream({
            quality: 1,
            chromaSubsampling: false, progressive: false
        });


        stream.pipe(out);
        out.on('finish', () => {
            console.log(`${filename} was created.`);
            resolve();
        });
    });
}




function drawPips(canvas, card, pipImage) {
    let ctx = canvas.getContext('2d');

    if (!card.pips) return;

    let placementInfo = pipPlacement[card.pips];


    if (placementInfo.type === 'onCircle') {
        let dAngle = (Math.PI * 2) / card.pips;
        let startAngle = placementInfo.startAngle || -(Math.PI / 2);

        let radius = (canvas.height / 2) * placementInfo.radiusPercent;

        for (let i = 0; i < card.pips; i++) {

            // find coordinate
            let x = Math.cos(startAngle + dAngle * i) * radius + canvas.height / 2;
            let y = Math.sin(startAngle + dAngle * i) * radius + canvas.height / 2;

            // draw pip
            if (pipImage) {
                let pipSize = 300;
                ctx.drawImage(images[pipImage], x - pipSize / 2, y - pipSize / 2, pipSize, pipSize);
            }
            else {
                ctx.fillStyle = "#FFFFFF";
                ctx.beginPath();
                ctx.arc(x, y, 40, 0, 2 * Math.PI);
                ctx.fill();
            }

        }
    }

}


function drawSquare(canvas, color, layerSize) {

    drawBackground(canvas, color);

    if (color.hasOwnProperty('rayed')) rayIt(canvas, color);
    if (color.hasOwnProperty('quartered')) quarterIt(canvas, color);
    if (color.hasOwnProperty('circles')) drawCircles(canvas, color, layerSize);
    if (color.hasOwnProperty('gradient')) drawGradient(canvas, color, true);
    if (color.hasOwnProperty('flecked')) fleckIt(canvas, color);
}

function drawBackground(canvas, color) {
    let ctx = canvas.getContext('2d');

    ctx.fillStyle = "#" + color.back;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawGradient(canvas, color, roundCorners) {
    let ctx = canvas.getContext('2d');

    ctx.fillStyle = "#" + color.gradient[0];
    ctx.fillRect(0, 0, canvas.width, canvas.height / 2);

    ctx.fillStyle = "#" + color.gradient[1];
    ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);

    // now the middle
    let x = canvas.width / 2;
    let p = 0.05;
    //let gradient = ctx.createLinearGradient(x, canvas.height * p, x, canvas.height * (1-p-p));
    let gradient = ctx.createRadialGradient(canvas.width / 2, canvas.width / 2, 1, canvas.width / 2, canvas.width / 2, canvas.width);

    gradient.addColorStop(0, "#" + color.gradient[0]);
    gradient.addColorStop(1, "#" + color.gradient[1]);

    ctx.fillStyle = gradient;
    //ctx.fillRect(0, canvas.height * (p), canvas.width, canvas.height * (1-p-p));
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function rayIt(canvas, color) {
    let ctx = canvas.getContext('2d');
    let center = {x:canvas.width/2, y: canvas.height/2};
    let rayCount = 18;
    let arcLength = ((Math.PI * 2) / rayCount) * (1/3);
    let radius = Math.max(canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    for (let j = 0; j < rayCount; j++) {
        let a0 = ((Math.PI * 2) / rayCount) * j - arcLength / 2;
        let a1 = a0 + arcLength;

        let x0 = Math.cos(a0) * radius + center.x;
        let y0 = Math.sin(a0) * radius + center.y;
        let x1 = Math.cos(a1) * radius + center.x;
        let y1 = Math.sin(a1) * radius + center.y;

        ctx.lineTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.lineTo(center.x, center.y);
    }
    ctx.closePath();

    ctx.fillStyle = "#" + color.rayed;
    ctx.fill();
}

function quarterIt(canvas, color) {
    let ctx = canvas.getContext('2d');
    let center = {x:canvas.width/2, y: canvas.height/2};

    let w = canvas.width;
    let h = canvas.height;

    //top
    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(0, 0);
    ctx.lineTo(w, 0);
    ctx.closePath();
    ctx.fillStyle = "#" + color.quartered[0];
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(w, 0);
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = "#" + color.quartered[1];
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(0, 0);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = "#" + color.quartered[2];
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(0, h);
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = "#" + color.quartered[3];
    ctx.fill();

}

function alphaColor(color, alpha) {
    let r = parseInt(color.substr(0, 2), 16);
    let g = parseInt(color.substr(2, 2), 16);
    let b = parseInt(color.substr(4, 2), 16);
    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha.toString() + ")";
}

function drawFleck(ctx, color, xCenter, yCenter, ratio) {

    let sides = Math.floor(Math.random() * 3) + 3;
    //let sides = 4;
    let angleIncr = Math.PI * 2 / sides;

    let range = 16 * ratio;
    let xOffset = Math.random() * range - range/2;
    let yOffset = Math.random() * range - range/2;

    let sizeRange = 6 * ratio;
    let minSize = 2 * ratio;

    for (let n = 0; n < 3; n++) {
        let angleOffset = Math.random() * Math.PI * 2;
        ctx.beginPath();

        for (let i = 0; i < sides; i++) {
            let size = Math.random() * sizeRange + minSize;
            let angle = (angleIncr * i + angleOffset) % (Math.PI * 2);
            let x = Math.cos(angle) * (size/2) + xCenter + xOffset;
            let y = Math.sin(angle) * (size/2) + yCenter + yOffset;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = alphaColor(color, 0.5); // "#" + color;
        ctx.fill();
    }

}

function fleckIt(canvas, color) {
    let ctx = canvas.getContext('2d');
    let colorArray = Array.isArray(color.flecked) ? color.flecked : [color.flecked];
    let colorIndex = 0;

    let radius = 1;
    let angle = 0;
    let maxRadius = Math.max(canvas.width, canvas.height);
    let center = {x:canvas.width/2, y: canvas.height/2};

    let ratio = canvas.height / 1200;

    let idealDistance = 15 * ratio;
    let radiusIncrPerRevolution = 12 * ratio;

    let maxTimes = 1000000;

    while (radius < maxRadius && maxTimes > 0) {
        // find point
        let x = Math.cos(angle) * radius + center.x;
        let y = Math.sin(angle) * radius + center.y;

        // draw at point
        drawFleck(ctx, colorArray[colorIndex++ % colorArray.length], x, y, ratio);


        let d = idealDistance;
        let percent = -1;

        while (d > 0) {
            // determine circumference
            let c = Math.PI * 2 * radius;

            if (d > c) {
                let percent = 0.01;
                radius += radiusIncrPerRevolution * percent;
                angle += Math.PI * 2 * percent;

                c = Math.PI * 2 * radius * percent;

                d -= c;

                // angle stays the same
            }
            else {

                percent = d / c;
                angle += Math.PI * 2 * percent;
                angle = angle % (Math.PI * 2);
                radius += radiusIncrPerRevolution * percent;

                d = 0; //exit
            }
        }

        //console.log(maxTimes + " radius:" + radius + " percent:" + percent + " circum:" + c);

        maxTimes--;
    }

}

// square circles
function drawCircles(canvas, color, layerSize) {
    let subLayerSize = (layerSize/2) / color.circles.length;
    let ctx = canvas.getContext('2d');
    for (let i = 0; i < color.circles.length; i++) {
        ctx.fillStyle = "#" + color.circles[i];
        ctx.fillRect(subLayerSize * i, subLayerSize * i, canvas.width - subLayerSize * i * 2, canvas.height - subLayerSize * i * 2);
    }

}

function drawCirclesOld(canvas, color, layerSize) {

    let center = {x:canvas.width/2, y: canvas.height/2};
    let maxRadius = Math.max(center.x, center.y);
    let radiusIncr = maxRadius / color.circles.length;

    let ctx = canvas.getContext('2d');
    for (let i = 0; i < color.circles.length; i++) {

        let radius = radiusIncr * (color.circles.length - i);

        ctx.beginPath();
        ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = "#" + color.circles[i];
        ctx.fill();
    }

}
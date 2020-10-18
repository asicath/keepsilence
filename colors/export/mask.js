const Canvas = require('canvas');

function applyMask(canvasColor, canvasAlpha, center, margin, width) {
    // the mask
    const ctxAlpha = canvasAlpha.getContext('2d');
    const alphaChannel = ctxAlpha.getImageData(0, 0, canvasAlpha.width, canvasAlpha.height);

    // now the image canvas

    let ctxColor = canvasColor.getContext('2d');

    // move it up to the diameter
    if (center !== null) {
        //const ctxColor = canvasColor.getContext('2d');
        const canvasColorAligned = Canvas.createCanvas(canvasColor.width, canvasColor.height);
        ctxColor = canvasColorAligned.getContext('2d');
        ctxColor.save();
        ctxColor.translate(0, -center + margin + width/2);
        ctxColor.drawImage(canvasColor, 0, 0);
        ctxColor.restore();
    }

    const colorChannel = ctxColor.getImageData(0, 0, canvasColor.width, canvasColor.height);

    // combine
    const idata = Canvas.createImageData(canvasAlpha.width, canvasAlpha.height);
    for (let i = 0; i < alphaChannel.data.length; i+=4) {
        idata.data[i+0] = colorChannel.data[i+0]; // r
        idata.data[i+1] = colorChannel.data[i+1]; // g
        idata.data[i+2] = colorChannel.data[i+2]; // b
        idata.data[i+3] = alphaChannel.data[i+3]; // a
    }

    // combine
    const canvasCombined = Canvas.createCanvas(canvasAlpha.width, canvasAlpha.height);
    const ctxCombined = canvasCombined.getContext('2d');
    ctxCombined.putImageData(idata, 0, 0);

    return canvasCombined;
}

function getColorField(color, width, height) {
    const canvas = Canvas.createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = "#" + color.back;
    ctx.fillRect(0, 0, width, height); // just fill with red



    if (color.hasOwnProperty('rayed')) rayIt(canvas, color);
    if (color.hasOwnProperty('quartered')) quarterIt(canvas, color);
    //if (color.hasOwnProperty('circles')) drawCircles(canvas, color, layerSize);
    //if (color.hasOwnProperty('gradient')) drawGradient(canvas, color, true);
    if (color.hasOwnProperty('flecked')) fleckIt(canvas, color);

    return canvas;
}

exports.applyMask = applyMask;
exports.getColorField = getColorField;

// unit test
if (module.parent === null) {
    const fs = require('fs');

    const width = 200;
    const height = 200;

    // the mask
    const canvasAlpha = Canvas.createCanvas(width, height);
    const ctxAlpha = canvasAlpha.getContext('2d');
    ctxAlpha.fillStyle ='#fff';
    ctxAlpha.arc(width/2, height/2, 50, 0, Math.PI*2, false);
    ctxAlpha.fill();

    // now the image canvas
    const canvasColor = getColorField('#f0f', width, height);

    // applyMask
    const canvasCombined = applyMask(canvasColor, canvasAlpha);

    // now draw to a existing canvas
    const canvas = Canvas.createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0,0,width,height);
    ctx.drawImage(canvasCombined, 0, 0);

    const outStream = fs.createWriteStream('./output/test-mask.jpg');
    outStream.on('close', () => {
        console.log('close');
    });

    canvas.createJPEGStream({
        quality: 1,
        chromaSubsampling: false, progressive: false
    }).pipe(outStream);

}

function alphaColor(color, alpha) {
    let r = parseInt(color.substr(0, 2), 16);
    let g = parseInt(color.substr(2, 2), 16);
    let b = parseInt(color.substr(4, 2), 16);
    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha.toString() + ")";
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

    let ratio = canvas.height / (1200 * 3);

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

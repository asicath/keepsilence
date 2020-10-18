const { createCanvas, loadImage } = require('canvas');
const {paths, cards} = require('./data');
const {applyMask, getColorField} = require('./mask');

function exportCanvasToImage(canvas, name) {
    return new Promise((resolve, reject) => {
        const fs = require('fs');
        const filename = `${__dirname}/output/${name}.jpg`;

        //const stream = canvas.createPNGStream();

        /*
        const stream = canvas.createJPEGStream({
            quality: 1,
            chromaSubsampling: false, progressive: false
        });
        const out = fs.createWriteStream(filename);
        stream.pipe(out);
        out.on('finish', () => {
            console.log(`${filename} was created.`);
            resolve();
        });
        */


        const stream = canvas.createPNGStream({
            quality: 1,
            chromaSubsampling: false, progressive: false
        });
        const out = fs.createWriteStream(filename.replace(".jpg", ".png"));
        stream.pipe(out);
        out.on('finish', () => {
            console.log(`${filename} was created.`);
            resolve();
        });


    });
}

const images = {};
async function loadImages() {
    console.log('loading images');

    for (let i = 1; i <= 22; i++) {
        let key = "d" + (i < 10 ?  "0" + i.toString() : i.toString());
        let filepath = `${__dirname}\\sigils\\${key}.png`;
        images[key] = await loadImage(filepath);
    }

    for (let i = 1; i <= 22; i++) {
        let key = "q" + (i < 10 ?  "0" + i.toString() : i.toString());
        let filepath = `${__dirname}\\sigils\\${key}.png`;
        images[key] = await loadImage(filepath);
    }

    let fileNames = ["tatva-fire.png", "tatva-water.png", "tatva-air.png", "tatva-earth.png", "tatva-spirit.png", "tatva-spirit-crowley.png", "tatva-spirit-crowley2.png"];
    for (let i = 0; i < fileNames.length; i++) {
        let filepath = `${__dirname}\\${fileNames[i]}`;
        let key = fileNames[i].replace(/tatva-/, '').replace(/\.png/, '');
        images[key] = await loadImage(filepath);
    }
}

(async () => {
    await loadImages();

    const size = 5000;
    const margin = size * 0.02;
    const canvas = createCanvas(size, size);
    //drawElementCorners(canvas, margin);
    //const radius = drawSpiritCircle(canvas, margin);
    //drawTreeOfLife(canvas, radius);

    drawMainCircle(canvas, margin);

    //drawSpiritEgg(canvas);

    await exportCanvasToImage(canvas, `main${size}`);
})();



function drawTreeOfLife(canvas, outerRadius) {
    console.log('drawing tree of life');

    const radius = outerRadius / 15;
    //const height = outerRadius - radius * 2;
    const height = ((outerRadius*2)/6);

    let sideX = Math.cos(Math.PI / 6) * height/2;
    let sideY = Math.sin(Math.PI / 6) * height/2;

    drawSephiroth(canvas, paths["1"], 0, -height, radius);
    //drawSephiroth(canvas, paths["d"], 0, -height/2, radius);
    drawSephiroth(canvas, paths["6"], 0, 0, radius);
    drawSephiroth(canvas, paths["9"], 0, height/2, radius);
    drawSephiroth(canvas, paths["10"], 0, height, radius);


    drawSephiroth(canvas, paths["7"], sideX, sideY, radius);
    drawSephiroth(canvas, paths["8"], -sideX, sideY, radius);
    drawSephiroth(canvas, paths["4"], sideX, -sideY, radius);
    drawSephiroth(canvas, paths["5"], -sideX, -sideY, radius);
    drawSephiroth(canvas, paths["2"], sideX, -sideY*3, radius);
    drawSephiroth(canvas, paths["3"], -sideX, -sideY*3, radius);
}

function drawSephiroth(canvas, path, x, y, radius) {

    const ctx = canvas.getContext('2d');

    let color = getColorField(path.colors[3], canvas.width, canvas.height);
    let mask = getCircleMask(canvas.height, radius);
    let c = applyMask(color, mask, null);
    ctx.drawImage(c, x, y);

    color = getColorField(path.colors[2], canvas.width, canvas.height);
    mask = getCircleMask(canvas.height, radius*0.8);
    c = applyMask(color, mask, null);
    ctx.drawImage(c, x, y);

    color = getColorField(path.colors[1], canvas.width, canvas.height);
    mask = getCircleMask(canvas.height, radius*0.6);
    c = applyMask(color, mask, null);
    ctx.drawImage(c, x, y);

    color = getColorField(path.colors[0], canvas.width, canvas.height);
    mask = getCircleMask(canvas.height, radius*0.4);
    c = applyMask(color, mask, null);
    ctx.drawImage(c, x, y);
}


function drawSpiritCircle(canvas, margin) {
    const path = paths["31bis"];

    //path.colors[3].circles
    const size = canvas.height;
    const width = size * 0.11;
    let radius = size/2 - width - margin + 1;

    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.translate(size/2, size/2);

    // 4
    let colors = path.colors[3].circles;
    for (let i = 0; i < colors.length; i++) {
        ctx.fillStyle = "#" + colors[i];
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI*2);
        ctx.fill();
        radius -= margin / colors.length;
        if (i === 0) radius -= 1;
    }

    // 3
    colors = path.colors[2].circles;
    for (let i = 0; i < colors.length; i++) {
        ctx.fillStyle = "#" + colors[i];
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI*2);
        ctx.fill();
        radius -= margin / colors.length;
        if (i === 0) radius -= 1;
    }

    // 2
    ctx.fillStyle = "#" + path.colors[1].back;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI*2);
    ctx.fill();
    radius -= margin;
    ctx.restore();

    // 1
    let c = getGradientCircle(size, radius, path.colors[0].gradient[0], path.colors[0].gradient[1]);
    ctx.drawImage(c, 0, 0);

    return radius;
}

function getGradientCircle(size, radius, color0, color1) {

    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    let gradient = ctx.createRadialGradient(size/2, size/2, radius*0.1, size/2, size/2, radius);

    gradient.addColorStop(0, "#" + color0);
    gradient.addColorStop(1, "#" + color1);

    ctx.fillStyle = gradient;
    //ctx.fillRect(0, canvas.height * (p), canvas.width, canvas.height * (1-p-p));
    ctx.fillRect(0, 0, size, size);

    // now mask it
    let mask = getCircleMask(size, radius);
    return applyMask(canvas, mask, null);
}

function getCircleMask(size, radius) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#fff';
    ctx.arc(size/2, size/2, radius, 0, Math.PI*2);
    ctx.fill();

    return canvas;
}

function drawElementCorners(canvas, margin) {
    console.log('drawing elemental corners');

    const size = canvas.height;
    const half = size/2;
    const ctx = canvas.getContext('2d');

    const colors = [
        paths[23],paths[11],
        paths["32bis-green"], paths[31]
    ];

    const f0 = getColorField(colors[0].colors[3], size, size);
    ctx.drawImage(f0, 0, 0);
    ctx.fillStyle = "#" + colors[0].colors[2].back;
    ctx.fillRect(0+margin, 0+margin, half-margin, half-margin);
    ctx.fillStyle = "#" + colors[0].colors[1].back;
    ctx.fillRect(0+margin*2, 0+margin*2, half-margin*2, half-margin*2);
    ctx.fillStyle = "#" + colors[0].colors[0].back;
    ctx.fillRect(0+margin*3, 0+margin*3, half-margin*3, half-margin*3);

    const f1 = getColorField(colors[1].colors[3], size, size);
    ctx.drawImage(f1, half, 0);
    ctx.fillStyle = "#" + colors[1].colors[2].back;
    ctx.fillRect(half, 0+margin, half-margin, half-margin);
    ctx.fillStyle = "#" + colors[1].colors[1].back;
    ctx.fillRect(half, 0+margin*2, half-margin*2, half-margin*2);
    ctx.fillStyle = "#" + colors[1].colors[0].back;
    ctx.fillRect(half, 0+margin*3, half-margin*3, half-margin*3);

    const f2 = getColorField(colors[2].colors[3], size, size);
    ctx.drawImage(f2, 0, half);
    ctx.fillStyle = "#" + colors[2].colors[2].back;
    ctx.fillRect(0+margin, half, half-margin, half-margin);
    ctx.fillStyle = "#" + colors[2].colors[1].back;
    ctx.fillRect(0+margin*2, half, half-margin*2, half-margin*2);
    ctx.fillStyle = "#" + colors[2].colors[0].back;
    ctx.fillRect(0+margin*3, half, half-margin*3, half-margin*3);

    const f3 = getColorField(colors[3].colors[3], size, size);
    ctx.drawImage(f3, half, half);

    // todo make this flecked
    const f3b = getColorField(colors[3].colors[2], size, size);
    ctx.drawImage(f3b, half,half,half-margin,half-margin,half, half, half-margin, half-margin);

    //ctx.fillRect(half, half, half-margin, half-margin);

    ctx.fillStyle = "#" + colors[3].colors[1].back;
    ctx.fillRect(half, half, half-margin*2, half-margin*2);
    ctx.fillStyle = "#" + colors[3].colors[0].back;
    ctx.fillRect(half, half, half-margin*3, half-margin*3);


    // draw the tatvas
    const imgSize = canvas.height * 0.06;
    let tMargin = margin*6;

    let img = images['water'];
    ctx.drawImage(img,
        0, 0, img.width, img.height,
        tMargin - imgSize/2, tMargin - imgSize/2, imgSize, imgSize);

    img = images['air'];
    ctx.drawImage(img,
        0, 0, img.width, img.height,
        canvas.width - tMargin - imgSize/2, tMargin - imgSize/2, imgSize, imgSize);

    img = images['earth'];
    ctx.drawImage(img,
        0, 0, img.width, img.height,
        tMargin - imgSize/2, canvas.height - tMargin - imgSize/2, imgSize, imgSize);

    img = images['fire'];
    ctx.drawImage(img,
        0, 0, img.width, img.height,
        canvas.width - tMargin - imgSize/2, canvas.height - tMargin - imgSize/2, imgSize, imgSize);




    // mask out the circle in the middle, not needed
    ctx.arc(half, half, half*0.9, 0, Math.PI*2);
    ctx.fillStyle = '#000';
    ctx.fill();

}

function drawSpiritEgg(canvas) {
    const ctx = canvas.getContext('2d');
    const imgSize = canvas.height * 0.06;

    let img = images['spirit'];
    img = images['spirit-crowley'];
    //img = images['spirit-crowley2'];

    ctx.drawImage(img,
        0, 0, img.width, img.height,
        canvas.height/2-imgSize/2, canvas.height/2-imgSize/2, imgSize, imgSize);
}

function drawMainCircle(canvas, margin, side = "q") {
    const size = canvas.height;


    const center = (size) / 2;
    const sectionAngle = 2 * Math.PI * (1/24);

    // calculate the "width" ie the height of the boxes
    const width = size * 0.11;

    // create the masks
    const masks = createMasks({size, margin, width, sectionAngle});
    const masksLong = createMasks({size, margin, width, sectionAngle: sectionAngle*3});

    // create the colors
    console.log('creating color fields');
    const colors = [[],[],[],[]];
    for (let n = 11; n <= 32; n++) {
        console.log(`${n}`);
        let path = paths[n.toString()];
        colors[0].push(getColorField(path.colors[3], size, size));
        colors[1].push(getColorField(path.colors[2], size, size));
        colors[2].push(getColorField(path.colors[1], size, size));
        colors[3].push(getColorField(path.colors[0], size, size));
    }

    //drawBackground(canvas, "#000");
    const ctx = canvas.getContext('2d');
    console.log('empress scale');
    drawImagesInCircle({ctx, center, sectionAngle, colors: colors[0], mask: masks[0], maskLong: masksLong[0], margin, width, side});
    console.log('emperor scale');
    drawImagesInCircle({ctx, center, sectionAngle, colors: colors[1], mask: masks[1], maskLong: masksLong[1], margin, width, side});
    console.log('queen scale');
    drawImagesInCircle({ctx, center, sectionAngle, colors: colors[2], mask: masks[2], maskLong: masksLong[2], margin, width, side});
    console.log('king scale');
    drawImagesInCircle({ctx, center, sectionAngle, colors: colors[3], mask: masks[3], maskLong: masksLong[3], margin, width, side});

    drawSigils({ctx, center, sectionAngle, colors: colors[3], margin, width, side});
}

function createMasks({size, margin, width, sectionAngle}) {
    // create the largest mask
    const masks = [getCircleSectionMask({margin: margin, width: width, size, angle: sectionAngle*1.005})];

    //const angleChange = 0.13;
    //const deltaAngle = sectionAngle * angleChange; // reduce sectionAngle by this much each iteration

    const deltaAngle = (Math.PI * 2/24) * 0.13;
    const marginChange = (deltaAngle / 2) * (size/2 - margin - width/2);

    // create the smaller mask
    for (let i = 0; i < 3; i++) {
        sectionAngle -= deltaAngle;
        margin += marginChange;
        width -= marginChange*2;

        masks.push(getCircleSectionMask({margin, width, size, angle: sectionAngle}));
    }

    return masks;
}

function drawSigils({ctx, center, sectionAngle, colors, margin, width, side = "q"}) {
    let direction = side === 'q' ? -1 : 1;
    direction = 1;

    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(sectionAngle*2*direction);



    const imgSize = width;

    for (let i = 0; i < colors.length; i++) {
        console.log(i.toString());
        if (i < colors.length-1) {

            let n = i + 1;
            let key = side + (n < 10 ?  "0" + n.toString() : n.toString());
            let img = images[key];
            ctx.drawImage(img, 0, 0, img.width, img.height, -imgSize/2, -imgSize/2 - center + margin + width/2, imgSize, imgSize);
            ctx.rotate(sectionAngle*direction);
        }
        else {
            ctx.rotate(sectionAngle*direction);
            let key = side+"22";
            let img = images[key];
            ctx.drawImage(img,
                0, 0, img.width, img.height,
                -(imgSize*3)/2, -imgSize/2 - center + margin + width/2 + imgSize*0.04, imgSize*3, imgSize);

            //const image = applyMask(colors[i], maskLong, center, margin, width);
            //ctx.drawImage(image, -center, -center);
        }

    }
    ctx.restore();
}

function drawImagesInCircle({ctx, center, sectionAngle, colors, mask, maskLong, margin, width, side = "q"}) {
    let direction = side === 'q' ? -1 : 1;
    direction = 1;

    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(sectionAngle*2*direction);
    for (let i = 0; i < colors.length; i++) {
        console.log(i.toString());
        if (i < colors.length-1) {
            const image = applyMask(colors[i], mask, center, margin, width);
            ctx.drawImage(image, -center, -center);
            ctx.rotate(sectionAngle*direction);
        }
        else {
            ctx.rotate(sectionAngle*direction);
            const image = applyMask(colors[i], maskLong, center, margin, width);
            ctx.drawImage(image, -center, -center);
        }
    }
    ctx.restore();
}

function getCircleSectionMask({size, margin, width, angle}) {

    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    const center = (size) / 2;
    const radius = size / 2 - margin;
    const angleOffset = -Math.PI / 2;

    // draw circle portion
    ctx.save();
    ctx.translate(center, center);

    // first go to 0
    ctx.rotate(angleOffset);

    ctx.beginPath();
    ctx.arc(0, 0, radius, -angle/2, angle/2, false);
    ctx.rotate(angle/2);
    ctx.lineTo(radius - width, 0);
    ctx.rotate(-angle/2);
    ctx.arc(0, 0, radius - width, angle/2, -angle/2, true);

    ctx.closePath();

    //ctx.strokeStyle = "#fff";
    //ctx.stroke();

    ctx.fillStyle = "#fff";
    ctx.fill();

    ctx.restore();

    return canvas;
}


function drawBackground(canvas, color) {
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = "#" + color.back;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}



const { createCanvas, loadImage } = require('canvas');
const { readdirSync } = require('fs');

let debugMarks = false;

let spiritNames = {
    
    m11:`Aعu-iao-uعa`,
    m12:`Beعθaoooabitom`,
    m13:`Gitωnosapφωllois`,
    m14:`Dηnaⲝartarωθ`,
    m15:`Hoo-oorω-iⲝ`,
    m16:`Vuaretza`,
    m17:`Zooωasar`,
    m18:`Chiva-abrahadabra-cadaxviii`,
    m19:`θalعⲝer-ā-dekerval`,
    m20:`Iehuvahaⲝanعθatan`,
    m21:`Kerugunaviel`,
    m22:`Lusanaherandraton`,
    m23:`Malai`,
    m24:`Nadimraphoroiozعθalai`,
    m25:`Salaθlala-amrodnaθعiⲝ`,
    m26:`Oaoaaaoooع-iⲝ`,
    m27:`Puraθmetai-apηmetai`,
    m28:`XanθaⲝeranⲈϘ-iⲝ`,
    m29:`QaniΔnayx-ipamai`,
    m30:`Ra-a-gioselahladnaimawa-iⲝ`,
    m31:`Shabnax-odobor`,
    m32:`Thath’thʻthithعthuth-thiⲝ`,

    q11:`Amprodias`,
    q12:`Baratchial`,
    q13:`Gargophias`,
    q14:`Dagadiel`,
    q15:`Hemethterith`,
    q16:`Uriens`,
    q17:`Zamradiel`,
    q18:`Characith`,
    q19:`Temphioth`,
    q20:`Yamatu`,
    q21:`Kurgasiax`,
    q22:`Lafcursiax`,
    q23:`Malkunofat`,
    q24:`Niantiel`,
    q25:`Saksaksalim`,
    q26:`A’ano’nin`,
    q27:`Parfaxitas`,
    q28:`Tzuflifu`,
    q29:`Qulielfi`,
    q30:`Raflifu`,
    q31:`Shalicu`,
    q32:`Thantifaxath`,
    
};


(async () => {
    //await loadImages();
    //await main();

    // const filename = `${__dirname}/231/${name}.png`;

    const getDirectories = source =>
        readdirSync(source, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

    let root = `C:\\git\\arcanorum\\Assets\\231\\textures`;

    let folders = getDirectories(root).filter(name => name.match(/^[qm]\d\d$/));
    folders.forEach(name => {
        let path = `${root}\\${name}\\`;
        let text = spiritNames[name];
        main(path + "color.png", path + "color_text.png", text);
    });



})();

async function main(input, output, text) {

    let canvas = createCanvas(1024, 1024);
    let ctx = canvas.getContext('2d');

    // start with white bg
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // add the sigil
    let image = await loadImage(input);
    ctx.drawImage(image, 0, 0, image.width, image.height);

    // draw the text and circle
    await drawNameCircle(canvas, text);

    if (debugMarks) {
        let image = await loadImage("C:\\git\\mandala\\Assets\\231\\coin5.fbx.png");
        ctx.drawImage(image, 0, 0, image.width, image.height);
    }

    await exportCanvasToImage(canvas, output);
}

async function drawNameCircle(canvas, text) {
    let ctx = canvas.getContext('2d');

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

    // determine how much each letter gets
    let letterCount = text.length;
    let dAngle = (Math.PI * 2) / letterCount;
    let startAngle = 0;

    for (let i = 0; i < letterCount; i++) {
        let letter = text[i];

        // find preferred font size/name
        let fontSize = 80;
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
        let trimmed = await getMinimumSizeImage(letter, fontName, fontSize);

        // rotate so the draw position is at the top
        ctx.save();
        ctx.translate(center.x, center.y);
        ctx.rotate(i * dAngle + startAngle);

        // find the draw position
        let x = 0;
        let y = -1 * (radius.textTop + radius.textBottom) / 2;

        // draw the pre generated trimmed letter image
        if (trimmed) {
            x -= trimmed.width / 2;
            y -= trimmed.height / 2;
            ctx.drawImage(trimmed.image, x, y, trimmed.width, trimmed.height);
        }

        // draw directly
        else {
            ctx.font = `${fontSize}pt "${fontName}"`;
            ctx.textAlign = 'center';
            ctx.fillStyle = "#000000";
            ctx.fillText(letter, x, y);
        }

        ctx.restore();
    }

    ctx.save();
    ctx.translate(center.x, center.y);

    // inner circle
    ctx.beginPath();
    ctx.arc(0, 0, radius.innerCircle, 0, 2 * Math.PI, false);
    ctx.lineWidth = innerCircleWidth;
    ctx.strokeStyle = '#000';
    ctx.stroke();

    if (debugMarks) {
        ctx.beginPath();
        ctx.arc(0, 0, radius.textTop, 0, 2 * Math.PI, false);
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#F0F';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, radius.textBottom, 0, 2 * Math.PI, false);
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#F0F';
        ctx.stroke();
    }

    ctx.restore();

}

async function getMinimumSizeImage(text, fontName, fontSize) {

    // create the canvas/ctx
    let width = Math.ceil(fontSize*3);
    let height = width;
    let canvas = createCanvas(width, height);
    let ctx = canvas.getContext('2d');
    ctx.textAlign = 'center';

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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
            if (pixel.r < 255 || pixel.g < 255 || pixel.b < 255) {
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
    value.image = createCanvas(value.width, value.height);
    let ctxOutput = value.image.getContext('2d');
    ctxOutput.drawImage(canvas,
        value.xMin, value.yMin, value.width, value.height,
        0, 0, value.width, value.height);

    //await exportCanvasToImage(value.image, "output");

    return value;
}

function exportCanvasToImage(canvas, filename) {
    return new Promise((resolve, reject) => {
        const fs = require('fs');
        const out = fs.createWriteStream(filename);
        const stream = canvas.createPNGStream();
        stream.pipe(out);
        out.on('finish', () => {
            console.log(`${filename} was created.`);
            resolve();
        });
    });
}
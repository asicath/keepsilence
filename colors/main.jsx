


class CardDisplay extends React.Component {
    render() {

        var index = list.indexOf(this.props.cardId);
        var nextId = this.props.cardId, prevId = this.props.cardId;
        if (index > 0) prevId = list[index - 1];
        if (index < list.length - 1) nextId = list[index + 1];

        var prevUrl = "index.htm?id=" + prevId;
        var nextUrl = "index.htm?id=" + nextId;

        var imgUrl = "img/" + this.props.cardId + ".jpg";
        return <table className="card-display"><tbody><tr>
            <td className="col-text" id="info-text">&nbsp;</td>
            <td className="col-card"><div className="prev"><a href={prevUrl}>prev</a></div><div className="next"><a href={nextUrl}>next</a></div><div className="card-title">{this.props.card.title}</div><img className="card" src={imgUrl} /></td>
            <td className="col-color">
            {this.props.card.paths.map(function(pathId, i){
                return <PathColors path={paths[pathId]} key={i} />;
            })}
            </td>
        </tr></tbody></table>
    }
}

class PathColors extends React.Component {
    render() {
        return <div className="path">
            <div className="path-title">{this.props.path.name}</div>
            <div className="path-colors">
                <div className="col"><ColorButton color={this.props.path.colors[0]} /><div className="color-button-label">king scale</div></div>
                <div className="col"><ColorButton color={this.props.path.colors[1]} /><div className="color-button-label">queen scale</div></div>
                <div className="col"><ColorButton color={this.props.path.colors[2]} /><div className="color-button-label">emperor scale</div></div>
                <div className="col"><ColorButton color={this.props.path.colors[3]} /><div className="color-button-label">empress scale</div></div>
            </div>
        </div>
    }
}

var currentColor = null;
class ColorButton extends React.Component {
    render() {
        var color = this.props.color;
        var click = function() {

            if (color === currentColor) {
                currentColor = null;
                setBackground(null);
            }
            else {
                setBackground(color);
                currentColor = color;
            }

        };
        return <div className="color-button" onClick={click} style={{backgroundColor: "#" + this.props.color.back}}>
            <div className="effectHolder"><canvas className="buttonEffectCanvas" width="94" height="88" data-color={JSON.stringify(this.props.color)}></canvas></div>
            <div className="nameHolder"><table><tbody><tr><td className="color-name">{this.props.color.name}</td></tr></tbody></table></div>
        </div>
    }
}


function setBackground(color) {

    var background = document.getElementById('background');
    var canvas = document.getElementById("background-effect");

    if (color === null) {
        background.style.backgroundColor = "#ffffff";
        clearIt(canvas);
        return;
    }


    background.style.backgroundColor = "#" + color.back;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (color.hasOwnProperty('rayed')) rayIt(canvas, color);
    else if (color.hasOwnProperty('flecked')) fleckIt(canvas, color);
    else if (color.hasOwnProperty('quartered')) quarterIt(canvas, color);
    else clearIt(canvas);

}

const cards = {

    "t04": {
        title: "The Emperor",
        paths: ["15"]
    },

    "w01": {
        title: "Ace of Wands",
        // Fire, Sol and the Phallus (as described in ace of swords)
        paths: ["31", "30", "27"]
    },
    "w02": {
        title: "Two of Wands",
        paths: ["2", "27", "15"]
    },
    "w03": {
        title: "Three of Wands",
        paths: ["30", "15"]
    },
    "w04": {
        title: "Four of Wands",
        paths: ["14", "15"]
    },
    "w05": {
        title: "Five of Wands",
        paths: ["31", "32","19"]
    },
    "w06": {
        title: "Six of Wands",
        paths: ["31", "21","19"]
    },
    "w07": {
        title: "Seven of Wands",
        paths: ["31", "27","19"]
    },
    "w08": {
        title: "Eight of Wands",
        paths: ["31", "12","25"]
    },
    "w09": {
        title: "Nine of Wands",
        paths: ["31", "13", "25"]
    },
    "w10": {
        title: "Ten of Wands",
        paths: ["31", "32", "25"]
    },
    "w-knight": {
        title: "knight of Wands",
        paths: ["31"]
    },
    "w-queen": {
        title: "queen of Wands",
        paths: ["31", "23"]
    },
    "w-prince": {
        title: "prince of Wands",
        paths: ["31","11"]
    },
    "w-princess": {
        title: "princess of Wands",
        paths: ["31", "32bis"]
    },
    
    
    "c01": {
        title: "Ace of Cups",
        paths: ["2", "3", "23", "29"]
    },
    "c02": {
        title: "Two of Cups",
        paths: ["14", "18"]
    },
    "c03": {
        title: "Three of Cups",
        paths: ["12", "18"]
    },
    "c04": {
        title: "Four of Cups",
        paths: ["13", "18"]
    },
    "c05": {
        title: "Five of Cups",
        paths: ["27", "24"]
    },
    "c06": {
        title: "Six of Cups",
        paths: ["30", "24"]
    },
    "c07": {
        title: "Seven of Cups",
        paths: ["14", "24"]
    },
    "c08": {
        title: "Eight of Cups",
        paths: ["32", "29"]
    },
    "c09": {
        title: "Nine of Cups",
        paths: ["21", "29"]
    },
    "c10": {
        title: "Ten of Cups",
        paths: ["27", "29"]
    },
    "c-knight": {
        title: "knight of Cups",
        paths: ["23","31"]
    },
    "c-queen": {
        title: "queen of Cups",
        paths: ["23"]
    },
    "c-prince": {
        title: "prince of Cups",
        paths: ["23", "11"]
    },
    "c-princess": {
        title: "princess of Cups",
        paths: ["23", "32bis"]
    },


    "s01": {
        title: "Ace of Swords",
        paths: ["11", "6"]
    },
    "s02": {
        title: "Two of Swords",
        paths: ["13","22"]
    },
    "s03": {
        title: "Three of Swords",
        paths: ["32","22"]
    },
    "s04": {
        title: "Four of Swords",
        paths: ["21","22"]
    },
    "s05": {
        title: "Five of Swords",
        paths: ["14","28"]
    },
    "s06": {
        title: "Six of Swords",
        paths: ["12","28"]
    },
    "s07": {
        title: "Seven of Swords",
        paths: ["13","28"]
    },
    "s08": {
        title: "Eight of Swords",
        paths: ["21","17"]
    },
    "s09": {
        title: "Nine of Swords",
        paths: ["27","17"]
    },
    "s10": {
        title: "Ten of Swords",
        paths: ["30","17"]
    },
    "s-knight": {
        title: "knight of Swords",
        paths: ["11","31"]
    },
    "s-queen": {
        title: "queen of Swords",
        paths: ["11","23"]
    },
    "s-prince": {
        title: "prince of Swords",
        paths: ["11"]
    },
    "s-princess": {
        title: "princess of Swords",
        paths: ["11","32bis"]
    },




    "d01": {
        title: "Ace of Disks",
        paths: ["32bis-green"]
    },
    "d02": {
        title: "Two of Disks",
        paths: ["21","26"]
    },
    "d03": {
        title: "Three of Disks",
        paths: ["27","26"]
    },
    "d04": {
        title: "Four of Disks",
        paths: ["30","26"]
    },
    "d05": {
        title: "Five of Disks",
        paths: ["12","16"]
    },
    "d06": {
        title: "Six of Disks",
        paths: ["13","16"]
    },
    "d07": {
        title: "Seven of Disks",
        paths: ["32", "16"]
    },
    "d08": {
        title: "Eight of Disks",
        paths: ["30","20"]
    },
    "d09": {
        title: "Nine of Disks",
        paths: ["9", "14","20"]
    },
    "d10": {
        title: "Ten of Disks",
        paths: ["12","20"]
    },
    "d-knight": {
        title: "knight of Disks",
        paths: ["32bis","31"]
    },
    "d-queen": {
        title: "queen of Disks",
        paths: ["32bis", "23"]
    },
    "d-prince": {
        title: "prince of Disks",
        paths: ["32bis", "11"]
    },
    "d-princess": {
        title: "princess of Disks",
        paths: ["32bis"]
    }

};

const paths = {
    "2": {
        type: 'Sphere',
        name: 'Chokmah',
        colors: [
            { back: "8ABAD3", name: "Pure soft blue" },
            { back: "808080", name: "Grey" },
            { back: "a4b2bf", name: "Blue pearl grey, like mother-of pearl" },
            { back: "ffffff", flecked: ["ed1c24", "0085ca", "FEDD00"], name: "White, flecked red, blue, and yellow" }
        ]
    },
    "3": {
        type: 'Sphere',
        name: 'Binah',
        colors: [
            { back: "AE0E36", name: "Crimson" },
            { back: "000000", name: "Black" },
            { back: "38200a", name: "Dark brown" },
            { back: "808080", flecked: "FDC3C6", name: "Grey flecked pink" }
        ]
    },
    "6": {
        type: 'Sphere',
        name: 'Tiphareth',
        colors: [
            //
            { back: "FDC3C6", name: "Clear pink rose" },
            { back: "FEDD00", name: "Yellow (gold)" },
            { back: "f25330", name: "Rich salmon" },
            { back: "FFCA1A", name: "Gold amber" }
        ]
    },
    "9": {
        type: 'Sphere',
        name: 'Yesod',
        colors: [
            { back: "001489", name: "Indigo" },
            { back: "440099", name: "Violet" },
            { back: "330b33", name: "Very dark purple" },
            { back: "dedb2c", flecked: "4D91C6", name: "Citrine, flecked azure" }
        ]
    },
    "11": {
        type: 'Element',
        name: 'Air',
        colors: [
            { back: "fee74d", name: "Bright pale yellow" },
            { back: "8ABAD3", name: "Sky blue" },
            { back: "00958D", name: "Blue emerald green" },
            { back: "00A550", flecked: "FFB000", name: "Emerald, flecked gold"}
        ]
    },
    "12": {
        type: 'Planet',
        name: 'Mercury',
        colors: [
            { back: "FEDD00", name: "Yellow" },
            { back: "BB29BB", name: "Purple" },
            { back: "808080", name: "Grey" },
            { back: "001489", rayed: "440099", name: "Indigo, rayed violet" }
        ]
    },
    "13": {
        type: 'Planet',
        name: 'Luna',
        colors: [
            { back: "0085ca", name: "Blue" },
            { back: "e8e8e8", name: "Silver" },
            { back: "A5C5D9", name: "Cold pale blue" },
            { back: "e8e8e8", rayed: "8ABAD3", name: "Silver, rayed sky blue" }
        ]
    },
    "14": {
        type: 'Planet',
        name: 'Venus',
        colors: [
            { back: "00A550", name:"Emerald Green" },
            { back: "8ABAD3", name:"Sky blue" },
            { back: "b2d135", name:"Early spring green" },
            { back: "a41247", rayed: "B2E79F", name:"Bright rose or cerise, rayed pale green" }
        ]
    },
    "15": {
        type: 'Zodiac',
        name: 'Aries',
        colors: [
            { back: "F2301B", name: "Scarlet" },
            { back: "ed1c24", name: "Red" },
            { back: "f5ac1c", name: "Brilliant flame" },
            { back: "ff1500", name: "Glowing red" }
        ]
    },
    "16": {
        type: 'Zodiac',
        name: 'Taurus',
        colors: [
            { back: "FF4E00", name:"Red orange" },
            { back: "000834", name:"Deep indigo" },
            { back: "C7B63C", name:"Deep warm olive" },
            { back: "5c3312", name:"Rich brown" }
        ]
    },
    "17": {
        type: 'Zodiac',
        name: 'Gemini',
        colors: [
            { back: "FF6D00", name: "Orange" },
            { back: "cca3b1", name: "Pale Mauve" },
            { back: "e8af36", name: "New yellow leather" },
            { back: "907172", name: "Reddish grey inclined to mauve" }
        ]
    },
    "18": {
        type: 'Zodiac',
        name: 'Cancer',
        colors: [
            { back: "ffb734", name: "Amber" },
            { back: "800f13", name: "Maroon" },
            { back: "d60d0a", name: "Rich bright russet" },
            { back: "322F12", name: "Dark greenish brown" }
        ]
    },
    "19": {
        type: 'Zodiac',
        name: 'Leo',
        colors: [
            { back: "E5D708", name: "Yellow, greenish" },
            { back: "550055", name: "Deep purple" },
            { back: "808080", name: "Grey" },
            { back: "ff9934", name: "Reddish amber" }
        ]
    },
    "20": {
        type: 'Zodiac',
        name: 'Virgo',
        colors: [
            { back: "59B934", name: "Green, yellowish" },
            { back: "9faeaa", name: "Slate grey" },
            { back: "558c70", name: "Green grey" },
            { back: "981733", name: "Plum colour" }
        ]
    },
    "21": {
        type: 'Planet',
        name: 'Jupiter',
        colors: [
            { back: "7f14aa", name: "Violet Purple" },
            { back: "0085ca", name: "Blue" },
            { back: "990099", name: "Rich purple" },
            { back: "00a8ff", rayed:"fedd00", name: "Bright blue, rayed yellow" }
        ]
    },
    "22": {
        type: 'Zodiac',
        name: 'Libra',
        colors: [
            { back: "00A550", name: "Emerald Green" },
            { back: "0085ca", name: "Blue" },
            { back: "008077", name: "Deep blue-green" },
            { back: "B2E79F", name: "Pale green" }
        ]
    },
    "23": {
        type: 'Element',
        name: 'Water',
        colors: [
            { back: "004dab", name: "Deep blue" },
            { back: "149C88", name: "Sea green" },
            { back: "5b6300", name: "Deep olive-green" },
            { back: "ffffff", flecked:"BB29BB", name: "White, flecked purple, like mother-of-pearl" }
        ]
    },
    "24": {
        type: 'Zodiac',
        name: 'Scorpio',
        colors: [
            { back: "00958d", name:"Green blue" },
            { back: "9D7446", name:"Dull brown" },
            { back: "211307", name:"Very dark brown" },
            { back: "1c131b", name:"Livid indigo brown (like a black beetle)" }
        ]
    },
    "25": {
        type: 'Zodiac',
        name: 'Sagittarius',
        colors: [
            { back: "0085ca", name: "Blue" },
            { back: "FEDD00", name: "Yellow" },
            { back: "00A550", name: "Green" },
            { back: "003a80", name: "Dark vivid blue" }
        ]
    },
    "26": {
        type: 'Zodiac',
        name: 'Capricornus',
        colors: [
            { back: "001489", name: "Indigo" },
            { back: "000000", name: "Black" },
            { back: "000a44", name: "Blue black" },
            { back: "28292b", name: "Cold dark grey, approaching black" }
        ]
    },
    "27": {
        type: 'Planet',
        name: 'Mars',
        colors: [
            { back: "ed2000", name: "Scarlet" },
            { back: "ed1c24", name: "Red" },
            { back: "c80815", name: "Venetian red" },
            { back: "ff0000", rayed:"00A550", name: "Bright red, rayed azure or emerald" }
        ]
    },
    "28": {
        type: 'Zodiac',
        name: 'Aquarius',
        colors: [
            { back: "440099", name: "Violet" },
            { back: "8ABAD3", name: "Sky blue" },
            { back: "ad78bd", name: "Blueish mauve" },
            { back: "ffe8ff", name: "White tinged purple" }
        ]
    },
    "29": {
        type: 'Zodiac',
        name: 'Pisces',
        colors: [
            { back: "AE0E36", name: "Crimson (ultra violet)" },
            { back: "D8B998", flecked:"F2F2F2", name: "Buff, flecked silver-white"},
            { back: "C08A80", name: "Light translucent pinkish brown" },
            { back: "76826a", name: "Stone color" }
        ]
    },
    "30": {
        type: 'Planet',
        name: 'Sol',
        colors: [
            { back: "FF6D00", name: 'Orange' },
            { back: "FEDD00", name: 'Gold yellow' },
            { back: "FFA500", name: 'Rich amber' },
            { back: "ffb734", rayed: "ed1c24", name: 'Amber, rayed red' }
        ]
    },
    "31": {
        type: 'Element',
        name: 'Fire',
        colors: [
            { back: "ff2a00", name: "Glowing orange scarlet" },
            { back: "D9381E", name: "Vermilion" },
            { back: "ed2000", flecked: "FFB000", name: "Scarlet, flecked gold" },
            { back: "D9381E", flecked:["AE0E36", "00A550"], name: "Vermilion, flecked crimson and emerald" }
        ]
    },
    "32": {
        type: 'Planet',
        name: 'Saturn',
        colors: [
            { back: "001489", name: "Indigo" },
            { back: "000000", name: "Black" },
            { back: "000a44", name: "Blue black" },
            { back: "000000", rayed:"0085ca", name: "Black, rayed blue" }
        ]
    },
    "31bis": {
        type: 'Element',
        name: 'Spirit',
        colors: [
            { back: "ffffff", name: "White merging into grey" },
            { back: "220022", name: "Deep purple, nearly black" },
            { back: "000000", name: "The 7 prismatic colours, the violet being outside" },
            { back: "000000", name: "White, red, yellow, blue, black (the latter outside)" }
        ]
    },
    "32bis": {
        type: 'Element',
        name: 'Earth',
        colors: [
            { back: "000000", quartered:["dedb2c", "8d8800", "731817", "000000"], name: "Emerald (Citrine, olive, russet, and black)" },
            { back: "ffb734", name: "Amber" },
            { back: "38200a", name: "Dark brown" },
            { back: "000000", flecked:"FEDD00", name: "Black, flecked yellow" }
        ]
    },
    "32bis-green": {
        type: 'Element',
        name: 'Earth (Green)',
        colors: [
            { back: "00A550", name: "Emerald (Citrine, olive, russet, and black)" },
            { back: "ffb734", name: "Amber" },
            { back: "38200a", name: "Dark brown" },
            { back: "000000", flecked:"FEDD00", name: "Black, flecked yellow" }
        ]
    }
    
    
};

function updateButtonEffects() {
    var a = document.getElementsByClassName("buttonEffectCanvas");
    for (var i = 0; i < a.length; i++) {

        var canvas = a[i];
        var color = JSON.parse(canvas.getAttribute('data-color'));

        //ctx.fillStyle = "#ff0000";
        //ctx.fillRect(0, 0, width, height);

        if (canvas.parentElement.clientWidth !==  canvas.width) canvas.width = canvas.parentElement.clientWidth + 6;
        if (canvas.parentElement.clientHeight !==  canvas.height) canvas.height = canvas.parentElement.clientHeight;

        if (color.hasOwnProperty('rayed')) rayIt(canvas, color);
        if (color.hasOwnProperty('flecked')) fleckIt(canvas, color);
        if (color.hasOwnProperty('quartered')) quarterIt(canvas, color)
    }

}

function clearIt(canvas) {
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function rayIt(canvas, color) {
    var ctx = canvas.getContext('2d');
    var center = {x:canvas.width/2, y: canvas.height/2};
    var rayCount = 12;
    var arcLength = ((Math.PI * 2) / rayCount) * (1/3);
    var radius = Math.max(canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    for (var j = 0; j < rayCount; j++) {
        var a0 = ((Math.PI * 2) / rayCount) * j - arcLength / 2;
        var a1 = a0 + arcLength;

        var x0 = Math.cos(a0) * radius + center.x;
        var y0 = Math.sin(a0) * radius + center.y;
        var x1 = Math.cos(a1) * radius + center.x;
        var y1 = Math.sin(a1) * radius + center.y;

        ctx.lineTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.lineTo(center.x, center.y);
    }
    ctx.closePath();

    ctx.fillStyle = "#" + color.rayed;
    ctx.fill();
}

function quarterIt(canvas, color) {
    var ctx = canvas.getContext('2d');
    var center = {x:canvas.width/2, y: canvas.height/2};

    var w = canvas.width;
    var h = canvas.height;

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
    var r = parseInt(color.substr(0, 2), 16);
    var g = parseInt(color.substr(2, 2), 16);
    var b = parseInt(color.substr(4, 2), 16);
    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha.toString() + ")";
}

function drawFleck(ctx, color, xCenter, yCenter) {

    //yourNumber = parseInt(hexString, 16);
    //"

    // draw at point
    //var size = Math.random() * 4 + 4;



    var sides = Math.floor(Math.random() * 3) + 3;
    //var sides = 4;
    var angleIncr = Math.PI * 2 / sides;

    for (var n = 0; n < 3; n++) {
        var angleOffset = Math.random() * Math.PI * 2;
        ctx.beginPath();
        for (var i = 0; i < sides; i++) {
            var size = Math.random() * 8 + 4;
            var angle = (angleIncr * i + angleOffset) % (Math.PI * 2);
            var x = Math.cos(angle) * (size/2) + xCenter;
            var y = Math.sin(angle) * (size/2) + yCenter;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = alphaColor(color, 0.5); // "#" + color;
        ctx.fill();
    }



    /*
    ctx.beginPath();
    ctx.arc(x, y, size/2, 0, 2 * Math.PI, false);
    ctx.fillStyle = "#" + color;
    ctx.fill();
    */

}

function fleckIt(canvas, color) {
    var ctx = canvas.getContext('2d');
    var colorArray = Array.isArray(color.flecked) ? color.flecked : [color.flecked];
    var colorIndex = 0;

    var radius = 1;
    var angle = 0;
    var maxRadius = Math.max(canvas.width, canvas.height);
    var center = {x:canvas.width/2, y: canvas.height/2};

    var idealDistance = 15;
    var radiusIncrPerRevolution = 12;

    var maxTimes = 1000000;

    while (radius < maxRadius && maxTimes > 0) {
        // find point
        var x = Math.cos(angle) * radius + center.x;
        var y = Math.sin(angle) * radius + center.y;

        // draw at point
        drawFleck(ctx, colorArray[colorIndex++ % colorArray.length], x, y);


        var d = idealDistance;
        var percent = -1;

        while (d > 0) {
            // determine circumference
            var c = Math.PI * 2 * radius;

            if (d > c) {
                var percent = 0.01;
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

function fleckItOld(canvas, color) {
    var ctx = canvas.getContext('2d');
    var fleckCount = 100;
    var colorArray = Array.isArray(color.flecked) ? color.flecked : [color.flecked];
    var colorIndex = 0;

    for (var i = 0; i < fleckCount; i++) {
        var x = Math.random() * canvas.width;
        var y = Math.random() * canvas.height;

        ctx.beginPath();
        ctx.arc(x, y, 2, 0, 2 * Math.PI, false);
        ctx.fillStyle = "#" + colorArray[colorIndex++ % colorArray.length];

        ctx.fill();
    }
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var list = [];
function main() {

    // get the id from the url
    var cardId = getParameterByName("id");

    // get the card info
    if (!cards.hasOwnProperty(cardId)) return;
    var card = cards[cardId];

    // create the list
    for (var key in cards) {
        list.push(key);
    }

    const element = <CardDisplay card={card} cardId={cardId} />;
    ReactDOM.render(
        element,
        document.getElementById('root')
    );
    updateButtonEffects();
}

window.onresize = function(event) {
    updateButtonEffects();
};

main();
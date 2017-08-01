


class CardDisplay extends React.Component {
    render() {
        return <table className="card-display"><tbody><tr>
            <td className="col-text">
                <p>
                This card represents the element of Water in its most secret and original form. It is the feminine complement of the Ace of Wands, and is derived from the Yoni and the Moon exactly as that is from the Lingam and the Sun. The third in the Hierarchy. This accordingly represents the essential form of the Holy Grail. Upon the dark sea of Binah, the Great Mother, are Lotuses, two in one, which fill the cup with the Life-fluid, symbolically represented either as Water, as Blood, or as Wine, according to the selected purpose of the symbolism. This being a primordial card, the liquid is shown as water; it can be transformed into Wine or Blood as may be required.
                </p><p>
                Above the Cup, descending upon it, is the Dove of the Holy Ghost, thus consecrating the element.
                </p><p>
                At the base of the Cup is the Moon, for it is the virtue of this card to conceive and to produce the second form of its Nature.
                </p>
            </td>
            <td className="col-card"><div className="card-title">Ace of Cups</div><img className="card" src="img/c01.jpg" /></td>
            <td className="col-color">
                <PathColors path={paths["3"]} />
                <PathColors path={paths["2"]} />
                <PathColors path={paths["23"]} />
                <PathColors path={paths["29"]} />
            </td>
        </tr></tbody></table>
    }
}

class PathColors extends React.Component {
    render() {
        return <div className="path">
                <div className="path-title">{this.props.path.name}</div>
                <div className="path-colors">
                    <div><ColorButton color={this.props.path.colors[0]} /><div className="color-button-label">king scale</div></div>
                    <div><ColorButton color={this.props.path.colors[1]} /><div className="color-button-label">queen scale</div></div>
                    <div><ColorButton color={this.props.path.colors[2]} /><div className="color-button-label">emperor scale</div></div>
                    <div><ColorButton color={this.props.path.colors[3]} /><div className="color-button-label">empress scale</div></div>
                </div>
            </div>
    }
}

class ColorButton extends React.Component {
    render() {
        return <div className="color-button" style={{backgroundColor: "#" + this.props.color.back}}>
            <div className="effectHolder"><canvas className="buttonEffectCanvas" width="88" height="88" data-color={JSON.stringify(this.props.color)}></canvas></div>
            <div className="nameHolder"><table><tbody><tr><td className="color-name">{this.props.color.name}</td></tr></tbody></table></div>
        </div>
    }
}

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
    //							"808080    FDC3C6"
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
    "29": {
        type: 'Zodiac',
        name: 'Pisces',
        colors: [
            { back: "AE0E36", name:"Crimson (ultra violet)" },
            { back: "D8B998", flecked:"F2F2F2", name: "Buff, flecked silver-white"},
            { back: "C08A80", name:"Light translucent pinkish brown" },
            { back: "76826a", name:"Stone color" }
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

        if (color.hasOwnProperty('rayed')) rayIt(canvas, color);
        if (color.hasOwnProperty('flecked')) fleckIt(canvas, color);
    }

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

function fleckIt(canvas, color) {
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


const element = <CardDisplay />;
ReactDOM.render(
    element,
    document.getElementById('root')
);
updateButtonEffects();
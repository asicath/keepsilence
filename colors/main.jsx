


class CardDisplay extends React.Component {
    render() {

        var index = list.indexOf(this.props.cardId);
        var nextId = this.props.cardId, prevId = this.props.cardId;
        if (index > 0) prevId = list[index - 1];
        if (index < list.length - 1) nextId = list[index + 1];

        var prevUrl = "index.htm?id=" + prevId;
        var nextUrl = "index.htm?id=" + nextId;

        var imgUrl = "img/" + this.props.cardId + ".jpg";
        var cardImg = <img className="card" src={imgUrl} />;
        if (this.props.card.noCard) cardImg = <div>&nbsp;</div>;

        return <table className="card-display"><tbody><tr>
            <td className="col-text" id="info-text">&nbsp;</td>
            <td className="col-card">
                <div className="prev"><a href={prevUrl}>prev</a></div>
                <div className="next"><a href={nextUrl}>next</a></div>
                <div className="card-title">{this.props.card.title}</div>
                {cardImg}
            </td>
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
                <div className="col square"><ColorButton color={this.props.path.colors[0]} /><div className="color-button-label">king scale</div></div>
                <div className="col square"><ColorButton color={this.props.path.colors[1]} /><div className="color-button-label">queen scale</div></div>
                <div className="col square"><ColorButton color={this.props.path.colors[2]} /><div className="color-button-label">emperor scale</div></div>
                <div className="col square"><ColorButton color={this.props.path.colors[3]} /><div className="color-button-label">empress scale</div></div>
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

        var buttonTextColor = "222222";
        if (color.hasOwnProperty('fore')) {
            if (color.fore === 'w') buttonTextColor = 'dddddd';
            else buttonTextColor = color.fore;
        }

        return <div className="color-button" onClick={click}>
            <div className="effectHolder"><canvas className="buttonEffectCanvas" width="10" height="10" data-color={JSON.stringify(this.props.color)}></canvas></div>
            <div className="nameHolder"><table><tbody><tr><td className="color-name" style={{color: "#" + buttonTextColor}}>{this.props.color.name}</td></tr></tbody></table></div>
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
    else if (color.hasOwnProperty('quartered')) {
        quarterIt(canvas, color);
        if (color.hasOwnProperty('flecked')) fleckIt(canvas, color);
    }
    else if (color.hasOwnProperty('circles')) drawCircles(canvas, color);
    else if (color.hasOwnProperty('gradient')) drawGradient(canvas, color);
    else if (color.hasOwnProperty('flecked')) fleckIt(canvas, color);
    else clearIt(canvas);

}

function updateButtonEffects() {

    var squares = document.getElementsByClassName("square");
    var minSize = 99999;
    for (var i = 0; i < squares.length; i++) {
        var square = squares[i];
        if (minSize > Math.floor(square.clientWidth)) minSize = Math.floor(square.clientWidth);
    }
    for (var i = 0; i < squares.length; i++) {
        var square = squares[i];
        square.style.height = minSize;
    }



    var a = document.getElementsByClassName("buttonEffectCanvas");

    for (var i = 0; i < a.length; i++) {

        var canvas = a[i];
        var color = JSON.parse(canvas.getAttribute('data-color'));

        //ctx.fillStyle = "#ff0000";
        //ctx.fillRect(0, 0, width, height);

        if (canvas.width !== canvas.parentElement.clientWidth) canvas.width = canvas.parentElement.clientWidth;
        if (canvas.height !== canvas.parentElement.clientHeight) canvas.height = canvas.parentElement.clientHeight;
        //if (minSize !== canvas.width) canvas.width = minSize;
        //if (minSize !== canvas.height) canvas.height = minSize;

        drawButtonBackground(canvas, color);

        if (color.hasOwnProperty('rayed')) rayIt(canvas, color);
        if (color.hasOwnProperty('quartered')) quarterIt(canvas, color);
        if (color.hasOwnProperty('circles')) drawCircles(canvas, color);
        if (color.hasOwnProperty('gradient')) drawGradient(canvas, color, true);
        if (color.hasOwnProperty('flecked')) fleckIt(canvas, color);

        roundCorners(canvas);
    }

}

function clearIt(canvas) {
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawCircles(canvas, color) {

    var center = {x:canvas.width/2, y: canvas.height/2};
    var maxRadius = Math.max(center.x, center.y);
    var radiusIncr = maxRadius / color.circles.length;

    var ctx = canvas.getContext('2d');
    for (var i = 0; i < color.circles.length; i++) {

        var radius = radiusIncr * (color.circles.length - i);

        ctx.beginPath();
        ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = "#" + color.circles[i];
        ctx.fill();
    }

}

function drawButtonBackground(canvas, color) {
    var ctx = canvas.getContext('2d');

    ctx.fillStyle = "#" + color.back;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function roundCorners(canvas) {


    var ctx = canvas.getContext('2d');
    ctx.fillStyle = "#ffffff";
    ctx.globalCompositeOperation = "destination-out";

    var round = canvas.height * 0.1;

    // upper left
    ctx.beginPath();
    ctx.moveTo(-1, -1);
    ctx.lineTo(-1, round);
    ctx.lineTo(0, round);
    ctx.arc(round, round, round, Math.PI, 1.5 * Math.PI, false);
    ctx.lineTo(round, -1);
    ctx.closePath();
    ctx.fill();

    // upper right
    ctx.moveTo(canvas.width+1, -1);
    ctx.lineTo(canvas.width - round, -1);
    ctx.lineTo(canvas.width - round, 0);
    ctx.arc(canvas.width - round, round, round, 1.5 * Math.PI, 0, false);
    ctx.lineTo(canvas.width+1, round);
    ctx.closePath();
    ctx.fill();

    // lower right
    ctx.moveTo(canvas.width+1, canvas.height+1);
    ctx.lineTo(canvas.width+1, canvas.height - round);
    ctx.lineTo(canvas.width, canvas.height - round);
    ctx.arc(canvas.width - round, canvas.height - round, round, 0, 0.5 * Math.PI, false);
    ctx.lineTo(canvas.width - round, canvas.height+1);
    ctx.closePath();
    ctx.fill();

    // lower left
    ctx.moveTo(-1, canvas.height+1);
    ctx.lineTo(round, canvas.height+1);
    ctx.lineTo(round, canvas.height);
    ctx.arc(round, canvas.height - round, round, 0.5 * Math.PI, Math.PI, false);
    ctx.lineTo(-1, canvas.height - round);
    ctx.closePath();
    ctx.fill();

    ctx.globalCompositeOperation = "source-over";
}

function drawGradient(canvas, color, roundCorners) {
    var ctx = canvas.getContext('2d');

    ctx.fillStyle = "#" + color.gradient[0];
    ctx.fillRect(0, 0, canvas.width, canvas.height / 2);

    ctx.fillStyle = "#" + color.gradient[1];
    ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);

    // now the middle
    var x = canvas.width / 2;
    var p = 0.05;
    var gradient = ctx.createLinearGradient(x, canvas.height * p, x, canvas.height * (1-p-p));

    gradient.addColorStop(0, "#" + color.gradient[0]);
    gradient.addColorStop(1, "#" + color.gradient[1]);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, canvas.height * (p), canvas.width, canvas.height * (1-p-p));
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

    // get the id from the url, try to show the card page
    var cardId = getParameterByName("id");
    if (cardId !== null && cards.hasOwnProperty(cardId)) return showCardPage(cardId);

    // otherwise show the menu
    return showIndexPage();
}

function showIndexPage() {
    const element = <Index />;
    ReactDOM.render(
        element,
        document.getElementById('root')
    );
}

class Index extends React.Component {
    render() {
        return <div>

            <div>
                Heinrich Cornelius Agrippa: Of Occult Philosophy, Book I, Part 3, Chapter XLIX. Of Light, Colours, Candles, and Lamps, and to what Stars, Houses, and Elements severall colours are ascribed.
            </div>
            <div>
                Eliphas Levi, Dogma et Rituel de la Haute Magie, Part II, Chapter VII. The Septenary of Talismans
            </div>
            <div>
                SRIA II, Theoricus Grade, The Lecture on Colours
            </div>
            <div>
                Order of the Golden Dawn, Hodos Chamelionis
            </div>
            <div>
                Aleister Crowley, 777, Notes to the Table of Correspondences
            </div>
        </div>
    }
}


function showCardPage(cardId) {

    // get the card info
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

var redrawTimeout = null;

window.onresize = function(event) {

    if (redrawTimeout != null) {
        clearTimeout(redrawTimeout);
    }

    redrawTimeout = setTimeout(function() {
        updateButtonEffects();
        redrawTimeout = null;
    }, 16);


    if (currentColor !== null) {
        setBackground(currentColor);
    }
};

main();
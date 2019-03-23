


class CardDisplay extends React.Component {
    render() {

        var index = list.indexOf(this.props.cardId);
        var nextId = this.props.cardId, prevId = this.props.cardId;
        if (index > 0) prevId = list[index - 1];
        if (index < list.length - 1) nextId = list[index + 1];

        var prevUrl = "index.htm?id=" + prevId;
        var nextUrl = "index.htm?id=" + nextId;

        // display a single card
        var imgUrl = "img/" + this.props.cardId + ".jpg";
        var cardImg = <img className="card" src={imgUrl} />;

        // if no card specified...
        if (this.props.card.noCard) cardImg = "";

        if (this.props.card.hasOwnProperty('cardGroups')) {
            cardImg = [];

            for (var j = 0; j < this.props.card.cardGroups.length; j++) {
                var group = this.props.card.cardGroups[j];
                var html = [];
                for (var i = 0; i < group.cards.length; i++) {
                    var id = group.cards[i];
                    var url = "index.htm?id=" + id;
                    var imgUrl = "img/" + id + ".jpg";
                    html.push(<div className="small-card-holder"><a href={url}><img className="small-card" src={imgUrl}/></a></div>);
                }
                cardImg.push(<div className="card-group"><div className="name">{group.name}</div><div className="cards">{html}</div></div>);
            }
        }

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

    var sides = Math.floor(Math.random() * 3) + 3;
    //var sides = 4;
    var angleIncr = Math.PI * 2 / sides;

    let range = 16;
    let xOffset = Math.random() * range - range/2;
    let yOffset = Math.random() * range - range/2;

    for (var n = 0; n < 3; n++) {
        var angleOffset = Math.random() * Math.PI * 2;
        ctx.beginPath();

        for (var i = 0; i < sides; i++) {
            var size = Math.random() * 6 + 2;
            var angle = (angleIncr * i + angleOffset) % (Math.PI * 2);
            var x = Math.cos(angle) * (size/2) + xCenter + xOffset;
            var y = Math.sin(angle) * (size/2) + yCenter + yOffset;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = alphaColor(color, 0.5); // "#" + color;
        ctx.fill();
    }

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
    if (cardId !== null && cards.hasOwnProperty(cardId)) {
        document.body.style.overflowY = "hidden";
        return showCardPage(cardId);
    }

    var source = getParameterByName("source");
    if (source) {
        loadHtml('htm/' + source + '.html');
        return;
    }

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

//Last, First M. “Section Title.” Book/Anthology. Ed. First M. Last. City: Publisher, Year Published. Page(s).
//Serviss, Garrett P. “A Trip of Terror.” A Columbus of Space. New York: Appleton, 1911. 17-32. Print.

// Levi, Eliphas. "Chapter VII. The Septenary of Talismans." Dogma et Rituel de la Haute Magie, Part II. 1856.
class Index extends React.Component {
    render() {
        return <div className="index main">

            <div className="main-title">LIBER ΙΡΙΣ</div>
            <div className="main-subtitle">SVB FIGVRA CXXVI</div>
            <div className="main-subtitle">An Exposition of the Occult Meaning of Colors</div>

            <div className="text-list">

                <div className="subtitle">Texts</div>

                <ul>

                <li className="text-source">
                    <a href="index.htm?source=agrippa">
                        Heinrich Cornelius Agrippa: Of Occult Philosophy, Book I, Part 3, Chapter XLIX. Of Light, Colours, Candles, and Lamps, and to what Stars, Houses, and Elements severall colours are ascribed. 1533.
                    </a>
                </li>
                <li className="text-source">
                    <a href="index.htm?source=levi">
                        Eliphas Levi, Dogma et Rituel de la Haute Magie, Part II, Chapter VII. The Septenary of Talismans. 1856.
                    </a>
                </li>
                <li className="text-source">
                    <a href="index.htm?source=aasr">
                        AASR, 14th Degree, The Explanation of the Girdle. Published 1882.
                    </a>
                </li>
                <li className="text-source">
                    <a href="index.htm?source=sria">
                        SRIA II, Theoricus Grade, The Lecture on Colours. 1867.
                    </a>
                </li>
                <li className="text-source">
                    <a href="index.htm?source=apr14">
                        APR, 14th Degree, Description of the banners of the twelve tribes of the chosen people. Published 1881.
                    </a>
                </li>
                <li className="text-source">
                    <a href="index.htm?source=chamelionis">
                        Order of the Golden Dawn, Hodos Chamelionis
                    </a>
                </li>
                <li className="text-source">
                    <a href="index.htm?source=777">
                        Aleister Crowley, 777, Notes to the Table of Correspondences
                    </a>
                </li>
                <li className="text-source">
                    <a href="https://docs.google.com/spreadsheets/d/15g8Y9E5mG2qD4Z2nYTPNQs2LJ9za4EeNcD_akGJ9s9g/edit?usp=sharing">
                        Our recommendations for RGB hex codes of 777 Columns XV-XVIII Scales of Colour
                    </a>
                </li>



                </ul>
            </div>

            <div className="path-list">
                <div className="subtitle">On the Tree</div>

                <div>
                    <div className="quarter-col">
                        <div className="subtitle">Spheres</div>
                        <div><a href="?id=kether">Kether</a></div>
                        <div><a href="?id=chokmah">Chokmah</a></div>
                        <div><a href="?id=binah">Binah</a></div>
                        <div><a href="?id=daath">Daath</a></div>
                        <div><a href="?id=chesed">Chesed</a></div>
                        <div><a href="?id=geburah">Geburah</a></div>
                        <div><a href="?id=tiphareth">Tiphareth</a></div>
                        <div><a href="?id=netzach">Netzach</a></div>
                        <div><a href="?id=hod">Hod</a></div>
                        <div><a href="?id=yesod">Yesod</a></div>
                        <div><a href="?id=malkuth">Malkuth</a></div>
                    </div>
                    <div className="quarter-col">
                        <div className="subtitle">Elements</div>
                        <div><a href="?id=shin">Fire</a></div>
                        <div><a href="?id=aleph">Air</a></div>
                        <div><a href="?id=mem">Water</a></div>
                        <div><a href="?id=earth">Earth</a></div>
                        <div><a href="?id=earth-green">Earth (Green)</a></div>
                        <div><a href="?id=spirit">Spirit</a></div>
                    </div>
                    <div className="quarter-col">
                        <div className="subtitle">Planets</div>
                        <div><a href="?id=gimel">Luna</a></div>
                        <div><a href="?id=beth">Mercury</a></div>
                        <div><a href="?id=daleth">Venus</a></div>
                        <div><a href="?id=resh">Sol</a></div>
                        <div><a href="?id=peh">Mars</a></div>
                        <div><a href="?id=kaph">Jupiter</a></div>
                        <div><a href="?id=tav">Saturn</a></div>
                    </div>
                    <div className="quarter-col">
                        <div className="subtitle">Zodiac</div>
                        <div><a href="?id=heh">Aries</a></div>
                        <div><a href="?id=vav">Taurus</a></div>
                        <div><a href="?id=zain">Gemini</a></div>
                        <div><a href="?id=cheth">Cancer</a></div>
                        <div><a href="?id=teth">Leo</a></div>
                        <div><a href="?id=nun">Scorpio</a></div>
                        <div><a href="?id=lamed">Libra</a></div>
                        <div><a href="?id=yod">Virgo</a></div>
                        <div><a href="?id=sameckh">Sagittarius</a></div>
                        <div><a href="?id=ayin">Capricorn</a></div>
                        <div><a href="?id=tzaddi">Aquarius</a></div>
                        <div><a href="?id=qoph">Pisces</a></div>
                    </div>
                </div>
            </div>

        </div>
    }
}

function loadHtml(url) {
    var xhr= new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange= function() {
        if (this.readyState!==4) return;
        if (this.status!==200) return; // or whatever error handling you want
        //var html = '<div class="index">' + addColorSpans(this.responseText) + '</div>'; // disable for now
        var html = '<div class="index">' + this.responseText + '</div>';
        document.getElementById('root').innerHTML = html;
    };
    xhr.send();
}

var reColors = /(\W)(red|orange|yellow|green|blue|indigo|violet|purple|black|white|grey|brown|amber)(\W)/ig;
var reAltColors = /(\W)(saffron|golden|saphire|honey|reddish|hempen|mud|blewish|citrine|pale)(\W)/ig;

function addColorSpans(html) {
    html = html.replace(reColors, spanColor);
    html = html.replace(reAltColors, spanColor);
    return html
}

function spanColor(match, p1, p2, p3, offset, string) {
    return p1 + '<span class="color ' + p2.toLowerCase() + '">' + p2 + '</span>' + p3;
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
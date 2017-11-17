function setSize() {
    var e = document.getElementById("tarot-img");

    var minCardHeight = 1073;


    // modify for proportions
    // 721x1073 down to 480
    minCardHeight = (minCardHeight / 721) * 480;

    var h = window.innerHeight - 250;
    if (h < minCardHeight) {
        e.style.height = h + "px";
        e.style.width = "";
    }

    else {
        e.style.width = "100%";
        e.style.height = "";
    }
}



window.onresize = function(event) {
    setSize();
};

setSize();

var colors = {};

var blankColor = {back:'ffffff'};

var currentColor = blankColor;

colors["11"] = [
    { back: "fee74d" },
    { back: "8ABAD3" },
    { back: "00958D" },
    { back: "00A550", flecked: "FFB000"}
];

colors["12"] = [
    { back: "FEDD00" },
    { back: "BB29BB" },
    { back: "808080" },
    { back: "001489", rayed: "440099" }
];

colors["13"] = [
    { back: "0085ca" },
    { back: "e8e8e8" },
    { back: "A5C5D9" },
    { back: "e8e8e8", rayed: "8ABAD3" }
];

colors["14"] = [
    { back: "00A550" },
    { back: "8ABAD3" },
    { back: "b2d135" },
    { back: "a41247", rayed: "B2E79F" }
];

colors["15"] = [
    { back: "F2301B" },
    { back: "ed1c24" },
    { back: "f23200" },
    { back: "ff1500" }
];

colors["16"] = [
    { back: "FF4E00" },
    { back: "000834" },
    { back: "C7B63C" },
    { back: "5c3312" }
];

colors["17"] = [
    { back: "FF6D00" },
    { back: "cca3b1" },
    { back: "e8af36" },
    { back: "907172" }
];

colors["18"] = [
    { back: "ffb734" },
    { back: "800f13" },
    { back: "d60d0a" },
    { back: "322F12" }
];

colors["19"] = [
    { back: "E5D708" },
    { back: "550055" },
    { back: "808080" },
    { back: "ff9934" }
];

colors["20"] = [
    { back: "59B934" },
    { back: "9faeaa" },
    { back: "558c70" },
    { back: "981733" }
];

colors["21"] = [
    { back: "7f14aa" },
    { back: "0085ca" },
    { back: "990099" },
    { back: "00a8ff", rayed:"fedd00" }
];

colors["22"] = [
    { back: "00A550" },
    { back: "0085ca" },
    { back: "008077" },
    { back: "B2E79F" }
];

colors["23"] = [
    { back: "004dab" },
    { back: "149C88" },
    { back: "5b6300" },
    { back: "ffffff", flecked:"BB29BB" }
];

colors["24"] = [
    { back: "00958d" },
    { back: "9D7446" },
    { back: "211307" },
    { back: "1c131b" }
];

colors["25"] = [
    { back: "0085ca" },
    { back: "FEDD00" },
    { back: "00A550" },
    { back: "003a80" }
];

colors["26"] = [
    { back: "001489" },
    { back: "000000" },
    { back: "000a44" },
    { back: "28292b" }
];

colors["27"] = [
    { back: "ed2000" },
    { back: "ed1c24" },
    { back: "c80815" },
    { back: "ff0000", rayed:"4D91C6" }
];

colors["28"] = [
    { back: "440099" },
    { back: "8ABAD3" },
    { back: "ad78bd" },
    { back: "ffe8ff" }
];

colors["29"] = [
    { back: "AE0E36" },
    { back: "D8B998", flecked:"F2F2F2" },
    { back: "C08A80" },
    { back: "76826a" }
];

colors["30"] = [
    { back: "FF6D00" },
    { back: "FEDD00" },
    { back: "FFA500" },
    { back: "ffb734", rayed: "ed1c24" }
];

colors["31"] = [
    { back: "ff2a00" },
    { back: "D9381E" },
    { back: "ed2000" },
    { back: "D9381E", flecked:["AE0E36", "00A550"] }
];

colors["32"] = [
    { back: "001489" },
    { back: "000000" },
    { back: "000a44" },
    { back: "000000", rayed:"0085ca" }
];






//


// set the buttons
function setColorButtons(prefix, path) {

    if (!colors.hasOwnProperty(path)) return;

    var o = colors[path];

    setButtonColor(document.getElementById(prefix + "scale-king"), o[0]);
    setButtonColor(document.getElementById(prefix + "scale-queen"), o[1]);
    setButtonColor(document.getElementById(prefix + "scale-emperor"), o[2]);
    setButtonColor(document.getElementById(prefix + "scale-empress"), o[3]);
}

function setButtonColor(el, color) {
    el.style.backgroundColor = "#" + color.back;

    if (color.hasOwnProperty("rayed")) {
        el.style.color = "#" + color.rayed;
    }
    if (color.hasOwnProperty("flecked")) {
        if (typeof color.flecked === 'object') el.style.color = "#" + color.flecked[0];
        else el.style.color = "#" + color.flecked;
    }
    else if (color.hasOwnProperty("fore")) {
        el.style.color = "#" + color.fore;
    }

    el.onclick = function() {
        if (color === currentColor) setColor(blankColor);
        else setColor(color);
    }
}



function setColor(color) {
    currentColor = color;
    document.body.style.backgroundColor = "#" + color.back;
}

setColorButtons("planet-", window.planetPath);
setColorButtons("zodiac-", window.zodiacPath);
function setSize() {
    var e = document.getElementById("tarot-img");

    var minCardHeight = 1073;


    // modify for proportions
    // 721x1073 down to 480
    minCardHeight = (minCardHeight / 721) * 480;

    var h = window.innerHeight - 50;
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

colors["30"] = {
    "1": { color: "FF6D00" },
    "2": { color: "FEDD00" },
    "3": { color: "FFA500" },
    "4": { color: "ffb734", rayed: "ed1c24" }
};


// set the buttons
function setColorButtons(path) {

    if (!colors.hasOwnProperty(path)) return;

    var o = colors[path];

    setButtonColor(document.getElementById("scale-king"), o["1"]);
    setButtonColor(document.getElementById("scale-queen"), o["2"]);
    setButtonColor(document.getElementById("scale-emperor"), o["3"]);
    setButtonColor(document.getElementById("scale-empress"), o["4"]);
}

function setButtonColor(el, color) {
    el.style.backgroundColor = "#" + color.color;

    if (color.hasOwnProperty("rayed")) {
        el.style.color = "#" + color.rayed;
    }

    el.onclick = function() {setColor(color);}
}

function setColor(color) {
    document.getElementById("body").style.backgroundColor = "#" + color.color;
}

setColorButtons(window.path);
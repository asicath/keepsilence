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

colors["11"] = {
    type: '',
    name: '',
    colors: [
        { back: "fee74d" },
        { back: "8ABAD3" },
        { back: "00958D" },
        { back: "00A550", flecked: "FFB000"}
    ]
};

colors["12"] = {
    type: '',
    name: '',
    colors: [
        { back: "FEDD00" },
        { back: "BB29BB" },
        { back: "808080" },
        { back: "001489", rayed: "440099" }
    ]
};

colors["13"] = {
    type: '',
    name: '',
    colors: [
        { back: "0085ca" },
        { back: "e8e8e8" },
        { back: "A5C5D9" },
        { back: "e8e8e8", rayed: "8ABAD3" }
    ]
};

colors["14"] = {
    type: 'Planet',
    name: 'Venus',
    colors: [
        { back: "00A550", name:"Emerald Green" },
        { back: "8ABAD3", name:"Sky blue" },
        { back: "b2d135", name:"Early spring green" },
        { back: "a41247", rayed: "B2E79F", name:"Bright rose or cerise, rayed pale green" }
    ]
};

colors["15"] = {
    type: '',
    name: '',
    colors: [
        { back: "F2301B" },
        { back: "ed1c24" },
        { back: "f23200" },
        { back: "ff1500" }
    ]
};

colors["16"] = {
    type: '',
    name: '',
    colors: [
        { back: "FF4E00" },
        { back: "000834" },
        { back: "C7B63C" },
        { back: "5c3312" }
    ]
};

colors["17"] = {
    type: '',
    name: '',
    colors: [
        { back: "FF6D00" },
        { back: "cca3b1" },
        { back: "e8af36" },
        { back: "907172" }
    ]
};

colors["18"] = {
    type: '',
    name: '',
    colors: [
        { back: "ffb734" },
        { back: "800f13" },
        { back: "d60d0a" },
        { back: "322F12" }
    ]
};

colors["19"] = {
    type: '',
    name: '',
    colors: [
        { back: "E5D708" },
        { back: "550055" },
        { back: "808080" },
        { back: "ff9934" }
    ]
};

colors["20"] = {
    type: '',
    name: '',
    colors: [
        { back: "59B934" },
        { back: "9faeaa" },
        { back: "558c70" },
        { back: "981733" }
    ]
};

colors["21"] = {
    type: '',
    name: '',
    colors: [
        { back: "7f14aa" },
        { back: "0085ca" },
        { back: "990099" },
        { back: "00a8ff", rayed:"fedd00" }
    ]
};

colors["22"] = {
    type: '',
    name: '',
    colors: [
        { back: "00A550" },
        { back: "0085ca" },
        { back: "008077" },
        { back: "B2E79F" }
    ]
};

colors["23"] = {
    type: '',
    name: '',
    colors: [
        { back: "004dab" },
        { back: "149C88" },
        { back: "5b6300" },
        { back: "ffffff", flecked:"BB29BB" }
    ]
};

colors["24"] = {
    type: 'Zodiac',
    name: 'Scorpio',
    colors: [
        { back: "00958d", name:"Green blue" },
        { back: "9D7446", name:"Dull brown" },
        { back: "211307", name:"Very dark brown" },
        { back: "1c131b", name:"Livid indigo brown (like a black beetle)" }
    ]
};

colors["25"] = {
    type: '',
    name: '',
    colors: [
        { back: "0085ca" },
        { back: "FEDD00" },
        { back: "00A550" },
        { back: "003a80" }
    ]
};

colors["26"] = {
    type: '',
    name: '',
    colors: [
        { back: "001489" },
        { back: "000000" },
        { back: "000a44" },
        { back: "28292b" }
    ]
};

colors["27"] = {
    type: '',
    name: '',
    colors: [
        { back: "ed2000" },
        { back: "ed1c24" },
        { back: "c80815" },
        { back: "ff0000", rayed:"4D91C6" }
    ]
};

colors["28"] = {
    type: '',
    name: '',
    colors: [
        { back: "440099" },
        { back: "8ABAD3" },
        { back: "ad78bd" },
        { back: "ffe8ff" }
    ]
};

colors["29"] = {
    type: 'Zodiac',
    name: 'Pisces',
    colors: [
        { back: "AE0E36", name:"Crimson (ultra violet)" },
        { back: "D8B998", flecked:"F2F2F2", name: "Buff, flecked silver-white"},
        { back: "C08A80", name:"Light translucent pinkish brown" },
        { back: "76826a", name:"Stone color" }
    ]
};

colors["30"] = {
    type: 'Planet',
    name: 'Sol',
    colors: [
        { back: "FF6D00", name:'Orange' },
        { back: "FEDD00", name:'Gold yellow' },
        { back: "FFA500", name:'Rich amber' },
        { back: "ffb734", rayed: "ed1c24", name:'Amber, rayed red' }
    ]
};

colors["31"] = {
    type: '',
    name: '',
    colors: [
        { back: "ff2a00" },
        { back: "D9381E" },
        { back: "ed2000" },
        { back: "D9381E", flecked:["AE0E36", "00A550"] }
    ]
};

colors["32"] = {
    type: 'Planet',
    name: 'Saturn',
    colors: [
        { back: "001489", name:"Indigo" },
        { back: "000000", name:"Black" },
        { back: "000a44", name:"Blue black" },
        { back: "000000", rayed:"0085ca", name:"Black, rayed blue" }
    ]
};






//
function initColorSections() {
    var sections = document.getElementsByClassName("color-section");

    for (var i = 0; i < sections.length; i++) {
        var section = sections[i];
        var path = section.getAttribute('data-path');
        setColorButtons(section, path);
    }

}

// set the buttons
function setColorButtons(section, path) {

    if (!colors.hasOwnProperty(path)) return;

    var o = colors[path];

    section.getElementsByClassName("section_title")[0].getElementsByTagName("a")[0].innerHTML = o.type + ' Colours: ' + o.name;

    setButtonColor(section.getElementsByClassName("scale-king")[0], o.colors[0]);
    setButtonColor(section.getElementsByClassName("scale-queen")[0], o.colors[1]);
    setButtonColor(section.getElementsByClassName("scale-emperor")[0], o.colors[2]);
    setButtonColor(section.getElementsByClassName("scale-empress")[0], o.colors[3]);
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

    el.getElementsByClassName("color-name")[0].innerHTML = color.name;

    el.onclick = function() {
        if (color === currentColor) setColor(blankColor);
        else setColor(color);
    }

}



function setColor(color) {
    currentColor = color;
    document.body.style.backgroundColor = "#" + color.back;
}

initColorSections();
const fs = require('fs');

// a specific color
class Color {
    constructor(name, hex) {
        this.name = name;
        this.hex = hex;
    }
}

const FIELD_TYPES = {
    solid: 'solid',
    quartered: 'quartered', // top, right, left, bottom
    layers: 'layers', // innermost to outermost
    fade: 'fade' // innermost to outermost
};

// represents a singular path of a particular scale
class ScalePathInfo {

    constructor(name, fieldType, fieldColors, rayedColors, fleckedColors) {

        this.name = name;

        this.fieldType = fieldType || FIELD_TYPES.solid;
        this.fieldColors = fieldColors || [];

        this.rayedColors = rayedColors || [];
        this.fleckedColors = fleckedColors || [];
    }

}


let rows = loadFromExport();

let colorMap = parseColorsFromRows(rows);

let paths = transformRowsToPaths(rows, colorMap);

exportData(paths);

console.log('complete');


function loadFromExport() {
    let text = fs.readFileSync('./color-export.txt').toString().replace(/[\r"]/g, ''); // export from GD as tab delimit csv

    let lines = text.split('\n');

    let fieldMap = [
        'key',
        'type',
        'name',
        'kingName',
        'kingHex',
        'queenName',
        'queenHex',
        'emperorName',
        'emperorHex',
        'empressName',
        'empressHex',
        null,
        'stone',
        'stoneNotes'
    ];


    let rows = lines.map(line => {

        let cells = line.split('\t');
        let row = {};

        cells.forEach((value, i) => {
            if (fieldMap.length <= i) return;
            let key = fieldMap[i];
            if (key === null) return;
            row[key] = value.trim();
        });

        row.name = row.name.replace(/\n/g, ' ').trim();

        row.kingHex = row.kingHex.toUpperCase();
        row.queenHex = row.queenHex.toUpperCase();
        row.emperorHex = row.emperorHex.toUpperCase();
        row.empressHex = row.empressHex.toUpperCase();

        return row;
    });

    rows.splice(0, 1);

    return rows;
}





// ********************************

// pull all colors out
function parseColorsFromRows(rows) {

    let colors = [];

    rows.forEach(row => {
        colors.push(...parseColorsFromRow(row['kingName'], row['kingHex']));
        colors.push(...parseColorsFromRow(row['queenName'], row['queenHex']));
        colors.push(...parseColorsFromRow(row['emperorName'], row['emperorHex']));
        colors.push(...parseColorsFromRow(row['empressName'], row['empressHex']));
    });

    // now resolve the colors
    let map = {};
    colors.forEach(color => {
        let key = color.name.toLowerCase();

        if (key in map) {
            // make sure they are the same
            let existing = map[key];
            if (existing.hex !== color.hex) {
                console.warn('colors hex dont match');
            }
        }
        else {
            map[key] = color;
        }

    });

    return map;
}

function parseColorsFromRow(name, hex) {

    let colors = [];

    let pathColorNames = parsePathColorNames(name);

    // parse the hex values
    let hexValues = parseHexValues(hex);

    // 1. first hex value is the fieldColor
    if (hexValues[0] === '*') {
        hexValues.splice(0, 1);
    }
    else if (hexValues[0] === '+') {
        hexValues.splice(0, 1);
    }
    else if (pathColorNames.main.indexOf(' or ') !== -1) {
        let fieldNames = pathColorNames.main.split(' or ');
        colors.push(new Color(fieldNames[0].trim(), hexValues[0]));
        colors.push(new Color(fieldNames[1].trim(), hexValues[1]));
        hexValues.splice(0, 2);
    }
    else if (pathColorNames.main.indexOf(' and ') !== -1) {
        throw new Error('There shouldnt be any ANDs in the field color');
    }
    else {
        colors.push(new Color(pathColorNames.main, hexValues[0]));
        hexValues.splice(0, 1);
    }

    // determine if we can continue
    if (hexValues.length === 0) return colors;

    // 2. Now examine for flecked or rayed
    if ((pathColorNames.rayed || pathColorNames.flecked).indexOf(' or ') !== -1) {
        let fieldNames = (pathColorNames.rayed || pathColorNames.flecked).split(' or ');
        colors.push(new Color(fieldNames[0].trim(), hexValues[0]));
        colors.push(new Color(fieldNames[1].trim(), hexValues[1]));
        hexValues.splice(0, 2);
    }
    else if ((pathColorNames.rayed || pathColorNames.flecked).indexOf(' and ') !== -1) {
        let fieldNames = (pathColorNames.rayed || pathColorNames.flecked).split(' and ');
        colors.push(new Color(fieldNames[0].trim(), hexValues[0]));
        colors.push(new Color(fieldNames[1].trim(), hexValues[1]));
        hexValues.splice(0, 2);
    }
    else if (hexValues.length === 1) {
        colors.push(new Color(pathColorNames.rayed || pathColorNames.flecked, hexValues[0]));
        hexValues.splice(0, 1);
    }

    if (hexValues.length > 0)
        throw new Error('Too many colors');

    return colors;
}

// ********************************




function transformRowsToPaths(rows, colorMap) {
    // now transform
    let paths = {};

    rows.forEach(row => {

        let key = row['key'];

        // skip this, just to hold malkuth colors
        if (key === 'X') return;

        let value = {};

        switch(row['type']) {
            case "S": value['type'] = 'Sphere'; break;
            case "P": value['type'] = 'Planet'; break;
            case "Z": value['type'] = 'Zodiac'; break;
            case "E": value['type'] = 'Element'; break;
        }

        value['name'] = row['name'].replace(/[\n\r]/g, '');

        //console.log('\n\t' + key + ' ' + value.name);

        // get the color objects, map to output later
        value['colors'] = [
            parseScalePath(row['kingName'], row['kingHex'], colorMap),
            parseScalePath(row['queenName'], row['queenHex'], colorMap),
            parseScalePath(row['emperorName'], row['emperorHex'], colorMap),
            parseScalePath(row['empressName'], row['empressHex'], colorMap)
        ];

        // store in the output object
        paths[key] = value;
    });

    return paths;
}

function getColorFromMap(name, colorMap) {
    let key = name.toLowerCase();
    if (!colorMap.hasOwnProperty(key)) {
        throw Error('color not found in map: ' + key);
    }
    return colorMap[key];
}

// takes a name + hex values and creates a scalePathInfo
function parseScalePath(name, hex, colorMap) {

    let pathColorNames = parsePathColorNames(name);

    // parse the hex values
    let hexValues = parseHexValues(hex);

    let value = new ScalePathInfo(name);

    // 1. first hex value is the fieldColor
    if (hexValues[0] === '*') {

        // change brilliance to white
        if (name.toLowerCase().indexOf('brilliance') !== -1) {
            value.fieldColors.push(getColorFromMap('white', colorMap));
            hexValues.splice(0, 1);
        }
        else if (name === 'White, flecked red, blue, and yellow') {
            value.fieldColors.push(getColorFromMap('white', colorMap));
            value.fleckedColors.push(getColorFromMap('red', colorMap));
            value.fleckedColors.push(getColorFromMap('blue', colorMap));
            value.fleckedColors.push(getColorFromMap('yellow', colorMap));
            hexValues.splice(0, 1);
        }
        else if (name === 'White merging into grey') {
            value.fieldColors.push(getColorFromMap('white', colorMap));
            value.fieldColors.push(getColorFromMap('grey', colorMap));
            value.fieldType = FIELD_TYPES.fade;
            hexValues.splice(0, 1);
        }
        else if (name === 'The 7 prismatic colours, the violet being outside') {
            value.fieldColors.push(getColorFromMap('red', colorMap));
            value.fieldColors.push(getColorFromMap('orange', colorMap));
            value.fieldColors.push(getColorFromMap('yellow', colorMap));
            value.fieldColors.push(getColorFromMap('green', colorMap));
            value.fieldColors.push(getColorFromMap('blue', colorMap));
            value.fieldColors.push(getColorFromMap('indigo', colorMap));
            value.fieldColors.push(getColorFromMap('violet', colorMap));
            value.fieldType = FIELD_TYPES.layers;
            hexValues.splice(0, 1);
        }
        else if (name === 'White, red, yellow, blue, black (the latter outside)') {
            value.fieldColors.push(getColorFromMap('white', colorMap));
            value.fieldColors.push(getColorFromMap('red', colorMap));
            value.fieldColors.push(getColorFromMap('yellow', colorMap));
            value.fieldColors.push(getColorFromMap('blue', colorMap));
            value.fieldColors.push(getColorFromMap('black', colorMap));
            value.fieldType = FIELD_TYPES.layers;
            hexValues.splice(0, 1);
        }
        else {
            throw Error('unhandled color: ' + name + ' | ' + hex);
        }

    }
    else if (hexValues[0] === '+') {
        value.fieldColors.push(getColorFromMap('citrine', colorMap));
        value.fieldColors.push(getColorFromMap('olive', colorMap));
        value.fieldColors.push(getColorFromMap('russet', colorMap));
        value.fieldColors.push(getColorFromMap('black', colorMap));
        hexValues.splice(0, 1);
        value.fieldType = FIELD_TYPES.quartered;
    }
    else if (pathColorNames.main.indexOf(' or ') !== -1) {
        let fieldNames = pathColorNames.main.toLowerCase().split(' or ');
        value.fieldColors.push(getColorFromMap(fieldNames[0].trim(), colorMap));
        value.fieldColors.push(getColorFromMap(fieldNames[1].trim(), colorMap));
        hexValues.splice(0, 2);
    }
    else if (pathColorNames.main.indexOf(' and ') !== -1) {
        throw new Error('There shouldnt be any ANDs in the field color');
    }
    else {
        value.fieldColors.push(getColorFromMap(pathColorNames.main.toLowerCase(), colorMap));
        hexValues.splice(0, 1);
    }

    // determine if we can continue
    if (hexValues.length === 0) return value;

    // 2. Now examine for flecked or rayed
    if ((pathColorNames.rayed || pathColorNames.flecked).indexOf(' or ') !== -1) {
        let fieldNames = (pathColorNames.rayed || pathColorNames.flecked).split(' or ');
        if (pathColorNames.rayed) {
            value.rayedColors.push(getColorFromMap(fieldNames[0].trim(), colorMap));
            value.rayedColors.push(getColorFromMap(fieldNames[1].trim(), colorMap));
        }
        if (pathColorNames.flecked) {
            value.fleckedColors.push(getColorFromMap(fieldNames[0].trim(), colorMap));
            value.fleckedColors.push(getColorFromMap(fieldNames[1].trim(), colorMap));
        }
        hexValues.splice(0, 2);
    }
    else if ((pathColorNames.rayed || pathColorNames.flecked).indexOf(' and ') !== -1) {
        let fieldNames = (pathColorNames.rayed || pathColorNames.flecked).split(' and ');
        if (pathColorNames.rayed) {
            value.rayedColors.push(getColorFromMap(fieldNames[0].trim(), colorMap));
            value.rayedColors.push(getColorFromMap(fieldNames[1].trim(), colorMap));
        }
        if (pathColorNames.flecked) {
            value.fleckedColors.push(getColorFromMap(fieldNames[0].trim(), colorMap));
            value.fleckedColors.push(getColorFromMap(fieldNames[1].trim(), colorMap));
        }
        hexValues.splice(0, 2);
    }
    else if (hexValues.length === 1) {
        let key = (pathColorNames.rayed || pathColorNames.flecked).toLowerCase();
        if (pathColorNames.rayed) value.rayedColors.push(getColorFromMap(key, colorMap));
        if (pathColorNames.flecked) value.fleckedColors.push(getColorFromMap(key, colorMap));
        hexValues.splice(0, 1);
    }

    if (hexValues.length > 0)
        throw new Error('Too many colors');

    return value;
}

function parsePathColorNames(name) {

    let value = {};

    let isFlecked = name.indexOf('fleck') !== -1;
    let isRayed = name.indexOf('rayed') !== -1;

    if (isFlecked) {
        let regEx = /flecked\s(?:with\s|)(.+)$/;
        let m = name.match(regEx);
        value.flecked = m[1];
        name = name.replace(regEx, '').replace(/,/g, '').trim();
    }

    if (isRayed) {
        let regEx = /rayed\s(?:with\s|)(.+)$/;
        let m = name.match(regEx);
        value.rayed = m[1];
        name = name.replace(regEx, '').replace(/,/g, '').trim();
    }

    value.main = name;

    return value;
}

function parseHexValues(cellValue) {
    let m = cellValue.match(/([0-9A-F]{6}|\*|\+)/g);
    if (m === null) return [];
    return m;
}

/*

    ‌{
        "key": "5",
        "type": "S",
        "name": "Sphere of Mars",
        "kingName": "Orange",
        "kingHex": "FF6D00",
        "queenName": "Scarlet red",
        "queenHex": "F2301B",
        "emperorName": "Bright scarlet",
        "emperorHex": "FF321C",
        "empressName": "Red, flecked black",
        "empressHex": "ED1C24\n000000"
    }

    "5": {
        type: 'Sphere',
        name: 'Geburah',
        colors: [
            { back: "FF6D00", name: "Orange" },
            { back: "F2301B", name: "Scarlet red" },
            { back: "ff321c", name: "Bright scarlet" },
            { back: "ed1c24", flecked: "000000", name: "Red, flecked black" }
        ]
    },
 */

function exportData(paths) {

    let data = transformPathsForExport(paths);

    let output = JSON.stringify(data, null, 2);

    fs.writeFileSync('./color-export.json', output);
}

function transformPathsForExport(paths) {
    let data = {};

    for (let key in paths) {

        let path = paths[key];

        let value = {
            type: path.type,
            name: path.name,
            colors: [
                transformColorForExport(path.colors[0]),
                transformColorForExport(path.colors[1]),
                transformColorForExport(path.colors[2]),
                transformColorForExport(path.colors[3]),
            ]
        };

        // store it
        let dataKey = key;
        if (key === 'D') dataKey = 'd';
        if (key === '31 bis') dataKey = '31bis';
        if (key === '32 bis') dataKey = '32bis';
        if (key === '32 bis earth green') dataKey = '32bis-green';
        data[dataKey] = value;
    }

    return data;
}

function transformColorForExport(color) {
    let value = {
        name: color.name,
        back: color.fieldColors[0].hex
    };

    if (color.fleckedColors.length === 1) {
        value.flecked = color.fleckedColors[0].hex;
    }
    else if (color.fleckedColors.length > 1) {
        value.flecked = color.fleckedColors.map(c => { return c.hex; });
    }

    if (color.rayedColors.length === 1) {
        value.rayed = color.rayedColors[0].hex;
    }
    else if (color.rayedColors.length > 1) {
        value.rayed = color.rayedColors[0].hex;
        //value.rayed = color.rayedColors.map(c => { return c.hex; });
    }

    if (color.fieldType === FIELD_TYPES.quartered) {
        value.quartered = color.fieldColors.map(c => { return c.hex; });
    }
    else if (color.fieldType === FIELD_TYPES.layers) {
        value.circles = color.fieldColors.reverse().map(c => { return c.hex; });
        value.back = value.circles[0];
    }
    else if (color.fieldType === FIELD_TYPES.fade) {
        value.gradient = color.fieldColors.map(c => { return c.hex; });
    }

    return value;
}


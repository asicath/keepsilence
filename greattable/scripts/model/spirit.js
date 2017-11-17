var spiritCount = 0;

var Spirit = function(type, subtype, sigilLines) {

    var my = {
        cells: [],
        sigilLines: sigilLines || [],
        type: type || 'spirit',
        subtype: subtype || '',

        drawIndex: 0, // Higher values appear on top
        backgroundColor: null,
        sigilColor: null,
        lineWidth: 0,
        nameFromCells: 'namefromcells'
    };

    my.spiritId = ++spiritCount;

    var getNameFromCells = function() {
        var n = '';

        _.each(my.cells, function(cell) {
            if (!cell) return;
            n += cell.val;
        });

        return n;
    };

    my.finalize = function() {

        // Create the sigil if it doesnt exist
        if (my.sigilLines.length == 0) {
            var sigil = [];
            my.sigilLines = [sigil];
            for (var i = 0; i < my.cells.length; i++) {
                sigil.push(i);
            }
        }

        // store the name
        my.nameFromCells = getNameFromCells();
    };

    // Add to the master list
    Model.allSpirits.push(my);

    return my;
};



var defaultHighlightColor = 'rgba(153, 153, 153, 1)';

var Governour = function(id, name, aethyr, sigilLines, location, ministers, angelOfTribe, coordinates) {

    var my = Spirit('governour', null, sigilLines);

    my.name = name;
    my.id = id;
    my.aethyr = aethyr;

    my.location = location;
    my.ministers = ministers;
    my.angelOfTribe = angelOfTribe;

    my.drawIndex = 100;
    my.sigilColor = 'rgba(0, 0, 0, 0.75)';
    my.lineWidth = 0.15;

    my.coordinates = coordinates;

    return my;
};

var Senior = function(index) {
    var my = Spirit('senior');

    my.drawIndex = 50;
    my.lineWidth = 0.4;
    my.sigilColor = Color.ByNumber(index, 7, 255);

    return my;
};

var King = function() {
    var my = Spirit('king');
    my.drawIndex = 60;
    my.sigilColor = Color.ByNumber(6, 7, 255);
    my.lineWidth = 0.2;
    return my;
};

var FatherAndSon = function() {
    var my = Spirit('greatcross', 'fatherandson');
    my.drawIndex = 10;
    my.backgroundColor = defaultHighlightColor;
    return my;
};

var HolySpirit = function() {
    var my = Spirit('greatcross', 'holyspirit');
    my.drawIndex = 11;
    my.backgroundColor = defaultHighlightColor;
    return my;
};

var NameOfGod = function(index) {
    var my = Spirit('name of god');
    my.drawIndex = 13;

    switch (index) {
        case 0:
            my.backgroundColor = 'rgba(238,19,45, 1)'; break;
        case 1:
            my.backgroundColor = 'rgba(241,215,16, 1)'; break;
        case 2:
            my.backgroundColor = 'rgba(50,143,246, 1)'; break;
        case 3:
            my.backgroundColor = 'rgba(0, 220, 0, 1)'; break;
    }


    return my;
};

var Decending = function() {
    var my = Spirit('lessercross', 'decending');
    my.backgroundColor = defaultHighlightColor;
    my.lineWidth = 0.2;
    return my;
};

var Transversary = function() {
    var my = Spirit('lessercross', 'transversary');
    my.backgroundColor = defaultHighlightColor;
    my.lineWidth = 0.2;
    return my;
};

// Those 4 above each attendent cross Transversary
var Above = function(index, subtype) {
    var my = Spirit('above', subtype);

    my.backgroundColor = defaultHighlightColor;

    return my;
};

// Those 4 below each attendent cross Transversary
var Below = function(index, subtype) {
    var my = Spirit('below', subtype);

    switch (index) {
        case 0:
            my.backgroundColor = 'rgba(241,215,16, 1)'; break; // Yellow
        case 1:
            my.backgroundColor = 'rgba(50,143,246, 1)'; break; // Blue
        case 2:
            my.backgroundColor = 'rgba(2,162,2, 1)'; break; // Green
        case 3:
            my.backgroundColor = 'rgba(238,19,45, 1)'; break; // Red
    }

    return my;
};

var Devil = function(index, subtype) {
    var my = Spirit('devil', subtype);

    switch (index) {
        case 0:
            my.backgroundColor = 'rgba(241,215,16, 1)'; break; // Yellow
        case 1:
            my.backgroundColor = 'rgba(50,143,246, 1)'; break; // Blue
        case 2:
            my.backgroundColor = 'rgba(2,162,2, 1)'; break; // Green
        case 3:
            my.backgroundColor = 'rgba(238,19,45, 1)'; break; // Red
    }

    return my;
};

var Alchemical = function(subtype) {
    var my = Spirit('alchemical', subtype);

    my.backgroundColor = defaultHighlightColor;

    return my;
};

var Gazavaa = function(index) {
    var my = Spirit('gazavaa', '');

    switch (index) {
        case 0:
            my.backgroundColor = 'rgba(238,19,45, 1)'; break;
        case 1:
            my.backgroundColor = 'rgba(241,215,16, 1)'; break;
        case 2:
            my.backgroundColor = 'rgba(50,143,246, 1)'; break;
    }

    return my;
};

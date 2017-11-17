
var Aethyr = function(id, name) {
    var my = {
        id: id,
        name: name,
        governours: []
    };
    return my;
};



var Model = (function() {

    var my = {
        cells: null,
        governours: null,
        aethyrs: null,
        allSpirits: []
    };

    my.load = function(success) {

        $.getJSON('data/data.js', function(data) {

            // First the primary spirits
            initCells(data);
            initAethyrs(data);
            initGovernours(data);

            // identify quarter
            for (var i = 0; i < my.cells.length; i++) {
                var cell = my.cells[i];

                if (cell.x < 12 && cell.y < 13) {
                    cell.quarter = "r";
                }
                else if (cell.x > 12 && cell.y < 13) {
                    cell.quarter = "b";
                }
                else if (cell.x < 12 && cell.y > 13) {
                    cell.quarter = "d";
                }
                else if (cell.x > 12 && cell.y > 13) {
                    cell.quarter = "t";
                }
                else {
                    cell.quarter = "";
                }
            }


            // Now swap the quarters
            for (var i = 0; i < my.cells.length; i++) {
                var cell = my.cells[i];
                switch (cell.quarter) {
                    case "b":
                        cell.x -= 13;
                        cell.y += 14;
                        break;
                    case "d":
                        cell.x += 13;
                        break;
                    case "t":
                        cell.y -= 14;
                        break;
                }
            }


            // Now the secondary spirits
            initSeniors();
            initKings();
            initPrincipalCrosses();
            initAttendantCrosses();
            initAlchemical();
            initGazavaa();

            success();
        });

    };


    var getCell = function(x, y) {
        return _.find(my.cells, function(c) {
            return c.x == x && c.y == y;
        });
    };

    var initCells = function(data) {
        my.cells =_.map(data.cells, function(cell) {
            return Cell(cell.val, cell.x, cell.y, !!cell.displayBackwards);
        });
    };

    var initAethyrs = function(data) {
        my.aethyrs = _.map(data.aethyrs, function(aethyr) {
            return Aethyr(aethyr.aethyrId, aethyr.name);
        });
    };

    var initGovernours = function(data) {

        my.governours = _.map(data.governours, function(gov) {

            // Find the aethyr
            var aethyr = _.find(my.aethyrs, function(a) {return a.id == gov.aethyrId;});

            // create the gov object
            var governour = Governour(gov.governourId, gov.name, aethyr, gov.sigilLines, gov.location, gov.ministers, gov.angelOfTribe, gov.coordinates);

            // Attach to aethyr
            aethyr.governours.push(governour);

            // Attach to cells
            for (var i = 0; i < gov.cells.length; i++) {
                var position = gov.cells[i];
                governour.cells[i] = getCell(position.x, position.y);
                governour.cells[i].spirits.push(governour);
            }

            // Determine tablet...
            var tCell = governour.cells[6];
            if (tCell.y < 13 && tCell.x < 12) {
                governour.tabletIndex = 1;
            }
            else if (tCell.y < 13 && tCell.x > 12) {
                governour.tabletIndex = 2;
            }
            else if (tCell.y > 13 && tCell.x < 12) {
                governour.tabletIndex = 3;
            }
            else if (tCell.y > 13 && tCell.x > 12) {
                governour.tabletIndex = 4;
            }
            else {
                governour.tabletIndex = 0;
            }

            governour.finalize();

            return governour;
        });

    };

    var bindCell = function(spirit, cell) {
        spirit.cells.push(cell);
        cell.spirits.push(spirit);
    };

    var seniorCoords = [
        [
            {x: 6, y: 6},
            {x: 5, y: 6},
            {x: 4, y: 6},
            {x: 3, y: 6},
            {x: 2, y: 6},
            {x: 1, y: 6},
            {x: 0, y: 6}
        ],
        [
            {x: 5, y: 6},
            {x: 5, y: 5},
            {x: 5, y: 4},
            {x: 5, y: 3},
            {x: 5, y: 2},
            {x: 5, y: 1},
            {x: 5, y: 0}
        ],
        [
            {x: 6, y: 6},
            {x: 6, y: 5},
            {x: 6, y: 4},
            {x: 6, y: 3},
            {x: 6, y: 2},
            {x: 6, y: 1},
            {x: 6, y: 0}
        ],
        [
            {x: 5, y: 6},
            {x: 6, y: 6},
            {x: 7, y: 6},
            {x: 8, y: 6},
            {x: 9, y: 6},
            {x: 10, y: 6},
            {x: 11, y: 6}
        ],
        [
            {x: 6, y: 6},
            {x: 6, y: 7},
            {x: 6, y: 8},
            {x: 6, y: 9},
            {x: 6, y: 10},
            {x: 6, y: 11},
            {x: 6, y: 12}
        ],
        [
            {x: 5, y: 6},
            {x: 5, y: 7},
            {x: 5, y: 8},
            {x: 5, y: 9},
            {x: 5, y: 10},
            {x: 5, y: 11},
            {x: 5, y: 12}
        ]
    ];

    var initSeniors = function() {

        var initQuarter = function(xOffset, yOffset) {

            _.each(seniorCoords, function(coords, index) {
                var s = Senior(index);
                _.each(coords, function(c) {
                    bindCell(s, getCell(c.x + xOffset, c.y + yOffset));
                });
                s.finalize();
            });

        };

        initQuarter(0, 0);
        initQuarter(13, 0);
        initQuarter(0, 14);
        initQuarter(13, 14);
    };

    var kingCoords =
    {
        comuniter:
        [
            {x: 4, y: 6},
            {x: 5, y: 5},
            {x: 6, y: 5},
            {x: 7, y: 6},
            {x: 6, y: 7},
            {x: 5, y: 7},
            {x: 5, y: 6}
        ],
        extremisJudiciis:[
            {x: 4, y: 6},
            {x: 5, y: 5},
            {x: 6, y: 5},
            {x: 7, y: 6},
            {x: 6, y: 7},
            {x: 5, y: 7},
            {x: 6, y: 6}
        ]
    };

    var initKings = function() {

        var initKing = function(xOffset, yOffset) {

            var s1 = King();
            _.each(kingCoords.comuniter, function(c) {
                bindCell(s1, getCell(c.x + xOffset, c.y + yOffset));
            });
            s1.finalize();

            var s2 = King();
            _.each(kingCoords.extremisJudiciis, function(c) {
                bindCell(s2, getCell(c.x + xOffset, c.y + yOffset));
            });
            s2.finalize();
        };

        initKing(0, 0);
        initKing(13, 0);
        initKing(0, 14);
        initKing(13, 14);
    };


    var initPrincipalCrosses = function() {

        var hsCoords = [
            {x: 0, y: 6, index: 0},
            {x: 1, y: 6, index: 0},
            {x: 2, y: 6, index: 0},
            {x: 3, y: 6, index: 1},
            {x: 4, y: 6, index: 1},
            {x: 5, y: 6, index: 1},
            {x: 6, y: 6, index: 1},
            {x: 7, y: 6, index: 2},
            {x: 8, y: 6, index: 2},
            {x: 9, y: 6, index: 2},
            {x: 10, y: 6, index: 2},
            {x: 11, y: 6, index: 2}
        ];

        var initCross = function(xOffset, yOffset) {

            var nameOfGod = [NameOfGod(0), NameOfGod(1), NameOfGod(2)];

            var holySpirit = HolySpirit();
            var fatherAndSon = FatherAndSon();

            _.each(hsCoords, function(c) {
                bindCell(holySpirit, getCell(c.x + xOffset, c.y + yOffset));
                bindCell(nameOfGod[c.index], getCell(c.x + xOffset, c.y + yOffset));
            });

            for (var y = 0; y < 13; y++) {
                bindCell(fatherAndSon, getCell(5 + xOffset, y + yOffset));
            }
            for (var y = 0; y < 13; y++) {
                bindCell(fatherAndSon, getCell(6 + xOffset, y + yOffset));
            }

            holySpirit.finalize();
            fatherAndSon.finalize();

            nameOfGod[0].finalize();
            nameOfGod[1].finalize();
            nameOfGod[2].finalize();
        };

        initCross(0, 0);
        initCross(13, 0);
        initCross(0, 14);
        initCross(13, 14);
    };

    var initAttendantCrosses = function() {

        var initCross = function(xOffset, yOffset, quarter) {


            var transverse = Transversary();
            for (var x = 0; x < 5; x++) {
                bindCell(transverse, getCell(x + xOffset, 1 + yOffset));
            }
            transverse.finalize();

            var descend = Decending();
            for (var y = 0; y < 6; y++) {
                bindCell(descend, getCell(2 + xOffset, y + yOffset));
            }
            descend.finalize();

            // Now the angels under this cross
            initAttendantCrossAngels(xOffset, yOffset, quarter);

        };

        var initCrosses = function(xOffset, yOffset) {
            initCross( 0 + xOffset, 0 + yOffset, 'first');
            initCross( 7 + xOffset, 0 + yOffset, 'second');
            initCross( 0 + xOffset, 7 + yOffset, 'third');
            initCross( 7 + xOffset, 7 + yOffset, 'fourth');
        };

        initCrosses(0, 0);
        initCrosses(13, 0);
        initCrosses(0, 14);
        initCrosses(13, 14);

    };


    var initAttendantCrossAngels = function(xOffset, yOffset, quarter) {

        var spirit;

        // four 4 letter names above the cross
        spirit = Above(0, 'angelof' + quarter);
        bindCell(spirit, getCell(0 + xOffset, yOffset));
        bindCell(spirit, getCell(1 + xOffset, yOffset));
        bindCell(spirit, getCell(3 + xOffset, yOffset));
        bindCell(spirit, getCell(4 + xOffset, yOffset));
        spirit.finalize();

        spirit = Above(1, 'angelof' + quarter);
        bindCell(spirit, getCell(1 + xOffset, yOffset));
        bindCell(spirit, getCell(3 + xOffset, yOffset));
        bindCell(spirit, getCell(4 + xOffset, yOffset));
        bindCell(spirit, getCell(0 + xOffset, yOffset));
        spirit.finalize();

        spirit = Above(2, 'angelof' + quarter);
        bindCell(spirit, getCell(3 + xOffset, yOffset));
        bindCell(spirit, getCell(4 + xOffset, yOffset));
        bindCell(spirit, getCell(0 + xOffset, yOffset));
        bindCell(spirit, getCell(1 + xOffset, yOffset));
        spirit.finalize();

        spirit = Above(3, 'angelof' + quarter);
        bindCell(spirit, getCell(4 + xOffset, yOffset));
        bindCell(spirit, getCell(0 + xOffset, yOffset));
        bindCell(spirit, getCell(1 + xOffset, yOffset));
        bindCell(spirit, getCell(3 + xOffset, yOffset));
        spirit.finalize();


        // one 5 letter name above the cross
        spirit = Above(4, 'nameofgodof' + quarter);
        bindCell(spirit, getCell(12, yOffset));
        bindCell(spirit, getCell(0 + xOffset, yOffset));
        bindCell(spirit, getCell(1 + xOffset, yOffset));
        bindCell(spirit, getCell(3 + xOffset, yOffset));
        bindCell(spirit, getCell(4 + xOffset, yOffset));
        spirit.finalize();


        // four 4 letter names below the cross
        spirit = Below(0, 'angelof' + quarter);
        bindCell(spirit, getCell(0 + xOffset, 2 + yOffset));
        bindCell(spirit, getCell(1 + xOffset, 2 + yOffset));
        bindCell(spirit, getCell(3 + xOffset, 2 + yOffset));
        bindCell(spirit, getCell(4 + xOffset, 2 + yOffset));
        spirit.finalize();

        spirit = Below(1, 'angelof' + quarter);
        bindCell(spirit, getCell(0 + xOffset, 3 + yOffset));
        bindCell(spirit, getCell(1 + xOffset, 3 + yOffset));
        bindCell(spirit, getCell(3 + xOffset, 3 + yOffset));
        bindCell(spirit, getCell(4 + xOffset, 3 + yOffset));
        spirit.finalize();

        spirit = Below(2, 'angelof' + quarter);
        bindCell(spirit, getCell(0 + xOffset, 4 + yOffset));
        bindCell(spirit, getCell(1 + xOffset, 4 + yOffset));
        bindCell(spirit, getCell(3 + xOffset, 4 + yOffset));
        bindCell(spirit, getCell(4 + xOffset, 4 + yOffset));
        spirit.finalize();

        spirit = Below(3, 'angelof' + quarter);
        bindCell(spirit, getCell(0 + xOffset, 5 + yOffset));
        bindCell(spirit, getCell(1 + xOffset, 5 + yOffset));
        bindCell(spirit, getCell(3 + xOffset, 5 + yOffset));
        bindCell(spirit, getCell(4 + xOffset, 5 + yOffset));
        spirit.finalize();

        // four 5 letter names below the cross
        spirit = Below(0, 'angelof' + quarter + 'additional');
        bindCell(spirit, getCell(12, 2 + yOffset));
        bindCell(spirit, getCell(0 + xOffset, 2 + yOffset));
        bindCell(spirit, getCell(1 + xOffset, 2 + yOffset));
        bindCell(spirit, getCell(3 + xOffset, 2 + yOffset));
        bindCell(spirit, getCell(4 + xOffset, 2 + yOffset));
        spirit.finalize();

        spirit = Below(1, 'angelof' + quarter + 'additional');
        bindCell(spirit, getCell(12, 3 + yOffset));
        bindCell(spirit, getCell(0 + xOffset, 3 + yOffset));
        bindCell(spirit, getCell(1 + xOffset, 3 + yOffset));
        bindCell(spirit, getCell(3 + xOffset, 3 + yOffset));
        bindCell(spirit, getCell(4 + xOffset, 3 + yOffset));
        spirit.finalize();

        spirit = Below(2, 'angelof' + quarter + 'additional');
        bindCell(spirit, getCell(12, 4 + yOffset));
        bindCell(spirit, getCell(0 + xOffset, 4 + yOffset));
        bindCell(spirit, getCell(1 + xOffset, 4 + yOffset));
        bindCell(spirit, getCell(3 + xOffset, 4 + yOffset));
        bindCell(spirit, getCell(4 + xOffset, 4 + yOffset));
        spirit.finalize();

        spirit = Below(3, 'angelof' + quarter + 'additional');
        bindCell(spirit, getCell(12, 5 + yOffset));
        bindCell(spirit, getCell(0 + xOffset, 5 + yOffset));
        bindCell(spirit, getCell(1 + xOffset, 5 + yOffset));
        bindCell(spirit, getCell(3 + xOffset, 5 + yOffset));
        bindCell(spirit, getCell(4 + xOffset, 5 + yOffset));
        spirit.finalize();


        // four? 3 letter names below the cross (possibly 8 or 12?)
        spirit = Devil(0, 'devilof' + quarter);
        bindCell(spirit, getCell(12, 2 + yOffset));
        bindCell(spirit, getCell(0 + xOffset, 2 + yOffset));
        bindCell(spirit, getCell(1 + xOffset, 2 + yOffset));
        spirit.finalize();

        spirit = Devil(1, 'devilof' + quarter);
        bindCell(spirit, getCell(12, 3 + yOffset));
        bindCell(spirit, getCell(0 + xOffset, 3 + yOffset));
        bindCell(spirit, getCell(1 + xOffset, 3 + yOffset));
        spirit.finalize();

        spirit = Devil(2, 'devilof' + quarter);
        bindCell(spirit, getCell(12, 4 + yOffset));
        bindCell(spirit, getCell(0 + xOffset, 4 + yOffset));
        bindCell(spirit, getCell(1 + xOffset, 4 + yOffset));
        spirit.finalize();

        spirit = Devil(3, 'devilof' + quarter);
        bindCell(spirit, getCell(12, 5 + yOffset));
        bindCell(spirit, getCell(0 + xOffset, 5 + yOffset));
        bindCell(spirit, getCell(1 + xOffset, 5 + yOffset));
        spirit.finalize();

        // Now the right side devils
        /*
        spirit = Devil(0, 'devilof' + quarter);
        bindCell(spirit, getCell(12, 2 + yOffset));
        bindCell(spirit, getCell(3 + xOffset, 2 + yOffset));
        bindCell(spirit, getCell(4 + xOffset, 2 + yOffset));
        spirit.finalize();

        spirit = Devil(1, 'devilof' + quarter);
        bindCell(spirit, getCell(12, 3 + yOffset));
        bindCell(spirit, getCell(3 + xOffset, 3 + yOffset));
        bindCell(spirit, getCell(4 + xOffset, 3 + yOffset));
        spirit.finalize();

        spirit = Devil(2, 'devilof' + quarter);
        bindCell(spirit, getCell(12, 4 + yOffset));
        bindCell(spirit, getCell(3 + xOffset, 4 + yOffset));
        bindCell(spirit, getCell(4 + xOffset, 4 + yOffset));
        spirit.finalize();

        spirit = Devil(3, 'devilof' + quarter);
        bindCell(spirit, getCell(12, 5 + yOffset));
        bindCell(spirit, getCell(3 + xOffset, 5 + yOffset));
        bindCell(spirit, getCell(4 + xOffset, 5 + yOffset));
        spirit.finalize();
        */
    };

    /* pg7
     ...... Here thou mayst see the cause, that Pilat[e] wrote with 4 letters.
     How doth the cause appear?
     ...... For above every crosse, standeth 4 letters: Not that Pilat[e] knew it, but that it was the fore-determination of God.
     They are thus to be read. In the upper left angle thou hast 'r z l a:' pronounce, 'urzla:' this name the first Angel appeareth, 'z l a:' go then to the first 'r,' and pronounce it 'zlar.' That was the first letter of the first Angel, is now the last letter of the name of the second Angel, beginning at 'z,' as 'z l a,' and so back again to the 'r.'
     Δ. So that the third beginneth at 'L,' whose last letter is the first of the second name, and is called 'Larz,' and so of the last: as 'a r z l,' to be pronounced 'arzel.'
     Δ. So that you have, of these 4 letters, 4 Angels names, here thus gathered out: but how are they to be used?
     ...... Let it be sufficient that you know these names. I will teach you to use them.
     Δ. Shall we labour by like order of every the 4 letters over the crosses to make 4 such names?
     ...... They are also to be made.
     Δ. I do know assuredly that there is very much matter in this Table.
     ...... It is true: for hither to, stretched the knowledge of Solomon.
    */


    var initAlchemical = function() {
        //
        var x, y;

        x = 13;
        y = 14;
        var spirit = Alchemical('circumference');
        bindCell(spirit, getCell(x++, y++));
        bindCell(spirit, getCell(x++, y++));
        bindCell(spirit, getCell(x++, y++));
        bindCell(spirit, getCell(x++, y++));
        bindCell(spirit, getCell(x++, y++));
        bindCell(spirit, getCell(x++, y++));
        spirit.finalize();

        x = 24;
        y = 14;
        var spirit = Alchemical('circumference');
        bindCell(spirit, getCell(x--, y++));
        bindCell(spirit, getCell(x--, y++));
        bindCell(spirit, getCell(x--, y++));
        bindCell(spirit, getCell(x--, y++));
        bindCell(spirit, getCell(x--, y++));
        bindCell(spirit, getCell(x--, y++));
        spirit.finalize();

        x = 13;
        y = 26;
        var spirit = Alchemical('circumference');
        bindCell(spirit, getCell(x++, y--));
        bindCell(spirit, getCell(x++, y--));
        bindCell(spirit, getCell(x++, y--));
        bindCell(spirit, getCell(x++, y--));
        bindCell(spirit, getCell(x++, y--));
        bindCell(spirit, getCell(x++, y--));
        spirit.finalize();

        x = 24;
        y = 26;
        var spirit = Alchemical('circumference');
        bindCell(spirit, getCell(x--, y--));
        bindCell(spirit, getCell(x--, y--));
        bindCell(spirit, getCell(x--, y--));
        bindCell(spirit, getCell(x--, y--));
        bindCell(spirit, getCell(x--, y--));
        bindCell(spirit, getCell(x--, y--));
        spirit.finalize();

        // darr
        var spirit = Alchemical('center');
        bindCell(spirit, getCell(13, 14));
        bindCell(spirit, getCell(24, 14));
        bindCell(spirit, getCell(24, 26));
        bindCell(spirit, getCell(13, 26));
        spirit.finalize();

        // lulo
        var spirit = Alchemical('center');
        bindCell(spirit, getCell(14, 15));
        bindCell(spirit, getCell(23, 15));
        bindCell(spirit, getCell(23, 25));
        bindCell(spirit, getCell(14, 25));
        spirit.finalize();
    };

    var initGazavaa = function() {
        // ga
        var spirit = Gazavaa(0);
        bindCell(spirit, getCell(10, 20));
        bindCell(spirit, getCell(11, 20));
        spirit.finalize();

        // za
        var spirit = Gazavaa(1);
        bindCell(spirit, getCell(3, 14));
        bindCell(spirit, getCell(4, 14));
        spirit.finalize();

        // vaa
        var spirit = Gazavaa(2);
        bindCell(spirit, getCell(22, 14));
        bindCell(spirit, getCell(23, 14));
        bindCell(spirit, getCell(24, 14));
        spirit.finalize();
    };



    return my;
})();


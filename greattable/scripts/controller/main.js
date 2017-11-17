
window.requestAnimFrame = ( function() {
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function (callback, element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();


var Controller = (function() {
    var my = {};

    // *** Google Font Loader, Document Ready, Load Data, then execute
    WebFont.load({
        google: {
            families: ['Vollkorn']
        },
        active: function () {
            $(document).ready(function () {

                initial();

            });
        }
    });

    var initial = function() {

        SpiritInfoView.loadTemplates();

        // Load the model
        Model.load(function() {

            // init the table
            $('#left').html('<canvas id="table" width="100" height="100" />');
            TableDraw.initTableUI(Model.cells);

            setupTableEvents();
            setupSpiritListEvents();

            my.animate();
            drawList();
        });

    };



    var tableState = null;
    var forceDraw = true;
    var checkDraw = true;

    var setTableState = function(state) {
        checkDraw = true;
        tableState = state;
    };

    // cycle initiating model frames events and view drawing
    my.animate = function() {

        // setup the next frame draw
        requestAnimFrame( my.animate );

        if (checkDraw) {
            checkDraw = false;
            // update any player input before processing frames
            TableView.drawTable(tableState, forceDraw);
            forceDraw = false;
        }

    };



    var listState = null;

    var setListState = function(state) {
        listState = state;
        drawList();
    };

    // only called occasionally
    var drawList = function() {
        SpiritInfoView.drawList(listState);
    };





    // Spirit List controller

    var setupSpiritListEvents = function() {

        // *** Governour list page ***

        $('#right').on('click', '.crumbGovernours', function() {
            setListState({ spiritType: 'governour' });
            setTableState({ spiritType: 'governour' });
            _gaq.push(['_trackEvent', 'Click', 'BreadCrumb', 'Governours']);
        });

        $('#right').on('click', '.crumbSpirits', function() {
            setListState(null);
            setTableState(null);
            _gaq.push(['_trackEvent', 'Click', 'BreadCrumb', 'Spirits']);
        });

        $('#right').on('click', '.governourLink', function() {
            var id = $(this).data('id');
            var governour = _.find(Model.governours, function(g){return g.id == id;});

            setListState({ governour: governour });
            setTableState({ governour: governour });
            _gaq.push(['_trackEvent', 'Click', 'Governour', id + "-" + governour.name]);
        });

        $('#right').on('mouseover', '.governourLink', function() {

            if ($(this).hasClass('noPreview')) return;

            var id = $(this).data('id');
            var governour = _.find(Model.governours, function(g) { return id == g.id; });

            // Show the gov temp?
        });
        $('#right').on('mouseout', '.governourLink', function() {
            //clearTempState();
        });

        $('#right').on('click', '.governourMap', function() {
            SpiritInfoView.showGovernourMap();
        });

        $('#right').on('mouseover', '.aethyrLink', function() {
            var id = $(this).data('id');
            var aethyr = _.find(Model.aethyrs, function(g) { return id == g.id; });

            // show the aethyr govs temp?
        });
        $('#right').on('mouseout', '.aethyrLink', function() {
            //clearTempState();
        });


        // *** Spirit list page ***

        $('#right').on('click', '.spiritType', function() {
            var spiritType = $(this).data('name');
            setListState({ spiritType: spiritType });
            setTableState({ spiritType: spiritType });
            _gaq.push(['_trackEvent', 'Click', 'SpiritType', spiritType]);
        });

        $('#right').on('mouseover', '.spiritType', function() {
            var spiritType = $(this).data('name');
            setTableState({ spiritType: spiritType });
        });
        $('#right').on('mouseout', '.spiritType', function() {
            setTableState(null);
        });


        $('#right').on('mouseover', '.spiritLink', function() {
            var spiritId = $(this).data('spiritid');
            tableState.spiritId = spiritId;
            setTableState(tableState);
        });
        $('#right').on('mouseout', '.spiritLink', function() {
            tableState.spiritId = null;
            setTableState(tableState);
        });






    };


    // Table controller

    var setupTableEvents = function() {
        var canvas = $('#table');

        function getMousePos(canvas, evt) {
            var rect = canvas.getBoundingClientRect();
            return {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        }

        // Setup events
        canvas.on('mousemove', function(event) {
            var coord = getMousePos(canvas[0], event);
            var cell = TableDraw.getCell(coord.x, coord.y);
            hoverCell(cell);
        });

        canvas.on('mouseout', function(event) {
            hoverCell(null);
        });

        canvas.on('mousedown', function(event) {
            var coord = getMousePos(canvas[0], event);
            var cell = TableDraw.getCell(coord.x, coord.y);
            clickCell(cell);
        });

        $(window).resize(function() {
            TableDraw.recalcNeeded = true;
            checkDraw = true;
            forceDraw = true;
        });
    };

    var stateFromHoverCell = false;

    var hoverCell = function(cell) {

        if (stateFromHoverCell || (!tableState && !listState)) {

            if (!cell) {
                setListState(null);
                setTableState(null);
                stateFromHoverCell = false;
            }
            else {
                setListState({ cell: cell });
                setTableState({ cell: cell });
                stateFromHoverCell = true;
            }

        }

    };

    var clickCell = function(cell) {
        setListState({ cell: cell });
        setTableState({ cell: cell });
        stateFromHoverCell = false;
        _gaq.push(['_trackEvent', 'Click', 'Cell', cell.name]);
    };

    return my;
})();

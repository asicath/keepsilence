var SpiritInfoView = (function() {
    var my = {};

    var templates = {};

    my.loadTemplates = function() {
        var templatess = $('script[type="text/x-handlebars-template"]');
        _.each(templatess, function(t) {
            var id = $(t).attr('id').replace('-template', '');
            templates[id] = Handlebars.compile($(t).html());
        });
    };



    my.drawList = function(state) {

        // Default to just showing the list of spirit types
        if (!state) {
            listSpiritTypes();
        }

        // Show a specific list of spirits
        else if (state.spiritType) {
            if (state.spiritType == 'governour') {
                listGovernours();
            }
            else {
                listSpiritsByType(state.spiritType);
            }
        }

        // Show a specific governour
        else if (state.governour) {
            showGovernour(state.governour);
        }

        // Show the info of a cell
        else if (state.cell) {
            showCellInfo(state.cell);
        }

    };



    var listSpiritsByType = function(spiritType) {

        var typeInfo = _.find(spiritTypeList, function(s){
            return s.name == spiritType;
        });

        var spirits = {};

        spirits.all = _.filter(Model.allSpirits, function(s) {
            return s.type == spiritType;
        });

        // Now group them by subtype
        var subtypes = _.groupBy(spirits.all, function(s) {
            if (s.subtype.length == 0) {
                return "none";
            }
            return s.subtype;
        });

        spirits.subtypes = _.reduce(subtypes, function(result, s, key) {
            if (key == "none") {
                spirits.top = s;
            }
            else {
                var info = _.find(typeInfo.subtypes, function(v) {
                    return v.name == key;
                });
                result.push({subtype:key, spirits: s, info: info});
            }

            return result;
        }, []);



        $('#right').html(templates.spiritListByType({typeInfo: typeInfo, spirits: spirits}));



        if (typeInfo.info) {
            $('#info').html(templates[typeInfo.info]({}));

            // cut off the info if its too long
            var maxHeight = 300;
            var infoDiv = $('#right #info');
            if (infoDiv.height() > maxHeight) {
                infoDiv.css('height', maxHeight);

                $('<p class="read-more link">-= View Full Text =-</p>').insertAfter(infoDiv);

                $('<p class="read-fade"></p>').insertAfter(infoDiv);
                var height = $('.read-fade').outerHeight();
                $('.read-fade').css('margin-top', -height);



                $('.read-more').on('click', function() {
                    infoDiv.css('height', '');
                    $('.read-fade').remove();
                    $('.read-more').remove();
                })
            }
        }
    };


    var listGovernours = function() {
        $('#right').html(templates.governourList(Model.aethyrs));
    };

    var showGovernour = function(governour) {

        var viewModel = {
            gov: governour,
            nextId: governour.id < 91 ? governour.id + 1 : null,
            prevId: governour.id > 1 ? governour.id - 1 : null
        };
        $('#right').html(templates.governour(viewModel));

        if (governour.coordinates) {
            var latLng = new google.maps.LatLng(governour.coordinates.lat, governour.coordinates.lng);

            var mapOptions = {
                center: latLng,
                zoom: 4,
                mapTypeId: google.maps.MapTypeId.SATELLITE
            };
            var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

            var marker = new google.maps.Marker({
                position: latLng,
                map: map,
                title: governour.location,
                optimized: false
            });

        }
    };

    my.showGovernourMap = function() {

        var viewModel = {
        };
        $('#right').html(templates.governourMap(viewModel));

        // init map
        var latLng = new google.maps.LatLng(51.509201, -0.127005);
        var mapOptions = {
            center: latLng,
            zoom: 3,
            mapTypeId: google.maps.MapTypeId.SATELLITE
        };
        var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

        var govs = _.filter(Model.allSpirits, function(s) {
            return s.type == 'governour';
        });

        _.each(govs, function(governour) {
            if (!governour.coordinates) return;
            latLng = new google.maps.LatLng(governour.coordinates.lat, governour.coordinates.lng);

            var marker = new google.maps.Marker({
                position: latLng,
                map: map,
                title: governour.location,
                optimized: false
            });

            switch (governour.tabletIndex) {
            //switch (governour.angelOfTribe - 8) {
                case 1:
                    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
                    break;
                case 2:
                    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/yellow-dot.png');
                    break;
                case 3:
                    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
                    break;
                case 4:
                    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
                    break;
                default:
                    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/purple-dot.png');
                    break;
            }
        });




    };

    var showCellInfo = function(cell) {

        $('#right').html(templates.cellInfo(cell));

        var types = _.reduce(_.groupBy(cell.spirits, function(s) {
            return s.type;
        }), function(result, s, key){
            var typeInfo = _.find(spiritTypeList, function(s){
                return s.name == key;
            });
            var o = {type:key, spirits: {all: s}, info: typeInfo};
            determineSubtypes(o);
            result.push(o);
            return result;
        }, []);

        // split into top/subtypes



        $('#right').append(templates.spiritList(types));

    };

    var determineSubtypes = function(o) {
        // Now group them by subtype
        var subtypes = _.groupBy(o.spirits.all, function(s) {
            if (s.subtype.length == 0) {
                return "none";
            }
            return s.subtype;
        });

        o.spirits.subtypes = _.reduce(subtypes, function(result, s, key) {
            if (key == "none") {
                o.spirits.top = s;
            }
            else {
                var info = _.find(o.info.subtypes, function(v) {
                    return v.name == key;
                });
                result.push({subtype:key, spirits: s, info: info});
            }

            return result;
        }, []);
    };


    var spiritTypeList = [
        {name:'name of god', display:'Names of God', info: "namesOfGodInfo"},
        {name:'senior', display:'Seniors', info: "seniorInfo"},
        {name:'king', display:'Kings', info: "kingInfo"},
        {name:'greatcross', display:'Great Crosses', info: "greatCrossInfo", subtypes: [
            {name:'holyspirit', display:'Linea Spiritus Sancti'},
            {name:'fatherandson', display:'Linea Patris et Fillii'}
        ]},
        {name:'lessercross', display:'Lesser Crosses', info: "attendantInfo", subtypes: [
            {name:'decending', display:'Decending'},
            {name:'transversary', display:'Transversary'}
        ]},
        {name:'above', display:'Above the Crosses', info: 'aboveInfo', subtypes:[
            {name:'angeloffirst', display:'Angels of the First Angles'},
            {name:'angelofsecond', display:'Angels of the Second Angles'},
            {name:'angelofthird', display:'Angels of the Third Angles'},
            {name:'angeloffourth', display:'Angels of the Fourth Angles'},
            {name:'nameofgodoffirst', display:'Names of God of the First Angles'},
            {name:'nameofgodofsecond', display:'Names of God of the Second Angles'},
            {name:'nameofgodofthird', display:'Names of God of the Third Angles'},
            {name:'nameofgodoffourth', display:'Names of God of the Fourth Angles'}
        ]},
        {name:'below', display:'Below the Crosses', info:'belowInfo', subtypes:[
            {name:'angeloffirst', display:'Angels of the First Angles'},
            {name:'angelofsecond', display:'Angels of the Second Angles'},
            {name:'angelofthird', display:'Angels of the Third Angles'},
            {name:'angeloffourth', display:'Angels of the Fourth Angles'},
            {name:'angeloffirstadditional', display:'Angels of the First Angles With Additional Letter'},
            {name:'angelofsecondadditional', display:'Angels of the Second Angles With Additional Letter'},
            {name:'angelofthirdadditional', display:'Angels of the Third Angles With Additional Letter'},
            {name:'angeloffourthadditional', display:'Angels of the Fourth Angles With Additional Letter'}
        ]},
        {name:'devil', display:'Wicked', info:'devilInfo', subtypes:[
            {name:'deviloffirst', display:'Wicked of the First Angles'},
            {name:'devilofsecond', display:'Wicked of the Second Angles'},
            {name:'devilofthird', display:'Wicked of the Third Angles'},
            {name:'deviloffourth', display:'Wicked of the Fourth Angles'}
        ]},
        {name:'governour', display:'Governours'},
        {name:'gazavaa', display:'Gazavaa', info:'gazavaaInfo'},
        {name:'alchemical', display:'Alchemical', info:'alchemicalInfo', subtypes: [
            {name:'circumference', display:'Quaternarius in Circumferentia'},
            {name:'center', display:'Quaternarius in Centro'}
        ]}

    ];

    var listSpiritTypes = function() {
        $('#right').html(templates.spiritTypeList(spiritTypeList));
    };

    return my;
})();

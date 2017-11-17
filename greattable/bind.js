
$.getJSON('data/data.js', function(data) {

    $.get('data/locations.txt', function(loc) {
        $.get('data/ministers.txt', function(min) {
            $.get('data/tribes.txt', function(tri) {
                var locations = loc.split('\r\n');

                for (var i = 1; i <= 91; i++) {
                    var gov = _.find(data.governours, function(g) {return g.governourId == i;});

                    var locData = locations[i-1].split(',');

                    //gov.location = locData[0];
                    if (locData.length > 1) {
                        gov.coordinates = {
                            lat: locData[1],
                            lng: locData[2]
                        };
                    }

                }

                $('body').html(JSON.stringify(data));
            });
        });

    });

});
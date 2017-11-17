

// *** Setup selection disabling
(function ($) {
    $.fn.disableSelection = function () {
        return this
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
    };
})(jQuery);




var map = null;
var bodies = null;
var month = 2;
var year = 1978;

var maxMonth = 7;
var maxYear = 2013;

var Execute = function (data) {

    $('.button').disableSelection();

    preLoadMarkerIcons();

    initBodyData(data);

    // Set map to middle of U.S.
    map = initializeMap(39.8282, -98.5795);

    ShowBodies();
};

var preLoadMarkerIcons = function () {
    var div = $('<div/>', { style: 'display: none' });
    for (var i = 0; i < 50; i++) {
        var url = "https://chart.googleapis.com/chart?chst=d_map_spin&chld=0.6|0|ff6666|10|b|" + i;
        div.append($('<img />', {src: url}));
    }
    $('body').append(div);
};

var parseDate = function (s) {

    if (s.length > 0) {
        var d = s.split('-');
        return parseInt(d[0]) + parseInt(d[2]) * 100;
    } else {
        return -1;
    }

};

var initBodyData = function (data) {
    bodies = [];

    $.each(data, function (index, body) {
        if (body.location != null) {
            body.latlng = new google.maps.LatLng(body.location.lat, body.location.lon);

            body.title = function () {
                var title = body.name;

                title += '\n' + body.city + ', ' + body.state;

                title += '\nOpened: ' + body.opened;

                if (body.closed.length > 0) {
                    title += '\nClosed: ' + body.closed;
                } else {
                    title += '\nActive';
                }

                return title;
            };

            body.openedDate = parseDate(body.opened);
            body.closedDate = parseDate(body.closed);

            body.marker = new google.maps.Marker({
                position: body.latlng,
                map: null,
                title: body.title(),
                optimized: false
            });

            body.offset = 0;

            if (body.originalLocation) {
                //"originalLocation": {"city": "Los Angeles", "state": "CA", "lat":34.0522, "lon":-118.2428, "date":"9-26-1998"}

                body.originalLocation.movedDate = parseDate(body.originalLocation.date);
                body.originalLocation.latlng = new google.maps.LatLng(body.originalLocation.lat, body.originalLocation.lon);
                body.showingOriginal = false;

                body.originalLocation.title = function () {
                    var title = body.name;

                    title += '\n' + body.originalLocation.city + ', ' + body.originalLocation.state;

                    title += '\nOpened: ' + body.opened;

                    if (body.closed.length > 0) {
                        title += '\nClosed: ' + body.closed;
                    } else {
                        title += '\nActive';
                    }

                    return title;
                };

            }
            bodies.push(body);
        }
    });

    // Lets sort them by open date
    bodies.sort(function (a, b) {
        return a.openedDate - b.openedDate;
    });
};

var ShowBodies = function () {

    $('#month').val(month);
    $('#year').val(year);

    var date = month + year * 100;

    var visible = {};
    var count = 0;

    $.each(bodies, function (index, body) {

        if (body.openedDate < date && (body.closedDate == -1 || body.closedDate > date)) {
            count++;

            // If the marker isn't already on the map, add it
            if (body.marker.getMap() == null) {
                body.marker.setMap(map);
            }

            // Set key now, might change with original location
            var key = body.city + ',' + body.state;

            if (body.originalLocation) {

                if (date < body.originalLocation.movedDate) {
                    if (!body.showingOriginal) {
                        body.marker.setPosition(body.originalLocation.latlng);
                        body.marker.setTitle(body.originalLocation.title());
                        body.showingOriginal = true;
                    }
                    var key = body.originalLocation.city + ',' + body.originalLocation.state;
                }
                else {
                    if (body.showingOriginal) {
                        body.marker.setPosition(body.latlng);
                        body.marker.setTitle(body.title());
                        body.showingOriginal = false;
                    }
                }

            }

            // Offset based on location to prevent total overlap
            var offset = 0;
            while (visible[key + offset]) {
                offset++;
            }

            visible[key + offset] = body;

            if (body.offset != offset) {
                body.latlng = new google.maps.LatLng(body.location.lat, body.location.lon + 0.1 * offset);
                body.marker.setPosition(body.latlng);
                body.offset = offset;
            }

            // Set the icon to show the number of years the body has been open
            var years = Math.floor((date - body.openedDate) / 100);
            var iconUrl = "https://chart.googleapis.com/chart?chst=d_map_spin&chld=0.6|0|ff6666|10|b|" + years;
            if (body.marker.getIcon() != iconUrl) {
                body.marker.setIcon(iconUrl);
            }

        }
        else {
            body.marker.setMap(null);
        }

    });

    // Show count
    var s = count + ' ';
    if (count == 1) {
        s += 'body';
    } else {
        s += 'bodies';
    }
    $('#bodycount').html(s);
};

var PrevYear = function () {
    year--;
    ShowBodies();
};

var NextYear = function () {

    // Don't go beyond 2014
    if (year < maxYear) {
        year++;
    }
    else {
        // trying to go beyond the max month
        month = maxMonth;
        pause();
    }

    // Enforce max month in the max year
    if (year == maxYear && month > maxMonth) {
        month = maxMonth;
        pause();
    }

    ShowBodies();
};

var PrevMonth = function () {
    month--;

    if (month == 0) {
        month = 12;
        year--;
    }

    ShowBodies();
};

var NextMonth = function () {
    month++;

    if (year < maxYear) {
        // Not at max year yet, allow to go on
        if (month == 13) {
            month = 1;
            year++;
        }
    }
    else {
        if (month > maxMonth) {
            month = maxMonth;
            pause();
        }
    }

    ShowBodies();
};

var play = null;

var pause = function () {
    if (play) {
        clearInterval(play);
        play = null;
    }
};

var runPlay = function (minutes) {
    pause();

    var period = minutes * 60 * 1000;
    var total = ((2014 - 1978) * 12);
    var interval = period / total;

    play = setInterval(function () {
        NextMonth();
    }, interval);
};



// *** Setup the control panel events ***

$(document).on('click', '#nextYear', function () {
    NextYear();
});

$(document).on('click', '#prevYear', function () {
    pause();
    PrevYear();
});

$(document).on('click', '#nextMonth', function () {
    NextMonth();
});

$(document).on('click', '#prevMonth', function () {
    pause();
    PrevMonth();
});

$(document).on('click', '#pause', function () {
    pause();
});

$(document).on('click', '#playfast', function () {
    runPlay(3);
});

$(document).on('click', '#playslow', function () {
    runPlay(10);
});

$(document).on('click', '#playfaster', function () {
    runPlay(1);
});

$(document).on('click', '#playslower', function () {
    runPlay(30);
});









var initializeMap = function (lat, lng) {
    var mapOptions = {
        center: new google.maps.LatLng(lat, lng),
        zoom: 4,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    return map;
}



// *** Google Font Loader, Document Ready, Load Data, then execute
WebFont.load({
    google: {
        families: ['Vollkorn']
    },
    active: function () {
        $(document).ready(function () {

            $.ajax({
                dataType: "json",
                url: 'bodies.js',
                success: function (data) {
                    Execute(data);
                },
                error: function (e1, e2, e3) {

                }
            });

        });
    }
});
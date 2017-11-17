
var Cell = function(val, x, y, displayBackwards) {
    var my = {
        val: val,
        x: x,
        y: y,
        displayBackwards: displayBackwards,
        spirits: []
    };

    my.name = String.fromCharCode(65 + x) + (y + 1);

    my.governour = function() {
        return _.find(my.spirits, function(s) {
            return s.type == 'governour';
        });
    };

    return my;
};

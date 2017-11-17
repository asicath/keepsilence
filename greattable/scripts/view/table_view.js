var TableView = (function() {
    var my = {};

    var lastKey = "notdrawnyet";

    // determines which spirits to draw based on current state
    // Passes these spirits onto the view
    my.drawTable = function(state, forceRedraw) {

        var spirits = null;
        var key = "blank";

        if (!state) {
            // None selected
        }

        else if (state.spiritId) {
            key = "spiritId";
            spirits = _.filter(Model.allSpirits, function(s) {
                return s.spiritId == state.spiritId;
            });
        }

        // Draw the spirits that have any letter in the specified cell
        // Used for mouseover and click
        else if (state.cell) {
            key = "cell";
            key += "_" + state.cell.x + "_" + state.cell.y;
            spirits = _.sortBy(state.cell.spirits, function(s) {
                return s.drawIndex;
            });
        }

        // Draw just the selected governour
        else if (state.governour) {
            key = "governour";
            spirits = [state.governour];
        }

        // Draw all the governours of an aethyr
        else if (state.aethyr) {
            key = "aethyr";
            spirits = state.aethyr.governours;
        }

        // Draw all of one particular spirit type
        else if (state.spiritType) {
            key = "spiritType";
            spirits = _.filter(Model.allSpirits, function(s) {
                return s.type == state.spiritType;
            });
        }




        // Append the spirit ids to the key
        if (spirits) {
            for (var i = 0; i < spirits.length; i++) {
                key += "_" + spirits[i].spiritId;
            }
        }

        // if the key is different from the last drawn key, draw again
        // OR if we are forcing a redraw due to resizing
        if (lastKey != key || forceRedraw) {
            lastKey = key;

            TableDraw.drawTable(spirits, state ? state.cell : null);
        }

    };

    return my;
})();
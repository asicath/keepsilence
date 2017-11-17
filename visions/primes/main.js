$(function() {

    var notes = {
        a3: {octave: 3, note: "A", freq: 220.00},
        b3: {octave: 3, note: "B", freq: 246.94},
        c4: {octave: 4, note: "C",  freq: 261.63},
        d4: {octave: 4, note: "D", freq: 293.66},
        e4: {octave: 4, note: "E", freq: 329.63},
        f4: {octave: 4, note: "F", freq: 349.23},
        g4: {octave: 4, note: "G", freq: 392.00},

        a4: {octave: 4, note: "A", freq: 440},
        b4: {octave: 4, note: "B", freq: 493.88},
        c5: {octave: 5, note: "C", freq: 523.25 },
        d5: {octave: 5, note: "D", freq: 587.33 },
        e5: {octave: 5, note: "E", freq: 659.26 },
        f5: {octave: 5, note: "F", freq: 698.46 },
        g5: {octave: 5, note: "G", freq: 783.99 }
    };

    var sevenHigh = [notes.a4, notes.b4, notes.c5, notes.d5, notes.e5, notes.f5, notes.g5];

    var sevenLow = [notes.a3, notes.b3, notes.c4, notes.d4, notes.e4, notes.f4, notes.g4];

    var twelve = [
        notes.a3,
        {octave: 3, note: "A#", freq: 233.08},
        notes.b3,
        notes.c4,
        {octave: 4, note: "C#", freq: 277.18},
        notes.d4,
        {octave: 4, note: "D#", freq: 311.13},
        notes.e4,
        notes.f4,
        {octave: 4, note: "F#", freq: 369.99},
        notes.g4,
        {octave: 4, note: "G#", freq: 415.30}
    ];


    var notes = sevenLow;//.concat(sevenHigh);
    //notes = twelve;

    function formatNumber(n, length) {
        var s = n.toString();
        while (s.length < length) {
            s = ' ' + s;
        }
        return s.replace(/\s/g, '&nbsp;');
    }


    var n = 2;

    function next() {

        $('#n').html('&nbsp;&nbsp;&nbsp;' + formatNumber(n, 5));

        var ranges = range.getRangeAt(n, notes.length);
        var factors = range.getPrimeFactors(n);



        // reset isActive
        for (var i = 0; i < notes.length; i++) {
            notes[i].isActive = false;
            notes[i].factor = 0;
        }

        // find any that are active
        for (var i = 0; i < factors.length; i++) {
            var f = factors[i];
            if (f == n) continue;
            for (var j = 0; j < ranges.length; j++) {
                if (f >= ranges[j].start && f <= ranges[j].end) {
                    notes[j].isActive = true;
                    notes[j].factor = f;
                }
            }
        }

        // set the tones, and display
        for (var l = 0; l < notes.length; l++) {
            var note = notes[l];

            // set the note
            var loud = note.isActive ? 0.2 : 0;
            var name = note.note + note.octave;
            pool.set(name, note.freq, loud);

            // display
            var displayValue = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
            if (note.isActive) {
                //displayValue = "++++";
                displayValue = formatNumber(note.factor, 5);
            }

            displayValue += '|';


            if (l < ranges.length) {
                var r = ranges[l];
                displayValue += ' ' + r.active.toFixed(4);
                //displayValue += ' ' + (r.next || 0).toFixed(4);
                displayValue += ' ' + formatNumber(r.start, 5) + '-' + formatNumber(r.end, 5);
                displayValue += ' ' + r.count;
            }



            $('#' + name + ' .value').html(displayValue);
        }

        n += 1;
    }

    function silence() {
        for (var l = 0; l < notes.length; l++) {
            var note = notes[l];
            var loud = 0;
            var name = note.note + note.octave;
            pool.set(name, note.freq, loud);
        }
    }

    function setupDisplay() {
        $('#display').append('<div id="n"></div>')
        for (var l = 0; l < notes.length; l++) {
            var note = notes[l];
            var name = note.note + note.octave;
            $('#display').append('<div id="' + name + '"><div>' + name + '|<span class="value">test</span></div></div>');
        }
    }

    function setupControls() {
        $('#pause').on('click', function() {
            if (running) {
                $(this).addClass('active');
                running = false;
                silence();
            }
            else {
                $(this).removeClass('active');
                startWithRandomDelay();
            }

        });
    }

    var running = false;
    function startWithRandomDelay() {
        running = true;
        var v = Math.random() * 50 - 25;

        var t = Math.floor(400 + v);

        setTimeout(function() {
            if (!running) return;
            next();
            startWithRandomDelay();
        }, t);
    }

    setupDisplay();
    setupControls();
    startWithRandomDelay();
});


//while (true) { next(); }

//setInterval(addDelay, 50);
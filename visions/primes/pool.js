var audioContext = new (window.AudioContext || window.webkitAudioContext)();


var pool = {
    free: [],
    taken: {},
    goingToZero:[]
};

function take() {
    var o = null;
    if (pool.free.length > 0) o = pool.free.splice(0, 1)[0];
    else o = createOscillatorWithAmp();
    return o;
}

function release(o) {
    pool.free.push(o);
}

function createOscillatorWithAmp() {
    // create the oscillator
    var oscillator = audioContext.createOscillator();

    // Add missing functions to make the oscillator compatible with the later standard.
    if (typeof oscillator.start === 'undefined') oscillator.start = function(when) { oscillator.noteOn(when); }
    if (typeof oscillator.stop === 'undefined') oscillator.stop = function(when) { oscillator.noteOff(when); }
    oscillator.frequency.value = 440;

    // create the amp
    var amp = audioContext.createGain();
    amp.gain.value = 0;

    // Connect oscillator to amp and amp to the mixer of the audioContext.
    // This is like connecting cables between jacks on a modular synth.
    oscillator.connect(amp);
    amp.connect(audioContext.destination);

    oscillator.start();

    return {oscillator: oscillator, amp: amp};
}

// Set the frequency of the oscillator and start it running.
pool.set = function(key, frequency, loud)
{
    // get from pool and cache if needed
    if (!pool.taken.hasOwnProperty(key) || pool.taken[key] == null) {

        // no need to take if loud is 0
        if (loud === 0) return;

        // otherwise get one
        pool.taken[key] = take();
    }

    // release it if this was a 0
    if (loud === 0) {
        goToZero(key);
    }
    else {
        var o = pool.taken[key];
        o.oscillator.frequency.value = frequency;
        goToValue(key, loud);
    }
};

function goToValue(key, loud) {
    var o = pool.taken[key];

    o.amp.gain.setValueAtTime(0.0001, audioContext.currentTime);
    o.amp.gain.exponentialRampToValueAtTime(loud, audioContext.currentTime + 0.03);
}

function goToZero(key) {

    var o = pool.taken[key];

    //let current = o.amp.gain.value;

    o.amp.gain.setValueAtTime(o.amp.gain.value, audioContext.currentTime);

    o.amp.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.3);
}
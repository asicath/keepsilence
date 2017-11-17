var config = {
    //calcPercent: 'getPercent_linear',
    //cutOff: 0,

    calcPercent: 'getPercent_cube',
    cutOff: 0.5,

    deltaPerSecond: 1,
    startAt: 1,
    interval: 10,
    freqBase: 100,
    freqIncr: 11,
    loudMax: 0.1,
    displayWidth: 50,
    numberOfPrimes: 200
};



$(function() {

    setPrimeCount(config.numberOfPrimes);

    var running = null;

    $('#btnStart').on('click', function() {
        if (running != null) clearInterval(running);
        config.deltaPerSecond = +$('#txtSpeed').val();
        config.startAt = +$('#txtStart').val();
        start();
    });

    $('#btnStop').on('click', function() {
        stop();
    });

    $('#btnFaster').on('click', function() {
        var c = Math.round((config.deltaPerSecond + 0.01) * 1000) / 1000;
        config.deltaPerSecond = c;
        calcDelta();
        $('#txtSpeed').val(config.deltaPerSecond.toString());
    });

    $('#btnSlower').on('click', function() {
        var c = Math.round((config.deltaPerSecond - 0.01) * 1000) / 1000;
        if (c <= 0) return;
        config.deltaPerSecond = c;
        calcDelta();
        $('#txtSpeed').val(config.deltaPerSecond.toString())
    });

    $('#selectMethod').on('change', function() {
        var method = $(this).val();
        config.calcPercent = method;
    });

});

function setPrimeCount(count) {
    // generate
    config.primes = generatePrimes(200);

    // prime display
    $('#display').html();
    config.primes.forEach(function(prime, count) {
        $('#display').append('<div id="div' + prime + '"></div>');
    });
}

var running = null;

function calcDelta() {
    config.delta = (config.deltaPerSecond / 1000) * config.interval;
}

function start() {
    // stop any existing loop
    if (running != null) {
        clearInterval(running);
        running = null;
    }

    var n = config.startAt;
    calcDelta();

    running = setInterval(function() {
        setStep(n);
        n += config.delta;
    }, config.interval);
}

function stop() {

    // stop the loop
    if (running != null) {
        clearInterval(running);
        running = null;
    }

    // silence each prime
    primes.forEach(function(i, count) {
        pool.set(i.toString(), 100, 0);
        //$('#div' + i).html(formatNumber(i, 4) + getPlus(0));
    });
}

function setStep(n) {

    var s0 = Math.floor(n).toString();
    var s1 = (Math.floor(n*100) % 100).toString();
    if (s1.length == 1) s1 = "0" + s1;
    $('#txtStart').val(s0 + '.' + s1);

    var method = calcMethods[config.calcPercent];

    config.primes.forEach(function(i, count) {

        // find freq
        var freq = config.freqBase + config.freqIncr * count;

        // find loudness
        var pBase = method(n, i);
        var p = pBase;
        if (config.cutOff > 0) p = Math.max(0, p * (1 + config.cutOff) - config.cutOff);
        var loud = p * config.loudMax;

        pool.set(i.toString(), freq, loud);

        // display
        var times = Math.floor(n / i);
        $('#div' + i).html(formatNumber(i, 4) + getPlus(pBase, config.cutOff) + formatNumber(times, 10) + '|' + formatNumber(Math.round(freq), 4));
    });

}

var calcMethods = {};

calcMethods.getPercent_square = function(n, i) {
    var maxLoud = 0.1;
    var p;
    if (n == 0 || n < i/2) {
        p = 0;
    }
    else {
        var p0 = ((n % i) * 2) / i;
        if (p0 > 1) p0 = 1 - (p0 - 1);

        p = 1 - p0;
        p = p * p;

        if (p < 0) p = 0;
    }

    return p;
};

calcMethods.getPercent_cube = function(n, i) {
    var maxLoud = 0.1;
    var p;
    if (n == 0 || n < i/2) {
        p = 0;
    }
    else {
        var p0 = ((n % i) * 2) / i;
        if (p0 > 1) p0 = 1 - (p0 - 1);

        p = 1 - p0;
        p = p * p * p;

        if (p < 0) p = 0;
    }

    return p;
};

// only starts to go up once the previous numberhas been hit, will be back down again before its done
calcMethods.getPercent_linear = function(n, i) {

    // default to silent
    var p = 0;

    // determine if we are in sound making range
    var r = n % i;

    // going down
    if (r < 1) {
        // 0 to 1;
        p = 1 - r;
    }

    // going up
    else if (r > i - 1) {
        // 1 to 0
        p = 1 - (i - r);
    }

    return p;
};

function formatNumber(n, length) {
    var s = n.toString();
    while (s.length < length) {
        s = ' ' + s;
    }
    return s.replace(/\s/g, '&nbsp;');
}

// will need to clear if cutoff changes
var plusCache = [];

function getPlus(p) {

    var cutOffIndex = Math.floor(config.displayWidth * config.cutOff);

    var i = Math.floor(p*config.displayWidth);

    if (plusCache[i]) return plusCache[i];
    var s = "|";
    for (var j = 0; j < 50; j++) {

        if (p > 0 && j <= i) s += '+';
        else if (cutOffIndex > 0 && j == cutOffIndex) {s += '|'}
        else s += '&nbsp;';
    }
    s += '|';
    plusCache[i] = s;
    return s;
}
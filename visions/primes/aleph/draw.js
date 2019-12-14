let Draw = function () {

    let radius = 249;
    let grey = "rgba(255,255,255, 0.2)";
    let lineColor = "rgba(255,255,0, 0.4)";
    let capType = 'round';
    let interval = 30;
    let currentHighlightIndex = [];
    let currentNumber = 2;
    let lastPrime = 2;


    let colorAlpha = 1;
    let colorSaturation = 1.0;
    let colors = [
        {r:0x8C, g:0x15, b:0xC4}, // violet 8C15C4
        {r:0x00, g:0x14, b:0x89}, // indigo 001489
        {r:0x00, g:0x85, b:0xCA}, // blue 0085ca
        {r:0x00, g:0xA5, b:0x50}, // green 00A550
        {r:0xFE, g:0xDD, b:0x00}, // yellow
        {r:0xFF, g:0x6D, b:0x00}, // orange FF6D00
        {r:0xED, g:0x28, b:0x00}  // red ed2800
    ];

    function moveToNextNumber() {

        // lower the number
        currentNumber += 0.01;

        // set color saturation by number
        colorSaturation = 1 - (currentNumber - Math.floor(currentNumber));

        interval = radius / (currentNumber * 3);

        // set the next
        setTimeout(moveToNextNumber, 100);
    }
    moveToNextNumber();


    let canvas, c;
    let lastPrimeCalc = null;

    function init() {

        canvas = document.getElementById('canvas');
        c = canvas.getContext('2d');

        onResize();
    }
    
    function onResize() {
        // set the initial size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        calculateRadius();
    }

    function calculateRadius() {
        let size = canvas.width;
        if (canvas.height < size) { size = canvas.height; }
        radius = (size * 0.95) / 2;
    }

    function draw(e) {
        c.clearRect(0, 0, canvas.width, canvas.height);
        drawCircle();
        //drawIntegerLine();

        let n = Math.floor(currentNumber);

        let ranges, factors;

        if (lastPrimeCalc !== null) {
            if (lastPrimeCalc.n === n) {
                ranges = lastPrimeCalc.ranges;
                factors = lastPrimeCalc.factors;
            }
            else {
                lastPrimeCalc = null;
            }
        }
        if (lastPrimeCalc === null) {
            ranges = range.getRangeAt(n, 7);
            factors = range.getPrimeFactors(n);
            lastPrimeCalc = {
                n: n,
                ranges: ranges,
                factors: factors
            };
        }

        // determine which range will be highlighted
        currentHighlightIndex = [];
        factors.forEach(m => {
            ranges.forEach((range, i) => {
                if (range.start <= m && m <= range.end) {
                    currentHighlightIndex.push(i);
                }
            })
        });

        let isPrime = false;
        if (currentHighlightIndex.length === 0) {
            isPrime = true;
            if (n !== lastPrime) lastPrime = n;
        }

        // create the spiral groups for each range and one for all the other primes
        let i = 0;
        let rangeIndex = 0;
        let spiralGroups = [];
        let spiralOfPrime = null;
        while (range.primes[i].n <= n) {
            let m = range.primes[i].n;

            while (rangeIndex < ranges.length && m > ranges[rangeIndex].end) {
                rangeIndex++;
            }

            if (typeof spiralGroups[rangeIndex] === 'undefined') {
                spiralGroups[rangeIndex] = [];
            }

            // grab the prime
            if (isPrime && n === m) {
                spiralOfPrime = [m];
            }
            else {
                spiralGroups[rangeIndex].push(m);
            }


            i++;
        }

        // draw the prime first
        if (spiralOfPrime !== null) {
            let fadeInPercent = 1- colorSaturation;
            drawSpiral(spiralOfPrime, -1, grey, fadeInPercent);
        }

        // draw the grey ones
        spiralGroups.forEach((a, index) => {
            if (currentHighlightIndex.indexOf(index) === -1) {
                drawSpiral(a, index, grey, 1);
            }
        });

        // then the colored ones
        spiralGroups.forEach((a, index) => {
            if (currentHighlightIndex.indexOf(index) !== -1)
                drawSpiral(a, index, grey, 1);
        });



        drawCurrentPosition();
        drawCircleMat();
        drawCircle();
    }

    function drawCircle() {

        let x = 0;
        let y = 0;

        c.save();

        c.translate(canvas.width / 2, canvas.height / 2);

        c.beginPath();
        c.arc(x, y, radius, 0, Math.PI * 2, false);
        c.closePath();
        c.lineWidth = 1;
        c.strokeStyle = "white";
        c.lineCap = capType;
        c.stroke();

        c.restore();
    }

    function drawCircleMat() {

        let x = canvas.width / 2;
        let y = canvas.height / 2;

        c.save();

        c.translate(canvas.width / 2, canvas.height / 2);

        c.beginPath();
        c.moveTo(-x, -y);
        c.lineTo(-x, y);
        c.lineTo(x, y);
        c.lineTo(x, 0);
        c.lineTo(radius, 0);
        c.arc(0, 0, radius, 0, Math.PI * 2, false);
        c.lineTo(x, 0);
        c.lineTo(x, -y);
        c.closePath();
        c.fillStyle = "black";
        c.fill();

        c.restore();
    }

    function drawIntegerLine() {
        c.save();
        c.translate(canvas.width / 2, canvas.height / 2);
        c.beginPath();
        c.moveTo(interval/2-0.5, 0);
        c.lineTo(interval/2-0.5, 1000);
        c.moveTo(-interval/2+0.5, 0);
        c.lineTo(-interval/2+0.5, 1000);

        c.lineWidth = 0.5; //interval;
        c.strokeStyle = lineColor;
        c.lineCap = capType;
        c.stroke();

        c.restore();
    }

    function drawCurrentPosition() {

        let y = interval * currentNumber;

        c.save();
        c.translate(canvas.width / 2, canvas.height / 2);
        c.beginPath();

        c.arc(0, y, interval/2, 0, Math.PI * 2, false);
        c.closePath();

        c.fillStyle = grey;
        c.fill();

        c.restore();

    }

    function drawSpiral(a, colorIndex, defaultColor, fadeInPercent) {

        c.save();

        c.translate(canvas.width / 2, canvas.height / 2);

        c.beginPath();

        a.forEach(n => {
            traceSpiral(n);
        });

        //c.closePath();

        let color = defaultColor;
        if (currentHighlightIndex.indexOf(colorIndex) !== -1) {
            let info = colors[colorIndex];
            let r = info.r * colorSaturation + 255 * (1 - colorSaturation);
            let g = info.g * colorSaturation + 255 * (1 - colorSaturation);
            let b = info.b * colorSaturation + 255 * (1 - colorSaturation);
            let alpha = colorAlpha * colorSaturation + 0.2 * (1 - colorSaturation);

            color = `rgba(${r},${g},${b}, ${alpha})`;
        }
        else if (fadeInPercent !== 1) {
            let alpha = 0.2 * fadeInPercent;
            color = `rgba(255,255,255, ${alpha})`;
        }


        c.lineWidth = interval; //interval;
        c.strokeStyle = color;
        c.lineCap = capType;
        c.stroke();

        c.restore();
    }

    function traceSpiral(n) {
        c.moveTo(0, 0);

        let radius = 0;
        let maxRadius = 500;
        let value = 0.01; // the current value

        let maxValue = maxRadius / interval;
        while (radius <= maxRadius) {

            // find the angle from the current value
            let anglePercent = (value % n) / n;
            let angle = Math.PI * 2 * anglePercent + Math.PI * 0.5;

            // also the radius should be known
            radius = (value / maxValue) * maxRadius;

            let x = Math.cos(angle) * radius;
            let y = Math.sin(angle) * radius;

            c.lineTo(x, y);

            value += 0.001;
        }
    }


    return {
        init: init,
        onResize: onResize,
        draw: draw
    };

} ();

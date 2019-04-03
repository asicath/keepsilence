let Draw = function () {

    let radius = 249;
    let grey = "rgba(255,255,255, 0.2)";
    let lineColor = "rgba(255,255,0, 0.4)";
    let capType = 'round';
    let interval = 10;
    let currentHighlightIndex = [];
    let currentNumber = 2;

    setInterval(() => {
        currentNumber++;
    }, 300);

    let colorAlpha = 0.5;
    let colors = [
        {color: `rgba(${0x8C},${0x15},${0xC4}, ${colorAlpha})`}, // violet 8C15C4
        {color: `rgba(${0x00},${0x14},${0x89}, ${colorAlpha})`}, // indigo 001489
        {color: `rgba(${0x00},${0x85},${0xCA}, ${colorAlpha})`}, // blue 0085ca
        {color: `rgba(${0x00},${0xA5},${0x50}, ${colorAlpha})`}, // green 00A550
        {color: `rgba(${0xFE},${0xDD},${0x00}, ${colorAlpha})`}, // yellow
        {color: `rgba(${0xFF},${0x6D},${0x00}, ${colorAlpha})`}, // orange FF6D00
        {color: `rgba(${0xED},${0x28},${0x00}, ${colorAlpha})`}, // red ed2800
    ];

    let canvas, c;

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

        let n = currentNumber;
        let ranges = range.getRangeAt(n, 7);
        let factors = range.getPrimeFactors(n);

        currentHighlightIndex = [];
        factors.forEach(m => {
            ranges.forEach((range, i) => {
                if (range.start <= m && m <= range.end) {
                    currentHighlightIndex.push(i);
                }
            })
        });

        let i = 0;
        let rangeIndex = 0;
        while (range.primes[i].n <= n) {
            let m = range.primes[i].n;

            while (rangeIndex < ranges.length && m > ranges[rangeIndex].end) {
                rangeIndex++;
            }

            drawSpiral(m, rangeIndex);
            i++;
        }


    }

    function drawCircle() {

        let x = 0;
        let y = 0;

        c.save();

        c.translate(canvas.width / 2, canvas.height / 2);

        c.beginPath();
        c.arc(x, y, radius, 0, Math.PI * 2, false);
        c.closePath();
        c.lineWidth = 3;
        c.strokeStyle = grey;
        c.lineCap = capType;
        c.stroke();

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

    function drawSpiral(n, colorIndex) {

        c.save();

        c.translate(canvas.width / 2, canvas.height / 2);

        c.beginPath();
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



        //c.closePath();
        c.lineWidth = interval; //interval;
        c.strokeStyle = currentHighlightIndex.indexOf(colorIndex) !== -1 ? colors[colorIndex].color : grey;
        c.lineCap = capType;
        c.stroke();

        c.restore();
    }


    return {
        init: init,
        onResize: onResize,
        draw: draw
    };

} ();

let Draw = function () {

    let radius = 249;
    let grey = "rgba(128,128,128, 1)";
    let capType = 'round';

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

    return {
        init: init,
        onResize: onResize,
        draw: draw
    };

} ();

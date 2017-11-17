
var Main = function () {

    var canvas = null;
    var c = null;

    var Init = function () {

        // Get canvas object
        canvas = document.getElementById('canvas');
        c = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        var width = canvas.width;
        var height = canvas.height;

        Prime.Init();
        Kaph.Init(c);

        Timer.Start(canvas);

    }

    window.onload = Init;

    window.onresize = function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        Kaph.CalculateRadius();
    };

    window.onkeydown = function () {
        var x;
        if (window.event) // IE8 and earlier
        {
            x = event.keyCode;
        }
        else if (event.which) // IE9/Firefox/Chrome/Opera/Safari
        {
            x = event.which;
        }
        keychar = String.fromCharCode(x);


        if (keychar == ' ') {
            Timer.TogglePause();
        }
        else if (x == 38) {
            Prime.Acceleration(Prime.Acceleration() + 0.0001);
        }
        else if (x == 40) {
            Prime.Acceleration(Prime.Acceleration() - 0.0001);
        }

        else if (x == 37) {
            Kaph.Lower();
        }
        else if (x == 39) {
            Kaph.Raise();
        }
        else {
            //alert("Key " + x + " was pressed down");
        }
    };

} ();

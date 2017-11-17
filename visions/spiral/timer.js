
//var Timer = function () {
//    var framesPerSecond = 60.0;
//    var secondsPerFrame = 1000.0 / framesPerSecond;
//    var listeners = [];
//    var totalTime = 0;

//    var Start = function () {
//        Tick();
//        setTimeout(Tick, secondsPerFrame);
//    };

//    var Tick = function () {
//        var time = secondsPerFrame;
//        totalTime += time;
//        for (var i = 0; i < listeners.length; i++) {
//            listeners[i](time, totalTime);
//        }
//        setTimeout(Tick, secondsPerFrame);
//    };

//    var AddEvent = function (event) {
//        listeners.push(event);
//    };

//    return {
//        Start: Start,
//        AddEvent: AddEvent
//    };
//} ();

var Timer = function () {

    if (!("requestAnimationFrame" in window)) {
        if ("webkitRequestAnimationFrame" in window) {
            window.requestAnimationFrame = window.webkitRequestAnimationFrame;
        } else if ("mozRequestAnimationFrame" in window) {
            window.requestAnimationFrame = window.mozRequestAnimationFrame;
        } else if ("console" in window) {
            console.log("no requestAnimationFrame found");
        }
    }

    var listeners = [];
    var startTime = 0;
    var lastTime = 0;
    var a;
    var paused = false;

    var Start = function (aa) {
        a = aa;
        startTime = Date.now();
        lastTime = startTime;
        window.requestAnimationFrame(Tick, a);
    };

    var Tick = function () {
        // Make sure the call back happens, Can also be placed at the end
        window.requestAnimationFrame(Tick, a);


        var currentTime = Date.now();
        var time = currentTime - lastTime;
        var totalTime = currentTime - startTime;

        if (!paused) {
            for (var i = 0; i < listeners.length; i++) {
                listeners[i](time, totalTime);
            }
        }

        lastTime = time;
    };

    var AddEvent = function (event) {
        listeners.push(event);
    };

    var TogglePause = function () {
        paused = !paused;
    };

    return {
        Start: Start,
        AddEvent: AddEvent,
        TogglePause: TogglePause
    };


} ();



//    // shim layer with setTimeout fallback
//    window.requestAnimFrame = (function () {
//        return
//        window.requestAnimationFrame ||
//        window.webkitRequestAnimationFrame ||
//        window.mozRequestAnimationFrame ||
//        window.oRequestAnimationFrame ||
//        window.msRequestAnimationFrame ||
//        function (callback, element) {
//            window.setTimeout(callback, 1000 / 60);
//        };
//    })();

(() => {

    window.onload = init;

    function init() {
        Draw.init();
        Timer.onTick(onTick);
        Timer.start();
    }

    function onTick(e) {
        Draw.draw(e);
    }

    window.onresize = function () {
        Draw.onResize();
    };

})();



let Timer = (() => {

    if (!("requestAnimationFrame" in window)) {
        if ("webkitRequestAnimationFrame" in window) {
            window.requestAnimationFrame = window.webkitRequestAnimationFrame;
        } else if ("mozRequestAnimationFrame" in window) {
            window.requestAnimationFrame = window.mozRequestAnimationFrame;
        } else if ("console" in window) {
            console.log("no requestAnimationFrame found");
        }
    }

    let listeners = [];
    let startTime = 0;
    let lastTime = 0;
    let paused = false;

    function start() {
        startTime = Date.now();
        lastTime = startTime;
        window.requestAnimationFrame(tick);
    }

    function tick() {
        // Make sure the call back happens, Can also be placed at the end
        window.requestAnimationFrame(tick);

        let currentTime = Date.now();

        let eventInfo = {
            time: currentTime - lastTime,
            totalTime: currentTime - startTime
        };

        if (!paused) {
            for (let i = 0; i < listeners.length; i++) {
                listeners[i](eventInfo);
            }
        }

        lastTime = eventInfo.time;
    }

    function onTick(event) {
        listeners.push(event);
    }

    function togglePause() {
        paused = !paused;
    }

    return {
        start: start,
        onTick: onTick,
        togglePause: togglePause
    };

}) ();
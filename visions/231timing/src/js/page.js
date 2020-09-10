
window.customTimes = {
    long: {
        initialDuration: 1000 * 10,
        totalTime: 1000*60*11,
        easingFunction: EasingFunctions.easeInOutQuad
    },
    short3: {
        initialDuration: 1000 * 10,
        totalTime: 1000*60*3,
        easingFunction: EasingFunctions.easeOutCubic
    },
    short2: {
        initialDuration: 1000 * 7,
        totalTime: 1000*60*2,
        easingFunction: EasingFunctions.easeOutCubic
    },
};

window.spirit = null;

window.requestAnimFrame = ( function() {
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function (callback, element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

const defaultTimes = {
    short3: {
        initialDuration: 1000 * 8,
        totalTime: 1000*60*3,
        easingFunction: EasingFunctions.easeOutCubic
    },
    short2: {
        initialDuration: 1000 * 6,
        totalTime: 1000*60*2,
        easingFunction: EasingFunctions.easeOutCubic
    },
    long: {
        initialDuration: 1000 * 10,
        totalTime: 1000*60*11,
        easingFunction: EasingFunctions.easeInOutCubic
    }
};

function initPageJs() {
    // do the Google Font Loader stuff....
    WebFont.load({
        google: {
            families: ['Vollkorn']
        },
        active: function () {
            $(document).ready(function () {

                const spirit = getQueryParams('spirit') || 'kaph';
                const wordConfig = words[spirit];

                // override customtimes with any word specific
                const times = Object.assign(wordConfig.customTimes || {}, defaultTimes);

                const timingKey = getQueryParams('timing') || 'long';
                const timeConfig = times[timingKey];

                init(wordConfig, timeConfig);
                startDrawing();

            });
        }
    });

    document.body.onkeydown = function(e){
        if(e.keyCode == 32) state.timer.togglePause();
    };
    document.body.onclick = function(e){
        state.timer.togglePause();
    };


    function drawFrame() {
        draw('#seal');
    }

    function startDrawing() {
        requestAnimFrame(startDrawing);
        drawFrame();

        //setInterval(drawFrame, 1000/60);
    }
}

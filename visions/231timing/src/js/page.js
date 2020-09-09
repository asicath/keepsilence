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

function initPageJs() {
    // do the Google Font Loader stuff....
    WebFont.load({
        google: {
            families: ['Vollkorn']
        },
        active: function () {
            $(document).ready(function () {

                let timingKey = getQueryParams('timing') || 'long';


                init(words.kaph, customTimes[timingKey]);
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

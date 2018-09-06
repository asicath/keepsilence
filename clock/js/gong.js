var Gong = (function() {
    var my = {};

    var gongs = [];

    for (var i = 0; i < 4; i++) {
        gongs[i] = new Audio('gong.mp3');

        gongs[i].addEventListener('ended', function(){
            this.load();
        });
    }

    var delayPlay = function(audio, time) {
        setTimeout(function() {
            audio.play();
        }, time);
    };

    my.play = function(count) {
        gongs[0].play();
        for (var i = 1; i < count; i++) {
            delayPlay(gongs[i], 4000*i)
        }
    };

    return my;
})();

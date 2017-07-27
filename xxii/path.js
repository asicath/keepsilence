function setSize() {
    var e1 = document.getElementById("tarot-img");
    var h = Math.min(721, window.innerHeight - 50);
    e1.style.height = h + "px";
}

window.onresize = function(event) {
    setSize();
};

setSize();

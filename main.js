function test() {
    println("Test");
}

window.onload = function () {
//    test();
    init();
};

function init() {
    ISO.world = new World();
    ISO.world.init(function () {
        window.onkeydown = doKeyDown;
        window.onkeyup = doKeyUp;
        ISO.world.run();
    });
}

function doKeyDown (e) {
    if (e.keyCode === RIGHT_ARROW) {
        ISO.player.moveRight(true);
    } else if (e.keyCode === LEFT_ARROW) {
        ISO.player.moveLeft(true);
    } else if (e.keyCode === UP_ARROW) {
        ISO.player.moveUp(true);
    } else if (e.keyCode === DOWN_ARROW) {
        ISO.player.moveDown(true);
    }
}

function doKeyUp (e) {
    if (e.keyCode === RIGHT_ARROW) {
        ISO.player.moveRight(false);
    } else if (e.keyCode === LEFT_ARROW) {
        ISO.player.moveLeft(false);
    } else if (e.keyCode === UP_ARROW) {
        ISO.player.moveUp(false);
    } else if (e.keyCode === DOWN_ARROW) {
        ISO.player.moveDown(false);
    }
}


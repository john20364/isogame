window.onload = function () {
    ISO.isowidth = 128;
    ISO.isoheight = ISO.isowidth >> 1;
    ISO.canvas = document.getElementById("canvas");
	ISO.context = canvas.getContext("2d");
	ISO.width = canvas.width = window.innerWidth;
	ISO.height = canvas.height = window.innerHeight;

    ISO.world = new World(function () {
        ISO.player = new Player(ISO.world, new Point(1, 1));
        draw();
    });
    
    window.onkeydown = doKeyDown;
    window.onkeyup = doKeyUp;
};

function draw() {
    ISO.context.fillStyle = "#000000";
    ISO.context.fillRect(0, 0, ISO.width, ISO.height);

    ISO.world.draw();
    ISO.player.draw();
    ISO.player.update()
    requestAnimationFrame(draw);
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


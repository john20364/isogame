function TObj(idx, label) {
    this.idx = idx;
    this.label = label;
}

function test() {
    var a = [];
    for (var i = 0; i <= 10; i++) {
        a.push(new TObj(i, "a"));
    } 
    console.log(a);
    
    var b = [];
    for (var i = 0; i <= a.length; i += 2) {
        b.push(new TObj(i, "b"));
    }
    console.log(b);
    
    for (var i = b.length-1; i >= 0; i--) {
//        console.log(b[i]);
        a.splice(b[i].idx+1, 0, b[i]);
    }
    console.log(a);
    
    for (var i = 0; i < b.length; i++) {
        a.splice(b[i].idx+1, 1);
    }
    console.log(a);
}

window.onload = function () {
    const ISOWIDTH = 128;
    ISO.isowidth = ISOWIDTH;
    ISO.isoheight = ISO.isowidth >> 1;
    ISO.canvas = document.getElementById("canvas");
	ISO.context = canvas.getContext("2d");
	ISO.width = canvas.width = window.innerWidth;
	ISO.height = canvas.height = window.innerHeight;

    var objarr = [
        {image:undefined,
        filename:"images\\floorsprites.png"},
//        filename:"images\\marzfloor.png"},
        {image:undefined,
//        filename:"images\\testfloor.png"}
        filename:"images\\floorplan.png"}
    ];

//    test();
    
    loadImages(objarr, 0, function () {
        ISO.floorsprites = objarr[0].image;
        ISO.floorplan = objarr[1].image;
        init();
    });
    
};

function init() {
    ISO.world = new World();
    window.onkeydown = doKeyDown;
    window.onkeyup = doKeyUp;
    gameLoop();
}

function gameLoop() {
    ISO.context.fillStyle = "#000000";
    ISO.context.fillRect(0, 0, ISO.width, ISO.height);

    ISO.world.render();
    ISO.world.update();
    requestAnimationFrame(gameLoop);
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


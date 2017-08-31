function TObj(idx, label) {
    this.idx = idx;
    this.label = label;
}

function test() 
{
    function print(text) {
        document.write(text + "<br/>");
    }
    
    function BaseEntity () {}

    BaseEntity.prototype.name = "whatever";
    BaseEntity.prototype.info = function () {
        print("BaseEntity: " + this.name);
    }
    
    function Automate () {}
    Automate.prototype = Object.create(BaseEntity.prototype);
    Automate.prototype.info = function () {
        print("Automate: " + this.name);
    }
    
    var entities = [];
    var entity = new BaseEntity();
    entity.name = "Base";
    entities.push(entity);
    entity = new Automate();
    entity.name = "Automatename.....";
    entities.push(entity);
    
    entities.forEach(function(shape) {
        shape.info();
    });
    
    var obj = new EntityBase();
    obj.init(new Point(10, 5), ISO.testplayer, 0);
    var twoD = obj.getSprite().getTwoD();
    print(twoD.x + ", " + twoD.y);
//    obj.update();
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
        filename:"images\\floorplan.png"},
        {image:undefined,
        filename:"images\\players.png"},
        {image:undefined,
        filename:"images\\testplayer.png"}
    ];

    
    loadImages(objarr, 0, function () {
        ISO.floorsprites = objarr[0].image;
        ISO.floorplan = objarr[1].image;
        ISO.players = objarr[2].image;
        ISO.testplayer = objarr[3].image;
//        test();
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


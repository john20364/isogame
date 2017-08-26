function World(cb) {
    var sprites = [];
    var player = undefined;
    var floorcanvas = document.createElement("canvas");
	var floorcontext = floorcanvas.getContext("2d");
    var floorplan = undefined;
    var floorsprites = undefined;
    
    const XWALL = 0XFF8000;
    const YWALL  = 0xFF0000;
    const CORNERWALL = 0x00FF00;
    const FLOOR = 0x000000;
    
    function createSpriteArray () {
        for (var i = 0; i < (floorplan.data.length / 4); i++) {
            var x = i % floorplan.width | 0;
            var y = i / floorplan.width | 0;

            var data = floorplan.data;
            var pixel = data[i*4] << 16;
                pixel |= data[i*4+1] << 8;
                pixel |= data[i*4+2];

            var imgidx = 0;
            var isFloor = false;
            switch (pixel) {
                case FLOOR:
                    imgidx = 0;
                    isFloor = true;
                    break;
                case CORNERWALL:
                    imgidx = 1;
                    break;
                case YWALL:
                    imgidx = 2;
                    break;
                case XWALL:
                    imgidx = 3;
                    break;
                default:
            }
            
            sprites.push(new Sprite(
                new Point(x, y), 
                floorsprites, 
                imgidx, 
                10,
                isFloor));
        }
    }    
    
    function loadFloorSprites() {
        floorsprites = new Image();

        floorsprites.onload = function() {
            createSpriteArray();
            if (cb) cb();
        };
        floorsprites.src = "images\\floorsprites.png";
//        floorsprites.src = "marzfloor.png";
    }
    
    function loadFloorPlan() {
        var img = new Image();

        img.onload = function() {
            floorcontext.drawImage(img, 0, 0);
            floorplan = floorcontext.getImageData(0, 0,
                img.width, img.height);
            loadFloorSprites();
//            if (cb) cb();
        };
//        img.src = "images\\floorplan.png";
        img.src = "images\\testfloor.png";
    };
    
    loadFloorPlan();
    
    this.setPlayer = function (aPlayer) {
        player = aPlayer;
    }
    
    this.draw = function () {
        var tempPos = player.position.copy().divide(10);
        var index = tempPos.x + tempPos.y * floorplan.width;

// TODO.....................
//        sprites.splice(index, 0, player);
        
        var pos = isoTo2D(tempPos);
        ISO.context.save();

        ISO.context.translate(ISO.width / 2 - pos.x, ISO.height / 2 - pos.y);
        
        for (var i = 0; i < sprites.length; i++) {
            // Only render what is inside the viewport
            var left = (pos.x - sprites[i].twoD.x) << 1;
            var right = (sprites[i].twoD.x - pos.x) << 1;
            var top = (pos.y - sprites[i].twoD.y) << 1;
            var bottom = (sprites[i].twoD.y - pos.y) << 1;
            
            if (left <= ISO.width + ISO.isowidth && 
                right <= ISO.width + ISO.isowidth &&
               top <= ISO.height + ISO.isoheight * 2 &&
               bottom <= ISO.height + ISO.isoheight * 4) {
                sprites[i].render();
            }
        }
        ISO.context.restore();
//        sprites.splice(index + 1, 1);
    }

    this.canMove = function (x, y) {
        var index = x + y * floorplan.width;
        return sprites[index].isFloor;
    }
}

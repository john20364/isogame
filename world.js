function World() {
    var sprites = [];
    var painterLookUp = [];
    var player = undefined;
    var floorcanvas = document.createElement("canvas");
	var floorcontext = floorcanvas.getContext("2d");
    var floordata = undefined;
    
    const XWALL = 0XFF8000;
    const YWALL  = 0xFF0000;
    const CORNERWALL = 0x00FF00;
    const FLOOR = 0x000000;

    // Initialization
    (function () {
        floorcontext.drawImage(ISO.floorplan, 0, 0);
        floordata = floorcontext.getImageData(0, 0,
            ISO.floorplan.width, ISO.floorplan.height);
        
        createSpriteArray();
        createPainterLookUp();
    })();
    
    function createPainterLookUp () {
        var i = 0;
        var j = 0;
        var x = -1;
        var y = 1;

        for (var k = 0; k < (floordata.data.length / 4); k++) {
            y--;
            x++;

            if ((y < 0) || (x >= floordata.width)) {
                y = ++j;
                x = i;
            }

            if (y >= floordata.height) {
                y = floordata.height - 1;
                x = ++i;
            }
            var index = x + y * floordata.width;
            painterLookUp[k] = index;
        }
    }
    
    function createSpriteArray () {
        for (var i = 0; i < (floordata.data.length / 4); i++) {
            var x = i % floordata.width | 0;
            var y = i / floordata.width | 0;

            var data = floordata.data;
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
                ISO.floorsprites, 
                imgidx, 
                10,
                isFloor));
        }
    }    
    
    this.setPlayer = function (aPlayer) {
        player = aPlayer;
    }
    
    this.render = function () {
        var tempPos = player.position.copy().divide(10);
        var tx = (tempPos.x % 1) > 0 ? ((tempPos.x + 1) | 0) :      tempPos.x;
        var ty = (tempPos.y % 1) > 0 ? ((tempPos.y + 1) | 0) :      tempPos.y;
//        console.log(tx+", "+ty);
        var playerIndex = tx + ty * floordata.width;
//        console.log(playerIndex);
        
        var pos = isoTo2D(tempPos);
        ISO.context.save();

        ISO.context.translate(ISO.width / 2 - pos.x, ISO.height / 2 - pos.y);
        
        for (var idx = 0; idx < sprites.length; idx++) {
            var i = painterLookUp[idx];
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
                
                if (i === playerIndex) {
                    // Draw player
                    player.setPosition(tempPos);
                    player.render();
                    sprites[painterLookUp[idx-1]].render();
//                    console.log(i);
//                    player.draw();
                }
            }
        }
        ISO.context.restore();
//        sprites.splice(index + 1, 1);
    }

    this.canMove = function (x, y) {
        var index = x + y * floordata.width;
        return sprites[index].isFloor;
    }
}

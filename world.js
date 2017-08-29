function World() {
    var that = this;
    var sprites = [];
    var painterLookUp = [];
    var floorcanvas = document.createElement("canvas");
	var floorcontext = floorcanvas.getContext("2d");
    var floordata = undefined;
    var entities = [];
    
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
        createEntities();
    })();
    
    function createEntities () {
        var factory = new EntityFactory();
        // Create the player
        ISO.player = factory.createEntity(that, new Point(1, 1));
        entities.push(ISO.player);
        
        // Create the entities
//        entities.push(factory.createEntity(
//            that, new Point(2.6, 2.6)));
        entities.push(factory.createEntity(
            that, new Point(5, 5)));
        entities.push(factory.createEntity(
            that, new Point(8, 10)));
    }
    
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
//                    imgidx = 1;
                    imgidx = 3;
                    break;
                case YWALL:
                    imgidx = 2;
                    break;
                case XWALL:
//                    imgidx = 3;
                    imgidx = 1;
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
    
//    this.setPlayer = function (aPlayer) {
//        player = aPlayer;
//    }
    
    this.render = function () {
        var playerIndex = ISO.player.getGridIndex();
        var twoD = ISO.player.getTwoD();
        ISO.context.save();

        ISO.context.translate(ISO.width / 2 - twoD.x, ISO.height / 2 - twoD.y);
        
        //-----------------------------
        // TODO.....
        // first sort the entities !!!!
        //-----------------------------
        entities.sort(function(a, b) {
            return a.getGridIndex() - b.getGridIndex();
        });
        
        for (var i = entities.length-1; i >= 0; i--) {
            var entity = entities[i];
            var idx = entity.getGridIndex() + 1;
            sprites.splice(
                idx, 0, 
                entity.getSprite());
        }
        
        for (var idx = 0; idx < sprites.length; idx++) {
//            var i = painterLookUp[idx];
            var i = idx;
            var spriteTwoD = sprites[i].getTwoD();
            
            // Only render what is inside the viewport
            var left = (twoD.x - spriteTwoD.x) << 1;
            var right = (spriteTwoD.x - twoD.x) << 1;
            var top = (twoD.y - spriteTwoD.y) << 1;
            var bottom = (spriteTwoD.y - twoD.y) << 1;
            
            if (left <= ISO.width + ISO.isowidth && 
                right <= ISO.width + ISO.isowidth &&
               top <= ISO.height + ISO.isoheight * 2 &&
               bottom <= ISO.height + ISO.isoheight * 4) {
                sprites[i].render();
                
                //-----------------------------
                // TODO.....
                // first sort the entities !!!!
                //-----------------------------
//                entities.sort(function(a, b) {
//                    return a.getGridIndex() - b.getGridIndex();
//                });
//                for (var n = 0; n < entities.length; n++) {
//                    entities[n].render();
//                }
                
                
                // Draw the entities.
//                for (var n = 0; n < entities.length; n++) {
//                    if (i === entities[n].getGridIndex()) {
//                        entities[n].render();
//                        var s = sprites[painterLookUp[idx-1]];
//                        if (!s.isFloor()) {
//                            s.render();
//                        }
//                    }
//                }
                
//                if (i === playerIndex) {
//                    // Draw player
//                    ISO.player.render();
//                    sprites[painterLookUp[idx-1]].render();
//                }
            }
        }

        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            var idx = entity.getGridIndex() + 1;
            sprites.splice(idx, 1);
        }
        
        ISO.context.restore();
    }

    this.update = function () {
        for (var i = 0; i < entities.length; i++) {
            entities[i].update();
        }
    }
    
    this.canMove = function (x, y) {
        var index = x + y * floordata.width;
        return sprites[index].isFloor();
    }
}

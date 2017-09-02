function World() {
    var that = this;
    var floorcanvas = document.createElement("canvas");
	var floorcontext = floorcanvas.getContext("2d");
    var floordata = undefined;
    
    var entities = [];
    
    var floorentities = [];
    var objectentities = [];
    
    var floorsprites = [];
    
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
        createEntities();
    })();
    
    function createEntities () {
        var factory = new EntityFactory();
        ISO.player = factory.createEntity(
            factory.typeEnum.PLAYER,
            that, 
            new Point(1, 5), 
            ISO.players, 
            0,
            false);
        
        entities.push(ISO.player);
        
        var entity = factory.createEntity(
            factory.typeEnum.AUTOMATE,
            that,
            new Point(10, 5), 
            ISO.testplayer, 
            0,
            false);
        
        entity.setPath([
            new Point(2, 2), 
            new Point(2, 10),
            new Point(20, 10),
            new Point(20, 2)
        ]);
        
        entities.push(entity);

        entity = factory.createEntity(
            factory.typeEnum.AUTOMATE,
            that,
            new Point(15, 15), 
            ISO.players, 
            1,
            false);
        
        entity.setPath([
            new Point(5, 25), 
            new Point(15, 15), 
        ]);
        
        entities.push(entity);
    }
    
    function createSpriteArray () {
        var factory = new EntityFactory();
        
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
                    imgidx = 3;
                    break;
                case YWALL:
                    imgidx = 2;
                    break;
                case XWALL:
                    imgidx = 1;
                    break;
                default:
            }
            
            var entity = factory.createEntity(
                    factory.typeEnum.SOLID,
                    that,
                    new Point(x, y), 
                    ISO.floorsprites, 
                    imgidx,
                    isFloor);
            
            entities.push(entity);
            
        }
    }
    
    function inViewPort(player2D, sprite) {
        var spriteTwoD = sprite.getTwoD();
        
        // calculate viewport boudaries
        var left = (player2D.x - spriteTwoD.x) << 1;
        var right = (spriteTwoD.x - player2D.x) << 1;
        var top = (player2D.y - spriteTwoD.y) << 1;
        var bottom = (spriteTwoD.y - player2D.y) << 1;
        
        // Check if sprite is inside the viewport
        if (left <= ISO.width + ISO.isowidth && 
            right <= ISO.width + ISO.isowidth &&
           top <= ISO.height + ISO.isoheight * 2 &&
           bottom <= ISO.height + ISO.isoheight * 4) {
            return true;
        }
        return false;
    }
    
    function render () {
        var renderobjects = [];
        
        floorentities = [];
        objectentities = [];
        
        var twoD = ISO.player.getTwoD();
        ISO.context.save();

        ISO.context.translate(ISO.width / 2 - twoD.x, ISO.height / 2 - twoD.y);
        
        // Check entities if there are in the viewport
        for (var i = 0; i < entities.length; i++) {
            if (inViewPort(twoD, entities[i].getSprite())) {
                if (entities[i].isFloor()) {
                    floorentities.push(entities[i]);
                } else {
                    objectentities.push(entities[i]);
                }
            }
        }
        
        // Draw floor
        for (var i = 0; i < floorentities.length; i++) {
            floorentities[i].render();
        }

        // Sort objects
        objectentities.sort(function (a, b) {
            return a.getTwoD().y - b.getTwoD().y;
        });
        
        // Draw objcts
        for (var i = 0; i < objectentities.length; i++) {
            objectentities[i].render();
        }
        
        ISO.context.restore();
    }
    
    function update () {
        for (var i = 0; i < entities.length; i++) {
            entities[i].update();
        }
    }

    this.canMove2 = function (entity, newposition, cb) {
        var p2 = newposition;
        for (var i = 0; i < objectentities.length; i++) {
            var obj = objectentities[i];
            if (obj !== entity) {
                var p1 = obj.getPosition();
                var dx = p2.x - p1.x;
                var dy = p2.y - p1.y;
                if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
                    cb (dx, dy, obj);
//                    if (dx < 0) {
//                        newposition.x -= (1+dx);
//                    } else {
//                        newposition.x += (1-dx);
//                    }
//                    if (dy < 0) {
//                        newposition.y -= (1+dy);
//                    } else {
//                        newposition.y += (1-dy);
//                    }
                    return false;
                }
            }
        }
        return true;    
    }
    
    this.canMove = function (entity, newposition) {
        var p2 = newposition;
        for (var i = 0; i < objectentities.length; i++) {
            var obj = objectentities[i];
            if (obj !== entity) {
                var p1 = obj.getPosition();
                if (Math.abs(p2.x - p1.x) < 1 && 
                   Math.abs(p2.y - p1.y) < 1) {
                    return false;
                }
            }
        }
        return true;    
    }
    
    this.run = function () {
        (function loop () {
            ISO.context.fillStyle = "#000000";
            ISO.context.fillRect(
                0, 0, ISO.width, ISO.height);
            render();
            update();
            requestAnimationFrame (loop);
        })();
    }
}

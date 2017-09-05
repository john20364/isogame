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
    this.init = function (cb) {
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
            ajaxGetJSON("level01.json", function (data) {
                ISO.data = data;
                
                floorcontext.drawImage(ISO.floorplan, 0, 0);
                floordata = floorcontext.getImageData(0, 0,
                    ISO.floorplan.width, ISO.floorplan.height);

                createEntities();
                
                if (cb) cb();
            });
        });
     }
    
    function createEntities () {
        entities = [];
        var data = ISO.data;
        var factory = new EntityFactory();
        
        // Create floor + walls
        createFloorAndWalls();
        
        for (obj in ISO.data) {
            var entity = undefined;

            switch (data[obj].type) {
                case "player" :
                    entity = factory.createEntity(
                        factory.typeEnum.PLAYER,
                        that, 
                        new Point(data[obj].position.x,
                                 data[obj].position.y), 
                        ISO.players, 
                        data[obj].spritesheet.index,
                        false);
                    ISO.player = entity;
                    break;
                case "automate" :
                    entity = factory.createEntity(
                        factory.typeEnum.AUTOMATE,
                        that, 
                        new Point(data[obj].position.x,
                                 data[obj].position.y), 
                        ISO.players, 
                        data[obj].spritesheet.index,
                        false);
                    
                    // Set eentity path if defined
                    if (data[obj].path) {
                        var path = [];
                        
                        for (j = 0; j < data[obj].path.length; j++) {
                            var point = data[obj].path[j];
                            path.push(new Point(point.x, point.y));
                        }
                        entity.setPath(path);
                    }
                    break;
                case "solid" :
                    // TODO..........
                    break;
            }
            entities.push(entity);
        }
    }
    
    function createFloorAndWalls () {
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
        var that = this;
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

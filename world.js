function World() {
    var that = this;
    var floorcanvas = document.createElement("canvas");
	var floorcontext = floorcanvas.getContext("2d");
    var floordata = undefined;
    
    var entities = [];
    
    var floorentities = [];
    var objectentities = [];
    
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
        
        createWorld("images.json", "level01.json", function () {
            if (cb) cb();
        })
     }
    
    function createWorld(images, level, cb) {
        var imgobjects = new ImageObjectCollection();
        createImages(imgobjects, images, function () {
            createEntities(imgobjects, level, function () {
                if (cb) cb();
            });
        });
    }

    function createEntity(factory, imgobjects, dataobj) {
        var entity = undefined;

        // Attach image to spritesheet object
        dataobj.spritesheet.image = imgobjects.getById(
            dataobj.spritesheet.id).image;

        switch (dataobj.type) {
            case "player" :
                entity = factory.createEntity(
                    factory.typeEnum.PLAYER,
                    that, 
                    dataobj);
                ISO.player = entity;
                break;
            case "automate" :
                entity = factory.createEntity(
                    factory.typeEnum.AUTOMATE,
                    that, 
                    dataobj);
                break;
            case "solid" :
                // TODO..........
                break;
        }
        entities.push(entity);
    }
    
    function createEntities (imgobjects, level, cb) {
        entities = [];
        
        // Create floor + walls
        createFloorAndWalls(imgobjects);
        
        getJSONData(level, function (data) {
            var factory = new EntityFactory();
            for (obj in data) {
                createEntity(factory, imgobjects, data[obj]);
            }
            if (cb) cb();
        });
    }
    
    function createFloorAndWalls (imgobjects) {
        var factory = new EntityFactory();
        var floorplan = imgobjects.getById("floorplan").image;

        floorcontext.drawImage(floorplan, 0, 0);
        floordata = floorcontext.getImageData(0, 0,
        floorplan.width, floorplan.height);
        
        for (var i = 0; i < (floordata.data.length / 4); i++) {
            var x = i % floordata.width | 0;
            var y = i / floordata.width | 0;

            var data = floordata.data;
            var pixel = data[i*4] << 16;
                pixel |= data[i*4+1] << 8;
                pixel |= data[i*4+2];

            var dataobj = {
                type:"solid",
                position:{
                    x:null,
                    y:null
                },
                spritesheet:{
                    id:null,
                    image:null,
                    index:null
                },
                isFloor:null
            };
            
            var imgidx = 0;
            var isFloor = false;
            
            dataobj.spritesheet.id = "floorsprites";
            dataobj.spritesheet.index = 0;
            dataobj.isFloor = false;
            dataobj.position.x = x;
            dataobj.position.y = y;
            dataobj.spritesheet.image = imgobjects.getById(
                dataobj.spritesheet.id).image;
            
            switch (pixel) {
                case FLOOR:
                    dataobj.spritesheet.index = 0;
                    dataobj.isFloor = true;
                    break;
                case CORNERWALL:
                    dataobj.spritesheet.index = 3;
                    break;
                case YWALL:
                    dataobj.spritesheet.index = 2;
                    break;
                case XWALL:
                    dataobj.spritesheet.index = 1;
                    break;
                default:
            }

            var entity = factory.createEntity(
                    factory.typeEnum.SOLID,
                    that,
                    dataobj);
            
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

    function walkObjectEntities (entity, cb) {
        for (var i = 0; i < objectentities.length; i++) {
            var obj = objectentities[i];
            if (obj !== entity) {
                cb(obj);
            }
        }
    }
    
    this.canMove = function (entity, newposition) {
        var dir = entity.getDirection();
        var ep = newposition;
        walkObjectEntities(entity, function (obj) {
            var op = obj.getPosition();
            if (Math.abs(ep.x - op.x) < 1 && 
               Math.abs(ep.y - op.y) < 1) {
                
                var oldpos =  entity.getPosition();

                // If player goes diagonal don't move
                // to prevent update conflicts !!!!!
                if (obj === ISO.player && 
                    obj.getDirection().x !== 0 && obj.getDirection().y !== 0) {
                        newposition.set(oldpos);
                        return false;
                }
                
                var dx = Math.abs(oldpos.x - op.x);
                var dy = Math.abs(oldpos.y - op.y);
                
                // Golden Trick to prevent stutter on
                // left-up direction along the walls
                // Check if it is not an automate because 
                // presicion is needed there !!!!!
                if (entity === ISO.player && 
                    !(obj instanceof Automate)) {
                    dx = dx.toPrecision(1);
                    dy = dy.toPrecision(1);
                }
                
                // if diogonal is direct to the corner to
                // other obj then stop !!!!!
                // Except for the player. This is needed for
                // smooth movements when going diagonal.
                if (entity !== ISO.player && dx === dy) {
                    newposition.set(oldpos);
                    return false;
                }
                
                if (dx < 0.001) dx = 0;
                if (dy < 0.001) dy = 0;
                
                if (dir.y === -1 && dir.x === -1) {
                    if (dx > dy) newposition.x = op.x + 1;
                    if (dy > dx) newposition.y = op.y + 1;
                } else if (dir.y === -1 && dir.x === 1) {
                    if (dx > dy) newposition.x = op.x - 1;
                    if (dy > dx) newposition.y = op.y + 1;
                } else if (dir.y === 1 && dir.x === -1) {
                    if (dx > dy) newposition.x = op.x + 1;
                    if (dy > dx) newposition.y = op.y - 1;
                } else if (dir.y === 1 && dir.x === 1) {
                    if (dx > dy) newposition.x = op.x - 1;
                    if (dy > dx) newposition.y = op.y - 1;
                } else if (dir.y === -1 && dir.x === 0) {
                    newposition.y = op.y + 1;
                } else if (dir.y === 1 && dir.x === 0) {
                    newposition.y = op.y - 1;
                } else if (dir.x === -1 && dir.y === 0) {
                    newposition.x = op.x + 1;
                } else if (dir.x === 1 && dir.y === 0) {
                    newposition.x = op.x - 1;
                } else {
                    newposition.x = oldpos.x;
                    newposition.y = oldpos.y;
                }
                return false;
            }
        });
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

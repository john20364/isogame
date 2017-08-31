function World() {
    var that = this;
    var sprites = [];
    var floorcanvas = document.createElement("canvas");
	var floorcontext = floorcanvas.getContext("2d");
    var floordata = undefined;
    var entities = [];
    
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
        // Create the player
        ISO.player = factory.createEntity(that, new Point(1, 1), ISO.players, 0);
        entities.push(ISO.player);
        
        var entity = undefined;
        // Create the entities
        entity = factory.createEntity(
            that, new Point(5, 5), ISO.players, 1);
        entities.push(entity);
        
        entity = new Automate();
        entity.init(that, new Point(10, 5), ISO.testplayer, 0);
        entity.setPath([
            new Point(2, 2), 
            new Point(2, 10),
            new Point(20, 10),
            new Point(20, 2)
        ]);
        entities.push(entity);

        entity = new Automate();
        entity.init(that, new Point(15, 15), ISO.testplayer, 0);
        entity.setPath([
            new Point(5, 25), 
            new Point(15, 15), 
        ]);
        entities.push(entity);
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
            var sprite = new Sprite(
                new Point(x, y), 
                ISO.floorsprites, 
                imgidx, 
                0,
                isFloor);
            
            floorsprites.push(sprite);
            
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
    
    this.render = function () {
        var renderobjects = [];
        var twoD = ISO.player.getTwoD();
        ISO.context.save();

        ISO.context.translate(ISO.width / 2 - twoD.x, ISO.height / 2 - twoD.y);
        
        // Draw floorsprites
        for (var i = 0; i < floorsprites.length; i++) {
            if (inViewPort(twoD, floorsprites[i])) {
                floorsprites[i].render();

                // Add all objects with height !!
                if (!floorsprites[i].isFloor()) {
                    renderobjects.push(floorsprites[i]);    
                }
            }
        }

        // Add entity.getSprite() to renderobjects 
        // within the viewport.
        // The less we have to do the faster it will be
        for (var i = 0; i < entities.length; i++) {
            if (inViewPort(twoD, entities[i].getSprite())) {
                renderobjects.push(entities[i].getSprite());
            }
        }
        
        //-----------------------------
        // Sort the renderobjects
        //-----------------------------
        renderobjects.sort(function(a, b) {
            return a.getTwoD().y - b.getTwoD().y;
        });

        // Draw the renderobjects
        for (var i = 0; i < renderobjects.length; i++) {
            renderobjects[i].render();
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
//        return sprites[index].isFloor();
        return floorsprites[index].isFloor();
    }
}

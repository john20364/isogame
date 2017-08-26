function Player(world, position, cb) {
    this.world = world;
    this.position = position.copy().multiply(10);
    this.world.setPlayer(this);
    var sprite= undefined;
    
    (function () {
        var img = new Image();
        img.onload = function() {
            sprite = new Sprite(
            new Point(0, 0), 
            img, 
            1, 
            0,
            false);
            if (cb) cb();
        };
        img.src = "images\\floorsprites.png";
    })();
    
    this.draw = function () {
        ISO.context.save();
        ISO.context.translate(ISO.width / 2, ISO.height / 2);
//        drawIso(isoTo2D(new Point(0, 0)), 9);
        sprite.render();
        ISO.context.restore();
    }
    
    this.walkRight = false;
    this.walkLeft = false;
    this.walkUp = false;
    this.walkDown = false;
    
    var step = 2;
    this.update = function () {
        if (this.walkRight) {
            var dx = this.position.x % 10;
            var dy = this.position.y % 10;
            var x = (this.position.x - dx) / 10;
            var y = (this.position.y - dy) / 10;
            
            if (dy === 0) {
                if (this.world.canMove(x + 1, y)) {
                    this.position.x += step;
                }
            } else {
                if (this.world.canMove(x + 1, y) &&
                    this.world.canMove(x + 1, y + 1)) {
                    this.position.x += step;
                }
            }
        }
        
        if (this.walkLeft) {
            var dx = (this.position.x - step) % 10;
            var dy = this.position.y % 10;
            var x = (this.position.x - step - dx) / 10;
            var y = (this.position.y - dy) / 10;

            if (dy === 0) {
                if (this.world.canMove(x, y)) {
                    this.position.x -= step;
                }
            } else {
                if (this.world.canMove(x, y) &&
                    this.world.canMove(x, y + 1)) {
                    this.position.x -= step;
                }
            }
        }
        
        if (this.walkUp) {
            var dx = this.position.x % 10;
            var dy = (this.position.y - step) % 10;
            var x = (this.position.x - dx) / 10;
            var y = (this.position.y - step - dy) / 10;

            if (dx === 0) {
                if (this.world.canMove(x, y)) {
                    this.position.y -= step;
                }
            } else {
                if (this.world.canMove(x, y) &&
                    this.world.canMove(x + 1, y)) {
                    this.position.y -= step;
                }
            }
        }
        
        if (this.walkDown) {
            var dx = this.position.x % 10;
            var dy = this.position.y % 10;
            var x = (this.position.x - dx) / 10;
            var y = (this.position.y - dy) / 10;

            if (dx === 0) {
                if (this.world.canMove(x, y + 1)) {
                    this.position.y += step;
                }
            } else {
                if (this.world.canMove(x, y + 1) &&
                    this.world.canMove(x + 1, y + 1)) {
                    this.position.y += step;
                }
            }
        }
    }
        
    this.moveRight = function (walking) {
        this.walkRight = walking;
    }
    this.moveLeft = function (walking) {
        this.walkLeft = walking;
    }
    this.moveUp = function (walking) {
        this.walkUp = walking;
    }
    this.moveDown = function (walking) {
        this.walkDown = walking;
    }
}

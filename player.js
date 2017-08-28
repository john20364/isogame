function Player(world, position) {
    this.world = world;
    this.position = position.copy().multiply(10);
    this.world.setPlayer(this);
    var sprite = undefined;

    // Initializarion
    (function () {
        sprite = new Sprite(
//        new Point(0, 0), 
        position,
        ISO.floorsprites, 
        1, 
        0,
        false);
    })();
    
    this.render = function () {
        sprite.render();
    }
    
    this.setPosition = function (position) {
        this.position = position.copy().multiply(10);
        sprite.setPosition(position);
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

function Player(world, pos) {
    this.world = world;
    var position = pos.copy().multiply(10);
    var sprite = undefined;

    // Initializarion
    (function () {
        sprite = new Sprite(
        pos,
        ISO.floorsprites, 
        3, 
        0,
        false);
    })();
    
//    this.render = function () {
//        sprite.render();
//    }
    
    this.getSprite = function () {
        return sprite;
    }
    
    this.setPosition = function (pos) {
        position = pos.copy().multiply(10);
        sprite.setPosition(pos);
    }
    
    this.getPosition = function () {
        return sprite.getPosition();
    }
    
    this.getGridIndex = function () {
        var tempPos = sprite.getPosition();
        var tx = (tempPos.x % 1) > 0 ? ((tempPos.x + 1) | 0) :      tempPos.x;
        var ty = (tempPos.y % 1) > 0 ? ((tempPos.y + 1) | 0) :      tempPos.y;

        return tx + ty * ISO.floorplan.width;
    }
    
    this.getTwoD = function () {
        return sprite.getTwoD();
    }
    
    this.walkRight = false;
    this.walkLeft = false;
    this.walkUp = false;
    this.walkDown = false;
    
    
    var step = 2;
    this.update = function () {
        function updateSpritePosition() {
            sprite.setPosition(position.copy().divide(10));
        }
        
        if (this.walkRight) {
            var dx = position.x % 10;
            var dy = position.y % 10;
            var x = (position.x - dx) / 10;
            var y = (position.y - dy) / 10;
            
            if (dy === 0) {
                if (this.world.canMove(x + 1, y)) {
                    position.x += step;
                    updateSpritePosition();
                }
            } else {
                if (this.world.canMove(x + 1, y) &&
                    this.world.canMove(x + 1, y + 1)) {
                    position.x += step;
                    updateSpritePosition();
                }
            }
        }
        
        if (this.walkLeft) {
            var dx = (position.x - step) % 10;
            var dy = position.y % 10;
            var x = (position.x - step - dx) / 10;
            var y = (position.y - dy) / 10;

            if (dy === 0) {
                if (this.world.canMove(x, y)) {
                    position.x -= step;
                    updateSpritePosition();
                }
            } else {
                if (this.world.canMove(x, y) &&
                    this.world.canMove(x, y + 1)) {
                    position.x -= step;
                    updateSpritePosition();
                }
            }
        }
        
        if (this.walkUp) {
            var dx = position.x % 10;
            var dy = (position.y - step) % 10;
            var x = (position.x - dx) / 10;
            var y = (position.y - step - dy) / 10;

            if (dx === 0) {
                if (this.world.canMove(x, y)) {
                    position.y -= step;
                    updateSpritePosition();
                }
            } else {
                if (this.world.canMove(x, y) &&
                    this.world.canMove(x + 1, y)) {
                    position.y -= step;
                    updateSpritePosition();
                }
            }
        }
        
        if (this.walkDown) {
            var dx = position.x % 10;
            var dy = position.y % 10;
            var x = (position.x - dx) / 10;
            var y = (position.y - dy) / 10;

            if (dx === 0) {
                if (this.world.canMove(x, y + 1)) {
                    position.y += step;
                    updateSpritePosition();
                }
            } else {
                if (this.world.canMove(x, y + 1) &&
                    this.world.canMove(x + 1, y + 1)) {
                    position.y += step;
                    updateSpritePosition();
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

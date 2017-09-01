function Player () {
    this.walkRight = false;
    this.walkLeft = false;
    this.walkUp = false;
    this.walkDown = false;
}

Player.prototype = Object.create(BaseEntity.prototype);

Player.prototype.update = function () {
    var position = this.getPosition().copy().multiply(10);
    var step = 2;
    
    if (this.walkRight) {
        var dx = position.x % 10;
        var dy = position.y % 10;
        var x = (position.x - dx) / 10;
        var y = (position.y - dy) / 10;

        if (dy === 0) {
            if (this.world.canMove(x + 1, y)) {
                position.x += step;
            }
        } else {
            if (this.world.canMove(x + 1, y) &&
                this.world.canMove(x + 1, y + 1)) {
                position.x += step;
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
            }
        } else {
            if (this.world.canMove(x, y) &&
                this.world.canMove(x, y + 1)) {
                position.x -= step;
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
            }
        } else {
            if (this.world.canMove(x, y) &&
                this.world.canMove(x + 1, y)) {
                position.y -= step;
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
            }
        } else {
            if (this.world.canMove(x, y + 1) &&
                this.world.canMove(x + 1, y + 1)) {
                position.y += step;
            }
        }
    }
    
    this.setPosition(position.divide(10));
}

Player.prototype.moveRight = function (walking) {
        this.walkRight = walking;
}

Player.prototype.moveLeft = function (walking) {
        this.walkLeft = walking;
}

Player.prototype.moveUp = function (walking) {
        this.walkUp = walking;
}

Player.prototype.moveDown = function (walking) {
        this.walkDown = walking;
}
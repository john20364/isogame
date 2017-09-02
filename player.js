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
        position.x += step;
    }

    if (this.walkLeft) {
        position.x -= step;
    }

    if (this.walkUp) {
        position.y -= step;
    }

    if (this.walkDown) {
        position.y += step;
    }
    
    position.divide(10);
    var that = this;
    if (this.world.canMove2(this, position, 
        function (dx, dy, entity) {
//            if (entity instanceof Automate) {
//                console.log(entity.getSpeed());
//                that.speed = entity.getSpeed();
//                if (dx < 0) {
//                    position.x -= (1+dx);
//                } else if (dx > 0) {
//                    position.x += (1-dx);
//                } else if (dy < 0) {
//                    position.y -= (1+dy);
//                } else if (dy > 0) {
//                    position.y += (1-dy);
//                }
//                that.setPosition(position);
//            }
    })) {
        this.setPosition(position);
    }
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
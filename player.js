function Player () {
    this.walkRight = false;
    this.walkLeft = false;
    this.walkUp = false;
    this.walkDown = false;
}

Player.prototype = Object.create(BaseEntity.prototype);

Player.prototype.update = function () {
    var f = 10;
    var position = this.getPosition().copy().multiply(f);
    var step = 2;

    var dir = this.getDirection();
    dir.x = 0;
    dir.y = 0;
    
    if (this.walkRight) {
        dir.x = 1;
        position.x += step;
    }
    if (this.walkLeft ) {
        dir.x = -1;
        position.x -= step;
    }
    if (this.walkUp   ) {
        dir.y = -1;
        position.y -= step;
    }
    if (this.walkDown ) {
        dir.y = 1;
        position.y += step;
    }
    
    position.divide(f);
    
    var that = this;
    if (this.world.canMove(this, position)) {
        this.setDirection(dir);
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
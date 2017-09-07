function Player () {
    this.walkRight = false;
    this.walkLeft = false;
    this.walkUp = false;
    this.walkDown = false;
}

Player.prototype = Object.create(BaseEntity.prototype);

Player.prototype.update = function () {
    var position = this.getPosition().copy()
    var step = 0.2;

    var dir = this.getDirection();
    dir.x = 0;
    dir.y = 0;

    if (this.walkRight && this.walkUp) {
        step *= Math.SQRT2 * 0.5;
        dir.x = 1;
        position.x += step;
        dir.y = -1;
        position.y -= step;
    } else if (this.walkRight && this.walkDown) {
        step *= Math.SQRT2 * 0.5;
        dir.x = 1;
        position.x += step;
        dir.y = 1;
        position.y += step;
    } else if (this.walkLeft && this.walkUp) {
        step *= Math.SQRT2 * 0.5;
        dir.x = -1;
        position.x -= step;
        dir.y = -1;
        position.y -= step;
    } else if (this.walkLeft && this.walkDown) {
        step *= Math.SQRT2 * 0.5;
        dir.x = -1;
        position.x -= step;
        dir.y = 1;
        position.y += step;
    } else if (this.walkRight) {
        dir.x = 1;
        position.x += step;
    } else if (this.walkLeft) {
        dir.x = -1;
        position.x -= step;
    } else if (this.walkUp) {
        dir.y = -1;
        position.y -= step;
    } else if (this.walkDown) {
        dir.y = 1;
        position.y += step;
    } 
    
    this.setDirection(dir);
    
    var that = this;
    if (this.world._canMove(this, position)) {
        //............
    } 
    this.setPosition(position);
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
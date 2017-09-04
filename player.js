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
    
    if (this.walkRight) position.x += step;
    if (this.walkLeft ) position.x -= step;
    if (this.walkUp   ) position.y -= step;
    if (this.walkDown ) position.y += step;
    
    position.divide(f);
    
    var that = this;
    if (this.world.canMove(this, position)) { 
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
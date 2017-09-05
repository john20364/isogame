function BaseEntity () {
    this.world = undefined;
    this.sprite = undefined;
}

BaseEntity.prototype.init = function (  world,
                                        position, 
                                        spritesheet, 
                                        spritewidth,
                                        spriteheight,
                                        index,
                                        floor) {
    this.world = world;
    
    this.sprite = new Sprite(
                        position,
                        spritesheet, 
                        spritewidth,
                        spriteheight,
                        index, 
                        floor);
}

BaseEntity.prototype.getSprite = function () {
    return this.sprite;
}

BaseEntity.prototype.setDirection = function (direction) {
    this.sprite.setDirection(direction);
}

BaseEntity.prototype.getDirection = function () {
    return this.sprite.getDirection();
}


BaseEntity.prototype.setPosition = function (position) {
    this.sprite.setPosition(position);
}

BaseEntity.prototype.getPosition = function () {
    return this.sprite.getPosition();
}
    
BaseEntity.prototype.getTwoD = function () {
    return this.sprite.getTwoD();
}

BaseEntity.prototype.isFloor = function () {
    return this.sprite.isFloor();
}
    
BaseEntity.prototype.render = function () {
    return this.sprite.render();
}

BaseEntity.prototype.update = function () {
    alert("BaseEntity.prototype.update");
}


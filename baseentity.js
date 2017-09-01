function BaseEntity () {
    this.world = undefined;
    this.sprite = undefined;
}

BaseEntity.prototype.init = function (  world,
                                        position, 
                                        spritesheet,           index) {
    this.world = world;
    
    this.sprite = new Sprite(
                        position,
                        spritesheet, 
                        index, 
                        0,
                        false);
}

BaseEntity.prototype.getSprite = function () {
    return this.sprite;
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
    
BaseEntity.prototype.update = function () {
    alert("BaseEntity.prototype.update");
}


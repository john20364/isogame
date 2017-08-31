function EntityBase () {}
EntityBase.prototype.world = undefined;
EntityBase.prototype.sprite = undefined;

EntityBase.prototype.init = function (  world,
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

EntityBase.prototype.getSprite = function () {
    return this.sprite;
}

EntityBase.prototype.setPosition = function (position) {
    this.sprite.setPosition(position);
}

EntityBase.prototype.getPosition = function () {
    return this.sprite.getPosition();
}
    
EntityBase.prototype.getTwoD = function () {
    return this.sprite.getTwoD();
}
    
EntityBase.prototype.update = function () {
    alert("EntityBase.prototype.update");
}


function BaseEntity () {
    this.world = undefined;
    this.sprite = undefined;
    this.data = undefined;
    this.behaviour = undefined;
}

BaseEntity.prototype.init = function (world, data) {
    this.world = world;
    this.sprite = new Sprite(data);
    this.data = data;
}

BaseEntity.prototype.getId = function () {
    if (this.data.id) {
        return this.data.id;
    }
    return undefined;
}

BaseEntity.prototype.setBehaviour = function (behaviour) {
    this.behaviour = behaviour;
}

BaseEntity.prototype.getSprite = function () {
    return this.sprite;
}

BaseEntity.prototype.getHeading = function () {
    return this.sprite.getHeading()
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

BaseEntity.prototype.action = function (initiator) {
    alert("BaseEntity.prototype.action");
}


function Solid () {}
    this.left = undefined;
    this.right = undefined;
    var action = false;
    var actor = undefined;
    var active = false;
    var execute = undefined;

Solid.prototype = Object.create(BaseEntity.prototype);

Solid.prototype.setLeft = function (entity) {
    this.left = entity;
}

Solid.prototype.setRight = function (entity) {
    this.right = entity;
}

Solid.prototype.getLeft = function () {
    return this.left;
}

Solid.prototype.getRight = function () {
    return this.right;
}

Solid.prototype.update = function () {
    if (this.behaviour) {
        this.behaviour.update();
    }
}

Solid.prototype.action = function (initiator) {
    if (this.behaviour) {
        this.behaviour.init(initiator);
    } 
}

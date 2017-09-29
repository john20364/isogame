function Solid () {}
    var left = undefined;
    var right = undefined;

Solid.prototype = Object.create(BaseEntity.prototype);

Solid.prototype.setLeft = function (entity) {
    left = entity;
}

Solid.prototype.setRight = function (entity) {
    right = entity;
}

Solid.prototype.getLeft = function () {
    return left;
}

Solid.prototype.getRight = function () {
    return right;
}

Solid.prototype.setBehaviour = function (behavior) {
    // Todo.........
}

Solid.prototype.update = function () {
    // Todo.....
}
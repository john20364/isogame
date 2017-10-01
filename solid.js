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
    if (this.behaviour && this.behaviour.isActive()) {
        this.behaviour.perform();
    }
//    if (action) {
//        active = execute();
//        if (!active) {
//            // TODO....
//            // Implement behaviour here
//            
//            if (execute === this.sprite.nextAnimationStep) {
//                execute = this.sprite.previousAnimationStep;
//            } else {
//                execute = undefined;
//                action = false;
//            }
//        }
//    }
}

Solid.prototype.action = function (initiator) {
    if (this.behaviour) {
        this.behaviour.init(initiator, this);
    } 
//    actor = initiator;
//    action = true;
//    execute = this.sprite.nextAnimationStep;
    // Todo.....
}

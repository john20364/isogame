function BaseBehaviour () {
    this.actor = undefined;
    this.self = undefined;
    this.active = false;
    this.isstewarding = false;
}

BaseBehaviour.prototype.setOwner = function (entity) {
    this.self = entity;
}

BaseBehaviour.prototype.init = function (actor) {
    if (!this.isActive() && !this.isBeingSteward()) {
        this.actor = actor;
        this.active = true;
        this.stewarship(true);
    } 
}

BaseBehaviour.prototype.term = function () {
    this.stewarship(false);
}

BaseBehaviour.prototype.notifyGroup = function (cb, all = false) {
    let p = this.self.getLeft();
    while (p) {
        cb(p);
        p = p.getLeft();
    }
    
    p = this.self.getRight();
    while (p) {
        cb(p);
        p = p.getRight();
    }
    
    if (all)
        cb(this.self);
}

BaseBehaviour.prototype.stewarship = function (bool) {
    this.notifyGroup(function (entity) {
        if (entity.behaviour) {
            entity.behaviour.isstewarding = bool;
        }
    });
}

BaseBehaviour.prototype.isActive = function () {
    return this.active;
}

BaseBehaviour.prototype.isBeingSteward = function () {
    return this.isstewarding;
}

BaseBehaviour.prototype.update = function () {
    alert("BaseBehaviour.prototype.update");
}

BaseBehaviour.prototype.perform = function () {
    alert("BaseBehaviour.prototype.perform");
}




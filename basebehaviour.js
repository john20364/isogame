function BaseBehaviour () {
    this.actor = undefined;
    this.self = undefined;
    this.active = false;
}

BaseBehaviour.prototype.init = function (actor, self) {
    this.actor = actor;
    this.self = self;
    this.active = true;
}

BaseBehaviour.prototype.isActive = function () {
    return this.active;
}

BaseBehaviour.prototype.perform = function () {
    alert("BaseBehaviour.prototype.perform");
}
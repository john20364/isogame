function DoorBehaviour() {
    
}

DoorBehaviour.prototype =   Object.create(BaseBehaviour.prototype);

DoorBehaviour.prototype.execute = function (self) {
    console.log("DoorBehaviour.prototype.execute");
//    console.dir(self.getPosition());
}

DoorBehaviour.prototype.perform = function () {
    this.active = false;
    
    // Walk left and execute
    var p = this.self.getLeft();
    while (p !== undefined) {
        if (p.behaviour)
            p.behaviour.execute(p);
        p = p.getLeft();
    }

    // Walk right and execute
    var p = this.self.getRight();
    while (p !== undefined) {
        if (p.behaviour)
            p.behaviour.execute(p);
        p = p.getRight();
    }
    
    // And last but not least execute myself
    this.execute(this.self);
}
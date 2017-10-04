function DoorBehaviour() {
    this.open = false;
}

DoorBehaviour.prototype =   Object.create(BaseBehaviour.prototype);

DoorBehaviour.prototype.execute = function (self, exec) {

    if (this.open === true)
        self.data.isFloor = false;

    if (!exec()) {
        if (this.open === false) {
            this.open = true;
            self.data.isFloor = true;
        } else {
            this.open = false;
            this.active = false; 
        }
    }
}

function toCloseToDoor(actor, obj) {
    // Check if player is close enough for interaction
    var heading = actor.getHeading();
    var pos = actor.getPosition();
    var o = obj.getPosition();
    
    var dx = 0;
    var dy = 0;
    
    if (heading === "E" || heading === "W") {
        dx = Math.abs(pos.x - o.x);
    } else if (heading === "N" || heading === "S") {
        dy = Math.abs(pos.y - o.y);
    } else if (heading === "NW" || heading === "NE" ||                heading === "SE" || heading === "SW") {
        dx = Math.abs(pos.x - o.x);
        dy = Math.abs(pos.y - o.y);
    }
    
    if (dx > 1 || dy > 1) {
        return false;
    }    
    
    return true;
}

DoorBehaviour.prototype.perform = function () {
    function getFunc(open, obj) {
        if (!open) {
            return obj.getSprite().nextAnimationStep;
        } else {
            return obj.getSprite().previousAnimationStep;
        }
    }
    
    // Check if the actor is to close to the door before 
    // closing the door
    if (this.open && this.self.data.isFloor === true) {
        if (toCloseToDoor(this.actor, this.self)) {
            return;
        }  
    } 
    
    // Walk left and execute
    var p = this.self.getLeft();
    while (p !== undefined) {
        if (p.behaviour) {
            p.behaviour.execute(p, getFunc(this.open, p));
        }
        p = p.getLeft();
    }

    // Walk right and execute
    var p = this.self.getRight();
    while (p !== undefined) {
        if (p.behaviour) {
            p.behaviour.execute(p, getFunc(this.open, p));
        }
        p = p.getRight();
    }
    
    // And last but not least execute myself
    this.execute(this.self, getFunc(this.open, this.self));
}






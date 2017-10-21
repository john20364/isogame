function DoorBehaviour2() {
    this.open = false;
    this.isClosing = false;
    this.ready = false;
}

DoorBehaviour2.prototype =   Object.create(BaseBehaviour.prototype);

DoorBehaviour2.prototype.execute = function (exec) {
    this.ready = exec();
    if (this.ready) {
        this.open = !this.open;
        if (this.open === false) {
            this.isClosing = false;
            this.active = false;
            
            // if being the steward clear stewardship
            if (!this.isBeingSteward()) {
                this.stewarship(false);
            }
        } else {
            // set floor property to true to prevent
            // acidental collision detection
//            if (this.self.data) {
//                this.self.data.isFloor = true;
//            }
        }
    }
}

DoorBehaviour2.prototype.toCloseToDoor = function (actor, obj) {
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
    
    if (dx > 2 || dy > 2) {
        return false;
    }    
    
    return true;
}

DoorBehaviour2.prototype.perform = function () {
    function getFunc(open, obj) {
        if (!open) {
            switch (obj.data.door.type) {
                case "left" :
                    return obj.getSprite().moveLeft;
                    break;
                case "right" :
                    return obj.getSprite().moveRight;
                    break;
                case "up" :
                    return obj.getSprite().moveUp;
                    break;
                case "down" :
                    return obj.getSprite().moveDown;
                    break;
            }
        } else {
            switch (obj.data.door.type) {
                case "left" :
                    return obj.getSprite().moveRight;
                    break;
                case "right" :
                    return obj.getSprite().moveLeft;
                    break;
                case "up" :
                    return obj.getSprite().moveDown;
                    break;
                case "down" :
                    return obj.getSprite().moveUp;
                    break;
            }
        }
    }
    
    // Check if the actor is to close to the door before 
    // closing the door
    if (this.open && !this.isClosing) {
        if (this.toCloseToDoor(this.actor, this.self)) {
            return;
        } else {
            this.isClosing = true;
            // set isFloor property to true;
//            this.notifyGroup(function (entity) {
//                if (entity.data) {
//                    entity.data.isFloor = false;
//                } 
//            }, true);
        }
    } 

    let that = this;
    let fin = false;
    this.notifyGroup(function (entity) {
        if (entity.behaviour) {
            if (!entity.behaviour.ready) {
                entity.behaviour.execute(
                    getFunc(that.open, entity));
            } 
            
            if (entity.behaviour.ready) {
                fin = true;
            }
        } 
    }, true);

    if (fin) {
        // Make sure everyone is ready
        this.notifyGroup(function (entity) {
            if (entity.behaviour) {
                while (!entity.behaviour.ready) {
                    entity.behaviour.execute(
                        getFunc(that.open, entity));
                }
            } 
        }, true);
    }

    // Reset ready status
    this.notifyGroup(function (entity) {
        if (entity.behaviour) {
            entity.behaviour.ready = false;
        } 
    }, true);
}

DoorBehaviour2.prototype.update = function () {
    if (this.self.data.animator) {
        this.notifyGroup(function (entity) {
            entity.getSprite().nextAnimationStep();
        }, true);
    }

    if (this.isActive()) {
        this.perform();
    }
}



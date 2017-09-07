function Automate () {
    this.path = undefined;
    this.pathindex = 0;
}

Automate.prototype = Object.create(BaseEntity.prototype);

Automate.prototype.setPath = function (path) {
    this.path = path;
}

Automate.prototype.getHeading = function () {
    return this.heading;
}

Automate.prototype.update = function () {
    if (this.path === undefined) return;
    var f = 10;
    var p = this.getPosition().copy().multiply(f);
    var dx = (p.x - this.path[this.pathindex].x * f);
    var dy = (p.y - this.path[this.pathindex].y * f);
    
    var dir = this.getDirection();
    dir.x = 0;
    dir.y = 0;
    
    var step = 0.5;
    
    if (dx > 0) {
        dir.x = -1;
        p.x -= step;
    }
    if (dx < 0) {
        dir.x = 1;
        p.x += step;
    }
    if (dy > 0) {
        dir.y = -1;
        p.y -= step;
    }
    if (dy < 0) {
        dir.y = 1;
        p.y += step;
    }
    
    p.divide(f);

    this.setDirection(dir);

    if (this.world.canMove(this, p)) {
        this.setPosition(p);
        if ((dx === 0) && (dy === 0)) {
            this.pathindex++;
            this.pathindex %= this.path.length;
        }
    }
}


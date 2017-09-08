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
    var p = this.getPosition().copy();
    var dx = p.x - this.path[this.pathindex].x;
    var dy = p.y - this.path[this.pathindex].y;
    
    var dir = this.getDirection();
    dir.x = 0;
    dir.y = 0;
    
    var step = 0.05;

    if (dx > 0 && dy > 0) {
        step *= Math.SQRT2 * 0.5;
        dir.x = -1;
        p.x -= step;
        dir.y = -1;
        p.y -= step;
    } else if (dx > 0 && dy < 0) {
        step *= Math.SQRT2 * 0.5;
        dir.x = -1;
        p.x -= step;
        dir.y = 1;
        p.y += step;
    } else if (dx < 0 && dy > 0) {
        step *= Math.SQRT2 * 0.5;
        dir.x = 1;
        p.x += step;
        dir.y = -1;
        p.y -= step;
    } else if (dx < 0 && dy < 0) {
        step *= Math.SQRT2 * 0.5;
        dir.x = 1;
        p.x += step;
        dir.y = 1;
        p.y += step;
    } else if (dx > 0 && dy === 0) {
        dir.x = -1;
        p.x -= step;
    } else if (dx < 0 && dy === 0) {
        dir.x = 1;
        p.x += step;
    } else if (dy > 0 && dx === 0) {
        dir.y = -1;
        p.y -= step;
    } else if (dy < 0 && dx === 0) {
        dir.y = 1;
        p.y += step;
    }
    
    this.setDirection(dir);

    if (this.world.canMove(this, p)) {
    }

    this.setPosition(p);
    if (Math.abs(dx) < step) {
        p.x = this.path[this.pathindex].x; 
    }
    if (Math.abs(dy) < step) {
        p.y = this.path[this.pathindex].y;   
    } 

    if ((p.x === this.path[this.pathindex].x) &&
       (p.y === this.path[this.pathindex].y)) {
        this.pathindex++;
        this.pathindex %= this.path.length;
    }
}


function Automate () {
    this.pathindex = 0;
    this.prevPosition = new Point();
    this.dircorrection = false;
    this.hitobj = undefined;
}

Automate.prototype = Object.create(BaseEntity.prototype);

Automate.prototype.getHeading = function () {
    return this.heading;
}

Automate.prototype.getPrevPosition = function () {
    return this.prevPosition;
}

Automate.prototype.dirCorrection = function (obj) {
    this.dircorrection = true;
    this.hitobj = obj;
}

Automate.prototype.update = function () {
    if (!this.data.path) return;
    
    var p = this.getPosition();
    this.prevPosition.set(p);
    
    var dx = p.x - this.data.path[this.pathindex].x;
    var dy = p.y - this.data.path[this.pathindex].y;
    
    var dir = this.getDirection();
    dir.x = 0;
    dir.y = 0;
    
    var step = 0.05;

    if (dx > 0 && dy > 0) {
        dir.x = -1;
        dir.y = -1;
    } else if (dx > 0 && dy < 0) {
        dir.x = -1;
        dir.y = 1;
    } else if (dx < 0 && dy > 0) {
        dir.x = 1;
        dir.y = -1;
    } else if (dx < 0 && dy < 0) {
        dir.x = 1;
        dir.y = 1;
    } else if (dx > 0 && dy === 0) {
        dir.x = -1;
    } else if (dx < 0 && dy === 0) {
        dir.x = 1;
    } else if (dy > 0 && dx === 0) {
        dir.y = -1;
    } else if (dy < 0 && dx === 0) {
        dir.y = 1;
    }
    
    if (this.dircorrection) {
        this.dircorrection = false;
        step *= Math.SQRT2 * 0.5;
        
        var op = this.hitobj.getPosition();
        var _dx = Math.abs(p.x - op.x);
        var _dy = Math.abs(p.y - op.y);
        (_dx >= _dy) ? dx = 0 : dy = 0;    
    }
    
    if (dx > 0 && dy > 0) {
        step *= Math.SQRT2 * 0.5;
        p.x -= step;
        p.y -= step;
    } else if (dx > 0 && dy < 0) {
        step *= Math.SQRT2 * 0.5;
        p.x -= step;
        p.y += step;
    } else if (dx < 0 && dy > 0) {
        step *= Math.SQRT2 * 0.5;
        p.x += step;
        p.y -= step;
    } else if (dx < 0 && dy < 0) {
        step *= Math.SQRT2 * 0.5;
        p.x += step;
        p.y += step;
    } else if (dx > 0 && dy === 0) {
        p.x -= step;
    } else if (dx < 0 && dy === 0) {
        p.x += step;
    } else if (dy > 0 && dx === 0) {
        p.y -= step;
    } else if (dy < 0 && dx === 0) {
        p.y += step;
    }
    
    var dx = Math.abs(p.x - this.data.path[this.pathindex].x);
    var dy = Math.abs(p.y - this.data.path[this.pathindex].y);

    if (dx < step) p.x = this.data.path[this.pathindex].x;
    if (dy < step) p.y = this.data.path[this.pathindex].y;
    
    this.world.checkCollision(dir, this);
    
    this.setPosition(p);
    this.setDirection(dir);

    if ((p.x === this.data.path[this.pathindex].x) &&
       (p.y === this.data.path[this.pathindex].y)) {
        this.pathindex++;
        this.pathindex %= this.data.path.length;
    }
}

Automate.prototype.action = function (initiator) {
    // Todo.....
}

function Automate () {}
Automate.prototype = Object.create(EntityBase.prototype);

Automate.prototype.path = undefined;
Automate.prototype.pathindex = 0;

Automate.prototype.setPath = function (path) {
    this.path = path;
}

Automate.prototype.update = function () {
    if (this.path === undefined) return;
    var p = this.getPosition().copy().multiply(10);
    var dx = p.x - this.path[this.pathindex].x * 10;
    var dy = p.y - this.path[this.pathindex].y * 10;
    
    var step = 0.5;
    
    if (dx > 0) p.x -= step;
    if (dx < 0) p.x += step;
    if (dy > 0) p.y -= step;
    if (dy < 0) p.y += step;
    
    this.setPosition(p.divide(10));
    
    if ((dx === 0) && (dy === 0)) {
        this.pathindex++;
        this.pathindex %= this.path.length;
    }
}


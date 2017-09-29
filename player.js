function Player () {
    this.walkRight = false;
    this.walkLeft = false;
    this.walkUp = false;
    this.walkDown = false;
    this.prevPosition = new Point();
    this.dircorrection = false;
    this.hitobj = undefined;
}

Player.prototype = Object.create(BaseEntity.prototype);

Player.prototype.getPrevPosition = function () {
    return this.prevPosition;
}

Player.prototype.dirCorrection = function (obj) {
    this.dircorrection = true;
    this.hitobj = obj;
}

Player.prototype.update = function () {
    var position = this.getPosition();
    this.prevPosition.set(position);
   
    var step = 0.1;

    var dir = this.getDirection();
    dir.x = 0;
    dir.y = 0;

    // Save keys
    var saveLeft = this.walkLeft;
    var saveRight = this.walkRight;
    var saveUp = this.walkUp;
    var saveDown = this.walkDown;

    if (this.walkRight && this.walkUp) {
        dir.x = 1;
        dir.y = -1;
    } else if (this.walkRight && this.walkDown) {
        dir.x = 1;
        dir.y = 1;
    } else if (this.walkLeft && this.walkUp) {
        dir.x = -1;
        dir.y = -1;
    } else if (this.walkLeft && this.walkDown) {
        dir.x = -1;
        dir.y = 1;
    } else if (this.walkRight) {
        dir.x = 1;
    } else if (this.walkLeft) {
        dir.x = -1;
    } else if (this.walkUp) {
        dir.y = -1;
    } else if (this.walkDown) {
        dir.y = 1;
    }

    if (this.dircorrection) {
        this.dircorrection = false;
        step *= Math.SQRT2 * 0.5;
        var op = this.hitobj.getPosition();
        var _dx = Math.abs(position.x - op.x);
        var _dy = Math.abs(position.y - op.y);
        if (_dx >= _dy) {
            this.walkLeft = false;
            this.walkRight = false;
        } else {
            this.walkUp = false;
            this.walkDown = false;
        }
    }
    
    if (this.walkRight && this.walkUp) {
        step *= Math.SQRT2 * 0.5;
        position.x += step;
        position.y -= step;
    } else if (this.walkRight && this.walkDown) {
        step *= Math.SQRT2 * 0.5;
        position.x += step;
        position.y += step;
    } else if (this.walkLeft && this.walkUp) {
        step *= Math.SQRT2 * 0.5;
        position.x -= step;
        position.y -= step;
    } else if (this.walkLeft && this.walkDown) {
        step *= Math.SQRT2 * 0.5;
        position.x -= step;
        position.y += step;
    } else if (this.walkRight) {
        position.x += step;
    } else if (this.walkLeft) {
        position.x -= step;
    } else if (this.walkUp) {
        position.y -= step;
    } else if (this.walkDown) {
        position.y += step;
    } 

    // Restore keys
    this.walkLeft = saveLeft;
    this.walkRight = saveRight;
    this.walkUp = saveUp;
    this.walkDown = saveDown;

    this.world.checkCollision(dir, this);

    this.setPosition(position);
    this.setDirection(dir);
}

Player.prototype.moveRight = function (walking) {
        this.walkRight = walking;
}

Player.prototype.moveLeft = function (walking) {
        this.walkLeft = walking;
}

Player.prototype.moveUp = function (walking) {
        this.walkUp = walking;
}

Player.prototype.moveDown = function (walking) {
        this.walkDown = walking;
}
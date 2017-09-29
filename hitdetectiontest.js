var ns = createNS("Hitdetectiontest");
ns.collision = new Collision();

function TSolid () {
    var _pos = new Point();
    
    this.setPosition = function (pos) {
        _pos = pos.copy();
    }
    
    this.getPosition = function () {
        return _pos;
    }

    this.update = function () {
    }
    
    this.render = function () {
        ns.context.strokeStyle = "#aaaaaa";
        ns.context.fillStyle = "#ff0000";
        
        ns.context.fillRect(_pos.x*ns.scale, _pos.y*ns.scale, ns.scale, ns.scale);
        ns.context.beginPath();
        ns.context.rect(_pos.x*ns.scale, _pos.y*ns.scale, ns.scale, ns.scale);
        ns.context.stroke();
    }
}

function TAutomate () {
    var path = undefined;
    var pathindex = 0;
    var _pos = new Point();
    var _prevpos = _pos.copy();
    var dircorrection = false;
    
    var _hitobj = undefined;
    
    this.dirCorrection = function (obj) {
        dircorrection = true;
        _hitobj = obj;
    }
    
    this.setPosition = function (pos) {
        _pos = pos.copy();
    }
    
    this.getPosition = function () {
        return _pos;
    }

    this.getPrevPosition = function () {
        return _prevpos;
    }

    this.setPath = function (arr) {
        path = arr;
    }
    
    this.update = function () {
        if (!path) return;

        var p = _pos;
        _prevpos.set(p);
        
        var dx = p.x - path[pathindex].x;
        var dy = p.y - path[pathindex].y;

        var dir = new Point();
        dir.x = 0;
        dir.y = 0;

        var step = 0.05;

        if (dircorrection) {
            dircorrection = false;
            var op = _hitobj.getPosition();
            var _dx = Math.abs(p.x - op.x);
            var _dy = Math.abs(p.y - op.y);
            (_dx >= _dy) ? dx = 0 : dy = 0;    
        }

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

        var dx = Math.abs(p.x - path[pathindex].x);
        var dy = Math.abs(p.y - path[pathindex].y);

        if (dx < step) p.x = path[pathindex].x;
        if (dy < step) p.y = path[pathindex].y;
        
        
        ns.collision.checkCollision(ns.entities, dir, this);
        
        if (p.x === path[pathindex].x &&
           p.y === path[pathindex].y) {
            pathindex++;
            pathindex %= path.length;
        }
    }
    
    this.render = function () {
        ns.context.strokeStyle = "#aaaaaa";
        ns.context.fillStyle = "#ff00ff";
        
        ns.context.fillRect(_pos.x*ns.scale, _pos.y*ns.scale, ns.scale, ns.scale);
        ns.context.beginPath();
        ns.context.rect(_pos.x*ns.scale, _pos.y*ns.scale, ns.scale, ns.scale);
        ns.context.stroke();
    }
    
}

function TPlayer () {
    var _pos = new Point();
    var _prevpos = _pos.copy();
    var _dir = new Point();
    var dircorrection = false;
    
    var _hitobj = undefined;

    this.left = false;
    this.right = false;
    this.up = false;
    this.down = false;

    this.dirCorrection = function (obj) {
        dircorrection = true;
        _hitobj = obj;
    }
    
    
    this.moveRight = function (val) {
        this.right = val;
    }
    this.moveLeft = function (val) {
        this.left = val;
    }
    this.moveUp = function (val) {
        this.up = val;
    }
    this.moveDown = function (val) {
        this.down = val;
    }
    
    this.setPosition = function (pos) {
        _pos = pos.copy();
    }
    
    this.getPosition = function () {
        return _pos;
    }

    this.getPrevPosition = function () {
        return _prevpos;
    }
    
    this.update = function () {
        var d = 0.07;
        _dir.x = 0;
        _dir.y = 0;

        // Save Keys
        var tleft = this.left;
        var tright = this.right;
        var tup = this.up;
        var tdown = this.down;

        _prevpos = _pos.copy();
        
        if (dircorrection) {
            dircorrection = false;
            var op = _hitobj.getPosition();
            var _dx = Math.abs(_pos.x - op.x);
            var _dy = Math.abs(_pos.y - op.y);
            if (_dx >= _dy) {
                this.left = false;
                this.right = false;
            } else {
                this.up = false;
                this.down = false;
            }
        }
        
        if (this.left && this.up) {
            _dir.x = -1;
            _dir.y = -1;
            d *= Math.SQRT2 * 0.5;
            _pos.x -= d;
            _pos.y -= d;
        } else if (this.right && this.up) {
            _dir.x = 1;
            _dir.y = -1;
            d *= Math.SQRT2 * 0.5;
            _pos.x += d;
            _pos.y -= d;
        } else if (this.right && this.down) {
            _dir.x = 1;
            _dir.y = 1;
            d *= Math.SQRT2 * 0.5;
            _pos.x += d;
            _pos.y += d;
        } else if (this.left && this.down) {
            _dir.x = -1;
            _dir.y = 1;
            d *= Math.SQRT2 * 0.5;
            _pos.x -= d;
            _pos.y += d;
        } else if (this.left) {
            _dir.x = -1;
            _pos.x -= d;
        } else if (this.right) {
            _dir.x = 1;
            _pos.x += d;
        } else if (this.up) {
            _dir.y = -1;
            _pos.y -= d;
        } else if (this.down) {
            _dir.y = 1;
            _pos.y += d;
        }

        // Restore Keys
        this.left = tleft;
        this.right = tright;
        this.up = tup;
        this.down = tdown;

        ns.collision.checkCollision(ns.entities, _dir, this);
    }
    
    this.render = function () {
        ns.context.strokeStyle = "#aaaaaa";
        ns.context.fillStyle = "#00ff00";
        
        ns.context.fillRect(_pos.x*ns.scale, _pos.y*ns.scale, ns.scale, ns.scale);
        ns.context.beginPath();
        ns.context.rect(_pos.x*ns.scale, _pos.y*ns.scale, ns.scale, ns.scale);
        ns.context.stroke();
    }
    
}

ns.field = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
           ];



ns.createEntities = function () {
    for (var row = 0; row < ns.rows; row++) {
        for (var col = 0; col < ns.cols; col++) {
            var index = row * ns.cols + col;
            if (ns.field[index] === 1) {
                var entity = new TSolid();
                entity.setPosition(new Point(col, row));
                ns.entities.push(entity);
            }
        }
    }
}

createAutomates = function () {
    var e = new TAutomate();
    e.setPosition(new Point(1, 10));
    e.setPath([{x:1, y:10}, {x:7, y:10}]);
    ns.entities.push(e);

    var e = new TAutomate();
    e.setPosition(new Point(1, 4));
    e.setPath([{x:1, y:4}, {x:11, y:15}]);
    ns.entities.push(e);

    var e = new TAutomate();
    e.setPosition(new Point(12, 4));
    e.setPath([{x:12, y:4}, {x:18, y:4}]);
    ns.entities.push(e);
    var e = new TAutomate();
    e.setPosition(new Point(18, 6));
    e.setPath([{x:18, y:6}, {x:12, y:6}]);
    ns.entities.push(e);
    var e = new TAutomate();
    e.setPosition(new Point(12, 8));
    e.setPath([{x:12, y:8}, {x:18, y:8}]);
    ns.entities.push(e);
    var e = new TAutomate();
    e.setPosition(new Point(18, 10));
    e.setPath([{x:18, y:10}, {x:12, y:10}]);
    ns.entities.push(e);

    var e = new TAutomate();
    e.setPosition(new Point(12, 17));
    e.setPath([{x:12, y:17}, 
               {x:17, y:17},
              {x:17, y:12},
              {x:12, y:12}]);
    ns.entities.push(e);

    var e = new TAutomate();
    e.setPosition(new Point(14, 14));
    e.setPath([{x:14, y:14}, 
               {x:18, y:18}]);
    ns.entities.push(e);
}

ns.init = function () {
    ns.canvas = document.getElementById("canvas");
    ns.context = ns.canvas.getContext("2d");
    //ns.width = canvas.width = window.innerWidth;
    //ns.height = canvas.height = window.innerHeight;
    ns.width = ns.canvas.width = 600;
    ns.height = ns.canvas.height = 600;
    ns.cols = 20;
    ns.rows = 20;
    ns.scale = Math.round(ns.width / ns.cols);

    ns.player = new TPlayer();
    ns.player.setPosition(new Point(17, 17));
    
    ns.entities = [];
    
    ns.createEntities();
    
    // Add player to entities
    ns.entities.push(ns.player);

//    var e = new TSolid();
//    e.setPosition(new Point(18, 18));
//    ns.entities.push(e);
//
//    var e = new TAutomate();
//    e.setPosition(new Point(18, 14));
//    ns.entities.push(e);
    
    
    createAutomates();
    
    ns.render();
    
    window.onkeydown = ns.doKeyDown;
    window.onkeyup = ns.doKeyUp;
}

ns.drawField = function () {
    ns.context.fillStyle = "#cccccc";
    ns.context.fillRect(0, 0, ns.width, ns.height);
    
    ns.context.strokeStyle = "#aaaaaa";
    for (var row = 0; row < ns.rows; row++) {
        for (var col = 0; col < ns.cols; col++) {
            var index = row * ns.cols + col;
            if (ns.field[index] === 1) {
                ns.context.fillStyle = "#ff0000";
            } else {
                ns.context.fillStyle = "#ffff00";
            }
            ns.context.fillRect(col*ns.scale, row*ns.scale, ns.scale, ns.scale);
            ns.context.beginPath();
            ns.context.rect(col*ns.scale, row*ns.scale, ns.scale, ns.scale);
            ns.context.stroke();
        }
    }
    
}

ns.render = function () {
    ns.drawField();
    
    for (var i = 0; i < ns.entities.length; i++) {
        ns.entities[i].render();
    }
    
    ns.player.update();
    for (var i = 0; i < ns.entities.length; i++) { 
        if (!(ns.entities[i] instanceof TPlayer))
            ns.entities[i].update();
    }
    ns.player.update();
    
    requestAnimationFrame(ns.render);
}

ns.doKeyDown = function (e) {
    if (e.keyCode === RIGHT_ARROW) {
        ns.player.moveRight(true);
    } else if (e.keyCode === LEFT_ARROW) {
        ns.player.moveLeft(true);
    } else if (e.keyCode === UP_ARROW) {
        ns.player.moveUp(true);
    } else if (e.keyCode === DOWN_ARROW) {
        ns.player.moveDown(true);
    }
}

ns.doKeyUp = function (e) {
    if (e.keyCode === RIGHT_ARROW) {
        ns.player.moveRight(false);
    } else if (e.keyCode === LEFT_ARROW) {
        ns.player.moveLeft(false);
    } else if (e.keyCode === UP_ARROW) {
        ns.player.moveUp(false);
    } else if (e.keyCode === DOWN_ARROW) {
        ns.player.moveDown(false);
    }
}

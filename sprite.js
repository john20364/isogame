function Sprite(data) {
    var dir = new Point();
    var position = new Point().set(data.position);
    var twoD = isoTo2D(position);
    var sx = data.spritesheet.index * ISO.isowidth;
    var sy = 0;
    var sw = ISO.isowidth;
    var sh = data.spritesheet.image.height;
    var delay = 0;
    var enable = false;
    var heading = 0;
    var that = this;
    
    if (data.animation) {
        enable = data.animation.auto;
        sh = Math.round(sh / data.animation.length); 
        setHeading(data.animation.heading);
    } 
    
    var dx = twoD.x - (ISO.isowidth >> 1);
    var dy = twoD.y - 
        (sh - ISO.isoheight);
    var dw = ISO.isowidth;
    var dh = sh;
    
    if (data.mask) {
        var mx = ISO.isowidth * data.mask.index;
        var my = 0;
        var mw = ISO.isowidth;
        var mh = data.mask.image.height;
        var maskcanvas = document.createElement("canvas");
        var maskctx = maskcanvas.getContext("2d");
        var half_width = ISO.isowidth >> 1;
        var half_height = ISO.isoheight >> 1;
    }
    
    var savedpos = new Point(-1);
    var old2D = twoD.copy();
    var diff2D = new Point;

    function savePosition () {
        if (savedpos.x === -1) {
            savedpos.set(position);
            old2D.set(twoD);
        }
    }
    
    function clearSavedPosition () {
        savedpos.x = -1;
    }
    
    this.getHeading = function () {
        switch (data.spritesheet.index) {
            case 0 :
                return "W";
                break;
            case 1 :
                return "NW";
                break;
            case 2 :
                return "N";
                break;
            case 3 :
                return "NE";
                break;
            case 4 :
                return "E";
                break;
            case 5 :
                return "SE";
                break;
            case 6 :
                return "S";
                break;
            case 7 :
                return "SW";
                break;
        }
    }
    
    function setHeading (headingStr) {
        switch (headingStr) {
            case "W":
                data.spritesheet.index = 0;
                break;
            case "NW":
            case "WN":
                data.spritesheet.index = 1;
                break;
            case "N":
                data.spritesheet.index = 2;
                break;
            case "NE":
            case "EN":
                data.spritesheet.index = 3;
                break;
            case "E":
                data.spritesheet.index = 4;
                break;
            case "SE":
            case "ES":
                data.spritesheet.index = 5;
                break;
            case "S":
                data.spritesheet.index = 6;
                break;
            case "SW":
            case "WS":
                data.spritesheet.index = 7;
                break;
        }
    }
    
    function _doorrender () {
        function adjustxy(p) {
            
            if (p.x >= 0) {
                if (p.x < half_width * d) {
                    p.x = 0;  
                } else {
                    p.x -= half_width * d;
                    if (p.x === half_width) 
                        p.x = ISO.isowidth;
                } 

            } else {
                if (half_width * mdist + p.x >= 0) {
                    p.x += half_width * mdist;
                } else {
                    p.x = 0;
                }
            }

            if (p.y >= 0) {
                if (p.y < half_height * d) {
                    p.y = 0;
                } else {
                    p.y -= half_height * d;
                    if (p.y === half_height) 
                        p.y = ISO.isoheight;
                }
            } else {
                if (half_height * mdist + p.y >= 0) {
                    p.y += half_height * mdist;
                } else {
                    p.y = 0;
                }
            }
        }
        
        maskcanvas.width = mw;
        maskcanvas.height = mh;

        maskctx.drawImage(data.spritesheet.image, 
            sx, sy, sw, sh, 0, 0, dw, dh);

        maskctx.globalCompositeOperation="destination-in";
//            maskctx.globalCompositeOperation="destination-out";

        let x = 0;
        let y = 0;
        let dist = data.door.movedistance;
        let mdist = data.door.maskdistance;
        let d = dist - mdist;          

        switch (data.door.type) {
            case "left":
                diff2D.x = old2D.x - twoD.x; 
                diff2D.y = old2D.y - twoD.y; 
                adjustxy(diff2D);
                break;
            case "right":
                diff2D.x = twoD.x - old2D.x;
                diff2D.y = twoD.y - old2D.y;
                adjustxy(diff2D);
                diff2D.x *= -1;
                diff2D.y *= -1;
                break;
            case "up":
                diff2D.x = twoD.x - old2D.x;
                diff2D.y = old2D.y - twoD.y;
                adjustxy(diff2D);
                diff2D.x *= -1;
                break;
            case "down":
                diff2D.x = old2D.x - twoD.x;
                diff2D.y = twoD.y - old2D.y;
                adjustxy(diff2D);
                diff2D.y *= -1;
                break;
        }

        maskctx.drawImage(
            data.mask.image, 
            mx, my, mw, mh, diff2D.x, diff2D.y, mw, mh);

        ISO.context.drawImage(
            maskcanvas, 0, 0, sw, sh, dx, dy, dw, dh);
    }

    this.noAnimation = function (id = 0) {
        sy = (sh * id) % data.spritesheet.image.height;
    }
    
    this.nextAnimationStep = function () {
        if (data.animation) {
            if (delay === 0) {
                sy += sh;
                sy %= data.spritesheet.image.height;
            }
            delay++;
            delay %= data.animation.delay;
        }
    }

    this.previousAnimationStep = function () {
        if (data.animation) {
            if (delay === 0) {
                if (sy === 0) 
                    sy = data.spritesheet.image.height;
                sy -= sh;
            }
            delay++;
            delay %= data.animation.delay;
        }
    }
    
    this.moveUp = function () {
        if (data.door === undefined) return;
        savePosition();
        let p = position.copy();
        let desty = Math.abs(savedpos.y - p.y);
        if (desty < data.door.movedistance) {
            p.y -= data.door.speed;
            if (savedpos.y - p.y >= data.door.movedistance) {
                p.y = savedpos.y - data.door.movedistance
            }
            that.setPosition(p);
            return false;
        } else {
            clearSavedPosition();
            return true;
        }
    }
    
    this.moveDown = function () {
        if (data.door === undefined) return;
        savePosition();
        let p = position.copy();
        let desty = Math.abs(savedpos.y - p.y);
        if (desty < data.door.movedistance) {
            p.y += data.door.speed;
            if (p.y - savedpos.y >= data.door.movedistance) {
                p.y = savedpos.y + data.door.movedistance
            }
            that.setPosition(p);
            return false;
        } else {
            clearSavedPosition();
            return true;
        }
    }
    
    this.moveLeft = function () {
        if (data.door === undefined) return;
        savePosition();
        let p = position.copy();
        let destx = Math.abs(savedpos.x - p.x);
        if (destx < data.door.movedistance) {
            p.x -= data.door.speed;
            if (savedpos.x - p.x >= data.door.movedistance) {
                p.x = savedpos.x - data.door.movedistance;
            }
            that.setPosition(p);
            return false;
        } else {
            clearSavedPosition();
            return true;
        }
    }
    
    this.moveRight = function () {
        if (data.door === undefined) return;
        savePosition();
        let p = position.copy();
        let destx = Math.abs(savedpos.x - p.x);
        if (destx < data.door.movedistance) {
            p.x += data.door.speed;
            if (p.x - savedpos.x >= data.door.movedistance) {
                p.x = savedpos.x + data.door.movedistance;
            }
            that.setPosition(p);
            return false;
        } else {
            clearSavedPosition();
            return true;
        }
    }
    
    function _render() {
        if (data.animation && enable) {
            if (heading === 0 && !data.animation.auto) {
                sy = 0;
            } else if (data.animation.offset !== 0 && sy === 0) {
                sy = sh * data.animation.offset;
            }
        }
        
        ISO.context.drawImage(
            data.spritesheet.image, sx, sy, sw, sh, dx, dy, dw, dh);

        if (data.animation && enable) {
            if (delay === 0) {
                sy += sh;
                sy %= data.spritesheet.image.height;
            }
            delay++;
            delay %= data.animation.delay;
        }
    }
    
    if (data.id === "door2") {
        this.render = _doorrender;
    } else {
        this.render = _render;
    }
    
    this.setDirection = function (direction) {
        dir = direction;    
        heading = dir.x * 10 + dir.y;
        switch (heading) {
            case 0:     // (0, 0)   - stop 
                if (data.animation && !data.animation.auto) {
                    enable = false;
                    sy = 0;
                }
                break;
            case -10 :  // (-1, 0)  - left 
                data.spritesheet.index = 0;
                break;
            case -11 :  // (-1, -1) - left-up
                data.spritesheet.index = 1;
                break;
            case -1 :   // (0, -1)  - up
                data.spritesheet.index = 2;
                break;
            case 9 :    // (1, -1)  - right-up 
                data.spritesheet.index = 3;
                break;
            case 10 :   // (1, 0)   - right 
                data.spritesheet.index = 4;
                break;
            case 11 :   // (1, 1)   - right-down 
                data.spritesheet.index = 5;
                break;
            case 1 :    // (0, 1)   - down
                data.spritesheet.index = 6;
                break;
            case -9 :   // (-1, 1)  - left-down 
                data.spritesheet.index = 7;
                break;
        }
        if (heading !== 0) {
            if (data.animation && !data.animation.auto) {
                enable = true;
            }
        }
        sx = data.spritesheet.index * ISO.isowidth;
    }

    this.getDirection = function () {
        return dir;    
    }
    
    this.setPosition = function (pos) {
        position = pos;
        twoD = isoTo2D(position);
        dx = twoD.x - (ISO.isowidth >> 1);
        dy = twoD.y - 
            (sh - ISO.isoheight);
    }
    
    this.getPosition = function () {
        return position;
    }

    this.getTwoD = function () {
        return twoD;
    }
    
    this.isFloor = function () {
        return data.isFloor;
    }
}
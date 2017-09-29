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

    this.render = function () {
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
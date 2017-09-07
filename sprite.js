function Sprite(pos, spritesheet, spriteindex, floor) {
    var dir = new Point();
    var position = pos;
    var twoD = isoTo2D(position);
    var sx = spriteindex * ISO.isowidth;
    var sy = 0;
    var sw = ISO.isowidth;
    var sh = spritesheet.height;
    var dx = twoD.x - (ISO.isowidth >> 1);
    var dy = twoD.y - (spritesheet.height - ISO.isoheight);
    var dw = ISO.isowidth;
    var dh = spritesheet.height;
    
    this.render = function () {
        ISO.context.drawImage(
            spritesheet, sx, sy, sw, sh, dx, dy, dw, dh);
    }

    this.setDirection = function (direction) {
        dir = direction;    
        var heading = dir.x * 10 + dir.y;
        switch (heading) {
            case 0:     // (0, 0)   - stop 
                break;
            case -10 :  // (-1, 0)  - left 
                break;
            case 10 :   // (1, 0)   - right 
                break;
            case -1 :   // (0, -1)  - down
                break;
            case 1 :    // (0, 1)   - up
                break;
            case -11 :  // (-1, -1) - left-down
                break;
            case 9 :    // (1, -1)  - right-down 
                break;
            case -9 :   // (-1, 1)  - left-up 
                break;
            case 11 :   // (1, 1)   - right-up 
                break;
        }
    }

    this.getDirection = function () {
        return dir;    
    }
    
    this.setPosition = function (pos) {
        position = pos;
        twoD = isoTo2D(position);
        dx = twoD.x - (ISO.isowidth >> 1);
        dy = twoD.y - (spritesheet.height - ISO.isoheight);
    }
    
    this.getPosition = function () {
        return position;
    }

    this.getTwoD = function () {
        return twoD;
    }
    
    this.isFloor = function () {
        return floor;
    }
}
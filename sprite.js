function Sprite(data) {
    var dir = new Point();
    var position = new Point().set(data.position);
    var twoD = isoTo2D(position);
    var sx = data.spritesheet.index * ISO.isowidth;
    var sy = 0;
    var sw = ISO.isowidth;
    var sh = data.spritesheet.image.height;
    var dx = twoD.x - (ISO.isowidth >> 1);
    var dy = twoD.y - 
        (data.spritesheet.image.height - ISO.isoheight);
    var dw = ISO.isowidth;
    var dh = data.spritesheet.image.height;
    
    this.render = function () {
        ISO.context.drawImage(
            data.spritesheet.image, sx, sy, sw, sh, dx, dy, dw, dh);
    }

    this.setDirection = function (direction) {
        dir = direction;    
        var heading = dir.x * 10 + dir.y;
        switch (heading) {
            case 0:     // (0, 0)   - stop 
                data.spritesheet.index = 0;
                break;
            case -10 :  // (-1, 0)  - left 
                data.spritesheet.index = 1;
                break;
            case -11 :  // (-1, -1) - left-up
                data.spritesheet.index = 2;
                break;
            case -1 :   // (0, -1)  - up
                data.spritesheet.index = 3;
                break;
            case 9 :    // (1, -1)  - right-up 
                data.spritesheet.index = 4;
                break;
            case 10 :   // (1, 0)   - right 
                data.spritesheet.index = 5;
                break;
            case 11 :   // (1, 1)   - right-down 
                data.spritesheet.index = 6;
                break;
            case 1 :    // (0, 1)   - down
                data.spritesheet.index = 7;
                break;
            case -9 :   // (-1, 1)  - left-down 
                data.spritesheet.index = 8;
                break;
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
            (data.spritesheet.image.height - ISO.isoheight);
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
function Sprite(pos, spritesheet, spriteindex, floor) {
        
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
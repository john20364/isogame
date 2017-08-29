function Sprite(pos, img, imgidx, yoffset, floor) {
    var position = pos;
    var twoD = isoTo2D(pos);
    var image = img;
    var imageIdx = imgidx;
    var imageYoffset = yoffset;
    
    var Floor = floor;
    var sx = imageIdx * ISO.isowidth;
    var sy = 0;
    var sw = ISO.isowidth;
    var sh = img.height;
    var dx = twoD.x - (ISO.isowidth >> 1);
    var dy = twoD.y - 
        (image.height - ISO.isoheight - imageYoffset);
    var dw = ISO.isowidth;
    var dh = image.height;
    
    this.render = function () {
        ISO.context.drawImage(
            image, sx, sy, sw, sh, dx, dy, dw, dh);
    }
    
    this.setPosition = function (pos) {
        position = pos;
        twoD = isoTo2D(pos);
        dx = twoD.x - (ISO.isowidth >> 1);
        dy = twoD.y - 
            (image.height - ISO.isoheight - imageYoffset);
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
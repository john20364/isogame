function Sprite(position, img, imgidx, yoffset, isFloor) {
    this.position = position;
    this.twoD = isoTo2D(position);
    this.img = img;
    this.imgidx = imgidx;
    this.yoffset = yoffset;
    this.isFloor = isFloor;
    var sx = imgidx * ISO.isowidth;
    var sy = 0;
    var sw = ISO.isowidth;
    var sh = img.height;
    var dx = this.twoD.x - (ISO.isowidth >> 1);
    var dy = this.twoD.y - 
        (img.height - ISO.isoheight - yoffset);
    var dw = ISO.isowidth;
    var dh = img.height;
    
    this.render = function () {
        ISO.context.drawImage(
            this.img, sx, sy, sw, sh, dx, dy, dw, dh);
    }
}
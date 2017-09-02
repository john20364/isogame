function println(text) {
    document.write(text + "<br/>")
}

function Point (x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    
    this.copy = function () {
        return new Point(this.x, this.y, this.z);
    }
    
    this.multiply = function (factor) {
        this.x *= factor;
        this.y *= factor;
        this.z *= factor;
        return this;
    }

    this.divide = function (factor) {
        this.x /= factor;
        this.y /= factor;
        this.z /= factor;
        return this;
    }
}

function loadImages (arr, idx, cb) {
	if(arr === 'undefined') return;

    if (arr.length === idx) {
        if (cb) {
            cb();
        } else {
            return;
        }
    }
	
    if (arr.length > idx) {
        arr[idx].image = new Image();
        arr[idx].image.onload = function () {
            loadImages(arr, idx+1, cb);
        }
        arr[idx].image.src = arr[idx].filename;
    }
}

/*
**        38
**        /\
**   37 <    > 39
**        \/
**        40
*/
const LEFT_ARROW = 37;
const UP_ARROW = 38;
const RIGHT_ARROW = 39;
const DOWN_ARROW = 40;
const KEY_SPACE = 32;

function isoTo2D(point) {
    var result = new Point();
    result.x = (point.x - point.y) * ISO.isowidth / 2;
    result.y = (point.x + point.y) * ISO.isoheight / 2;
    result.z = point.z;
    return result;
}

function drawIso(point, type) {
    var fillcolor;
    switch (type) {
        case 0: // FLOOR
            fillcolor = "#cccccc";
            break;        
        case 1: // WALL
            fillcolor = "#ff0000";
            break;        
        case 9: // PLAYER
//            fillcolor = "#ff8844";
            fillcolor = "#4444ff";
            break;        
        case 255: // SPACE 
            fillcolor = "#444444";
        default: 
            fillcolor = "#444444";
    }
    
    ISO.context.strokeStyle = "#000000";
    ISO.context.lineWidth = 1;
    
    ISO.context.beginPath();
    ISO.context.moveTo(
        point.x, 
        point.y - point.z);
    ISO.context.lineTo(
        point.x + ISO.isowidth / 2, 
        point.y - point.z + ISO.isoheight / 2);
    ISO.context.lineTo(
        point.x, 
        point.y - point.z + ISO.isoheight);
    ISO.context.lineTo(
        point.x -ISO.isowidth / 2, 
        point.y - point.z + ISO.isoheight / 2);
    ISO.context.closePath();
    ISO.context.strokeStyle = fillcolor;
    ISO.context.fillStyle = fillcolor;
    ISO.context.fill();
    ISO.context.stroke();
}
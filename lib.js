function println(text) {
    document.write(text + "<br/>")
}

function createNS(ns) {
    var array = ns.split(".");

    // first create the root namespace object
    if (!window[array[0]]) {
        window[array[0]] = {};
    }

    var root = window[array[0]];
    array = array.slice(1);

    for (var i = 0; i < array.length; i++) {
        if (!root[array[i]]) {
            root[array[i]] = {};
        }
        root = root[array[i]];
    }

    return root;
}

function Point (x, y) {
    this.x = x || 0;
    this.y = y || 0;
    
    this.copy = function () {
        return new Point(this.x, this.y);
    }
    
    this.multiply = function (factor) {
        this.x *= factor;
        this.y *= factor;
        return this;
    }

    this.divide = function (factor) {
        this.x /= factor;
        this.y /= factor;
        return this;
    }
    
    this.set = function (point) {
        this.x = point.x;
        this.y = point.y;
        return this;
    }
}

function ImageObjectCollection() {
    var objects = [];
    
    this.addImageObject = function (obj) {
        objects.push(obj);
    }
    
    this.getById = function (id) {
        for (var i = 0; i < objects.length; i++) {
            if (objects[i].id === id) return objects[i];
        }
        return undefined;
    }
    
    this.toArray = function () {
        return objects;
    }
    
    this.clear = function () {
        objects = [];
    }
}

function getJSONData (filename, cb) {
    var hr = new XMLHttpRequest();
    hr.open("POST", "get_data.php", true);
    hr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    hr.onreadystatechange = function () {
        if (hr.readyState === 4 && hr.status === 200) {
            var result = JSON.parse(hr.responseText);
            if (cb) cb(result);
        }
    }
    // Add &-sign between multiple parameters
    hr.send("filename="+filename);
}

function createImages(collection, filename, cb) {
    function Imagedata () {
        this.id;
        this.filename;
        this.image;
        return this;
    }
    
    getJSONData(filename, function (data) {
        for (obj in data) {
            var imgobj = new Imagedata();
            imgobj.id = data[obj].id;
            imgobj.filename = data[obj].filename;
            imgobj.image = undefined;
            collection.addImageObject(imgobj);       
        }
        
        loadImages(collection.toArray(), 0, function () {
            if (cb) cb();
        })
    });
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
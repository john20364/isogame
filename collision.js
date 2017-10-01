function Collision () {
    function checkLeft(arr, p, e){
        var o = e.getPosition();
        if ((p.y >= o.y && p.y < o.y + 1) ||
            (p.y + 1 < o.y + 1 && p.y + 1 > o.y)) {
            if (p.x > o.x && p.x < o.x + 1) {
                arr.push(e);    
            }
        }
    } 

    function checkRight(arr, p, e){
        var o = e.getPosition();
        if ((p.y >= o.y && p.y < o.y + 1) ||
            (p.y + 1 < o.y + 1 && p.y + 1 > o.y)) {
            if (p.x + 1 > o.x && p.x + 1 < o.x + 1) {
                arr.push(e);    
            }
        }
    } 

    function checkTop(arr, p, e) {
        var o = e.getPosition();
        if ((p.x >= o.x && p.x < o.x + 1) ||
            (p.x + 1 < o.x + 1 && p.x + 1 > o.x)) {
            if (p.y > o.y && p.y < o.y + 1) {
                arr.push(e);    
            }
        }
    }

    function checkBottom(arr, p, e) {
        var o = e.getPosition();
        if ((p.x >= o.x && p.x < o.x + 1) ||
            (p.x + 1 < o.x + 1 && p.x + 1 > o.x)) {
            if (p.y + 1 > o.y && p.y + 1 < o.y + 1) {
                arr.push(e);    
            }
        }
    }

    this.checkCollision = function(entities, dir, entity) {
        var result = undefined;
        var hobjs = [];
        var vobjs = [];
        var p = entity.getPosition();
        var prev = entity.getPrevPosition();

        function walkEntities(entity, cb) {
            for (var i = 0; i < entities.length; i++) {
                if (entity !== entities[i]) {
                    cb (entities[i])
                }
            }
        }    

        walkEntities(entity, function (e) {
            if (dir.x === 1 && dir.y === 1) {
                var pos = new Point(p.x, prev.y);
                checkRight(hobjs, pos, e);
                pos = new Point(prev.x, p.y);
                checkBottom(vobjs, pos, e);
            } else if (dir.x === 1 && dir.y === -1) {
                var pos = new Point(p.x, prev.y);
                checkRight(hobjs, pos, e);
                pos = new Point(prev.x, p.y);
                checkTop(vobjs, pos, e);
            } else if (dir.x === -1 && dir.y === 1) {
                var pos = new Point(p.x, prev.y);
                checkLeft(hobjs, pos, e);
                pos = new Point(prev.x, p.y);
                checkBottom(vobjs, pos, e);
            } else if (dir.x === -1 && dir.y === -1) {
                var pos = new Point(p.x, prev.y);
                checkLeft(hobjs, pos, e);
                pos = new Point(prev.x, p.y);
                checkTop(vobjs, pos, e);
            } else if (dir.x === 1 && dir.y === 0) {
                checkRight(hobjs, p, e);
            } else if (dir.x === -1 && dir.y === 0) {
                checkLeft(hobjs, p, e);
            } else if (dir.x === 0 && dir.y === 1) {
                checkBottom(vobjs, p, e);
            } else if (dir.x === 0 && dir.y === -1) {
                checkTop(vobjs, p, e);
            }
        });

        // right - down
        if (dir.x === 1 && dir.y === 1) {
            if (hobjs.length !== 0) {
                entity.dirCorrection(hobjs[0]);
                result = hobjs[0];
                var o = hobjs[0].getPosition();
                p.x = o.x - 1;
            } 

            if (vobjs.length !== 0) {
                entity.dirCorrection(vobjs[0]);
                result = vobjs[0];
                var o = vobjs[0].getPosition();
                p.y = o.y - 1;
            }
        // right - up
        } else if (dir.x === 1 && dir.y === -1) {
            if (hobjs.length !== 0) {
                entity.dirCorrection(hobjs[0]);
                result = hobjs[0];
                var o = hobjs[0].getPosition();
                p.x = o.x - 1;
            }

            if (vobjs.length !== 0) {
                entity.dirCorrection(vobjs[0]);
                result = vobjs[0];
                var o = vobjs[0].getPosition();
                p.y = o.y + 1;
            }
        // left - down
        } else if (dir.x === -1 && dir.y === 1) {
            if (hobjs.length !== 0) {
                entity.dirCorrection(hobjs[0]);
                result = hobjs[0];
                var o = hobjs[0].getPosition();
                p.x = o.x + 1;
            }

            if (vobjs.length !== 0) {
                entity.dirCorrection(vobjs[0]);
                result = vobjs[0];
                var o = vobjs[0].getPosition();
                p.y = o.y - 1;
            }
        // left - up
        } else if (dir.x === -1 && dir.y === -1) {
            if (hobjs.length !== 0) {
                entity.dirCorrection(hobjs[0]);
                result = hobjs[0];
                var o = hobjs[0].getPosition();
                p.x = o.x + 1;
            }

            if (vobjs.length !== 0) {
                entity.dirCorrection(vobjs[0]);
                result = vobjs[0];
                var o = vobjs[0].getPosition();
                p.y = o.y + 1;
            }
        // right
        } else if (dir.x === 1 && dir.y === 0) {
            if (hobjs.length !== 0) {
                result = hobjs[0];
                var o = hobjs[0].getPosition();
                p.x = o.x - 1;
            }
        // left
        } else if (dir.x === -1 && dir.y === 0) {
            if (hobjs.length !== 0) {
                result = hobjs[0];
                var o = hobjs[0].getPosition();
                p.x = o.x + 1;
            }
        // down
        } else if (dir.x === 0 && dir.y === 1) {
            if (vobjs.length !== 0) {
                result = vobjs[0];
                var o = vobjs[0].getPosition();
                p.y = o.y - 1;
            }
        // up
        } else if (dir.x === 0 && dir.y === -1) {
            if (vobjs.length !== 0) {
                result = vobjs[0];
                var o = vobjs[0].getPosition();
                p.y = o.y + 1;
            }
        }
        return result;
    }
    
}
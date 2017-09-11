// TODO: .......................
function EntityFactory () {
    this.typeEnum = {"AUTOMATE":1,
                    "PLAYER":2,
                    "SOLID":3};
    
    this.createEntity = function (type, world, data) {
        var entity = undefined;
        switch (type) {
            case this.typeEnum.AUTOMATE:
                entity = new Automate();
                break;
            case this.typeEnum.PLAYER:
                entity = new Player();
                break;
            case this.typeEnum.SOLID:
                entity = new Solid();
                break;
        }
        if (entity) {
            entity.init(world, data);
        }
        // Add new functionality to entity object here !!
        return entity;
    }
}


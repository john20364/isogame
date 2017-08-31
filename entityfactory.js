function EntityFactory () {
    this.createEntity = function (world, pos, spritesheet, spriteindex) {
        var entity = new Player(world, pos, spritesheet, spriteindex);
        // Add new functionality to entity object here !!
        return entity;
    }
}


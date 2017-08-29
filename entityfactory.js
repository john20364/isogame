function EntityFactory () {
    this.createEntity = function (world, pos) {
        var entity = new Player(world, pos);
        // Add new functionality to entity object here !!
        return entity;
    }
}


var createWorld = (function (WorldBuilder, PlayerController, Camera, createDefaultViewPort, World) {
    "use strict";

    function createWorld(stage, screenWidth, screenHeight, tileHeight) {
        var players = {};
        var scenery = [];
        var balls = [];
        var worldBuilder = new WorldBuilder(stage, screenWidth, screenHeight, tileHeight, players, scenery, balls);
        var playerController = new PlayerController(worldBuilder);
        var camera = new Camera(createDefaultViewPort(screenWidth, screenHeight));
        return {
            world: new World(stage, players, scenery, balls, playerController, camera),
            worldBuilder: worldBuilder
        };
    }

    return createWorld;
})(WorldBuilder, PlayerController, Camera, createDefaultViewPort, World);
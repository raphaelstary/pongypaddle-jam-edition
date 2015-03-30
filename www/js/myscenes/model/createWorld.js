var createWorld = (function (WorldBuilder, PlayerController, Camera, createDefaultViewPort, World) {
    "use strict";

    function createWorld(stage, screenWidth, screenHeight, tileHeight, paddleHitFn, gameOverFn) {
        var players = {};
        var scenery = [];
        var balls = [];
        var obstacles = [];
        var worldBuilder = new WorldBuilder(stage, screenWidth, screenHeight, tileHeight, players, scenery, balls,
            obstacles);
        var playerController = new PlayerController(worldBuilder);
        var camera = new Camera(createDefaultViewPort(screenWidth, screenHeight));
        return {
            world: new World(stage, players, scenery, balls, playerController, camera, obstacles, paddleHitFn,
                gameOverFn),
            worldBuilder: worldBuilder
        };
    }

    return createWorld;
})(WorldBuilder, PlayerController, Camera, createDefaultViewPort, World);
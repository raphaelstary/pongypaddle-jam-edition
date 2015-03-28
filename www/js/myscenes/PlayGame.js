var PlayGame = (function (Event, createWorld, Object) {
    "use strict";

    function PlayGame(services) {
        this.stage = services.stage;
        this.events = services.events;
        this.sceneStorage = services.sceneStorage;
    }

    PlayGame.prototype.show = function (next) {
        var hasEnded = false;
        var self = this;

        var screenWidth = 384;
        var screenHeight = 640;
        var tileWidth = 10;

        var worldWrapper = createWorld(this.stage, screenWidth, screenHeight, tileWidth);
        var world = worldWrapper.world;
        var worldBuilder = worldWrapper.worldBuilder;

        worldBuilder.createDefaultWalls();
        worldBuilder.initDefaultPlayers();
        world.activePlayers = 1;
        world.activeBalls = 1;

        var keyBoardListener = this.events.subscribe(Event.KEY_BOARD, world.handleKeyBoard.bind(world));
        var movePlayerListener = this.events.subscribe(Event.TICK_MOVE, world.updatePlayerMovement.bind(world));
        var moveBallListener = this.events.subscribe(Event.TICK_MOVE, world.updateBallMovement.bind(world));
        var ballCollisionListener = this.events.subscribe(Event.TICK_COLLISION,
            world.checkBallCollision.bind(world));
        var wallsKill = false;
        var wallCollisionListener = wallsKill ?
            this.events.subscribe(Event.TICK_COLLISION, world.checkCollisionsWithWallsKillOn.bind(world)) :
            this.events.subscribe(Event.TICK_COLLISION, world.checkCollisions.bind(world));
        var cameraListener = this.events.subscribe(Event.TICK_CAMERA, world.updateCamera.bind(world));

        var gameStateListener = this.events.subscribe(Event.TICK_CAMERA, function () {
            if (world.activePlayers < 1 || world.activeBalls < 1) {
                if (hasEnded)
                    return;
                hasEnded = true;
                nextScene();
            }
        });

        function nextScene() {
            world.nuke();

            self.events.unsubscribe(gameStateListener);
            self.events.unsubscribe(keyBoardListener);
            self.events.unsubscribe(movePlayerListener);
            self.events.unsubscribe(moveBallListener);
            self.events.unsubscribe(ballCollisionListener);
            self.events.unsubscribe(wallCollisionListener);
            self.events.unsubscribe(cameraListener);

            next();
        }
    };

    return PlayGame;
})(Event, createWorld, Object);
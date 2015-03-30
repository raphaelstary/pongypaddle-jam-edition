var PlayGame = (function (Event, createWorld, Object, Math) {
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

        var worldWrapper = createWorld(this.stage, screenWidth, screenHeight, tileWidth, paddleHit, gameOver);
        var world = worldWrapper.world;
        var worldBuilder = worldWrapper.worldBuilder;

        worldBuilder.createDefaultWalls();
        worldBuilder.initDefaultPlayers();
        var scoreBoard = worldBuilder.createScoreBoard();
        world.activePlayers = 1;
        worldBuilder.createRandomBall();
        world.activeBalls++;

        var keyBoardListener = this.events.subscribe(Event.KEY_BOARD, world.handleKeyBoard.bind(world));
        var movePlayerListener = this.events.subscribe(Event.TICK_MOVE, world.updatePlayerMovement.bind(world));
        var moveBallListener = this.events.subscribe(Event.TICK_MOVE, world.updateBallMovement.bind(world));
        var ballCollisionListener = this.events.subscribe(Event.TICK_COLLISION, world.checkBallPaddleCollision.bind(world));
        var wallCollisionListener = this.events.subscribe(Event.TICK_COLLISION, world.checkCollisions.bind(world));
        var cameraListener = this.events.subscribe(Event.TICK_CAMERA, world.updateCamera.bind(world));

        function gameOver() {
            if (hasEnded)
                return;
            hasEnded = true;
            nextScene();
        }

        var score = 9;

        function paddleHit() {
            score++;
            scoreBoard.data.msg = score.toString();
            if (score % 10 == 0) {
                worldBuilder.createRandomBall();
            }
        }

        function nextScene() {
            world.nuke();
            self.stage.remove(scoreBoard);
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
})(Event, createWorld, Object, Math);
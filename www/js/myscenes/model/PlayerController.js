var PlayerController = (function (Math, Entity, Vectors) {
    "use strict";

    function PlayerController(worldBuilder) {
        this.worldBuilder = worldBuilder;
    }

    PlayerController.prototype.jumpLeft = function (player) {
        player.forceX -= 5;
        player.forceY -= 15;
    };

    PlayerController.prototype.jumpRight = function (player) {
        player.forceX += 5;
        player.forceY -= 15;
    };

    PlayerController.prototype.createBall = function (point, direction) {
        this.worldBuilder.createBall(point, direction);
    };

    return PlayerController;
})(Math, Entity, Vectors);
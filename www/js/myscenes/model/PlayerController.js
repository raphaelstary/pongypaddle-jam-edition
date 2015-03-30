var PlayerController = (function (Math, Entity, Vectors) {
    "use strict";

    function PlayerController(worldBuilder) {
        this.worldBuilder = worldBuilder;
    }

    PlayerController.prototype.jumpLeft = function (player) {
        if (player.forceX > -15)
            player.forceX -= 15;
        if (player.forceY > -20)
            player.forceY -= 20;
    };

    PlayerController.prototype.jumpRight = function (player) {
        if (player.forceX < 15)
            player.forceX += 15;
        if (player.forceY > -20)
            player.forceY -= 20;
    };

    PlayerController.prototype.createNewBall = function () {
        this.worldBuilder.createRandomBall();
    };

    return PlayerController;
})(Math, Entity, Vectors);
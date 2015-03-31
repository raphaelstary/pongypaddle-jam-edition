var PlayerController = (function (Math, Entity, Vectors) {
    "use strict";

    function PlayerController(worldBuilder) {
        this.worldBuilder = worldBuilder;
    }
    var forceX = 15;
    var forceY = 20;
    PlayerController.prototype.jumpLeft = function (player) {
        if (player.forceX > -forceX)
            player.forceX -= forceX;
        if (player.forceY > -forceY)
            player.forceY -= forceY;
    };

    PlayerController.prototype.jumpRight = function (player) {
        if (player.forceX < forceX)
            player.forceX += forceX;
        if (player.forceY > -forceY)
            player.forceY -= forceY;
    };

    PlayerController.prototype.createNewBall = function () {
        this.worldBuilder.createRandomBall();
    };

    return PlayerController;
})(Math, Entity, Vectors);
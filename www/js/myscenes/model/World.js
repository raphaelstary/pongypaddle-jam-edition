var World = (function (Math, Object, Vectors, Key) {
    "use strict";

    function World(stage, players, scenery, balls, playerController, camera) {
        this.stage = stage;

        this.scenery = scenery;
        this.players = players;
        this.balls = balls;

        this.activePlayers = 0;
        this.activeBalls = 0;

        this.playerController = playerController;

        this.camera = camera;

        this.gravity = 5;

        this.suicides = {};
    }

    World.prototype.handleKeyBoard = function (keyBoard) {
        if (keyBoard[Key.DOWN]) {
            this.playerController.createBall({
                x: 50,
                y: 50
            }, {
                x: 2,
                y: 2
            });
        } else if (keyBoard[Key.LEFT]) {
            this.playerController.jumpLeft(this.players[0].entity);
        } else if (keyBoard[Key.RIGHT]) {
            this.playerController.jumpRight(this.players[0].entity);
        }
    };

    World.prototype.updatePlayerMovement = function () {
        Object.keys(this.players).forEach(function (playerKey) {
            var bufferedControls = this.players[playerKey].controls;
            bufferedControls.forEach(function (fn) {
                fn();
            });

            var player = this.players[playerKey].entity;

            var forceX = 0;
            var forceY = 0;

            // current - river upstream
            forceY += this.gravity;

            var airResistance = 0.9;
            player.forceX *= airResistance;
            player.forceY *= airResistance;

            forceX += player.forceX;
            forceY += player.forceY;

            player.lastX = player.x;
            player.lastY = player.y;

            player.x += Math.round(forceX);
            player.y += Math.round(forceY);

        }, this);
    };

    World.prototype.updateBallMovement = function () {
        this.balls.forEach(function (ball) {
            var forceX = 0;
            var forceY = 0;

            forceX += ball.forceX;
            forceY += ball.forceY;

            ball.lastX = ball.x;
            ball.lastY = ball.y;

            ball.x += Math.round(forceX);
            ball.y += Math.round(forceY);
        }, this);
    };

    World.prototype.updateCamera = function () {
        this.scenery.forEach(function (obj) {
            this.camera.calcScreenPosition(obj);
        }, this);
        this.balls.forEach(function (ball) {
            this.camera.calcScreenPosition(ball);
        }, this);
        Object.keys(this.players).forEach(function (playerKey) {
            var player = this.players[playerKey].entity;

            this.camera.calcScreenPosition(player);
        }, this);
    };

    World.prototype.checkBallCollision = function () {
        this.balls.forEach(function (ball, index, ballArray) {
            var ballWidthHalf = ball.collision.getWidthHalf();
            var ballHeightHalf = ball.collision.getHeightHalf();

            Object.keys(this.players).forEach(function (playerKey) {
                var player = this.players[playerKey].entity;
                var widthHalf = player.collision.getWidthHalf();
                var heightHalf = player.collision.getHeightHalf();

                if (player.x + widthHalf > ball.x - ballWidthHalf && player.x - widthHalf < ball.x + ballWidthHalf &&
                    player.y + heightHalf > ball.y - ballHeightHalf &&
                    player.y - heightHalf < ball.y + ballHeightHalf) {

                    // play paddle
                    var b4_y = ball.y + ballHeightHalf;
                    var b1_y = ball.y - ballHeightHalf;
                    var b4_x = ball.x - ballWidthHalf;
                    var b1_x = b4_x;
                    var b2_x = ball.x + ballWidthHalf;
                    var b3_x = b2_x;
                    var b2_y = b1_y;
                    var b3_y = b4_y;

                    var p;

                    // Now compare them to know the side of collision
                    //if (player.lastX + widthHalf <= ball.x - ballWidthHalf &&
                    //    player.x + widthHalf > ball.x - ballWidthHalf) {
                    //
                    //    // Collision on right side of player
                    //    p = Vectors.getIntersectionPoint(ball.lastX - ballWidthHalf, ball.lastY, ball.x - ballWidthHalf,
                    //        ball.y, b2_x, b2_y, b3_x, b3_y);
                    //    ball.x = p.x + ballWidthHalf;
                    //
                    //    ball.forceX *= -1;
                    //
                    //} else if (player.lastX - widthHalf >= ball.x + ballWidthHalf &&
                    //    player.x - widthHalf < ball.x + ballWidthHalf) {
                    //
                    //    // Collision on left side of player
                    //    p = Vectors.getIntersectionPoint(ball.lastX + ballWidthHalf, ball.lastY, ball.x + ballWidthHalf,
                    //        ball.y, b1_x, b1_y, b4_x, b4_y);
                    //    ball.x = p.x - ballWidthHalf;
                    //
                    //
                    //
                    //    ball.forceX *= -1;
                    //
                    //} else
                    if (player.lastY + heightHalf <= ball.y - ballHeightHalf &&
                        player.y + heightHalf > ball.y - ballHeightHalf) {

                        ball.forceY *= -1;

                        // Collision on bottom side of player
                        p = Vectors.getIntersectionPoint(ball.lastX, ball.lastY - ballHeightHalf, ball.x,
                            ball.y - ballHeightHalf, b3_x, b3_y, b4_x, b4_y);
                        ball.y = p.y + ballHeightHalf;

                    } else {

                        ball.forceY *= -1;
                        //if (ball.x < player.x - this.tileHeight) {
                        //    if (ball.lastX < ball.x) {
                        //        ball.forceX *= 1.5;
                        //    } else {
                        //        ball.forceX *= 0.5;
                        //    }
                        //} else if (ball.x > player.x + this.tileHeight) {
                        //    if (ball.lastX > ball.x) {
                        //        ball.forceX *= 1.5;
                        //    } else {
                        //        ball.forceX *= 0.5;
                        //    }
                        //} else {
                        //    if (ball.forceX > 5) {
                        //        ball.forceX *= 0.5;
                        //    }
                        //}

                        // Collision on top side of player
                        p = Vectors.getIntersectionPoint(ball.lastX, ball.lastY + ballHeightHalf, ball.x,
                            ball.y + ballHeightHalf, b1_x, b1_y, b2_x, b2_y);
                        ball.y = p.y - ballHeightHalf;

                    }

                }
            }, this);
        }, this);
    };

    World.prototype.checkCollisionsWithWallsKillOn = function () {
        this.scenery.forEach(function (element) {
            this.balls.forEach(function (ball, index, ballsArray) {
                var widthHalf = ball.collision.getWidthHalf();
                var heightHalf = ball.collision.getHeightHalf();
                if (ball.x + widthHalf > element.getCornerX() && ball.x - widthHalf < element.getEndX() &&
                    ball.y + heightHalf > element.getCornerY() && ball.y - heightHalf < element.getEndY()) {

                    if (element.collision.getWidth() > element.collision.getHeight()) {
                        ball.forceY *= -1;
                    } else {
                        ball.forceX *= -1;
                    }
                }
            }, this);

            Object.keys(this.players).forEach(function (playerKey) {
                var player = this.players[playerKey].entity;

                var widthHalf = player.collision.getWidthHalf();
                var heightHalf = player.collision.getHeightHalf();
                if (player.x + widthHalf > element.getCornerX() && player.x - widthHalf < element.getEndX() &&
                    player.y + heightHalf > element.getCornerY() && player.y - heightHalf < element.getEndY()) {

                    this.killPaddle(player, playerKey);
                    this.suicides[playerKey] = true;
                }
            }, this);
        }, this);
    };

    World.prototype.checkCollisions = function () {
        this.scenery.forEach(function (element) {
            this.balls.forEach(function (ball, index, ballsArray) {
                var widthHalf = ball.collision.getWidthHalf();
                var heightHalf = ball.collision.getHeightHalf();
                if (ball.x + widthHalf > element.getCornerX() && ball.x - widthHalf < element.getEndX() &&
                    ball.y + heightHalf > element.getCornerY() && ball.y - heightHalf < element.getEndY()) {

                    if (element.collision.getWidth() > element.collision.getHeight()) {
                        ball.forceY *= -1;
                    } else {
                        ball.forceX *= -1;
                    }
                }
            }, this);

            Object.keys(this.players).forEach(function (playerKey) {
                var player = this.players[playerKey].entity;

                var widthHalf = player.collision.getWidthHalf();
                var heightHalf = player.collision.getHeightHalf();
                if (player.x + widthHalf > element.getCornerX() && player.x - widthHalf < element.getEndX() &&
                    player.y + heightHalf > element.getCornerY() && player.y - heightHalf < element.getEndY()) {

                    var elemHeightHalf = element.collision.getHeightHalf();
                    var elemWidthHalf = element.collision.getWidthHalf();
                    var b4_y = element.y + elemHeightHalf;
                    var b1_y = element.y - elemHeightHalf;
                    var b4_x = element.x - elemWidthHalf;
                    var b1_x = b4_x;
                    var b2_x = element.x + elemWidthHalf;
                    var b3_x = b2_x;
                    var b2_y = b1_y;
                    var b3_y = b4_y;

                    var p;

                    // Now compare them to know the side of collision
                    if (player.lastX + widthHalf <= element.x - elemWidthHalf &&
                        player.x + widthHalf > element.x - elemWidthHalf) {

                        // Collision on right side of player
                        p = Vectors.getIntersectionPoint(player.lastX + widthHalf, player.lastY,
                            player.x + widthHalf, player.y, b1_x, b1_y, b4_x, b4_y);
                        player.x = p.x - widthHalf;
                        player.forceX = 0;

                    } else if (player.lastX - widthHalf >= element.x + elemWidthHalf &&
                        player.x - widthHalf < element.x + elemWidthHalf) {

                        // Collision on left side of player
                        p = Vectors.getIntersectionPoint(player.lastX - widthHalf, player.lastY,
                            player.x - widthHalf, player.y, b2_x, b2_y, b3_x, b3_y);
                        player.x = p.x + widthHalf;
                        player.forceX = 0;
                    } else if (player.lastY + heightHalf <= element.y - elemHeightHalf &&
                        player.y + heightHalf > element.y - elemHeightHalf) {

                        // Collision on bottom side of player
                        p = Vectors.getIntersectionPoint(player.lastX, player.lastY + heightHalf, player.x,
                            player.y + heightHalf, b1_x, b1_y, b2_x, b2_y);
                        player.y = p.y - heightHalf;
                        player.forceY = 0;
                    } else {
                        // Collision on top side of player
                        p = Vectors.getIntersectionPoint(player.lastX, player.lastY - heightHalf, player.x,
                            player.y - heightHalf, b3_x, b3_y, b4_x, b4_y);
                        player.y = p.y + heightHalf;
                        player.forceY = 0;
                    }
                }
            }, this);
        }, this);
    };

    World.prototype.removeBall = function (ball, index, ballArray) {
        this.activeBalls--;
        this.stage.remove(ball.collision);
        this.stage.remove(ball.sprite);
        ballArray.splice(index, 1);
    };

    World.prototype.killPaddle = function (player, key) {
        this.activePlayers--;
        //self.stage.remove(player.collision);
        delete this.players[key];

        player.sprite.alpha = 0.2;
    };

    World.prototype.nuke = function () {
        var self = this;

        function remove(entity) {
            self.stage.remove(entity.collision);
            self.stage.remove(entity.sprite);
        }

        Object.keys(this.players).forEach(function (playerKey) {
            var player = this.players[playerKey].entity;

            remove(player);
        }, this);
        this.scenery.forEach(remove);
        this.balls.forEach(remove);
    };

    return World;
})(Math, Object, Vectors, Key);
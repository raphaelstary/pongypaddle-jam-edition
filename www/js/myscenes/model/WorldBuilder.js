var WorldBuilder = (function (Entity, Vectors, range) {
    "use strict";

    function WorldBuilder(stage, screenWidth, screenHeight, tileHeight, players, scenery, balls, obstacles) {
        this.stage = stage;
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.tileHeight = tileHeight;

        this.players = players;
        this.scenery = scenery;
        this.balls = balls;
        this.obstacles = obstacles;
    }

    WorldBuilder.prototype.createDefaultWalls = function () {
        var wallLeft = this.stage.drawRectangle(this.tileHeight / 2, this.screenHeight / 2, this.tileHeight,
            this.screenHeight, 'white', true);
        var wallRight = this.stage.drawRectangle(this.screenWidth - this.tileHeight / 2, this.screenHeight / 2,
            this.tileHeight, this.screenHeight, 'white', true);
        var wallTop = this.stage.drawRectangle(this.screenWidth / 2, this.tileHeight / 2, this.screenWidth,
            this.tileHeight, 'white', true);

        var wallBottom = this.stage.drawRectangle(this.screenWidth / 2, this.screenHeight - this.tileHeight / 2,
            this.screenWidth, this.tileHeight, 'white', false);

        this.scenery.push(createEntity(wallTop), createEntity(wallLeft), createEntity(wallRight));
        this.obstacles.push(createEntity(wallBottom))
    };

    WorldBuilder.prototype.createScoreBoard = function () {
        return this.stage.drawText(this.screenWidth / 2 + 20, this.screenHeight / 2 + 20, '0', this.screenHeight / 2,
            'gamefont', 'white', 0, undefined, 0.3);
    };

    function createEntity(drawable) {
        return new Entity(drawable.x, drawable.y, 0, drawable, drawable);
    }

    WorldBuilder.prototype.initDefaultPlayers = function () {

        [0].forEach(function (num) {
            this.players[num] = {
                entity: this.createPlayerEntity({
                    x: this.screenWidth / 2,
                    y: this.screenHeight / 6 * 5
                }, num),
                controls: [],
                jumpPressed: false
            };
        }, this);
    };

    var startRotation = 0;

    WorldBuilder.prototype.createPlayerEntity = function (startPosition, id, color) {
        var sprite;
        if (color) {
            sprite = this.stage.drawRectangle(startPosition.x, startPosition.y, this.tileHeight * 12,
                this.tileHeight * 2, color, true);
        } else {
            sprite = this.stage.drawRectangle(startPosition.x, startPosition.y, this.tileHeight * 12,
                this.tileHeight * 2, 'white', true);
        }
        var entity = new Entity(startPosition.x, startPosition.y, startRotation, sprite, sprite);
        entity.id = id;
        entity.debug = true;
        return entity;
    };

    var magnitude = 8;
    WorldBuilder.prototype.createStartBall = function () {
        var randomDegrees = range(50, 60);
        var angle = Vectors.toRadians(randomDegrees);
        this.createBall({
            x: 150,
            y: 50
        }, {
            x: Vectors.getX(0, magnitude, angle),
            y: Vectors.getY(0, magnitude, angle)
        });
    };

    WorldBuilder.prototype.create2ndBall = function () {
        var randomDegrees = range(0, 1) ? range(260, 265) : range(275, 280);
        var angle = Vectors.toRadians(randomDegrees);
        this.createBall({
            x: 150,
            y: 50
        }, {
            x: Vectors.getX(0, magnitude, angle),
            y: Vectors.getY(0, magnitude, angle)
        });
    };

    WorldBuilder.prototype.createRandomBall = function () {
        if (this.balls.length == 0) {
            this.createStartBall();
            return;
        }
        if (this.balls.length == 1) {
            this.create2ndBall();
            return;
        }

        var randomDegrees = range(0, 1) ? range(15, 80) : range(100, 165);
        var angle = Vectors.toRadians(randomDegrees);
        this.createBall({
            x: 150,
            y: 50
        }, {
            x: Vectors.getX(0, magnitude, angle),
            y: Vectors.getY(0, magnitude, angle)
        });
    };

    WorldBuilder.prototype.createBall = function (point, direction) {
        var ballDrawable = this.stage.drawRectangle(point.x, point.y, this.tileHeight, this.tileHeight, 'white', true);
        var ball = new Entity(ballDrawable.x, ballDrawable.y, 0, ballDrawable, ballDrawable);
        this.balls.push(ball);

        ball.forceX = direction.x;
        ball.forceY = direction.y;
    };

    return WorldBuilder;
})(Entity, Vectors, range);
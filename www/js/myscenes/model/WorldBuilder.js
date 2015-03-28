var WorldBuilder = (function (Entity) {
    "use strict";

    function WorldBuilder(stage, screenWidth, screenHeight, tileHeight, players, scenery, balls) {
        this.stage = stage;
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.tileHeight = tileHeight;

        this.players = players;
        this.scenery = scenery;
        this.balls = balls;
    }

    WorldBuilder.prototype.createDefaultWalls = function () {
        var wallLeft = this.stage.drawRectangle(this.tileHeight/2, this.screenHeight / 2, this.tileHeight*2,
            this.screenHeight, 'white', true);
        var wallRight = this.stage.drawRectangle(this.screenWidth - this.tileHeight/2, this.screenHeight / 2,
            this.tileHeight*2, this.screenHeight, 'white', true);
        var wallTop = this.stage.drawRectangle(this.screenWidth / 2, this.tileHeight/2, this.screenWidth,
            this.tileHeight*2, 'white', true);
        var wallBottom = this.stage.drawRectangle(this.screenWidth / 2, this.screenHeight - this.tileHeight/2,
            this.screenWidth, this.tileHeight*2, 'white', true);

        this.scenery.push(createEntity(wallTop), createEntity(wallBottom), createEntity(wallLeft),
            createEntity(wallRight));
    };

    function createEntity(drawable) {
        return new Entity(drawable.x, drawable.y, 0, drawable, drawable);
    }

    WorldBuilder.prototype.initDefaultPlayers = function () {

        [0].forEach(function (num) {
            this.players[num] = {
                entity: this.createPlayerEntity({x:this.screenWidth/2,y:this.screenHeight/2}, num),
                controls: [],
                jumpPressed: false
            };
        }, this);
    };

    var startRotation = 0;

    WorldBuilder.prototype.createPlayerEntity = function (startPosition, id, color) {
        var sprite;
        if (color) {
            sprite = this.stage.drawRectangle(startPosition.x, startPosition.y, this.tileHeight * 10, this.tileHeight * 2,
                color, true);
        } else {
            sprite = this.stage.drawRectangle(startPosition.x, startPosition.y, this.tileHeight * 10, this.tileHeight * 2,
                'white');
        }
        var entity = new Entity(startPosition.x, startPosition.y, startRotation, sprite, sprite);
        entity.id = id;
        return entity;
    };

    WorldBuilder.prototype.createBall = function (point, direction) {
        var ballDrawable = this.stage.drawRectangle(point.x, point.y, this.tileHeight, this.tileHeight, 'white', true);
        var ball = new Entity(ballDrawable.x, ballDrawable.y, 0, ballDrawable, ballDrawable);
        this.balls.push(ball);

        ball.forceX = direction.x;
        ball.forceY = direction.y;
    };

    return WorldBuilder;
})(Entity);
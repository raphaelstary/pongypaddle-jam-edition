var GameLoop = (function (requestAnimationFrame, Event) {
    "use strict";

    // callback from animationFrame infrastructure. tick list of given periodic handlers
    function GameLoop(events) {
        this.events = events;

        this.isMove = true;
        this.isCollision = true;
    }

    GameLoop.prototype.run = function () {
        requestAnimationFrame(this.run.bind(this));

        this.events.syncFire(Event.TICK_START);

        // input phase
        this.events.syncFire(Event.TICK_INPUT);

        // move phase
        if (this.isMove)
            this.events.syncFire(Event.TICK_MOVE);

        // collision phase
        if (this.isCollision)
            this.events.syncFire(Event.TICK_COLLISION);

        // draw phase
        this.events.syncFire(Event.TICK_DRAW);

        this.events.syncFire(Event.TICK_END);
    };

    GameLoop.prototype.disableMove = function () {
        this.isMove = false;
    };

    GameLoop.prototype.enableMove = function () {
        this.isMove = true;
    };

    GameLoop.prototype.disableCollision = function () {
        this.isCollision = false;
    };

    GameLoop.prototype.enableCollision = function () {
        this.isCollision = true;
    };

    return GameLoop;
})(requestAnimFrame, Event);
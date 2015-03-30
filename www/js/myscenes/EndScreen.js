var EndScreen = (function (Event, Key) {
    "use strict";

    function EndScreen(services) {
        this.stage = services.stage;
        this.events = services.events;
        this.timer = services.timer;
        this.sceneStorage = services.sceneStorage;
    }

    EndScreen.prototype.show = function (next) {
        var screenWidth = 384;
        var screenHeight = 640;
        var tileWidth = 10;
        var hasEnded = false;

        var aBtnListener = this.events.subscribe(Event.KEY_BOARD, function (keyBoard) {
            if (!hasEnded && (keyBoard[Key.ENTER])) {
                hasEnded = true;
                endScene();
            }
        });

        var myName = this.stage.drawText(screenWidth / 2, screenHeight / 6, this.sceneStorage.points.toString(),
            tileWidth * 4, 'gamefont', 'white');

        var presents = this.stage.drawText(screenWidth / 2, screenHeight / 6 * 1.5, 'points', tileWidth*2, 'gamefont',
            'white');
        var gameName = this.stage.drawText(screenWidth / 2, screenHeight / 5 * 2, 'PONGY PADDLE', tileWidth * 3.5,
            'gamefont', 'white');

        var gameJamEdition = this.stage.drawText(screenWidth / 2, screenHeight / 2, "game jam edition", tileWidth * 2,
            'gamefont', 'grey');

        var left = this.stage.drawText(screenWidth / 2, screenHeight / 6 * 4, "'<-' (left arrow key) - jump left",
            tileWidth, 'gamefont', 'darkgrey');
        var right = this.stage.drawText(screenWidth / 2, screenHeight / 6 * 4.3, "'->' (right arrow key) - jump right",
            tileWidth, 'gamefont', 'darkgrey');
        var gameControls = this.stage.drawText(screenWidth / 2, screenHeight / 6 * 5, "press 'ENTER' to play again",
            tileWidth * 2, 'gamefont', 'white');

        var self = this;

        function endScene() {
            self.stage.remove(left);
            self.stage.remove(right);
            self.stage.remove(myName);
            self.stage.remove(presents);
            self.stage.remove(gameName);
            self.stage.remove(gameJamEdition);
            self.stage.remove(gameControls);
            self.events.unsubscribe(aBtnListener);
            self.timer.doLater(next, 6);
        }
    };

    return EndScreen;
})(Event, Key);
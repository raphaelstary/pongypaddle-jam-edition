var SplashScreen = (function (Event, Key) {
    "use strict";

    function SplashScreen(services) {
        this.stage = services.stage;
        this.events = services.events;
        this.timer = services.timer;
    }

    SplashScreen.prototype.show = function (next) {
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

        var myName = this.stage.drawText(screenWidth / 2, screenHeight / 6, 'Raphael Stary', tileWidth * 3, 'Arial', 'white');

        var presents = this.stage.drawText(screenWidth / 2, screenHeight / 6 * 1.5, 'presents', tileWidth * 2, 'Arial', 'white');
        var gameName = this.stage.drawText(screenWidth / 2, screenHeight / 5*2, 'PONGY PADDLE', tileWidth * 4,
            'Arial', 'white');

        var gameJamEdition = this.stage.drawText(screenWidth / 2, screenHeight / 2, "game jam edition", tileWidth * 2,
            'Arial', 'grey');

        var gameControls = this.stage.drawText(screenWidth / 2, screenHeight / 4 * 3, "press 'ENTER' to continue", tileWidth * 2,
            'Arial', 'white');

        var self = this;

        function endScene() {
            self.stage.remove(myName);
            self.stage.remove(presents);
            self.stage.remove(gameName);
            self.stage.remove(gameJamEdition);
            self.stage.remove(gameControls);
            self.events.unsubscribe(aBtnListener);
            self.timer.doLater(next, 6);
        }
    };

    return SplashScreen;
})(Event, Key);
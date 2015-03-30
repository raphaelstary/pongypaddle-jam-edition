var installMyScenes = (function (SceneManager) {
    "use strict";

    function installMyScenes(sceneServices) {
        // create your scenes and add them to the scene manager

        var sceneManager = new SceneManager();
        var startScreen = new SplashScreen(sceneServices);
        var gameScreen = new PlayGame(sceneServices);
        var endScreen = new EndScreen(sceneServices);
        sceneManager.add(startScreen.show.bind(startScreen), true);
        sceneManager.add(gameScreen.show.bind(gameScreen));
        sceneManager.add(endScreen.show.bind(endScreen));

        return sceneManager;
    }

    return installMyScenes;
})(SceneManager);
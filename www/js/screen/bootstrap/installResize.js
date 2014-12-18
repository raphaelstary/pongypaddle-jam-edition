var installResize = (function (window, ResizeHandler, Event) {
    "use strict";

    function installResize(events, device) {
        var resizeHandler = new ResizeHandler(events);
        window.addEventListener('resize', resizeHandler.handleResize.bind(resizeHandler));
        events.subscribe(Event.RESIZE, function (event) {
            device.width = event.width;
            device.height = event.height;
            device.cssWidth = event.cssWidth;
            device.cssHeight = event.cssHeight;
            device.devicePixelRatio = event.devicePixelRatio;
        });
    }

    return installResize;
})(window, ResizeHandler, Event);
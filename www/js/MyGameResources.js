var MyGameResources = (function (URL, addFontToDOM) {
    "use strict";

    // your files
    var font;

    function registerFiles(resourceLoader) {
        // add your files to the resource loader for downloading
        font = resourceLoader.addFont('data/FFFFORWA.woff'); //the cool px font
        return 1; // number of registered files
    }

    function processFiles() {
        // process your downloaded files
        if (URL) {
            addFontToDOM([
                {
                    name: 'gamefont',
                    url: URL.createObjectURL(font.blob)
                }
            ]);
        }

        return {
            // services created with downloaded files
        };
    }

    return {
        create: registerFiles,
        process: processFiles
    };
})(window.URL || window.webkitURL, addFontToDOM);
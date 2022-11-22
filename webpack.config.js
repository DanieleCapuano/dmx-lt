const webpack = require('webpack');

module.exports = [{
    target: 'node',
    entry: './src/index.js',
    mode: "development",
    plugins: [
        // This is the important part for dmx to work
        new webpack.ExternalsPlugin('commonjs', [
            'enttec-open-dmx-usb' 
        ]) 
    ],
}, {
    target: 'node',
    entry: './src/process_manager.js',
    mode: "development",
    output: {
        filename: "light_process_main.js"
    }
}];
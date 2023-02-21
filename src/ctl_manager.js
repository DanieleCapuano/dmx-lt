// import DMXController from './DMXController';
import { openDMX } from './openDMX';


export const init = _init;
export const setColor = _setColor;

let ctl = null;
const config = {
    color: { r: 255, g: 0, b: 0 },
    startChannel: 1,
    intensity: 0,
    controller: null,
    DEBUG: false
};

function _init(isDebug) {
    config.DEBUG = isDebug || false;
    // ctl = new DMXController();
    return new Promise(res => {
        openDMX.init(config.DEBUG).then(dev => {
            ctl = dev;
            res(ctl);
        });
    });
}

function _setColor(colors_array) {
    if (!ctl) return new Promise((res, rej) => rej());
    if (!Array.isArray(colors_array)) colors_array = [colors_array];

    colors_array.forEach(color_def => {
        let color = color_def.color;
        openDMX.setColor(
            color_def.startChannel || config.startChannel, 
            color.r, color.g, color.b, 
            color_def.time, 
            color_def.easingFn
        );
    });
}
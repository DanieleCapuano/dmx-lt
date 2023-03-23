//const openDMX = require("enttec-open-dmx-usb");   //use this to have back the "official" behavior
const openDMX = require("./enttec-open-dmx-usb-buffered");
const process = require('node:process');
const animateObj = require('./animate');

///////////////////////////////////////////////////////////////////
let rgb = {
    1: {
        1: 0,
        2: 0,
        3: 0
    }
};
let dmxDevice = null,
    animationPromises = [];

let DEBUG = false;
let config = {};

///////////////////////////////////////////////////////////////////

const init = (cfg) => {
    config = cfg;
    DEBUG = config.DEBUG || false;
    const DMXDevice = openDMX.EnttecOpenDMXUSBDevice;
    return new Promise((res) => {
        if (!DEBUG) {
            DMXDevice.getFirstAvailableDevice().then(dev => {
                dmxDevice = new DMXDevice(dev);

                // console.info("DEVICE", device);
                dmxDevice.setChannels(rgb);
                process.on('beforeExit', () => {
                    console.log('Cleaning up lights to rgb 0');
                    dmxDevice.setChannels({ 1: 0, 2: 0, 3: 0 });
                });
                // _demo();

                res(dmxDevice);
            });
        }
        else {
            dmxDevice = {
                setChannels: () => { }
            }
            res(dmxDevice);
        }

        // _animate_debug(res);
    });
}

const setColor = (startChannel, r, g, b, time, easing) => {
    startChannel = startChannel || 1;
    rgb[startChannel] = rgb[startChannel] || _init_rgb_obj(startChannel, 0, 0, 0);
    if (animationPromises[startChannel]) {
        if (DEBUG) console.warn("Forcing the current animation to be stopped!");
        animateObj.stopAnimation(startChannel);
        animationPromises[startChannel] = null;
    }

    if (DEBUG) console.info("Setting color to", startChannel, r, g, b, time, easing);
    let _requested_rgb_obj = _init_rgb_obj(startChannel, r, g, b);
    if (!time) {
        rgb[startChannel] = _requested_rgb_obj;
        dmxDevice.setChannels(rgb[startChannel]);
    }
    else {
        animationPromises[startChannel] = animateObj.animate(
            startChannel,
            rgb[startChannel], _requested_rgb_obj, time, easing,
            (rgb_update_val) => {
                rgb[startChannel] = rgb_update_val;
                dmxDevice.setChannels(rgb[startChannel]);
            }
        ).then(() => {
            animationPromises[startChannel] = null;
        });
    }
};

function _init_rgb_obj(startChannel, r, g, b) {
    let o = {};
    let nchannels = config.light_channels_n || 3,
        cols = [r, g, b].map(n => Math.max(0, Math.min(255, n)));
    for (let i = 0; i < nchannels; i++) {
        o[startChannel + i] = cols[i] || 0;
    }

    return o;
}

const _demo = () => {
    function _get_rgb(n) {
        let itv = setInterval(() => {
            Object.keys(rgb).forEach(cs => {
                let c = parseInt(cs);
                if (c !== n && rgb[c] > 0) rgb[c]--;
                else if (c === n) {
                    if (rgb[c] < 255) rgb[c]++;
                    else {
                        clearInterval(itv);
                        n++;
                        if (n === 4) n = 1;
                        return _get_rgb(n);
                    }
                }
            });
            console.info("CHANNELS", n, rgb);
            dmxDevice.setChannels(rgb);
        }, 20);
    }
    _get_rgb(1);
}

function _animate_debug(res) {
    animate(rgb, _init_rgb_obj(1, 255, 0, 0), 200, 'linear', (val) => {
        console.info("UPDATE VAL", val)
    }).then(() => {
        res && res({
            setChannels: () => { }
        });
    });
}

module.exports.openDMX = {
    init,
    setColor
};
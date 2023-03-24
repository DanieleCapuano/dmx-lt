//const openDMX = require("enttec-open-dmx-usb");   //use this to have back the "official" behavior
const openDMX = require("./enttec-open-dmx-usb-buffered");
const process = require('node:process');
const animateObj = require('./animate');

///////////////////////////////////////////////////////////////////
let rgb = {

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
                dmxDevice = new DMXDevice(dev, config);
                clearColors(config);

                process.on('beforeExit', () => {
                    console.log('Cleaning up lights to rgb 0');
                    clearColors(config);
                });

                res(dmxDevice);
            });
        }
        else {
            dmxDevice = {
                setChannels: () => { }
            }
            res(dmxDevice);
        }
    });
}

const clearColors = (config) => {
    const { light_addresses } = config;
    light_addresses.forEach(startChannel => {
        dmxDevice.setChannels(_init_rgb_obj(startChannel, 0, 0, 0));
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

/*
    the config might contain a detailed object with configuration for each address shaped as follows:
    {
        "address_opts": {
            "1": {
                "red_offset": 1,
                "fixed_values": [{
                    "offset": 0,
                    "value": 255
                }, {
                    "offset": 4,
                    "value": 0
                }, {
                    "offset": 5,
                    "value": 0
                }]
            }
        }
    }

    in the above example, a fixture is configured to have, for each 6-channels address:
    [alpha, red, green, blue, strobo, mix]

    The assumption is still that r, g, b channels are consecutive starting from startChannel + red_offset
 */
function _init_rgb_obj(startChannel, r, g, b) {
    let o = {};
    const { light_options } = config,
        { max, min } = Math,
        address_opts = (light_options || {})[startChannel] || {},
        { fixed_values, red_offset } = address_opts,
        cols = [r, g, b].map(n => max(0, min(255, n)));

    for (let i = 0; i < (fixed_values || []).length; i++) {
        let fv = fixed_values[i];
        o[startChannel + fv.offset] = fv.value;
    }

    let ro = red_offset || 0,
        j = 0;
    for (let i = ro; i < ro + 3; i++) {
        o[startChannel + i] = cols[j] || 0;
        j++;
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
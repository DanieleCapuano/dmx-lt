import { init, setColor } from "./ctl_manager";
import { start_server } from "./websocket_server";
import { get_config } from "./config";
import path from 'node:path';

export const start = _start;
export const get_ws_message = _get_ws_message;

function _start() {
    // console.info("IF YOU DIDN'T PATCH the enttec-open-usb MODULE, PLEASE SET this.startSending(4); OR SIMILAR");
    const config_path = (process.argv[2] || "--config=" + path.resolve("./config/config.json/")).split("=")[1];
    console.info("CONFIG PATH", config_path);

    get_config(config_path).then((config) => {
        //THIS ALLOWS TO TEST MESSAGES AND COLORS USING ANOTHER DEBUG WEB SITE (see debug folder)
        const DEBUG = config._BEDEBUG_;
        globalThis.DEBUG = DEBUG;
        globalThis.GLOBAL_CONFIG = config;

        init(config).then(() => {
            (config.light_addresses || [1]).forEach(startChannel => {
                setColor({
                    color: { r: 0, g: 0, b: 0 },
                    time: 200,
                    startChannel: startChannel
                });
            });
        })

        start_server(DEBUG);
    });
}

function _get_ws_message(msg) {
    if (!msg) return;
    msg = JSON.parse(msg);

    setColor(msg);
}

_start();
//quite based on https://www.npmjs.com/package/enttec-open-dmx-usb

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnttecOpenDMXUSBDevice = exports.PRODUCT_ID = exports.VENDOR_ID = void 0;
const eventemitter3_1 = require("eventemitter3");
const serialport_1 = __importDefault(require("serialport"));
exports.VENDOR_ID = "0403"; // Enttec
exports.PRODUCT_ID = "6001"; // Open DMX USB


class EnttecOpenDMXUSBDevice extends eventemitter3_1.EventEmitter {
    /**
     * @param {string} path A path returned by {@link EnttecOpenDMXUSBDevice.listDevices} or
     * {@link EnttecOpenDMXUSBDevice.getFirstAvailableDevice}.
     * @param {boolean} [startSending=true] Whether the device should start sending as soon as it is ready.
     */
    constructor(path, startSending = true) {
        super();
        this.shouldBeSending = false;
        this.sendTimeout = null;
        this.buffer = Buffer.alloc(513);
        this.buffersQueue = [];

        this.port = { isOpen: () => true, set: (o, cb) => cb() };
        return this.startSending(0);

        this.port = new serialport_1.default(path, {
            baudRate: 250000,
            dataBits: 8,
            stopBits: 2,
            parity: "none",
            autoOpen: true
        });
        this.port.on("open", () => {
            this.emit("ready");
            if (startSending)
                this.startSending(0);
        });
        // Without this, errors would be uncaught.
        this.port.on("error", (error) => {
            this.emit("error", error);
        });
    }
    /**
     * Start sending.
     * @param {number} [interval=0] The time between each attempt to send. Most of the time, `0` works.
     * @throws Error When the device is not ready yet.
     */
    startSending(interval = 0) {
        if (!this.port.isOpen)
            throw new Error("The device is not ready yet. Wait for the 'ready' event.");
        this.shouldBeSending = true;
        // eslint-disable-next-line unicorn/consistent-function-scoping
        const send = () => {
            this.sendUniverse()
                .then(() => {
                    if (this.shouldBeSending)
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                        this.sendTimeout = setTimeout(send, interval);
                })
                .catch(error => this.emit("error", error));
        };
        send();
    }
    /**
     * Stop sending.
     */
    stopSending() {
        this.shouldBeSending = false;
        if (this.sendTimeout !== null)
            clearTimeout(this.sendTimeout);
    }
    /**
     * Set the channel values.
     * If channels is an Object, the keys are the channel numbers.
     *
     * @param {Buffer|Object|Array} channels
     * @param {boolean} [clear=false] Whether all previously assigned channels should be set to 0
     */
    setChannels(channels) {
        // console.info("WRITE CHANNELS");
        const { max, min } = Math;
        let _ch_buffer = Buffer.alloc(513);
        _ch_buffer[0] = 0;
        if (this.buffersQueue.length) {
            //start editing from last value in queue
            this.buffersQueue[this.buffersQueue.length - 1].copy(_ch_buffer);
        }

        if (Buffer.isBuffer(channels)) {
            if (channels.length > 512)
                throw new Error("The maximum size of an DMX universe is 512 channels.");
            channels.copy(_ch_buffer, 1);
            // channels.copy(this.buffer, 1);
        }
        else if (Array.isArray(channels)) {
            if (channels.length > 512)
                throw new Error("The maximum size of an DMX universe is 512 channels.");
            channels.forEach((value, index) => {
                value = max(min(value, 0xFF), 0);
                _ch_buffer[index + 1] = value;
                // this.buffer[index + 1] = value;
            });
        }
        else if (typeof channels === "object") {
            Object.entries(channels).forEach(([channel, value]) => {
                let channelNumber;
                try {
                    channelNumber = Number.parseInt(channel, 10);
                }
                catch {
                    throw new Error("Only channel numbers are supported.");
                }
                if (channelNumber > 512 || channelNumber < 1)
                    throw new Error("All channel numbers must be between 1 and 512.");

                value = max(min(value, 0xFF), 0);
                _ch_buffer[channelNumber] = value;
                // this.buffer[channelNumber] = value;
            });
        }
        else
            throw new TypeError("data must be of type Buffer, Object or Array.");

        this.buffersQueue.push(_ch_buffer);
    }
    /**
     * @returns {Promise} Resolves when the whole universe was sent.
     * @private
     */
    async sendUniverse() {
        return new Promise(resolve => {
            this.port.set({ brk: true, rts: false }, () => {
                // setTimeout(() => {
                this.port.set({ brk: false, rts: false }, () => {
                    // setTimeout(() => {
                    this.buffer = this.buffersQueue.length ? this.buffersQueue.shift() : this.buffer;


                    //to DEBUG ONLY
                    // console.info("BUFFER TO SEND", this.buffer);
                    // console.info("BUFFERED", this.buffersQueue.length);
                    // resolve();

                    this.port.write(this.buffer, resolve);
                    // }, 0);
                });
                // }, 0);
            });
        });
    }
    /**
     * Get the paths of all available devices.
     * @returns {Promise<string[]>}
     */
    static async listDevices() {
        const allPorts = await serialport_1.default.list();
        return allPorts
            .filter(device => device.vendorId === exports.VENDOR_ID && device.productId === exports.PRODUCT_ID)
            .map(device => device.path);
    }
    /**
     * Get the path of the first available device.
     * @throws Error When no device is found.
     * @returns {Promise<string>}
     */
    static async getFirstAvailableDevice() {
        const devices = await EnttecOpenDMXUSBDevice.listDevices();
        if (devices.length === 0)
            // throw new Error("No device found.");
            return "/dev/test";
        else
            return devices[0];
    }
}
exports.EnttecOpenDMXUSBDevice = EnttecOpenDMXUSBDevice;

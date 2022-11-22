# DMX-LT: lightweight controller for dmx lights in Node.js.

This server receives messages over websocket and uses them to control DMX lights using the enttec-open-dmx-usb module (ENTTEC controller for DMX).
A JSON config file must be provided (see details below). A debug folder provides a debugging frontend website which can be used to visualize the sent colors without the need for an actual DMX light attached.
A light process manager utility is built as well, which will spawn the server controlling its status. If the light server will go down, the light process will spawn it again: when used together with the websock-lt module (which provides an on-the-fly reconnection mechanism) this tries to keep safe the general situation of the performance.

```
npm run build
```

or

```
yarn build
```

to bundle your application.


## To watch

```
npm run watch
```


## Example

```bash
node dist/light_process_main.js --config=path/to/config/file.json
```

OR you can use the BATCH file (for windows only prvided)
```bash
.\start.bat
```

## Configuration example
See the config/config.json file.

## Debug example
1. In the config file you'll provide set the debug flag to true
```javascript
{
    "_BEDEBUG_": true
}
```

2. Start the main server
```bash
.\start.bat
```

3. Start the debug client (from root directory) which will show the colors as if it was the actual light.
The following code will assume the http-server node module is installed as simple local web server.
```bash
hs . -o
```
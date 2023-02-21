const WebSocketServer = require('websocket').server;
const http = require('http');
import { get_ws_message } from './index';

const httpPort = 6789;
const outPort = 6780;

export const start_server = _start_server;

//////////////////////////////////////////////////////////

let ws = null;
let ws_out = null;
function _start_server(DEBUG) {
    ws = _create_server(httpPort);
    if (DEBUG) {
        ws_out = _create_server(outPort);
    }
}

function _create_server(port) {
    const server = http.createServer(function (request, response) {
        console.log((new Date()) + ' Received request for ' + request.url);
        response.writeHead(404);
        response.end();
    });
    server.listen(port, function () {
        console.log((new Date()) + ' Server is listening on port ' + port);
    });

    const wsServer = new WebSocketServer({
        httpServer: server,
        autoAcceptConnections: true
    });

    wsServer.on('connect', function (connection) {
        console.log((new Date()) + ' Connection accepted.');
        wsServer.connection = connection;
        connection.on('message', function (message) {
            if (message.type === 'utf8') {
                console.log('Received Message on WS ['+port+']: ' + message.utf8Data);
                get_ws_message(message.utf8Data);

                //FOR DEBUG PURPOSES: COLORS ARE SENT ON ANOTHER WS CONNECTION
                if (ws_out && ws_out.connection) {
                    console.log('Sending Message on WS ['+outPort+']: ' + message.utf8Data);
                    ws_out.connection.sendUTF(message.utf8Data);
                }
            }
        });
        connection.on('close', function (reasonCode, description) {
            console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        });
    });

    return wsServer;
}
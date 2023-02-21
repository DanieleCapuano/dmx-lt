const { spawn } = require('node:child_process');

let main = null;
_start_process();

function _start_process() {
    main = spawn('node', [__dirname +'/main.js']);
    main.stdout.on('data', (data) => {
        console.log(`${data}`);
    });
    main.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        setTimeout(_start_process, 500);
    });
}
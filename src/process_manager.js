const { spawn } = require('node:child_process');

let main = null;
_start_process();

function _start_process() {
    main = spawn('node', [__dirname + '/main.js', process.argv[2], process.argv[3], process.argv[4]]);  //just [2] used, but add 2 more
    main.stdout.on('data', (data) => {
        console.log(`${data}`);
    });
    main.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        setTimeout(_start_process, 500);
    });
}
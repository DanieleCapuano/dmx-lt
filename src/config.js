import { readFile } from 'node:fs';

export const get_config = _get_config;

function _get_config(config_path) {
    return new Promise(res => {
        readFile(config_path, (err, data) => {
            if (err) res({});
            else {
                try {
                    const _cfg = JSON.parse(data);
                    const config = Object.assign({}, _cfg.default || _cfg);
                    res(config);
                }
                catch(e) {
                    res({});
                }
            }
        });
    });
}
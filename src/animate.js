const { performance } = this.window || require('perf_hooks');

//you can control the setInterval frequency using this value
const INTERVAL_FREQ = 2;

//available easing functions:
//linear, easein, easeout
let currentPromises = [],
    animationIntervals = [],
    f32a = new Float32Array();
function animate(start_channel, start_values, dest_values, t, easing, updateFn) {
    start_channel = start_channel || 1;
    currentPromises[start_channel] = new Promise(resolve => {
        let /////////////////////////
            t_curr = 0,
            lerp_param = 0,
            t0 = performance.now(),
            t1 = t0 + t,
            update_obj = {},
            min = Math.min,
            max = Math.max,
            itv_fn = () => {
                let elapsed_time = (performance.now() - t0);
                lerp_param = min(max(elapsed_time / (t1 - t0), 0), 1);  //in [0, 1]
                lerp_param = _manage_easing_fn(lerp_param, easing);
                t_curr = min(max(t * lerp_param, 0), t);

                //lerp_param goes from 0 to 1
                update_obj = Object.keys(start_values).reduce((o, k) => {
                    let a = start_values[k],
                        b = dest_values[k];

                    if (b === undefined) {
                        console.warn("DESTINATION VALUES OBJECT WITH WRONG KEYS!", start_values, dest_values);
                        o[k] = a;
                    }
                    else {
                        let v = a * (1 - lerp_param) + b * lerp_param;
                        v = new Uint8Array(new Float32Array([v]))[0];
                        o[k] = v;
                    }
                    return o;
                }, update_obj);

                // console.info("VAL", update_obj, t_curr, lerp_param);
                updateFn(update_obj);

                if (lerp_param === 1 || t_curr === t) {
                    // console.info("CLEARING", t_curr, lerp_param);
                    (animationIntervals[start_channel] !== null && animationIntervals[start_channel] !== undefined) && clearInterval(animationIntervals[start_channel]);
                    resolve();
                }
                return itv_fn;
            };
        animationIntervals[start_channel] = setInterval(itv_fn(), INTERVAL_FREQ);
    });

    return currentPromises[start_channel];
}

function stopAnimation(channel) {
    channel = channel || 1;
    (animationIntervals[channel] !== null && animationIntervals[channel] !== undefined) && clearInterval(animationIntervals[channel]);
    animationIntervals[channel] = null;
    currentPromises[channel] = null;
}

function _manage_easing_fn(n, easing_fn) {
    let out = n;    //linear
    if (easing_fn) {
        switch (easing_fn) {
            case 'easein':
                out = Math.pow(n, 2);
                break;
            case 'easeout':
                out = Math.pow(n, 1 / 2);
                break;
            case 'linear':
            default:
                out = n;
                break;
        }
    }
    return out;
}


if (!globalThis.window) {
    module.exports = { animate, stopAnimation };
}
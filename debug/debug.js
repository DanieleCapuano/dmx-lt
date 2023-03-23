import { start_ws, send_ws_msg } from "websock-lt";
window.WS = { start_ws, send_ws_msg };

window.onload = () => {
    if (!window.animate && !window.stopAnimation) {
        window.animate = () => { };
        window.stopAnimation = () => { };
    }

    let animPromises = [];

    window.rgb = {
        "1": { "1": 0, "2": 0, "3": 0 }
    };
    _set_rgb(rgb[1], 1);

    start_ws('6789');   //to debug sending message to the backend
    // start_ws('6780', (msg_list) => {
    //     if (!Array.isArray(msg_list)) msg_list = [msg_list];
    //     msg_list.forEach(msg => {
    //         let c = msg.color,
    //             t = msg.time,
    //             e = msg.easingFn,
    //             startChannel = msg.startChannel || 1,
    //             rgb_val = {
    //                 [String(startChannel)]: c.r,
    //                 [String(startChannel + 1)]: c.g,
    //                 [String(startChannel + 2)]: c.b
    //             };
    //         if (animPromises[startChannel]) {
    //             window.stopAnimation(startChannel);
    //             animPromises[startChannel] = null;
    //         }

    //         if (!t) {
    //             _set_rgb(rgb_val, startChannel);
    //         }
    //         else {
    //             animPromises[startChannel] = animate_debug(startChannel, rgb_val, t, e).then(() => {
    //                 animPromises[startChannel] = null;
    //             });
    //         }
    //     });
    // });

    function animate_debug(channel, dest_values, time, easing) {
        rgb[channel] = rgb[channel] || {
            [channel]: 0,
            [channel + 1]: 0,
            [channel + 2]: 0
        };

        return window.animate(channel, rgb[channel], dest_values, time, easing, (update_val) => {
            _set_rgb(
                update_val,
                channel
            );
        });
    }

    function _set_rgb(rgb_update, startChannel) {
        rgb[startChannel] = rgb_update;
        startChannel = startChannel || 1;

        let rgb_data = rgb[startChannel];

        Array.prototype.slice
            .call(document.querySelectorAll('.channel-' + startChannel))
            .forEach(div => {
                div.style.backgroundColor = 'rgba('
                    + rgb_data[String(startChannel)] + ', ' +
                    +rgb_data[String(startChannel + 1)] + ', ' +
                    +rgb_data[String(startChannel + 2)] + ', ' + ' 1)';
            });
    }
}
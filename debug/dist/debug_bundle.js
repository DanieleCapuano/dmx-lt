/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./debug.js":
/*!******************!*\
  !*** ./debug.js ***!
  \******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var websock_lt__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! websock-lt */ \"./node_modules/websock-lt/dist/websock-lt.js\");\n/* harmony import */ var websock_lt__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(websock_lt__WEBPACK_IMPORTED_MODULE_0__);\n\r\nwindow.WS = { start_ws: websock_lt__WEBPACK_IMPORTED_MODULE_0__.start_ws, send_ws_msg: websock_lt__WEBPACK_IMPORTED_MODULE_0__.send_ws_msg };\r\n\r\nwindow.onload = () => {\r\n    if (!window.animate && !window.stopAnimation) {\r\n        window.animate = () => { };\r\n        window.stopAnimation = () => { };\r\n    }\r\n\r\n    let animPromises = [];\r\n\r\n    window.rgb = {\r\n        \"1\": { \"1\": 0, \"2\": 0, \"3\": 0 }\r\n    };\r\n    _set_rgb(rgb[1], 1);\r\n\r\n    (0,websock_lt__WEBPACK_IMPORTED_MODULE_0__.start_ws)('6789');   //to debug sending message to the backend\r\n    (0,websock_lt__WEBPACK_IMPORTED_MODULE_0__.start_ws)('6780', (msg_list) => {\r\n        if (!Array.isArray(msg_list)) msg_list = [msg_list];\r\n        msg_list.forEach(msg => {\r\n            let c = msg.color,\r\n                t = msg.time,\r\n                e = msg.easingFn,\r\n                startChannel = msg.startChannel || 1,\r\n                rgb_val = {\r\n                    [String(startChannel)]: c.r,\r\n                    [String(startChannel + 1)]: c.g,\r\n                    [String(startChannel + 2)]: c.b\r\n                };\r\n            if (animPromises[startChannel]) {\r\n                window.stopAnimation(startChannel);\r\n                animPromises[startChannel] = null;\r\n            }\r\n\r\n            if (!t) {\r\n                _set_rgb(rgb_val, startChannel);\r\n            }\r\n            else {\r\n                animPromises[startChannel] = animate_debug(startChannel, rgb_val, t, e).then(() => {\r\n                    animPromises[startChannel] = null;\r\n                });\r\n            }\r\n        });\r\n    });\r\n\r\n    function animate_debug(channel, dest_values, time, easing) {\r\n        rgb[channel] = rgb[channel] || {\r\n            [channel]: 0,\r\n            [channel + 1]: 0,\r\n            [channel + 2]: 0\r\n        };\r\n\r\n        return window.animate(channel, rgb[channel], dest_values, time, easing, (update_val) => {\r\n            _set_rgb(\r\n                update_val,\r\n                channel\r\n            );\r\n        });\r\n    }\r\n\r\n    function _set_rgb(rgb_update, startChannel) {\r\n        rgb[startChannel] = rgb_update;\r\n        startChannel = startChannel || 1;\r\n\r\n        let rgb_data = rgb[startChannel];\r\n\r\n        Array.prototype.slice\r\n            .call(document.querySelectorAll('.channel-' + startChannel))\r\n            .forEach(div => {\r\n                div.style.backgroundColor = 'rgba('\r\n                    + rgb_data[String(startChannel)] + ', ' +\r\n                    +rgb_data[String(startChannel + 1)] + ', ' +\r\n                    +rgb_data[String(startChannel + 2)] + ', ' + ' 1)';\r\n            });\r\n    }\r\n}\n\n//# sourceURL=webpack://dmxlt/./debug.js?");

/***/ }),

/***/ "./node_modules/websock-lt/dist/websock-lt.js":
/*!****************************************************!*\
  !*** ./node_modules/websock-lt/dist/websock-lt.js ***!
  \****************************************************/
/***/ ((module) => {

eval("/*\r\n * ATTENTION: The \"eval\" devtool has been used (maybe by default in mode: \"development\").\r\n * This devtool is neither made for production nor for readable output files.\r\n * It uses \"eval()\" calls to create a separate source file in the browser devtools.\r\n * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)\r\n * or disable the default devtool with \"devtool: false\".\r\n * If you are looking for production-ready output files, see mode: \"production\" (https://webpack.js.org/configuration/mode/).\r\n */\r\n(function webpackUniversalModuleDefinition(root, factory) {\r\n\tif(true)\r\n\t\tmodule.exports = factory();\r\n\telse {}\r\n})(self, () => {\r\nreturn /******/ (() => { // webpackBootstrap\r\n/******/ \t\"use strict\";\r\n/******/ \tvar __webpack_modules__ = ({\r\n\r\n/***/ \"./src/index.js\":\r\n/*!**********************!*\\\r\n  !*** ./src/index.js ***!\r\n  \\**********************/\r\n/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {\r\n\r\neval(\"__webpack_require__.r(__webpack_exports__);\\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\\n/* harmony export */   \\\"send_ws_msg\\\": () => (/* binding */ send_ws_msg),\\n/* harmony export */   \\\"start_ws\\\": () => (/* binding */ start_ws)\\n/* harmony export */ });\\nconst start_ws = _start_ws;\\nconst send_ws_msg = _send_ws_msg;\\nlet connection = null,\\n  retry_itv = null,\\n  last_msg = null;\\nconst CONFIG = window.CONFIG || {};\\nfunction _start_ws(opts) {\\n  let {\\n    port,\\n    callback,\\n    preserve_last_message\\n  } = opts;\\n  port = port || '6789';\\n  CONFIG.preserve_last_message = preserve_last_message;\\n  return new Promise(resolve => {\\n    try {\\n      _connect_to_ws(port, callback, resolve);\\n    } catch (e) {\\n      resolve();\\n    }\\n  });\\n}\\nfunction _connect_to_ws(port, callback, resolve) {\\n  console.info(\\\"Connecting to websocket...\\\");\\n  connection = new WebSocket('ws://localhost:' + port);\\n  connection.addEventListener('open', function () {\\n    console.info('WebSocket Client Connected');\\n    const _call_cb = d => {\\n      callback && callback(JSON.parse(d));\\n    };\\n    if (last_msg) {\\n      _restore_last_message(_call_cb);\\n    }\\n    connection.addEventListener('message', function (message) {\\n      let data = message.utf8Data || message.data;\\n      if (CONFIG._DEBUG_) console.log(\\\"Received: '\\\" + data + \\\"'\\\");\\n      if (CONFIG.preserve_last_message) _save_last_msg(data);\\n      _call_cb(data);\\n    });\\n    resolve && resolve(connection);\\n  });\\n  connection.addEventListener('error', function (error) {\\n    if (CONFIG._DEBUG_) console.log(\\\"Connection Error: \\\" + error.toString());\\n    connection = null;\\n    resolve && resolve();\\n  });\\n  connection.addEventListener('close', function () {\\n    console.warn('Websocket Connection Closed');\\n    connection = null;\\n    if (!retry_itv) {\\n      retry_itv = setInterval(() => {\\n        if (connection) {\\n          clearInterval(retry_itv);\\n          retry_itv = null;\\n          return;\\n        }\\n        _connect_to_ws(port, callback, resolve);\\n      }, 3000);\\n    }\\n  });\\n}\\nlet warning_message_given = false;\\nfunction _send_ws_msg(data) {\\n  if (!(connection || {}).readyState) {\\n    if (!warning_message_given)\\n      //give it just once\\n      console.warn(\\\"No WS Connection available: No color sent\\\");\\n    warning_message_given = true;\\n    return;\\n  }\\n  let msg = JSON.stringify(data);\\n  if (CONFIG._DEBUG_) console.info(\\\"MSG\\\", msg);\\n  if (CONFIG.preserve_last_message) _save_last_msg(data);\\n  connection.send(msg);\\n}\\nfunction _save_last_msg(data) {\\n  if (CONFIG.preserve_last_message) {\\n    let c = CONFIG.preserve_last_message;\\n    if (c.id) {\\n      //we want the last message(s) to be indexed by id\\n      last_msg = last_msg || {};\\n\\n      //the client can transform the saved message so that, if recovered, it could be sent with changes\\n      //(it's a recovery message, so maybe it should not have the same information, e.g. timing, of the original one)\\n      last_msg[data[c.id]] = (c.transform_msg || (m => m))(data);\\n    } else last_msg = data;\\n  }\\n}\\nfunction _restore_last_message(fn) {\\n  const c = CONFIG.preserve_last_message,\\n    _send = d => {\\n      fn && fn(d);\\n      _send_ws_msg(d);\\n    };\\n  if (c.id) Object.keys(last_msg).forEach(last_msg_id => _send(last_msg[last_msg_id]));else _send(last_msg);\\n}\\n\\n//# sourceURL=webpack://websock-lt/./src/index.js?\");\r\n\r\n/***/ })\r\n\r\n/******/ \t});\r\n/************************************************************************/\r\n/******/ \t// The require scope\r\n/******/ \tvar __nested_webpack_require_4859__ = {};\r\n/******/ \t\r\n/************************************************************************/\r\n/******/ \t/* webpack/runtime/define property getters */\r\n/******/ \t(() => {\r\n/******/ \t\t// define getter functions for harmony exports\r\n/******/ \t\t__nested_webpack_require_4859__.d = (exports, definition) => {\r\n/******/ \t\t\tfor(var key in definition) {\r\n/******/ \t\t\t\tif(__nested_webpack_require_4859__.o(definition, key) && !__nested_webpack_require_4859__.o(exports, key)) {\r\n/******/ \t\t\t\t\tObject.defineProperty(exports, key, { enumerable: true, get: definition[key] });\r\n/******/ \t\t\t\t}\r\n/******/ \t\t\t}\r\n/******/ \t\t};\r\n/******/ \t})();\r\n/******/ \t\r\n/******/ \t/* webpack/runtime/hasOwnProperty shorthand */\r\n/******/ \t(() => {\r\n/******/ \t\t__nested_webpack_require_4859__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))\r\n/******/ \t})();\r\n/******/ \t\r\n/******/ \t/* webpack/runtime/make namespace object */\r\n/******/ \t(() => {\r\n/******/ \t\t// define __esModule on exports\r\n/******/ \t\t__nested_webpack_require_4859__.r = (exports) => {\r\n/******/ \t\t\tif(typeof Symbol !== 'undefined' && Symbol.toStringTag) {\r\n/******/ \t\t\t\tObject.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });\r\n/******/ \t\t\t}\r\n/******/ \t\t\tObject.defineProperty(exports, '__esModule', { value: true });\r\n/******/ \t\t};\r\n/******/ \t})();\r\n/******/ \t\r\n/************************************************************************/\r\n/******/ \t\r\n/******/ \t// startup\r\n/******/ \t// Load entry module and return exports\r\n/******/ \t// This entry module can't be inlined because the eval devtool is used.\r\n/******/ \tvar __webpack_exports__ = {};\r\n/******/ \t__webpack_modules__[\"./src/index.js\"](0, __webpack_exports__, __nested_webpack_require_4859__);\r\n/******/ \t\r\n/******/ \treturn __webpack_exports__;\r\n/******/ })()\r\n;\r\n});\n\n//# sourceURL=webpack://dmxlt/./node_modules/websock-lt/dist/websock-lt.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./debug.js");
/******/ 	
/******/ })()
;
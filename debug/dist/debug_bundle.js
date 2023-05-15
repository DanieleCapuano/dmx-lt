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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var websock_lt__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! websock-lt */ \"./node_modules/websock-lt/dist/websock-lt.js\");\n/* harmony import */ var websock_lt__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(websock_lt__WEBPACK_IMPORTED_MODULE_0__);\n\r\nwindow.WS = { start_ws: websock_lt__WEBPACK_IMPORTED_MODULE_0__.start_ws, send_ws_msg: websock_lt__WEBPACK_IMPORTED_MODULE_0__.send_ws_msg };\r\n\r\nwindow.onload = () => {\r\n    if (!window.animate && !window.stopAnimation) {\r\n        window.animate = () => { };\r\n        window.stopAnimation = () => { };\r\n    }\r\n\r\n    let animPromises = [];\r\n\r\n    window.rgb = {\r\n        \"1\": { \"1\": 0, \"2\": 0, \"3\": 0 }\r\n    };\r\n    _set_rgb(rgb[1], 1);\r\n\r\n    // start_ws('6789');   //to debug sending message to the backend\r\n    (0,websock_lt__WEBPACK_IMPORTED_MODULE_0__.start_ws)('6780', (msg_list) => {\r\n        if (!Array.isArray(msg_list)) msg_list = [msg_list];\r\n        msg_list.forEach(msg => {\r\n            let c = msg.color,\r\n                t = msg.time,\r\n                e = msg.easingFn,\r\n                startChannel = msg.startChannel || 1,\r\n                rgb_val = {\r\n                    [String(startChannel)]: c.r,\r\n                    [String(startChannel + 1)]: c.g,\r\n                    [String(startChannel + 2)]: c.b\r\n                };\r\n            if (animPromises[startChannel]) {\r\n                window.stopAnimation(startChannel);\r\n                animPromises[startChannel] = null;\r\n            }\r\n\r\n            if (!t) {\r\n                _set_rgb(rgb_val, startChannel);\r\n            }\r\n            else {\r\n                animPromises[startChannel] = animate_debug(startChannel, rgb_val, t, e).then(() => {\r\n                    animPromises[startChannel] = null;\r\n                });\r\n            }\r\n        });\r\n    });\r\n\r\n    function animate_debug(channel, dest_values, time, easing) {\r\n        rgb[channel] = rgb[channel] || {\r\n            [channel]: 0,\r\n            [channel + 1]: 0,\r\n            [channel + 2]: 0\r\n        };\r\n\r\n        return window.animate(channel, rgb[channel], dest_values, time, easing, (update_val) => {\r\n            _set_rgb(\r\n                update_val,\r\n                channel\r\n            );\r\n        });\r\n    }\r\n\r\n    function _set_rgb(rgb_update, startChannel) {\r\n        rgb[startChannel] = rgb_update;\r\n        startChannel = startChannel || 1;\r\n\r\n        let rgb_data = rgb[startChannel];\r\n        let div = document.querySelector('.channel-' + startChannel);\r\n        if (!div) {\r\n            let container = document.querySelector('.lights');\r\n\r\n            div = document.createElement('div');\r\n            div.classList.add('channel-' + startChannel, 'channel');\r\n            div.style.position = 'relative';\r\n            div.style.height = '100%';\r\n            div.style.flex = '1';\r\n            div.innerHTML = '<b>Channel: ' + startChannel + '</b>';\r\n\r\n            container.appendChild(div);\r\n        }\r\n\r\n        div.style.backgroundColor = 'rgba('\r\n            + rgb_data[String(startChannel)] + ', ' +\r\n            + rgb_data[String(startChannel + 1)] + ', ' +\r\n            + rgb_data[String(startChannel + 2)] + ', ' + ' 1)';\r\n    }\r\n}\n\n//# sourceURL=webpack://dmxlt/./debug.js?");

/***/ }),

/***/ "./node_modules/websock-lt/dist/websock-lt.js":
/*!****************************************************!*\
  !*** ./node_modules/websock-lt/dist/websock-lt.js ***!
  \****************************************************/
/***/ ((module) => {

eval("!function(e,o){ true?module.exports=o():0}(self,(()=>(()=>{\"use strict\";var e={d:(o,n)=>{for(var t in n)e.o(n,t)&&!e.o(o,t)&&Object.defineProperty(o,t,{enumerable:!0,get:n[t]})},o:(e,o)=>Object.prototype.hasOwnProperty.call(e,o),r:e=>{\"undefined\"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:\"Module\"}),Object.defineProperty(e,\"__esModule\",{value:!0})}},o={};e.r(o),e.d(o,{send_ws_msg:()=>t,start_ws:()=>n});const n=function(e,o){return e=e||\"6789\",new Promise((n=>{try{i(e,o,n)}catch(e){n()}}))},t=function(e){if(!(r||{}).readyState)return s||console.warn(\"No WS Connection available: No color sent\"),void(s=!0);let o=JSON.stringify(e);c._DEBUG_&&console.info(\"MSG\",o),r.send(o)};let r=null,l=null;const c=window.CONFIG||{};function i(e,o,n){console.info(\"Connecting to websocket...\"),r=new WebSocket(\"ws://localhost:\"+e),r.addEventListener(\"open\",(function(){console.info(\"WebSocket Client Connected\"),r.addEventListener(\"message\",(function(e){let n=e.utf8Data||e.data;c._DEBUG_&&console.log(\"Received: '\"+n+\"'\"),o&&o(JSON.parse(n))})),n&&n(r)})),r.addEventListener(\"error\",(function(e){c._DEBUG_&&console.log(\"Connection Error: \"+e.toString()),r=null,n&&n()})),r.addEventListener(\"close\",(function(){console.warn(\"Websocket Connection Closed\"),r=null,l||(l=setInterval((()=>{if(r)return clearInterval(l),void(l=null);i(e,o,n)}),3e3))}))}let s=!1;return o})()));\n\n//# sourceURL=webpack://dmxlt/./node_modules/websock-lt/dist/websock-lt.js?");

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
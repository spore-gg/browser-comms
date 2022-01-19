"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ = _interopRequireWildcard(require("lodash-es"));

var _rpc_client = _interopRequireDefault(require("./rpc_client.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DEFAULT_HANDSHAKE_TIMEOUT_MS = 10000; // 10 seconds

var SW_CONNECT_TIMEOUT_MS = 5000; // 5s

var selfWindow = typeof window !== 'undefined' ? window : self;

var BrowserComms = /*#__PURE__*/_createClass(
/*
@param {Object} options
@param {Number} [options.timeout] - request timeout (ms)
@param {Number} [options.handShakeTimeout=10000] - handshake timeout (ms)
@param {Boolean} [options.useSw] - whether or not we should try comms with service worker
@param {Function<Boolean>} options.isParentValidFn - restrict parent origin
*/
function BrowserComms() {
  var _this = this,
      _globalThis$window,
      _globalThis$window2;

  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  _classCallCheck(this, BrowserComms);

  _defineProperty(this, "setParent", function (parent) {
    _this.parent = parent;
    _this.hasParent = true;
  });

  _defineProperty(this, "setInAppBrowserWindow", function (iabWindow, callback) {
    // can't use postMessage, so this hacky executeScript works
    _this.iabWindow = iabWindow;
    var readyEvent = navigator.userAgent.indexOf('iPhone') !== -1 ? 'loadstop' // for some reason need to wait for this on iOS
    : 'loadstart';

    _this.iabWindow.addEventListener(readyEvent, function () {
      _this.iabWindow.executeScript({
        code: 'window._browserCommsIsInAppBrowser = true;'
      });

      clearInterval(_this.iabInterval);
      _this.iabInterval = setInterval(function () {
        return _this.iabWindow.executeScript({
          code: "localStorage.getItem('portal:queue');"
        }, function (values) {
          try {
            var _values;

            values = JSON.parse((_values = values) === null || _values === void 0 ? void 0 : _values[0]);

            if (!_.isEmpty(values)) {
              _this.iabWindow.executeScript({
                code: "localStorage.setItem('portal:queue', '[]')"
              });
            }

            return _.map(values, callback);
          } catch (err) {
            return console.log(err, values);
          }
        });
      }, 100);
    });

    return _this.iabWindow.addEventListener('exit', function () {
      return clearInterval(_this.iabInterval);
    });
  });

  _defineProperty(this, "replyInAppBrowserWindow", function (data) {
    var escapedData = data.replace(/'/g, "'");
    return _this.iabWindow.executeScript({
      code: "if(window._browserCommsOnMessage) window._browserCommsOnMessage('".concat(escapedData, "')")
    });
  });

  _defineProperty(this, "onMessageInAppBrowserWindow", function (data) {
    return _this.onMessage({
      data: data,
      source: {
        postMessage: function postMessage(data) {
          // needs to be defined in native
          return _this.call('browser.reply', {
            data: data
          });
        }
      }
    });
  });

  _defineProperty(this, "listen", function () {
    _this.isListening = true;
    selfWindow.addEventListener('message', _this.onMessage); // set via win.executeScript in cordova

    typeof window !== 'undefined' && window !== null && (window._browserCommsOnMessage = function (eStr) {
      return _this.onMessage({
        debug: true,
        data: function () {
          try {
            return JSON.parse(eStr);
          } catch (error) {
            console.log('error parsing', eStr);
            return null;
          }
        }()
      });
    });
    _this.clientValidation = _this.client.call('ping', null, {
      timeout: _this.handshakeTimeout
    }).then(function (registeredMethods) {
      if (_this.hasParent) {
        _this.parentsRegisteredMethods = _this.parentsRegisteredMethods.concat(registeredMethods);
      }
    })["catch"](function () {
      return null;
    });
    _this.swValidation = _this.ready.then(function () {
      var _this$sw;

      return (_this$sw = _this.sw) === null || _this$sw === void 0 ? void 0 : _this$sw.call('ping', null, {
        timeout: _this.handshakeTimeout
      });
    }).then(function (registeredMethods) {
      _this.parentsRegisteredMethods = _this.parentsRegisteredMethods.concat(registeredMethods);
    });
  });

  _defineProperty(this, "close", function () {
    _this.isListening = true;
    return selfWindow.removeEventListener('message', _this.onMessage);
  });

  _defineProperty(this, "call", /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(method) {
      var localMethod,
          _len,
          params,
          _key,
          parentError,
          hasParentMethod,
          result,
          localResult,
          _result,
          _localResult,
          _result2,
          _localResult2,
          _args = arguments;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (_this.isListening) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return", new Promise(function (resolve, reject) {
                return reject(new Error('Must call listen() before call()'));
              }));

            case 2:
              localMethod = function localMethod(method, params) {
                var fn = _this.registeredMethods[method];

                if (!fn) {
                  throw new Error('Method not found');
                }

                return fn.apply(null, params);
              };

              _context.next = 5;
              return _this.ready;

            case 5:
              for (_len = _args.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                params[_key - 1] = _args[_key];
              }

              if (!_this.hasParent) {
                _context.next = 61;
                break;
              }

              parentError = null;
              _context.next = 10;
              return _this.clientValidation;

            case 10:
              hasParentMethod = _this.parentsRegisteredMethods.indexOf(method) !== -1;

              if (hasParentMethod) {
                _context.next = 15;
                break;
              }

              return _context.abrupt("return", localMethod(method, params));

            case 15:
              _context.next = 17;
              return _this.client.call(method, params);

            case 17:
              result = _context.sent;
              _context.prev = 18;

              if (!(method === 'ping')) {
                _context.next = 24;
                break;
              }

              localResult = localMethod(method, params);
              return _context.abrupt("return", (result || []).concat(localResult));

            case 24:
              return _context.abrupt("return", result);

            case 25:
              _context.next = 59;
              break;

            case 27:
              _context.prev = 27;
              _context.t0 = _context["catch"](18);
              _context.prev = 29;
              parentError = _context.t0;

              if (!_this.sw) {
                _context.next = 49;
                break;
              }

              _context.prev = 32;
              _context.next = 35;
              return _this.sw.call(method, params);

            case 35:
              _result = _context.sent;

              if (!(method === 'ping')) {
                _context.next = 41;
                break;
              }

              _localResult = localMethod(method, params);
              return _context.abrupt("return", (_result || []).concat(_localResult));

            case 41:
              return _context.abrupt("return", _result);

            case 42:
              _context.next = 47;
              break;

            case 44:
              _context.prev = 44;
              _context.t1 = _context["catch"](32);
              return _context.abrupt("return", localMethod(method, params));

            case 47:
              _context.next = 50;
              break;

            case 49:
              return _context.abrupt("return", localMethod(method, params));

            case 50:
              _context.next = 59;
              break;

            case 52:
              _context.prev = 52;
              _context.t2 = _context["catch"](29);

              if (!(_context.t2.message === 'Method not found' && parentError)) {
                _context.next = 58;
                break;
              }

              throw parentError;

            case 58:
              throw _context.t2;

            case 59:
              _context.next = 86;
              break;

            case 61:
              if (!_this.sw) {
                _context.next = 85;
                break;
              }

              _context.next = 64;
              return _this.swValidation;

            case 64:
              if (!(_this.parentsRegisteredMethods.indexOf(method) === -1)) {
                _context.next = 68;
                break;
              }

              return _context.abrupt("return", localMethod(method, params));

            case 68:
              _context.prev = 68;
              _context.next = 71;
              return _this.sw.call(method, params);

            case 71:
              _result2 = _context.sent;

              if (!(method === 'ping')) {
                _context.next = 77;
                break;
              }

              _localResult2 = localMethod(method, params);
              return _context.abrupt("return", (_result2 || []).concat(_localResult2));

            case 77:
              return _context.abrupt("return", _result2);

            case 78:
              _context.next = 83;
              break;

            case 80:
              _context.prev = 80;
              _context.t3 = _context["catch"](68);
              return _context.abrupt("return", localMethod(method, params));

            case 83:
              _context.next = 86;
              break;

            case 85:
              return _context.abrupt("return", localMethod(method, params));

            case 86:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[18, 27], [29, 52], [32, 44], [68, 80]]);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());

  _defineProperty(this, "onRequest", /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(reply, request) {
      var params, _i, _Array$from, param, result;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              // replace callback params with proxy functions
              params = [];

              for (_i = 0, _Array$from = Array.from(request.params || []); _i < _Array$from.length; _i++) {
                param = _Array$from[_i];

                if (_rpc_client["default"].isRPCCallback(param)) {
                  (function (param) {
                    return params.push(function () {
                      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                        args[_key2] = arguments[_key2];
                      }

                      return reply(_rpc_client["default"].createRPCCallbackResponse({
                        params: args,
                        callbackId: param.callbackId
                      }));
                    });
                  })(param);
                } else {
                  params.push(param);
                }
              } // acknowledge request, prevent request timeout


              reply(_rpc_client["default"].createRPCRequestAcknowledgement({
                requestId: request.id
              }));
              _context2.prev = 3;
              _context2.next = 6;
              return _this.call.apply(_this, [request.method].concat(_toConsumableArray(Array.from(params))));

            case 6:
              result = _context2.sent;
              return _context2.abrupt("return", reply(_rpc_client["default"].createRPCResponse({
                requestId: request.id,
                result: result
              })));

            case 10:
              _context2.prev = 10;
              _context2.t0 = _context2["catch"](3);
              return _context2.abrupt("return", reply(_rpc_client["default"].createRPCResponse({
                requestId: request.id,
                rPCError: _rpc_client["default"].createRPCError({
                  code: _rpc_client["default"].ERROR_CODES.DEFAULT,
                  data: _context2.t0
                })
              })));

            case 13:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[3, 10]]);
    }));

    return function (_x2, _x3) {
      return _ref2.apply(this, arguments);
    };
  }());

  _defineProperty(this, "onMessage", function (e, param) {
    if (param == null) {
      param = {};
    }

    var _param = param,
        isServiceWorker = _param.isServiceWorker;

    var reply = function reply(message) {
      if (typeof window !== 'undefined' && window !== null) {
        var _e$source;

        return (_e$source = e.source) === null || _e$source === void 0 ? void 0 : _e$source.postMessage(JSON.stringify(message), '*');
      } else {
        return e.ports[0].postMessage(JSON.stringify(message));
      }
    };

    try {
      // silent
      var message = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;

      if (!_rpc_client["default"].isRPCEntity(message)) {
        throw new Error('Non-portal message');
      }

      if (_rpc_client["default"].isRPCRequest(message)) {
        return _this.onRequest(reply, message);
      } else if (_rpc_client["default"].isRPCEntity(message)) {
        var rpc;

        if (_this.isParentValidFn(e.origin)) {
          rpc = isServiceWorker ? _this.sw : _this.client;
          return rpc.resolve(message);
        } else if (_rpc_client["default"].isRPCResponse(message)) {
          rpc = isServiceWorker ? _this.sw : _this.client;
          return rpc.resolve(_rpc_client["default"].createRPCResponse({
            requestId: message.id,
            rPCError: _rpc_client["default"].createRPCError({
              code: _rpc_client["default"].ERROR_CODES.INVALID_ORIGIN
            })
          }));
        } else {
          throw new Error('Invalid origin');
        }
      } else {
        throw new Error('Unknown RPCEntity type');
      }
    } catch (err) {}
  });

  _defineProperty(this, "on", function (method, fn) {
    _this.registeredMethods[method] = fn;
  });

  var timeout = options.timeout,
      _options$handshakeTim = options.handshakeTimeout,
      handshakeTimeout = _options$handshakeTim === void 0 ? DEFAULT_HANDSHAKE_TIMEOUT_MS : _options$handshakeTim,
      _options$isParentVali = options.isParentValidFn,
      isParentValidFn = _options$isParentVali === void 0 ? function () {
    return true;
  } : _options$isParentVali;
  var useSw = options;
  this.handshakeTimeout = handshakeTimeout;
  this.isParentValidFn = isParentValidFn;
  this.isListening = false; // window?._browserCommsIsInAppBrowser is set by native app. on iOS it isn't set
  // soon enough, so we rely on userAgent

  var isInAppBrowser = (globalThis === null || globalThis === void 0 ? void 0 : (_globalThis$window = globalThis.window) === null || _globalThis$window === void 0 ? void 0 : _globalThis$window._browserCommsIsInAppBrowser) || navigator.userAgent.indexOf('/InAppBrowser') !== -1;
  this.hasParent = typeof window !== 'undefined' && window.self !== window.top || isInAppBrowser;
  this.parent = globalThis === null || globalThis === void 0 ? void 0 : (_globalThis$window2 = globalThis.window) === null || _globalThis$window2 === void 0 ? void 0 : _globalThis$window2.parent;
  this.client = new _rpc_client["default"]({
    timeout: timeout,
    postMessage: function postMessage(msg, origin) {
      if (isInAppBrowser) {
        var queue = function () {
          try {
            return JSON.parse(localStorage['portal:queue']);
          } catch (error) {
            return null;
          }
        }();

        if (queue == null) {
          queue = [];
        }

        queue.push(msg);
        localStorage['portal:queue'] = JSON.stringify(queue);
        return localStorage['portal:queue'];
      } else {
        var _this$parent;

        return (_this$parent = _this.parent) === null || _this$parent === void 0 ? void 0 : _this$parent.postMessage(msg, origin);
      }
    }
  });
  useSw = useSw || navigator.serviceWorker && typeof window !== 'undefined' && window !== null && window.location.protocol !== 'http:';

  if (useSw) {
    // only use service workers if current page has one
    this.ready = waitForServiceWorker();
  } else {
    this.ready = Promise.resolve(true);
  } // All parents must respond to 'ping' with @registeredMethods


  this.registeredMethods = {
    ping: function ping() {
      return Object.keys(_this.registeredMethods);
    }
  };
  this.parentsRegisteredMethods = [];
});

var _default = BrowserComms;
exports["default"] = _default;

function waitForServiceWorker() {
  var _this2 = this;

  return new Promise(function (resolve, reject) {
    var _navigator, _navigator$serviceWor;

    var readyTimeout = setTimeout(resolve, SW_CONNECT_TIMEOUT_MS);
    return (_navigator = navigator) === null || _navigator === void 0 ? void 0 : (_navigator$serviceWor = _navigator.serviceWorker) === null || _navigator$serviceWor === void 0 ? void 0 : _navigator$serviceWor.ready["catch"](function () {
      console.log('caught sw error');
      return null;
    }).then(function (registration) {
      var worker = registration === null || registration === void 0 ? void 0 : registration.active;

      if (worker) {
        _this2.sw = new _rpc_client["default"]({
          timeout: _this2.timeout,
          postMessage: function postMessage(msg, origin) {
            var swMessageChannel = new MessageChannel();

            if (swMessageChannel) {
              swMessageChannel.port1.onmessage = function (e) {
                return _this2.onMessage(e, {
                  isServiceWorker: true
                });
              };

              return worker.postMessage(msg, [swMessageChannel.port2]);
            }
          }
        });
      }

      clearTimeout(readyTimeout);
      return resolve();
    });
  });
}
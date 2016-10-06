(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var Stack = _interopRequire(require("./Stack/Stack"));

},{"./Stack/Stack":3}],2:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

// import bunyan from 'bunyan';

var ffi = _interopRequire(require("ffi"));

var StackMethodMap = _interopRequire(require("./StackMethodMap"));

/** @module FFIFactory */

// const log = bunyan.createLogger({ name: 'Stack' });
/**
  * @constant {string} RTLD_NOW - `ffi` flag that determines if `dlopen`
  * operates such that all necessary relocations shall be performed when
  * the object is first loaded.
  * [ref](http://pubs.opengroup.org/onlinepubs/009695399/functions/dlopen.html)
  */
var RTLD_NOW = ffi.DynamicLibrary.FLAGS.RTLD_NOW;
/**
  * @constant {string} RTLD_GLOBAL - `ffi` flag that determines if `dlopen`
  * operates such that The object's symbols shall be made available for the
  * relocation processing of any other object.
  * [ref](http://pubs.opengroup.org/onlinepubs/009695399/functions/dlopen.html)
  */
var RTLD_GLOBAL = ffi.DynamicLibrary.FLAGS.RTLD_GLOBAL;
/**
  * @constant {string} MODE - Determines the `dlopen` mode obtained from `ffi`.
  */
var MODE = RTLD_NOW | RTLD_GLOBAL;

/**
  * @function jsMethodName
  * Generates the Javascript method name from the method name in the map.
  */
function jsMethodName(methodName) {
  return methodName.replace(/^./, methodName[0].toLowerCase());
}

var _default = (function () {
  var _class =
  /**
    * @constructor FFIFactory
    * @classdesc Create a FFIFactory instance
    * @param {string} libPath - The absolute path to the shared library to hook into
    */
  function _default(libPath) {
    _classCallCheck(this, _class);

    this.dynamicLibrary = ffi.DynamicLibrary(libPath, MODE);
    this.buildMethods();
    return this.dynamicLibrary;
  };

  _createClass(_class, {
    buildMethods: {

      /**
        * Loops through array of objects representing functions to generate with `ffi`.
        */

      value: function buildMethods() {
        for (var i = 0, len = StackMethodMap.length; i < len; i++) {
          var method = StackMethodMap[i];
          var ptr = this.dynamicLibrary.get("StackInterface" + method.methodName);
          this.dynamicLibrary[jsMethodName(method.methodName)] = ffi.ForeignFunction(ptr, method.returnType, method.paramTypes);
        }
      }
    }
  });

  return _class;
})();

module.exports = _default;

},{"./StackMethodMap":4,"ffi":28}],3:[function(require,module,exports){
(function (__dirname){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var bunyan = _interopRequire(require("bunyan"));

var ref = _interopRequire(require("ref"));

var StructType = _interopRequire(require("ref-struct"));

var Enum = _interopRequire(require("enum"));

var path = _interopRequire(require("path"));

var FFIFactory = _interopRequire(require("./FFIFactory"));

/** @module Stack */

var log = bunyan.createLogger({ name: "Stack" });
/**
  * @constant {string} VOCLIENT_PATH - Absolute path to the shared C library
  */
// const VOCLIENT_PATH = `${__dirname}/../shared-libs/VOClient.framework/VOClient`;
var VOCLIENT_PATH = path.resolve(__dirname, "../../app/Stack/shared-libs/VOClient.framework/VOClient");

console.log("The voclient path is: " + VOCLIENT_PATH + ".");

var UI_EVENTS = new Enum({
  UI_EVENT_NONE: 0,
  UI_EVENT_DIAL: 1,
  UI_EVENT_DIAL_VIDEO: 2,
  UI_EVENT_END: 3,
  UI_EVENT_ANSWER: 4,
  UI_EVENT_ANSWER_VIDEO: 5,
  UI_EVENT_HOLD: 6,
  UI_EVENT_RETRIEVE: 7,
  UI_EVENT_CONF: 8,
  UI_EVENT_DROPCONF: 9,
  UI_EVENT_ALTERNATE: 10,
  UI_EVENT_ANSWERHOLD: 11,
  UI_EVENT_ANSWERCONF: 12,
  UI_EVENT_REJECT_486: 13,
  UI_EVENT_REJECT_600: 14,
  UI_EVENT_TRANSFER: 15,
  UI_EVENT_JOIN: 16,
  UI_EVENT_PARK: 17,
  UI_EVENT_RECORDSTART: 18,
  UI_EVENT_RECORDSTOP: 19,
  UI_EVENT_MUTE: 20,
  UI_EVENT_UNMUTE: 21,
  UI_EVENT_START_VIDEO: 22,
  UI_EVENT_STOP_VIDEO: 23,
  UI_EVENT_END_CALL_1: 24,
  UI_EVENT_END_CALL_2: 25,
  UI_EVENT_DIAL_BLIND_XFER: 26,
  UI_EVENT_DIAL_CELLULAR_OUTBOUND: 50,
  UI_EVENT_DIAL_CELLULAR_CLICK2CALL: 51,
  UI_EVENT_KEY0_DOWN: 100 + "0".charCodeAt(),
  UI_EVENT_KEY1_DOWN: 100 + "1".charCodeAt(),
  UI_EVENT_KEY2_DOWN: 100 + "2".charCodeAt(),
  UI_EVENT_KEY3_DOWN: 100 + "3".charCodeAt(),
  UI_EVENT_KEY4_DOWN: 100 + "4".charCodeAt(),
  UI_EVENT_KEY5_DOWN: 100 + "5".charCodeAt(),
  UI_EVENT_KEY6_DOWN: 100 + "6".charCodeAt(),
  UI_EVENT_KEY7_DOWN: 100 + "7".charCodeAt(),
  UI_EVENT_KEY8_DOWN: 100 + "8".charCodeAt(),
  UI_EVENT_KEY9_DOWN: 100 + "9".charCodeAt(),
  UI_EVENT_KEYSTAR_DOWN: 100 + "*".charCodeAt(),
  UI_EVENT_KEYPOUND_DOWN: 100 + "#".charCodeAt(),
  UI_EVENT_KEY0_UP: 200 + "0".charCodeAt(),
  UI_EVENT_KEY1_UP: 200 + "1".charCodeAt(),
  UI_EVENT_KEY2_UP: 200 + "2".charCodeAt(),
  UI_EVENT_KEY3_UP: 200 + "3".charCodeAt(),
  UI_EVENT_KEY4_UP: 200 + "4".charCodeAt(),
  UI_EVENT_KEY5_UP: 200 + "5".charCodeAt(),
  UI_EVENT_KEY6_UP: 200 + "6".charCodeAt(),
  UI_EVENT_KEY7_UP: 200 + "7".charCodeAt(),
  UI_EVENT_KEY8_UP: 200 + "8".charCodeAt(),
  UI_EVENT_KEY9_UP: 200 + "9".charCodeAt(),
  UI_EVENT_KEYSTAR_UP: 200 + "*".charCodeAt(),
  UI_EVENT_KEYPOUND_UP: 200 + "#".charCodeAt() });

var _default = (function () {
  var _class =
  /**
    * @constructor Stack
    * @classdesc Creates a new Stack instance using FFIFactory
    */
  function _default() {
    _classCallCheck(this, _class);

    this.client = new FFIFactory(VOCLIENT_PATH);
  };

  _createClass(_class, {
    startup: {

      /**
        * Initializes and registers the media stack
        */

      value: function startup() {
        // this.setDataCallback();
        // this.setSIPLogHandler();
        // this.setDeviceType();
        // this.getDeviceType();
        this.setApplicationVersion();
        this.initializeConfig();
        this.initialize();
        // this.setVideoCaptureParameters();
        // this.setVideoRenderView();
        // this.setSelfVideoDisplayView();
        // this.setAudioRingtoneFilename();
        // this.setAudioRingtoneVolume();
      }
    },
    setDataCallback: {
      value: function setDataCallback() {
        log.info("setDataCallback");
        // this.client.setDataCallback();
      }
    },
    setSIPLogHandler: {
      value: function setSIPLogHandler() {
        log.info("setSIPLogHandler");
        // this.client.setSIPLogHandler();
      }
    },
    setDeviceType: {
      value: function setDeviceType() {
        var deviceTypeEnum = new Enum({
          DEVICE_UNKNOWN: 0,
          DEVICE_IOS_IPHONE: 1,
          DEVICE_IOS_IPOD: 2,
          DEVICE_IOS_IPAD: 3,
          DEVICE_WINDOWS_PC: 4,
          DEVICE_WINDOWS_PHONE: 5,
          DEVICE_WINDOWS_TABLET: 6,
          DEVICE_MAC: 7 }, { name: "E_DEVICE_TYPE" });
        log.info(deviceTypeEnum);
        this.client.setDeviceType(deviceTypeEnum.DEVICE_MAC.value);
        // this.client.setDeviceType(7);
      }
    },
    getDeviceType: {
      value: function getDeviceType() {
        var deviceType = this.client.getDeviceType(ref.types["void"]);
        log.info(deviceType, "Device Type Gotten");
      }
    },
    setApplicationVersion: {
      value: function setApplicationVersion() {
        var appVersionBuf = ref.alloc(ref.types.char, "1");
        this.client.setApplicationVersion(appVersionBuf);
      }
    },
    initializeConfig: {
      value: function initializeConfig() {
        this.client.initializeConfig(ref.NULL);
      }
    },
    initialize: {
      value: function initialize() {
        this.client.initialize(ref.types["void"]);
      }
    },
    setVideoCaptureParameters: {
      value: function setVideoCaptureParameters() {
        // Requires a struct of VIDEO_CAPTURE_PARAMETERS
        // (See StackInterface.h ln:530 for typdef)
        var videoCaptureParametersStruct = StructType({
          nFrameRate: ref.types.int,
          nImageWidth: ref.types.int,
          nImageHeight: ref.types.int });
        var vcp = new videoCaptureParametersStruct({
          nFrameRate: 10,
          nImageHeight: 352,
          nImageWidth: 288 });
        this.client.setVideoCaptureParameters(vcp.ref());
      }
    },
    setDeviceLists: {
      value: function setDeviceLists(devices) {
        var audioInputs = devices.audioInputs;
        var audioOutputs = devices.audioOutputs;
        var videoInputs = devices.videoInputs;

        // for (const audioInput of audioInputs) {
        //   if (audioInput.deviceId !== 'default') {
        //     this.client.setAudioInputDevice(audioInput.groupId);
        //   }
        // }
        // for (const audioOutput of audioOutputs) {
        //   if (audioOutput.deviceId !== 'default') {
        //     this.client.setAudioOutputDevice(audioOutput.groupId);
        //   }
        // }

        // for (const videoInput of videoInputs) {
        //   if (videoInput.deviceId !== 'default') {
        //     const videoInputBuf = ref.alloc(ref.types.char, videoInput.label);
        //     this.client.setVideoCaptureDevice(videoInputBuf);
        //   }
        // }
      }
    },
    setVideoRenderView: {
      value: function setVideoRenderView() {
        log.info("setVideoRenderView");
        // this.client.setVideoRenderView();
      }
    },
    setSelfVideoDisplayView: {
      value: function setSelfVideoDisplayView() {
        log.info("setSelfVideoDisplayView");
        // this.client.setSelfVideoDisplayView();
      }
    },
    setAudioRingtoneFilename: {
      value: function setAudioRingtoneFilename() {
        var ringtonePath = "" + __dirname + "/../assets/RING1.wav";
        var ringtoneBuf = ref.alloc(ref.types.char, ringtonePath);
        this.client.setAudioRingtoneFilename(ringtoneBuf);
      }
    },
    setAudioRingtoneVolume: {
      value: function setAudioRingtoneVolume() {
        this.client.setAudioRingtoneVolume(1);
      }
    },
    startVoIPStack: {
      value: function startVoIPStack(cb) {
        this.client.startVoIPStack.async(cb);
      }
    },
    stopVoIPStack: {
      value: function stopVoIPStack() {
        this.client.stopVoIPStack(true);
      }
    },
    sendUserEvent: {
      value: function sendUserEvent(event) {
        this.client.sendUserEvent(event);
      }
    },
    startCall: {
      value: function startCall(phoneNumber) {
        var phoneName = arguments[1] === undefined ? null : arguments[1];
        var startWithVideo = arguments[2] === undefined ? false : arguments[2];

        this.client.placeCall(phoneNumber, phoneName, startWithVideo);
        var callEvent = startWithVideo ? "UI_EVENT_DIAL_VIDEO" : "UI_EVENT_DIAL";
        this.client.sendUserEvent(UI_EVENTS.get(callEvent));
      }
    },
    endCall: {
      value: function endCall() {
        this.sendUserEvent(UI_EVENTS.get("UI_EVENT_END"));
      }
    },
    setConfigParameters: {
      value: function setConfigParameters(params) {
        var _this = this;

        Object.keys(params).forEach(function (key) {
          var val = params[key];
          _this.setConfigParameter(key, val);
        });
      }
    },
    getConfigParameters: {
      value: function getConfigParameters(params) {
        var _this = this;

        var gotten = [];
        Object.keys(params).forEach(function (key) {
          var val = params[key];
          gotten.push(_this.getConfigParameter(key, val));
        });

        return gotten;
      }
    },
    setConfigParameter: {
      value: function setConfigParameter(paramName, paramValue) {
        // const pNameBuf = ref.alloc(ref.types.char, paramName);
        // const pValueBuf = ref.alloc(ref.types.char, paramValue);
        // this.client.setConfigParameter(pNameBuf, pValueBuf);
        this.client.setConfigParameter(paramName, paramValue);
      }
    },
    getConfigParameter: {
      value: function getConfigParameter(paramName) {
        var pNameBuf = ref.alloc(ref.types.char, paramName);
        var returnBuf = ref.alloc(ref.types.char, 100);
        this.client.getConfigParameter(pNameBuf, returnBuf, 100);
        return ref.get(returnBuf);
      }
    },
    getOSVersion: {
      value: function getOSVersion() {
        return this.client.getOSVersion("void");
      }
    },
    setOSVersion: {
      value: function setOSVersion(version) {
        this.client.setOSVersion(version);
      }
    }
  });

  return _class;
})();

module.exports = _default;

}).call(this,"/lib/Stack")
},{"./FFIFactory":2,"bunyan":11,"enum":19,"path":40,"ref":43,"ref-struct":42}],4:[function(require,module,exports){
/** @module StackMethodMap */

/**
  * Exports an array of objects for `ffi` method definitions.
  */
"use strict";

module.exports = [{
  methodName: "SetDataCallback",
  returnType: "void",
  paramTypes: ["pointer"] },
// What is the parameter type for this method?
{
  methodName: "SetSIPLogHandler",
  returnType: "void",
  paramTypes: ["void"] },
// What is the parameter type for this method?
// It *should* be an `enum` but trying `int`
{
  methodName: "SetDeviceType",
  returnType: "void",
  paramTypes: ["uint32"] }, {
  methodName: "GetDeviceType",
  returnType: "int",
  paramTypes: ["void"] },
// How the frack am I supposed to get this value?
// Garth suggested to use 1 (2016-03-09)
{
  methodName: "SetApplicationVersion",
  returnType: "void",
  paramTypes: ["pointer"] }, {
  methodName: "InitializeConfig",
  returnType: "void",
  paramTypes: ["pointer"] }, {
  methodName: "Initialize",
  returnType: "void",
  paramTypes: ["void"] },
// What is the param type for this method?
{
  methodName: "SetVideoCaptureParameters",
  returnType: "void",
  paramTypes: ["pointer"] }, {
  methodName: "SetAudioInputDevice",
  returnType: "void",
  paramTypes: ["int"] }, {
  methodName: "SetAudioOutputDevice",
  returnType: "void",
  paramTypes: ["int"] }, {
  methodName: "SetVideoCaptureDevice",
  returnType: "void",
  paramTypes: ["pointer"] },
// Hmmm ... what's our `self.window` equivalent?
{
  methodName: "SetVideoRenderView",
  returnType: "void",
  paramTypes: ["pointer", "int", "int", "int", "int"] },
// Again, `self.window`?
{
  methodName: "SetSelfVideoDisplayView",
  returnType: "void",
  paramTypes: ["pointer", "int", "int", "int", "int"] },
// Should this point to the .WAV file in the framework?
// Absolute or relative path?
{
  methodName: "SetAudioRingtoneFilename",
  returnType: "void",
  paramTypes: ["pointer"] }, {
  methodName: "SetAudioRingtoneVolume",
  returnType: "void",
  paramTypes: ["double"] }, {
  methodName: "SetConfigParameter",
  returnType: "void",
  paramTypes: ["string", "string"] }, {
  methodName: "StartVoIPStack",
  returnType: "void",
  paramTypes: [] }, {
  methodName: "StopVoIPStack",
  returnType: "void",
  paramTypes: ["bool"] }, {
  methodName: "PlaceCall",
  returnType: "void",
  paramTypes: ["string", "string", "bool"] }, {
  methodName: "GetConfigParameter",
  returnType: "long",
  paramTypes: ["pointer", "pointer", "int"] }, {
  methodName: "SetOSVersion",
  returnType: "void",
  paramTypes: ["float"] }, {
  methodName: "GetOSVersion",
  returnType: "float",
  paramTypes: ["void"] }, {
  methodName: "SendUserEvent",
  returnType: "void",
  paramTypes: ["int"] }];

},{}],5:[function(require,module,exports){
// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// when used in node, this will actually load the util module we depend on
// versus loading the builtin util module as happens otherwise
// this is a bug in node module loading as far as I am concerned
var util = require('util/');

var pSlice = Array.prototype.slice;
var hasOwn = Object.prototype.hasOwnProperty;

// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  }
  else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = stackStartFunction.name;
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function replacer(key, value) {
  if (util.isUndefined(value)) {
    return '' + value;
  }
  if (util.isNumber(value) && !isFinite(value)) {
    return value.toString();
  }
  if (util.isFunction(value) || util.isRegExp(value)) {
    return value.toString();
  }
  return value;
}

function truncate(s, n) {
  if (util.isString(s)) {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}

function getMessage(self) {
  return truncate(JSON.stringify(self.actual, replacer), 128) + ' ' +
         self.operator + ' ' +
         truncate(JSON.stringify(self.expected, replacer), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

function _deepEqual(actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (util.isBuffer(actual) && util.isBuffer(expected)) {
    if (actual.length != expected.length) return false;

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }

    return true;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (!util.isObject(actual) && !util.isObject(expected)) {
    return actual == expected;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b) {
  if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b)) {
    return a === b;
  }
  var aIsArgs = isArguments(a),
      bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b);
  }
  var ka = objectKeys(a),
      kb = objectKeys(b),
      key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key])) return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  } else if (actual instanceof expected) {
    return true;
  } else if (expected.call({}, actual) === true) {
    return true;
  }

  return false;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (util.isString(expected)) {
    message = expected;
    expected = null;
  }

  try {
    block();
  } catch (e) {
    actual = e;
  }

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  if (!shouldThrow && expectedException(actual, expected)) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/message) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

assert.ifError = function(err) { if (err) {throw err;}};

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

},{"util/":60}],6:[function(require,module,exports){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

},{}],7:[function(require,module,exports){
(function (process,__filename){

/**
 * Module dependencies.
 */

var fs = require('fs')
  , path = require('path')
  , join = path.join
  , dirname = path.dirname
  , exists = fs.existsSync || path.existsSync
  , defaults = {
        arrow: process.env.NODE_BINDINGS_ARROW || ' → '
      , compiled: process.env.NODE_BINDINGS_COMPILED_DIR || 'compiled'
      , platform: process.platform
      , arch: process.arch
      , version: process.versions.node
      , bindings: 'bindings.node'
      , try: [
          // node-gyp's linked version in the "build" dir
          [ 'module_root', 'build', 'bindings' ]
          // node-waf and gyp_addon (a.k.a node-gyp)
        , [ 'module_root', 'build', 'Debug', 'bindings' ]
        , [ 'module_root', 'build', 'Release', 'bindings' ]
          // Debug files, for development (legacy behavior, remove for node v0.9)
        , [ 'module_root', 'out', 'Debug', 'bindings' ]
        , [ 'module_root', 'Debug', 'bindings' ]
          // Release files, but manually compiled (legacy behavior, remove for node v0.9)
        , [ 'module_root', 'out', 'Release', 'bindings' ]
        , [ 'module_root', 'Release', 'bindings' ]
          // Legacy from node-waf, node <= 0.4.x
        , [ 'module_root', 'build', 'default', 'bindings' ]
          // Production "Release" buildtype binary (meh...)
        , [ 'module_root', 'compiled', 'version', 'platform', 'arch', 'bindings' ]
        ]
    }

/**
 * The main `bindings()` function loads the compiled bindings for a given module.
 * It uses V8's Error API to determine the parent filename that this function is
 * being invoked from, which is then used to find the root directory.
 */

function bindings (opts) {

  // Argument surgery
  if (typeof opts == 'string') {
    opts = { bindings: opts }
  } else if (!opts) {
    opts = {}
  }
  opts.__proto__ = defaults

  // Get the module root
  if (!opts.module_root) {
    opts.module_root = exports.getRoot(exports.getFileName())
  }

  // Ensure the given bindings name ends with .node
  if (path.extname(opts.bindings) != '.node') {
    opts.bindings += '.node'
  }

  var tries = []
    , i = 0
    , l = opts.try.length
    , n
    , b
    , err

  for (; i<l; i++) {
    n = join.apply(null, opts.try[i].map(function (p) {
      return opts[p] || p
    }))
    tries.push(n)
    try {
      b = opts.path ? require.resolve(n) : require(n)
      if (!opts.path) {
        b.path = n
      }
      return b
    } catch (e) {
      if (!/not find/i.test(e.message)) {
        throw e
      }
    }
  }

  err = new Error('Could not locate the bindings file. Tried:\n'
    + tries.map(function (a) { return opts.arrow + a }).join('\n'))
  err.tries = tries
  throw err
}
module.exports = exports = bindings


/**
 * Gets the filename of the JavaScript file that invokes this function.
 * Used to help find the root directory of a module.
 * Optionally accepts an filename argument to skip when searching for the invoking filename
 */

exports.getFileName = function getFileName (calling_file) {
  var origPST = Error.prepareStackTrace
    , origSTL = Error.stackTraceLimit
    , dummy = {}
    , fileName

  Error.stackTraceLimit = 10

  Error.prepareStackTrace = function (e, st) {
    for (var i=0, l=st.length; i<l; i++) {
      fileName = st[i].getFileName()
      if (fileName !== __filename) {
        if (calling_file) {
            if (fileName !== calling_file) {
              return
            }
        } else {
          return
        }
      }
    }
  }

  // run the 'prepareStackTrace' function above
  Error.captureStackTrace(dummy)
  dummy.stack

  // cleanup
  Error.prepareStackTrace = origPST
  Error.stackTraceLimit = origSTL

  return fileName
}

/**
 * Gets the root directory of a module, given an arbitrary filename
 * somewhere in the module tree. The "root directory" is the directory
 * containing the `package.json` file.
 *
 *   In:  /home/nate/node-native-module/lib/index.js
 *   Out: /home/nate/node-native-module
 */

exports.getRoot = function getRoot (file) {
  var dir = dirname(file)
    , prev
  while (true) {
    if (dir === '.') {
      // Avoids an infinite loop in rare cases, like the REPL
      dir = process.cwd()
    }
    if (exists(join(dir, 'package.json')) || exists(join(dir, 'node_modules'))) {
      // Found the 'package.json' file or 'node_modules' dir; we're done
      return dir
    }
    if (prev === dir) {
      // Got to the top
      throw new Error('Could not find module root given file: "' + file
                    + '". Do you have a `package.json` file? ')
    }
    // Try the parent dir next
    prev = dir
    dir = join(dir, '..')
  }
}

}).call(this,require('_process'),"/node_modules/bindings/bindings.js")
},{"_process":41,"fs":9,"path":40}],8:[function(require,module,exports){

},{}],9:[function(require,module,exports){
arguments[4][8][0].apply(exports,arguments)
},{"dup":8}],10:[function(require,module,exports){
(function (global){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192 // not used by this implementation

var rootParent = {}

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Safari 5-7 lacks support for changing the `Object.prototype.constructor` property
 *     on objects.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

function typedArraySupport () {
  function Bar () {}
  try {
    var arr = new Uint8Array(1)
    arr.foo = function () { return 42 }
    arr.constructor = Bar
    return arr.foo() === 42 && // typed array instances can be augmented
        arr.constructor === Bar && // constructor can be set
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (arg) {
  if (!(this instanceof Buffer)) {
    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
    if (arguments.length > 1) return new Buffer(arg, arguments[1])
    return new Buffer(arg)
  }

  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    this.length = 0
    this.parent = undefined
  }

  // Common case.
  if (typeof arg === 'number') {
    return fromNumber(this, arg)
  }

  // Slightly less common case.
  if (typeof arg === 'string') {
    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8')
  }

  // Unusual.
  return fromObject(this, arg)
}

function fromNumber (that, length) {
  that = allocate(that, length < 0 ? 0 : checked(length) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < length; i++) {
      that[i] = 0
    }
  }
  return that
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8'

  // Assumption: byteLength() return value is always < kMaxLength.
  var length = byteLength(string, encoding) | 0
  that = allocate(that, length)

  that.write(string, encoding)
  return that
}

function fromObject (that, object) {
  if (Buffer.isBuffer(object)) return fromBuffer(that, object)

  if (isArray(object)) return fromArray(that, object)

  if (object == null) {
    throw new TypeError('must start with number, buffer, array or string')
  }

  if (typeof ArrayBuffer !== 'undefined') {
    if (object.buffer instanceof ArrayBuffer) {
      return fromTypedArray(that, object)
    }
    if (object instanceof ArrayBuffer) {
      return fromArrayBuffer(that, object)
    }
  }

  if (object.length) return fromArrayLike(that, object)

  return fromJsonObject(that, object)
}

function fromBuffer (that, buffer) {
  var length = checked(buffer.length) | 0
  that = allocate(that, length)
  buffer.copy(that, 0, 0, length)
  return that
}

function fromArray (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

// Duplicate of fromArray() to keep fromArray() monomorphic.
function fromTypedArray (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  // Truncating the elements is probably not what people expect from typed
  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
  // of the old Buffer constructor.
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array) {
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    array.byteLength
    that = Buffer._augment(new Uint8Array(array))
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromTypedArray(that, new Uint8Array(array))
  }
  return that
}

function fromArrayLike (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
// Returns a zero-length buffer for inputs that don't conform to the spec.
function fromJsonObject (that, object) {
  var array
  var length = 0

  if (object.type === 'Buffer' && isArray(object.data)) {
    array = object.data
    length = checked(array.length) | 0
  }
  that = allocate(that, length)

  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
} else {
  // pre-set for values that may exist in the future
  Buffer.prototype.length = undefined
  Buffer.prototype.parent = undefined
}

function allocate (that, length) {
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = Buffer._augment(new Uint8Array(length))
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that.length = length
    that._isBuffer = true
  }

  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1
  if (fromPool) that.parent = rootParent

  return that
}

function checked (length) {
  // Note: cannot use `length < kMaxLength` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (subject, encoding) {
  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)

  var buf = new Buffer(subject, encoding)
  delete buf.parent
  return buf
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  var i = 0
  var len = Math.min(x, y)
  while (i < len) {
    if (a[i] !== b[i]) break

    ++i
  }

  if (i !== len) {
    x = a[i]
    y = b[i]
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')

  if (list.length === 0) {
    return new Buffer(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; i++) {
      length += list[i].length
    }
  }

  var buf = new Buffer(length)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

function byteLength (string, encoding) {
  if (typeof string !== 'string') string = '' + string

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'binary':
      // Deprecated
      case 'raw':
      case 'raws':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  start = start | 0
  end = end === undefined || end === Infinity ? this.length : end | 0

  if (!encoding) encoding = 'utf8'
  if (start < 0) start = 0
  if (end > this.length) end = this.length
  if (end <= start) return ''

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'binary':
        return binarySlice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return 0
  return Buffer.compare(this, b)
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
  else if (byteOffset < -0x80000000) byteOffset = -0x80000000
  byteOffset >>= 0

  if (this.length === 0) return -1
  if (byteOffset >= this.length) return -1

  // Negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

  if (typeof val === 'string') {
    if (val.length === 0) return -1 // special case: looking for empty string always fails
    return String.prototype.indexOf.call(this, val, byteOffset)
  }
  if (Buffer.isBuffer(val)) {
    return arrayIndexOf(this, val, byteOffset)
  }
  if (typeof val === 'number') {
    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
    }
    return arrayIndexOf(this, [ val ], byteOffset)
  }

  function arrayIndexOf (arr, val, byteOffset) {
    var foundIndex = -1
    for (var i = 0; byteOffset + i < arr.length; i++) {
      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
      } else {
        foundIndex = -1
      }
    }
    return -1
  }

  throw new TypeError('val must be string, number or Buffer')
}

// `get` is deprecated
Buffer.prototype.get = function get (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` is deprecated
Buffer.prototype.set = function set (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) throw new Error('Invalid hex string')
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function binaryWrite (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    var swap = encoding
    encoding = offset
    offset = length | 0
    length = swap
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'binary':
        return binaryWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function binarySlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
  }

  if (newBuf.length) newBuf.parent = this.parent || this

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
  if (offset < 0) throw new RangeError('index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; i--) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; i++) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    target._set(this.subarray(start, start + len), targetStart)
  }

  return len
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function fill (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (end < start) throw new RangeError('end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')

  var i
  if (typeof value === 'number') {
    for (i = start; i < end; i++) {
      this[i] = value
    }
  } else {
    var bytes = utf8ToBytes(value.toString())
    var len = bytes.length
    for (i = start; i < end; i++) {
      this[i] = bytes[i % len]
    }
  }

  return this
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function toArrayBuffer () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1) {
        buf[i] = this[i]
      }
      return buf.buffer
    }
  } else {
    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function _augment (arr) {
  arr.constructor = Buffer
  arr._isBuffer = true

  // save reference to original Uint8Array set method before overwriting
  arr._set = arr.set

  // deprecated
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.equals = BP.equals
  arr.compare = BP.compare
  arr.indexOf = BP.indexOf
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUIntLE = BP.readUIntLE
  arr.readUIntBE = BP.readUIntBE
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readIntLE = BP.readIntLE
  arr.readIntBE = BP.readIntBE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUIntLE = BP.writeUIntLE
  arr.writeUIntBE = BP.writeUIntBE
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeIntLE = BP.writeIntLE
  arr.writeIntBE = BP.writeIntBE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; i++) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"base64-js":6,"ieee754":34,"isarray":37}],11:[function(require,module,exports){
(function (Buffer,process){
/**
 * Copyright (c) 2015 Trent Mick.
 * Copyright (c) 2015 Joyent Inc.
 *
 * The bunyan logging library for node.js.
 *
 * -*- mode: js -*-
 * vim: expandtab:ts=4:sw=4
 */

var VERSION = '1.8.1';

/*
 * Bunyan log format version. This becomes the 'v' field on all log records.
 * This will be incremented if there is any backward incompatible change to
 * the log record format. Details will be in 'CHANGES.md' (the change log).
 */
var LOG_VERSION = 0;


var xxx = function xxx(s) {     // internal dev/debug logging
    var args = ['XX' + 'X: '+s].concat(
        Array.prototype.slice.call(arguments, 1));
    console.error.apply(this, args);
};
var xxx = function xxx() {};  // comment out to turn on debug logging


/*
 * Runtime environment notes:
 *
 * Bunyan is intended to run in a number of runtime environments. Here are
 * some notes on differences for those envs and how the code copes.
 *
 * - node.js: The primary target environment.
 * - NW.js: http://nwjs.io/  An *app* environment that feels like both a
 *   node env -- it has node-like globals (`process`, `global`) and
 *   browser-like globals (`window`, `navigator`). My *understanding* is that
 *   bunyan can operate as if this is vanilla node.js.
 * - browser: Failing the above, we sniff using the `window` global
 *   <https://developer.mozilla.org/en-US/docs/Web/API/Window/window>.
 *      - browserify: http://browserify.org/  A browser-targetting bundler of
 *        node.js deps. The runtime is a browser env, so can't use fs access,
 *        etc. Browserify's build looks for `require(<single-string>)` imports
 *        to bundle. For some imports it won't be able to handle, we "hide"
 *        from browserify with `require('frobshizzle' + '')`.
 * - Other? Please open issues if things are broken.
 */
var runtimeEnv;
if (typeof (process) !== 'undefined' && process.versions) {
    if (process.versions.nw) {
        runtimeEnv = 'nw';
    } else if (process.versions.node) {
        runtimeEnv = 'node';
    }
}
if (!runtimeEnv && typeof (window) !== 'undefined' &&
    window.window === window) {
    runtimeEnv = 'browser';
}
if (!runtimeEnv) {
    throw new Error('unknown runtime environment');
}


var os, fs, dtrace;
if (runtimeEnv === 'browser') {
    os = {
        hostname: function () {
            return window.location.host;
        }
    };
    fs = {};
    dtrace = null;
} else {
    os = require('os');
    fs = require('fs');
    try {
        dtrace = require('dtrace-provider' + '');
    } catch (e) {
        dtrace = null;
    }
}
var util = require('util');
var assert = require('assert');
var EventEmitter = require('events').EventEmitter;
var stream = require('stream');

try {
    var safeJsonStringify = require('safe-json-stringify');
} catch (e) {
    safeJsonStringify = null;
}
if (process.env.BUNYAN_TEST_NO_SAFE_JSON_STRINGIFY) {
    safeJsonStringify = null;
}

// The 'mv' module is required for rotating-file stream support.
try {
    var mv = require('mv' + '');
} catch (e) {
    mv = null;
}

try {
    var sourceMapSupport = require('source-map-support' + '');
} catch (_) {
    sourceMapSupport = null;
}


//---- Internal support stuff

/**
 * A shallow copy of an object. Bunyan logging attempts to never cause
 * exceptions, so this function attempts to handle non-objects gracefully.
 */
function objCopy(obj) {
    if (obj == null) {  // null or undefined
        return obj;
    } else if (Array.isArray(obj)) {
        return obj.slice();
    } else if (typeof (obj) === 'object') {
        var copy = {};
        Object.keys(obj).forEach(function (k) {
            copy[k] = obj[k];
        });
        return copy;
    } else {
        return obj;
    }
}

var format = util.format;
if (!format) {
    // If node < 0.6, then use its `util.format`:
    // <https://github.com/joyent/node/blob/master/lib/util.js#L22>:
    var inspect = util.inspect;
    var formatRegExp = /%[sdj%]/g;
    format = function format(f) {
        if (typeof (f) !== 'string') {
            var objects = [];
            for (var i = 0; i < arguments.length; i++) {
                objects.push(inspect(arguments[i]));
            }
            return objects.join(' ');
        }

        var i = 1;
        var args = arguments;
        var len = args.length;
        var str = String(f).replace(formatRegExp, function (x) {
            if (i >= len)
                return x;
            switch (x) {
                case '%s': return String(args[i++]);
                case '%d': return Number(args[i++]);
                case '%j': return JSON.stringify(args[i++], safeCycles());
                case '%%': return '%';
                default:
                    return x;
            }
        });
        for (var x = args[i]; i < len; x = args[++i]) {
            if (x === null || typeof (x) !== 'object') {
                str += ' ' + x;
            } else {
                str += ' ' + inspect(x);
            }
        }
        return str;
    };
}


/**
 * Gather some caller info 3 stack levels up.
 * See <http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi>.
 */
function getCaller3Info() {
    if (this === undefined) {
        // Cannot access caller info in 'strict' mode.
        return;
    }
    var obj = {};
    var saveLimit = Error.stackTraceLimit;
    var savePrepare = Error.prepareStackTrace;
    Error.stackTraceLimit = 3;
    Error.captureStackTrace(this, getCaller3Info);

    Error.prepareStackTrace = function (_, stack) {
        var caller = stack[2];
        if (sourceMapSupport) {
            caller = sourceMapSupport.wrapCallSite(caller);
        }
        obj.file = caller.getFileName();
        obj.line = caller.getLineNumber();
        var func = caller.getFunctionName();
        if (func)
            obj.func = func;
    };
    this.stack;
    Error.stackTraceLimit = saveLimit;
    Error.prepareStackTrace = savePrepare;
    return obj;
}


function _indent(s, indent) {
    if (!indent) indent = '    ';
    var lines = s.split(/\r?\n/g);
    return indent + lines.join('\n' + indent);
}


/**
 * Warn about an bunyan processing error.
 *
 * @param msg {String} Message with which to warn.
 * @param dedupKey {String} Optional. A short string key for this warning to
 *      have its warning only printed once.
 */
function _warn(msg, dedupKey) {
    assert.ok(msg);
    if (dedupKey) {
        if (_warned[dedupKey]) {
            return;
        }
        _warned[dedupKey] = true;
    }
    process.stderr.write(msg + '\n');
}
function _haveWarned(dedupKey) {
    return _warned[dedupKey];
}
var _warned = {};


function ConsoleRawStream() {}
ConsoleRawStream.prototype.write = function (rec) {
    if (rec.level < INFO) {
        console.log(rec);
    } else if (rec.level < WARN) {
        console.info(rec);
    } else if (rec.level < ERROR) {
        console.warn(rec);
    } else {
        console.error(rec);
    }
};


//---- Levels

var TRACE = 10;
var DEBUG = 20;
var INFO = 30;
var WARN = 40;
var ERROR = 50;
var FATAL = 60;

var levelFromName = {
    'trace': TRACE,
    'debug': DEBUG,
    'info': INFO,
    'warn': WARN,
    'error': ERROR,
    'fatal': FATAL
};
var nameFromLevel = {};
Object.keys(levelFromName).forEach(function (name) {
    nameFromLevel[levelFromName[name]] = name;
});

// Dtrace probes.
var dtp = undefined;
var probes = dtrace && {};

/**
 * Resolve a level number, name (upper or lowercase) to a level number value.
 *
 * @param nameOrNum {String|Number} A level name (case-insensitive) or positive
 *      integer level.
 * @api public
 */
function resolveLevel(nameOrNum) {
    var level;
    var type = typeof (nameOrNum);
    if (type === 'string') {
        level = levelFromName[nameOrNum.toLowerCase()];
        if (!level) {
            throw new Error(format('unknown level name: "%s"', nameOrNum));
        }
    } else if (type !== 'number') {
        throw new TypeError(format('cannot resolve level: invalid arg (%s):',
            type, nameOrNum));
    } else if (nameOrNum < 0 || Math.floor(nameOrNum) !== nameOrNum) {
        throw new TypeError(format('level is not a positive integer: %s',
            nameOrNum));
    } else {
        level = nameOrNum;
    }
    return level;
}


function isWritable(obj) {
    if (obj instanceof stream.Writable) {
        return true;
    }
    return typeof (obj.write) === 'function';
}


//---- Logger class

/**
 * Create a Logger instance.
 *
 * @param options {Object} See documentation for full details. At minimum
 *    this must include a 'name' string key. Configuration keys:
 *      - `streams`: specify the logger output streams. This is an array of
 *        objects with these fields:
 *          - `type`: The stream type. See README.md for full details.
 *            Often this is implied by the other fields. Examples are
 *            'file', 'stream' and "raw".
 *          - `level`: Defaults to 'info'.
 *          - `path` or `stream`: The specify the file path or writeable
 *            stream to which log records are written. E.g.
 *            `stream: process.stdout`.
 *          - `closeOnExit` (boolean): Optional. Default is true for a
 *            'file' stream when `path` is given, false otherwise.
 *        See README.md for full details.
 *      - `level`: set the level for a single output stream (cannot be used
 *        with `streams`)
 *      - `stream`: the output stream for a logger with just one, e.g.
 *        `process.stdout` (cannot be used with `streams`)
 *      - `serializers`: object mapping log record field names to
 *        serializing functions. See README.md for details.
 *      - `src`: Boolean (default false). Set true to enable 'src' automatic
 *        field with log call source info.
 *    All other keys are log record fields.
 *
 * An alternative *internal* call signature is used for creating a child:
 *    new Logger(<parent logger>, <child options>[, <child opts are simple>]);
 *
 * @param _childSimple (Boolean) An assertion that the given `_childOptions`
 *    (a) only add fields (no config) and (b) no serialization handling is
 *    required for them. IOW, this is a fast path for frequent child
 *    creation.
 */
function Logger(options, _childOptions, _childSimple) {
    xxx('Logger start:', options)
    if (!(this instanceof Logger)) {
        return new Logger(options, _childOptions);
    }

    // Input arg validation.
    var parent;
    if (_childOptions !== undefined) {
        parent = options;
        options = _childOptions;
        if (!(parent instanceof Logger)) {
            throw new TypeError(
                'invalid Logger creation: do not pass a second arg');
        }
    }
    if (!options) {
        throw new TypeError('options (object) is required');
    }
    if (!parent) {
        if (!options.name) {
            throw new TypeError('options.name (string) is required');
        }
    } else {
        if (options.name) {
            throw new TypeError(
                'invalid options.name: child cannot set logger name');
        }
    }
    if (options.stream && options.streams) {
        throw new TypeError('cannot mix "streams" and "stream" options');
    }
    if (options.streams && !Array.isArray(options.streams)) {
        throw new TypeError('invalid options.streams: must be an array')
    }
    if (options.serializers && (typeof (options.serializers) !== 'object' ||
            Array.isArray(options.serializers))) {
        throw new TypeError('invalid options.serializers: must be an object')
    }

    EventEmitter.call(this);

    // Fast path for simple child creation.
    if (parent && _childSimple) {
        // `_isSimpleChild` is a signal to stream close handling that this child
        // owns none of its streams.
        this._isSimpleChild = true;

        this._level = parent._level;
        this.streams = parent.streams;
        this.serializers = parent.serializers;
        this.src = parent.src;
        var fields = this.fields = {};
        var parentFieldNames = Object.keys(parent.fields);
        for (var i = 0; i < parentFieldNames.length; i++) {
            var name = parentFieldNames[i];
            fields[name] = parent.fields[name];
        }
        var names = Object.keys(options);
        for (var i = 0; i < names.length; i++) {
            var name = names[i];
            fields[name] = options[name];
        }
        return;
    }

    // Start values.
    var self = this;
    if (parent) {
        this._level = parent._level;
        this.streams = [];
        for (var i = 0; i < parent.streams.length; i++) {
            var s = objCopy(parent.streams[i]);
            s.closeOnExit = false; // Don't own parent stream.
            this.streams.push(s);
        }
        this.serializers = objCopy(parent.serializers);
        this.src = parent.src;
        this.fields = objCopy(parent.fields);
        if (options.level) {
            this.level(options.level);
        }
    } else {
        this._level = Number.POSITIVE_INFINITY;
        this.streams = [];
        this.serializers = null;
        this.src = false;
        this.fields = {};
    }

    if (!dtp && dtrace) {
        dtp = dtrace.createDTraceProvider('bunyan');

        for (var level in levelFromName) {
            var probe;

            probes[levelFromName[level]] = probe =
                dtp.addProbe('log-' + level, 'char *');

            // Explicitly add a reference to dtp to prevent it from being GC'd
            probe.dtp = dtp;
        }

        dtp.enable();
    }

    // Handle *config* options (i.e. options that are not just plain data
    // for log records).
    if (options.stream) {
        self.addStream({
            type: 'stream',
            stream: options.stream,
            closeOnExit: false,
            level: options.level
        });
    } else if (options.streams) {
        options.streams.forEach(function (s) {
            self.addStream(s, options.level);
        });
    } else if (parent && options.level) {
        this.level(options.level);
    } else if (!parent) {
        if (runtimeEnv === 'browser') {
            /*
             * In the browser we'll be emitting to console.log by default.
             * Any console.log worth its salt these days can nicely render
             * and introspect objects (e.g. the Firefox and Chrome console)
             * so let's emit the raw log record. Are there browsers for which
             * that breaks things?
             */
            self.addStream({
                type: 'raw',
                stream: new ConsoleRawStream(),
                closeOnExit: false,
                level: options.level
            });
        } else {
            self.addStream({
                type: 'stream',
                stream: process.stdout,
                closeOnExit: false,
                level: options.level
            });
        }
    }
    if (options.serializers) {
        self.addSerializers(options.serializers);
    }
    if (options.src) {
        this.src = true;
    }
    xxx('Logger: ', self)

    // Fields.
    // These are the default fields for log records (minus the attributes
    // removed in this constructor). To allow storing raw log records
    // (unrendered), `this.fields` must never be mutated. Create a copy for
    // any changes.
    var fields = objCopy(options);
    delete fields.stream;
    delete fields.level;
    delete fields.streams;
    delete fields.serializers;
    delete fields.src;
    if (this.serializers) {
        this._applySerializers(fields);
    }
    if (!fields.hostname && !self.fields.hostname) {
        fields.hostname = os.hostname();
    }
    if (!fields.pid) {
        fields.pid = process.pid;
    }
    Object.keys(fields).forEach(function (k) {
        self.fields[k] = fields[k];
    });
}

util.inherits(Logger, EventEmitter);


/**
 * Add a stream
 *
 * @param stream {Object}. Object with these fields:
 *    - `type`: The stream type. See README.md for full details.
 *      Often this is implied by the other fields. Examples are
 *      'file', 'stream' and "raw".
 *    - `path` or `stream`: The specify the file path or writeable
 *      stream to which log records are written. E.g.
 *      `stream: process.stdout`.
 *    - `level`: Optional. Falls back to `defaultLevel`.
 *    - `closeOnExit` (boolean): Optional. Default is true for a
 *      'file' stream when `path` is given, false otherwise.
 *    See README.md for full details.
 * @param defaultLevel {Number|String} Optional. A level to use if
 *      `stream.level` is not set. If neither is given, this defaults to INFO.
 */
Logger.prototype.addStream = function addStream(s, defaultLevel) {
    var self = this;
    if (defaultLevel === null || defaultLevel === undefined) {
        defaultLevel = INFO;
    }

    s = objCopy(s);

    // Implicit 'type' from other args.
    if (!s.type) {
        if (s.stream) {
            s.type = 'stream';
        } else if (s.path) {
            s.type = 'file'
        }
    }
    s.raw = (s.type === 'raw');  // PERF: Allow for faster check in `_emit`.

    if (s.level !== undefined) {
        s.level = resolveLevel(s.level);
    } else {
        s.level = resolveLevel(defaultLevel);
    }
    if (s.level < self._level) {
        self._level = s.level;
    }

    switch (s.type) {
    case 'stream':
        assert.ok(isWritable(s.stream),
                  '"stream" stream is not writable: ' + util.inspect(s.stream));

        if (!s.closeOnExit) {
            s.closeOnExit = false;
        }
        break;
    case 'file':
        if (s.reemitErrorEvents === undefined) {
            s.reemitErrorEvents = true;
        }
        if (!s.stream) {
            s.stream = fs.createWriteStream(s.path,
                                            {flags: 'a', encoding: 'utf8'});
            if (!s.closeOnExit) {
                s.closeOnExit = true;
            }
        } else {
            if (!s.closeOnExit) {
                s.closeOnExit = false;
            }
        }
        break;
    case 'rotating-file':
        assert.ok(!s.stream,
                  '"rotating-file" stream should not give a "stream"');
        assert.ok(s.path);
        assert.ok(mv, '"rotating-file" stream type is not supported: '
                      + 'missing "mv" module');
        s.stream = new RotatingFileStream(s);
        if (!s.closeOnExit) {
            s.closeOnExit = true;
        }
        break;
    case 'raw':
        if (!s.closeOnExit) {
            s.closeOnExit = false;
        }
        break;
    default:
        throw new TypeError('unknown stream type "' + s.type + '"');
    }

    if (s.reemitErrorEvents && typeof (s.stream.on) === 'function') {
        // TODO: When we have `<logger>.close()`, it should remove event
        //      listeners to not leak Logger instances.
        s.stream.on('error', function onStreamError(err) {
            self.emit('error', err, s);
        });
    }

    self.streams.push(s);
    delete self.haveNonRawStreams;  // reset
}


/**
 * Add serializers
 *
 * @param serializers {Object} Optional. Object mapping log record field names
 *    to serializing functions. See README.md for details.
 */
Logger.prototype.addSerializers = function addSerializers(serializers) {
    var self = this;

    if (!self.serializers) {
        self.serializers = {};
    }
    Object.keys(serializers).forEach(function (field) {
        var serializer = serializers[field];
        if (typeof (serializer) !== 'function') {
            throw new TypeError(format(
                'invalid serializer for "%s" field: must be a function',
                field));
        } else {
            self.serializers[field] = serializer;
        }
    });
}



/**
 * Create a child logger, typically to add a few log record fields.
 *
 * This can be useful when passing a logger to a sub-component, e.g. a
 * 'wuzzle' component of your service:
 *
 *    var wuzzleLog = log.child({component: 'wuzzle'})
 *    var wuzzle = new Wuzzle({..., log: wuzzleLog})
 *
 * Then log records from the wuzzle code will have the same structure as
 * the app log, *plus the component='wuzzle' field*.
 *
 * @param options {Object} Optional. Set of options to apply to the child.
 *    All of the same options for a new Logger apply here. Notes:
 *      - The parent's streams are inherited and cannot be removed in this
 *        call. Any given `streams` are *added* to the set inherited from
 *        the parent.
 *      - The parent's serializers are inherited, though can effectively be
 *        overwritten by using duplicate keys.
 *      - Can use `level` to set the level of the streams inherited from
 *        the parent. The level for the parent is NOT affected.
 * @param simple {Boolean} Optional. Set to true to assert that `options`
 *    (a) only add fields (no config) and (b) no serialization handling is
 *    required for them. IOW, this is a fast path for frequent child
 *    creation. See 'tools/timechild.js' for numbers.
 */
Logger.prototype.child = function (options, simple) {
    return new (this.constructor)(this, options || {}, simple);
}


/**
 * A convenience method to reopen 'file' streams on a logger. This can be
 * useful with external log rotation utilities that move and re-open log files
 * (e.g. logrotate on Linux, logadm on SmartOS/Illumos). Those utilities
 * typically have rotation options to copy-and-truncate the log file, but
 * you may not want to use that. An alternative is to do this in your
 * application:
 *
 *      var log = bunyan.createLogger(...);
 *      ...
 *      process.on('SIGUSR2', function () {
 *          log.reopenFileStreams();
 *      });
 *      ...
 *
 * See <https://github.com/trentm/node-bunyan/issues/104>.
 */
Logger.prototype.reopenFileStreams = function () {
    var self = this;
    self.streams.forEach(function (s) {
        if (s.type === 'file') {
            if (s.stream) {
                // Not sure if typically would want this, or more immediate
                // `s.stream.destroy()`.
                s.stream.end();
                s.stream.destroySoon();
                delete s.stream;
            }
            s.stream = fs.createWriteStream(s.path,
                {flags: 'a', encoding: 'utf8'});
            s.stream.on('error', function (err) {
                self.emit('error', err, s);
            });
        }
    });
};


/* BEGIN JSSTYLED */
/**
 * Close this logger.
 *
 * This closes streams (that it owns, as per 'endOnClose' attributes on
 * streams), etc. Typically you **don't** need to bother calling this.
Logger.prototype.close = function () {
    if (this._closed) {
        return;
    }
    if (!this._isSimpleChild) {
        self.streams.forEach(function (s) {
            if (s.endOnClose) {
                xxx('closing stream s:', s);
                s.stream.end();
                s.endOnClose = false;
            }
        });
    }
    this._closed = true;
}
 */
/* END JSSTYLED */


/**
 * Get/set the level of all streams on this logger.
 *
 * Get Usage:
 *    // Returns the current log level (lowest level of all its streams).
 *    log.level() -> INFO
 *
 * Set Usage:
 *    log.level(INFO)       // set all streams to level INFO
 *    log.level('info')     // can use 'info' et al aliases
 */
Logger.prototype.level = function level(value) {
    if (value === undefined) {
        return this._level;
    }
    var newLevel = resolveLevel(value);
    var len = this.streams.length;
    for (var i = 0; i < len; i++) {
        this.streams[i].level = newLevel;
    }
    this._level = newLevel;
}


/**
 * Get/set the level of a particular stream on this logger.
 *
 * Get Usage:
 *    // Returns an array of the levels of each stream.
 *    log.levels() -> [TRACE, INFO]
 *
 *    // Returns a level of the identified stream.
 *    log.levels(0) -> TRACE      // level of stream at index 0
 *    log.levels('foo')           // level of stream with name 'foo'
 *
 * Set Usage:
 *    log.levels(0, INFO)         // set level of stream 0 to INFO
 *    log.levels(0, 'info')       // can use 'info' et al aliases
 *    log.levels('foo', WARN)     // set stream named 'foo' to WARN
 *
 * Stream names: When streams are defined, they can optionally be given
 * a name. For example,
 *       log = new Logger({
 *         streams: [
 *           {
 *             name: 'foo',
 *             path: '/var/log/my-service/foo.log'
 *             level: 'trace'
 *           },
 *         ...
 *
 * @param name {String|Number} The stream index or name.
 * @param value {Number|String} The level value (INFO) or alias ('info').
 *    If not given, this is a 'get' operation.
 * @throws {Error} If there is no stream with the given name.
 */
Logger.prototype.levels = function levels(name, value) {
    if (name === undefined) {
        assert.equal(value, undefined);
        return this.streams.map(
            function (s) { return s.level });
    }
    var stream;
    if (typeof (name) === 'number') {
        stream = this.streams[name];
        if (stream === undefined) {
            throw new Error('invalid stream index: ' + name);
        }
    } else {
        var len = this.streams.length;
        for (var i = 0; i < len; i++) {
            var s = this.streams[i];
            if (s.name === name) {
                stream = s;
                break;
            }
        }
        if (!stream) {
            throw new Error(format('no stream with name "%s"', name));
        }
    }
    if (value === undefined) {
        return stream.level;
    } else {
        var newLevel = resolveLevel(value);
        stream.level = newLevel;
        if (newLevel < this._level) {
            this._level = newLevel;
        }
    }
}


/**
 * Apply registered serializers to the appropriate keys in the given fields.
 *
 * Pre-condition: This is only called if there is at least one serializer.
 *
 * @param fields (Object) The log record fields.
 * @param excludeFields (Object) Optional mapping of keys to `true` for
 *    keys to NOT apply a serializer.
 */
Logger.prototype._applySerializers = function (fields, excludeFields) {
    var self = this;

    xxx('_applySerializers: excludeFields', excludeFields);

    // Check each serializer against these (presuming number of serializers
    // is typically less than number of fields).
    Object.keys(this.serializers).forEach(function (name) {
        if (fields[name] === undefined ||
            (excludeFields && excludeFields[name]))
        {
            return;
        }
        xxx('_applySerializers; apply to "%s" key', name)
        try {
            fields[name] = self.serializers[name](fields[name]);
        } catch (err) {
            _warn(format('bunyan: ERROR: Exception thrown from the "%s" '
                + 'Bunyan serializer. This should never happen. This is a bug'
                + 'in that serializer function.\n%s',
                name, err.stack || err));
            fields[name] = format('(Error in Bunyan log "%s" serializer '
                + 'broke field. See stderr for details.)', name);
        }
    });
}


/**
 * Emit a log record.
 *
 * @param rec {log record}
 * @param noemit {Boolean} Optional. Set to true to skip emission
 *      and just return the JSON string.
 */
Logger.prototype._emit = function (rec, noemit) {
    var i;

    // Lazily determine if this Logger has non-'raw' streams. If there are
    // any, then we need to stringify the log record.
    if (this.haveNonRawStreams === undefined) {
        this.haveNonRawStreams = false;
        for (i = 0; i < this.streams.length; i++) {
            if (!this.streams[i].raw) {
                this.haveNonRawStreams = true;
                break;
            }
        }
    }

    // Stringify the object. Attempt to warn/recover on error.
    var str;
    if (noemit || this.haveNonRawStreams) {
        try {
            str = JSON.stringify(rec, safeCycles()) + '\n';
        } catch (e) {
            if (safeJsonStringify) {
                str = safeJsonStringify(rec) + '\n';
            } else {
                var dedupKey = e.stack.split(/\n/g, 2).join('\n');
                _warn('bunyan: ERROR: Exception in '
                    + '`JSON.stringify(rec)`. You can install the '
                    + '"safe-json-stringify" module to have Bunyan fallback '
                    + 'to safer stringification. Record:\n'
                    + _indent(format('%s\n%s', util.inspect(rec), e.stack)),
                    dedupKey);
                str = format('(Exception in JSON.stringify(rec): %j. '
                    + 'See stderr for details.)\n', e.message);
            }
        }
    }

    if (noemit)
        return str;

    var level = rec.level;
    for (i = 0; i < this.streams.length; i++) {
        var s = this.streams[i];
        if (s.level <= level) {
            xxx('writing log rec "%s" to "%s" stream (%d <= %d): %j',
                rec.msg, s.type, s.level, level, rec);
            s.stream.write(s.raw ? rec : str);
        }
    };

    return str;
}


/**
 * Build a log emitter function for level minLevel. I.e. this is the
 * creator of `log.info`, `log.error`, etc.
 */
function mkLogEmitter(minLevel) {
    return function () {
        var log = this;

        function mkRecord(args) {
            var excludeFields;
            if (args[0] instanceof Error) {
                // `log.<level>(err, ...)`
                fields = {
                    // Use this Logger's err serializer, if defined.
                    err: (log.serializers && log.serializers.err
                        ? log.serializers.err(args[0])
                        : Logger.stdSerializers.err(args[0]))
                };
                excludeFields = {err: true};
                if (args.length === 1) {
                    msgArgs = [fields.err.message];
                } else {
                    msgArgs = Array.prototype.slice.call(args, 1);
                }
            } else if (typeof (args[0]) !== 'object' && args[0] !== null ||
                       Array.isArray(args[0])) {
                // `log.<level>(msg, ...)`
                fields = null;
                msgArgs = Array.prototype.slice.call(args);
            } else if (Buffer.isBuffer(args[0])) {  // `log.<level>(buf, ...)`
                // Almost certainly an error, show `inspect(buf)`. See bunyan
                // issue #35.
                fields = null;
                msgArgs = Array.prototype.slice.call(args);
                msgArgs[0] = util.inspect(msgArgs[0]);
            } else {  // `log.<level>(fields, msg, ...)`
                fields = args[0];
                msgArgs = Array.prototype.slice.call(args, 1);
            }

            // Build up the record object.
            var rec = objCopy(log.fields);
            var level = rec.level = minLevel;
            var recFields = (fields ? objCopy(fields) : null);
            if (recFields) {
                if (log.serializers) {
                    log._applySerializers(recFields, excludeFields);
                }
                Object.keys(recFields).forEach(function (k) {
                    rec[k] = recFields[k];
                });
            }
            rec.msg = format.apply(log, msgArgs);
            if (!rec.time) {
                rec.time = (new Date());
            }
            // Get call source info
            if (log.src && !rec.src) {
                rec.src = getCaller3Info()
            }
            rec.v = LOG_VERSION;

            return rec;
        };

        var fields = null;
        var msgArgs = arguments;
        var str = null;
        var rec = null;
        if (! this._emit) {
            /*
             * Show this invalid Bunyan usage warning *once*.
             *
             * See <https://github.com/trentm/node-bunyan/issues/100> for
             * an example of how this can happen.
             */
            var dedupKey = 'unbound';
            if (!_haveWarned[dedupKey]) {
                var caller = getCaller3Info();
                _warn(format('bunyan usage error: %s:%s: attempt to log '
                    + 'with an unbound log method: `this` is: %s',
                    caller.file, caller.line, util.inspect(this)),
                    dedupKey);
            }
            return;
        } else if (arguments.length === 0) {   // `log.<level>()`
            return (this._level <= minLevel);
        } else if (this._level > minLevel) {
            /* pass through */
        } else {
            rec = mkRecord(msgArgs);
            str = this._emit(rec);
        }
        probes && probes[minLevel].fire(function () {
                return [ str ||
                    (rec && log._emit(rec, true)) ||
                    log._emit(mkRecord(msgArgs), true) ];
        });
    }
}


/**
 * The functions below log a record at a specific level.
 *
 * Usages:
 *    log.<level>()  -> boolean is-trace-enabled
 *    log.<level>(<Error> err, [<string> msg, ...])
 *    log.<level>(<string> msg, ...)
 *    log.<level>(<object> fields, <string> msg, ...)
 *
 * where <level> is the lowercase version of the log level. E.g.:
 *
 *    log.info()
 *
 * @params fields {Object} Optional set of additional fields to log.
 * @params msg {String} Log message. This can be followed by additional
 *    arguments that are handled like
 *    [util.format](http://nodejs.org/docs/latest/api/all.html#util.format).
 */
Logger.prototype.trace = mkLogEmitter(TRACE);
Logger.prototype.debug = mkLogEmitter(DEBUG);
Logger.prototype.info = mkLogEmitter(INFO);
Logger.prototype.warn = mkLogEmitter(WARN);
Logger.prototype.error = mkLogEmitter(ERROR);
Logger.prototype.fatal = mkLogEmitter(FATAL);



//---- Standard serializers
// A serializer is a function that serializes a JavaScript object to a
// JSON representation for logging. There is a standard set of presumed
// interesting objects in node.js-land.

Logger.stdSerializers = {};

// Serialize an HTTP request.
Logger.stdSerializers.req = function req(req) {
    if (!req || !req.connection)
        return req;
    return {
        method: req.method,
        url: req.url,
        headers: req.headers,
        remoteAddress: req.connection.remoteAddress,
        remotePort: req.connection.remotePort
    };
    // Trailers: Skipping for speed. If you need trailers in your app, then
    // make a custom serializer.
    //if (Object.keys(trailers).length > 0) {
    //  obj.trailers = req.trailers;
    //}
};

// Serialize an HTTP response.
Logger.stdSerializers.res = function res(res) {
    if (!res || !res.statusCode)
        return res;
    return {
        statusCode: res.statusCode,
        header: res._header
    }
};


/*
 * This function dumps long stack traces for exceptions having a cause()
 * method. The error classes from
 * [verror](https://github.com/davepacheco/node-verror) and
 * [restify v2.0](https://github.com/mcavage/node-restify) are examples.
 *
 * Based on `dumpException` in
 * https://github.com/davepacheco/node-extsprintf/blob/master/lib/extsprintf.js
 */
function getFullErrorStack(ex)
{
    var ret = ex.stack || ex.toString();
    if (ex.cause && typeof (ex.cause) === 'function') {
        var cex = ex.cause();
        if (cex) {
            ret += '\nCaused by: ' + getFullErrorStack(cex);
        }
    }
    return (ret);
}

// Serialize an Error object
// (Core error properties are enumerable in node 0.4, not in 0.6).
var errSerializer = Logger.stdSerializers.err = function err(err) {
    if (!err || !err.stack)
        return err;
    var obj = {
        message: err.message,
        name: err.name,
        stack: getFullErrorStack(err),
        code: err.code,
        signal: err.signal
    }
    return obj;
};


// A JSON stringifier that handles cycles safely.
// Usage: JSON.stringify(obj, safeCycles())
function safeCycles() {
    var seen = [];
    return function (key, val) {
        if (!val || typeof (val) !== 'object') {
            return val;
        }
        if (seen.indexOf(val) !== -1) {
            return '[Circular]';
        }
        seen.push(val);
        return val;
    };
}



var RotatingFileStream = null;
if (mv) {

RotatingFileStream = function RotatingFileStream(options) {
    this.path = options.path;

    this.count = (options.count == null ? 10 : options.count);
    assert.equal(typeof (this.count), 'number',
        format('rotating-file stream "count" is not a number: %j (%s) in %j',
            this.count, typeof (this.count), this));
    assert.ok(this.count >= 0,
        format('rotating-file stream "count" is not >= 0: %j in %j',
            this.count, this));

    // Parse `options.period`.
    if (options.period) {
        // <number><scope> where scope is:
        //    h   hours (at the start of the hour)
        //    d   days (at the start of the day, i.e. just after midnight)
        //    w   weeks (at the start of Sunday)
        //    m   months (on the first of the month)
        //    y   years (at the start of Jan 1st)
        // with special values 'hourly' (1h), 'daily' (1d), "weekly" (1w),
        // 'monthly' (1m) and 'yearly' (1y)
        var period = {
            'hourly': '1h',
            'daily': '1d',
            'weekly': '1w',
            'monthly': '1m',
            'yearly': '1y'
        }[options.period] || options.period;
        var m = /^([1-9][0-9]*)([hdwmy]|ms)$/.exec(period);
        if (!m) {
            throw new Error(format('invalid period: "%s"', options.period));
        }
        this.periodNum = Number(m[1]);
        this.periodScope = m[2];
    } else {
        this.periodNum = 1;
        this.periodScope = 'd';
    }

    var lastModified = null;
    try {
        var fileInfo = fs.statSync(this.path);
        lastModified = fileInfo.mtime.getTime();
    }
    catch (err) {
        // file doesn't exist
    }
    var rotateAfterOpen = false;
    if (lastModified) {
        var lastRotTime = this._calcRotTime(0);
        if (lastModified < lastRotTime) {
            rotateAfterOpen = true;
        }
    }

    // TODO: template support for backup files
    // template: <path to which to rotate>
    //      default is %P.%n
    //      '/var/log/archive/foo.log'  -> foo.log.%n
    //      '/var/log/archive/foo.log.%n'
    //      codes:
    //          XXX support strftime codes (per node version of those)
    //              or whatever module. Pick non-colliding for extra
    //              codes
    //          %P      `path` base value
    //          %n      integer number of rotated log (1,2,3,...)
    //          %d      datetime in YYYY-MM-DD_HH-MM-SS
    //                      XXX what should default date format be?
    //                          prior art? Want to avoid ':' in
    //                          filenames (illegal on Windows for one).

    this.stream = fs.createWriteStream(this.path,
        {flags: 'a', encoding: 'utf8'});

    this.rotQueue = [];
    this.rotating = false;
    if (rotateAfterOpen) {
        this._debug('rotateAfterOpen -> call rotate()');
        this.rotate();
    } else {
        this._setupNextRot();
    }
}

util.inherits(RotatingFileStream, EventEmitter);

RotatingFileStream.prototype._debug = function () {
    // Set this to `true` to add debug logging.
    if (false) {
        if (arguments.length === 0) {
            return true;
        }
        var args = Array.prototype.slice.call(arguments);
        args[0] = '[' + (new Date().toISOString()) + ', '
            + this.path + '] ' + args[0];
        console.log.apply(this, args);
    } else {
        return false;
    }
};

RotatingFileStream.prototype._setupNextRot = function () {
    this.rotAt = this._calcRotTime(1);
    this._setRotationTimer();
}

RotatingFileStream.prototype._setRotationTimer = function () {
    var self = this;
    var delay = this.rotAt - Date.now();
    // Cap timeout to Node's max setTimeout, see
    // <https://github.com/joyent/node/issues/8656>.
    var TIMEOUT_MAX = 2147483647; // 2^31-1
    if (delay > TIMEOUT_MAX) {
        delay = TIMEOUT_MAX;
    }
    this.timeout = setTimeout(
        function () {
            self._debug('_setRotationTimer timeout -> call rotate()');
            self.rotate();
        },
        delay);
    if (typeof (this.timeout.unref) === 'function') {
        this.timeout.unref();
    }
}

RotatingFileStream.prototype._calcRotTime =
function _calcRotTime(periodOffset) {
    this._debug('_calcRotTime: %s%s', this.periodNum, this.periodScope);
    var d = new Date();

    this._debug('  now local: %s', d);
    this._debug('    now utc: %s', d.toISOString());
    var rotAt;
    switch (this.periodScope) {
    case 'ms':
        // Hidden millisecond period for debugging.
        if (this.rotAt) {
            rotAt = this.rotAt + this.periodNum * periodOffset;
        } else {
            rotAt = Date.now() + this.periodNum * periodOffset;
        }
        break;
    case 'h':
        if (this.rotAt) {
            rotAt = this.rotAt + this.periodNum * 60 * 60 * 1000 * periodOffset;
        } else {
            // First time: top of the next hour.
            rotAt = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(),
                d.getUTCDate(), d.getUTCHours() + periodOffset);
        }
        break;
    case 'd':
        if (this.rotAt) {
            rotAt = this.rotAt + this.periodNum * 24 * 60 * 60 * 1000
                * periodOffset;
        } else {
            // First time: start of tomorrow (i.e. at the coming midnight) UTC.
            rotAt = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(),
                d.getUTCDate() + periodOffset);
        }
        break;
    case 'w':
        // Currently, always on Sunday morning at 00:00:00 (UTC).
        if (this.rotAt) {
            rotAt = this.rotAt + this.periodNum * 7 * 24 * 60 * 60 * 1000
                * periodOffset;
        } else {
            // First time: this coming Sunday.
            var dayOffset = (7 - d.getUTCDay());
            if (periodOffset < 1) {
                dayOffset = -d.getUTCDay();
            }
            if (periodOffset > 1 || periodOffset < -1) {
                dayOffset += 7 * periodOffset;
            }
            rotAt = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(),
                d.getUTCDate() + dayOffset);
        }
        break;
    case 'm':
        if (this.rotAt) {
            rotAt = Date.UTC(d.getUTCFullYear(),
                d.getUTCMonth() + this.periodNum * periodOffset, 1);
        } else {
            // First time: the start of the next month.
            rotAt = Date.UTC(d.getUTCFullYear(),
                d.getUTCMonth() + periodOffset, 1);
        }
        break;
    case 'y':
        if (this.rotAt) {
            rotAt = Date.UTC(d.getUTCFullYear() + this.periodNum * periodOffset,
                0, 1);
        } else {
            // First time: the start of the next year.
            rotAt = Date.UTC(d.getUTCFullYear() + periodOffset, 0, 1);
        }
        break;
    default:
        assert.fail(format('invalid period scope: "%s"', this.periodScope));
    }

    if (this._debug()) {
        this._debug('  **rotAt**: %s (utc: %s)', rotAt,
            new Date(rotAt).toUTCString());
        var now = Date.now();
        this._debug('        now: %s (%sms == %smin == %sh to go)',
            now,
            rotAt - now,
            (rotAt-now)/1000/60,
            (rotAt-now)/1000/60/60);
    }
    return rotAt;
};

RotatingFileStream.prototype.rotate = function rotate() {
    // XXX What about shutdown?
    var self = this;

    // If rotation period is > ~25 days, we have to break into multiple
    // setTimeout's. See <https://github.com/joyent/node/issues/8656>.
    if (self.rotAt && self.rotAt > Date.now()) {
        return self._setRotationTimer();
    }

    this._debug('rotate');
    if (self.rotating) {
        throw new TypeError('cannot start a rotation when already rotating');
    }
    self.rotating = true;

    self.stream.end();  // XXX can do moves sync after this? test at high rate

    function del() {
        var toDel = self.path + '.' + String(n - 1);
        if (n === 0) {
            toDel = self.path;
        }
        n -= 1;
        self._debug('  rm %s', toDel);
        fs.unlink(toDel, function (delErr) {
            //XXX handle err other than not exists
            moves();
        });
    }

    function moves() {
        if (self.count === 0 || n < 0) {
            return finish();
        }
        var before = self.path;
        var after = self.path + '.' + String(n);
        if (n > 0) {
            before += '.' + String(n - 1);
        }
        n -= 1;
        fs.exists(before, function (exists) {
            if (!exists) {
                moves();
            } else {
                self._debug('  mv %s %s', before, after);
                mv(before, after, function (mvErr) {
                    if (mvErr) {
                        self.emit('error', mvErr);
                        finish(); // XXX finish here?
                    } else {
                        moves();
                    }
                });
            }
        })
    }

    function finish() {
        self._debug('  open %s', self.path);
        self.stream = fs.createWriteStream(self.path,
            {flags: 'a', encoding: 'utf8'});
        var q = self.rotQueue, len = q.length;
        for (var i = 0; i < len; i++) {
            self.stream.write(q[i]);
        }
        self.rotQueue = [];
        self.rotating = false;
        self.emit('drain');
        self._setupNextRot();
    }

    var n = this.count;
    del();
};

RotatingFileStream.prototype.write = function write(s) {
    if (this.rotating) {
        this.rotQueue.push(s);
        return false;
    } else {
        return this.stream.write(s);
    }
};

RotatingFileStream.prototype.end = function end(s) {
    this.stream.end();
};

RotatingFileStream.prototype.destroy = function destroy(s) {
    this.stream.destroy();
};

RotatingFileStream.prototype.destroySoon = function destroySoon(s) {
    this.stream.destroySoon();
};

} /* if (mv) */



/**
 * RingBuffer is a Writable Stream that just stores the last N records in
 * memory.
 *
 * @param options {Object}, with the following fields:
 *
 *    - limit: number of records to keep in memory
 */
function RingBuffer(options) {
    this.limit = options && options.limit ? options.limit : 100;
    this.writable = true;
    this.records = [];
    EventEmitter.call(this);
}

util.inherits(RingBuffer, EventEmitter);

RingBuffer.prototype.write = function (record) {
    if (!this.writable)
        throw (new Error('RingBuffer has been ended already'));

    this.records.push(record);

    if (this.records.length > this.limit)
        this.records.shift();

    return (true);
};

RingBuffer.prototype.end = function () {
    if (arguments.length > 0)
        this.write.apply(this, Array.prototype.slice.call(arguments));
    this.writable = false;
};

RingBuffer.prototype.destroy = function () {
    this.writable = false;
    this.emit('close');
};

RingBuffer.prototype.destroySoon = function () {
    this.destroy();
};


//---- Exports

module.exports = Logger;

module.exports.TRACE = TRACE;
module.exports.DEBUG = DEBUG;
module.exports.INFO = INFO;
module.exports.WARN = WARN;
module.exports.ERROR = ERROR;
module.exports.FATAL = FATAL;
module.exports.resolveLevel = resolveLevel;
module.exports.levelFromName = levelFromName;
module.exports.nameFromLevel = nameFromLevel;

module.exports.VERSION = VERSION;
module.exports.LOG_VERSION = LOG_VERSION;

module.exports.createLogger = function createLogger(options) {
    return new Logger(options);
};

module.exports.RingBuffer = RingBuffer;
module.exports.RotatingFileStream = RotatingFileStream;

// Useful for custom `type == 'raw'` streams that may do JSON stringification
// of log records themselves. Usage:
//    var str = JSON.stringify(rec, bunyan.safeCycles());
module.exports.safeCycles = safeCycles;

}).call(this,{"isBuffer":require("../../is-buffer/index.js")},require('_process'))
},{"../../is-buffer/index.js":36,"_process":41,"assert":5,"events":20,"fs":9,"os":39,"safe-json-stringify":44,"stream":45,"util":60}],12:[function(require,module,exports){
(function (Buffer){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.

function isArray(arg) {
  if (Array.isArray) {
    return Array.isArray(arg);
  }
  return objectToString(arg) === '[object Array]';
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = Buffer.isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

}).call(this,{"isBuffer":require("../../is-buffer/index.js")})
},{"../../is-buffer/index.js":36}],13:[function(require,module,exports){

/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = require('./debug');
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // is webkit? http://stackoverflow.com/a/16459606/376773
  return ('WebkitAppearance' in document.documentElement.style) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (window.console && (console.firebug || (console.exception && console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  return JSON.stringify(v);
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs() {
  var args = arguments;
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return args;

  var c = 'color: ' + this.color;
  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
  return args;
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}
  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage(){
  try {
    return window.localStorage;
  } catch (e) {}
}

},{"./debug":14}],14:[function(require,module,exports){

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = require('ms');

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lowercased letter, i.e. "n".
 */

exports.formatters = {};

/**
 * Previously assigned color.
 */

var prevColor = 0;

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 *
 * @return {Number}
 * @api private
 */

function selectColor() {
  return exports.colors[prevColor++ % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function debug(namespace) {

  // define the `disabled` version
  function disabled() {
  }
  disabled.enabled = false;

  // define the `enabled` version
  function enabled() {

    var self = enabled;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // add the `color` if not set
    if (null == self.useColors) self.useColors = exports.useColors();
    if (null == self.color && self.useColors) self.color = selectColor();

    var args = Array.prototype.slice.call(arguments);

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %o
      args = ['%o'].concat(args);
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    if ('function' === typeof exports.formatArgs) {
      args = exports.formatArgs.apply(self, args);
    }
    var logFn = enabled.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }
  enabled.enabled = true;

  var fn = exports.enabled(namespace) ? enabled : disabled;

  fn.namespace = namespace;

  return fn;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  var split = (namespaces || '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

},{"ms":38}],15:[function(require,module,exports){
(function (Buffer,global){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var os = _interopRequire(require("os"));

var EnumItem = _interopRequire(require("./enumItem"));

var isString = require("./isType").isString;

var indexOf = require("./indexOf").indexOf;

var endianness = os.endianness();

/**
 * Represents an Enum with enum items.
 * @param {Array || Object}  map     This are the enum items.
 * @param {String || Object} options This are options. [optional]
 */

var Enum = (function () {
  function Enum(map, options) {
    var _this = this;

    _classCallCheck(this, Enum);

    /* implement the "ref type interface", so that Enum types can
     * be used in `node-ffi` function declarations and invokations.
     * In C, these Enums act as `uint32_t` types.
     *
     * https://github.com/TooTallNate/ref#the-type-interface
     */
    this.size = 4;
    this.indirection = 1;

    if (options && isString(options)) {
      options = { name: options };
    }

    this._options = options || {};
    this._options.separator = this._options.separator || " | ";
    this._options.endianness = this._options.endianness || endianness;
    this._options.ignoreCase = this._options.ignoreCase || false;
    this._options.freez = this._options.freez || false;

    this.enums = [];

    if (map.length) {
      this._enumLastIndex = map.length;
      var array = map;
      map = {};

      for (var i = 0; i < array.length; i++) {
        map[array[i]] = Math.pow(2, i);
      }
    }

    for (var member in map) {
      guardReservedKeys(this._options.name, member);
      this[member] = new EnumItem(member, map[member], { ignoreCase: this._options.ignoreCase });
      this.enums.push(this[member]);
    }
    this._enumMap = map;

    if (this._options.ignoreCase) {
      this.getLowerCaseEnums = function () {
        var res = {};
        for (var i = 0, len = this.enums.length; i < len; i++) {
          res[this.enums[i].key.toLowerCase()] = this.enums[i];
        }
        return res;
      };
    }

    if (this._options.name) {
      this.name = this._options.name;
    }

    var isFlaggable = function () {
      for (var i = 0, len = _this.enums.length; i < len; i++) {
        var e = _this.enums[i];

        if (!(e.value !== 0 && !(e.value & e.value - 1))) {
          return false;
        }
      }
      return true;
    };

    this.isFlaggable = isFlaggable();
    if (this._options.freez) {
      this.freezeEnums(); //this will make instances of Enum non-extensible
    }
  }

  /**
   * Returns the appropriate EnumItem key.
   * @param  {EnumItem || String || Number} key The object to get with.
   * @return {String}                           The get result.
   */

  Enum.prototype.getKey = function getKey(value) {
    var item = this.get(value);
    if (item) {
      return item.key;
    }
  };

  /**
   * Returns the appropriate EnumItem value.
   * @param  {EnumItem || String || Number} key The object to get with.
   * @return {Number}                           The get result.
   */

  Enum.prototype.getValue = function getValue(key) {
    var item = this.get(key);
    if (item) {
      return item.value;
    }
  };

  /**
   * Returns the appropriate EnumItem.
   * @param  {EnumItem || String || Number} key The object to get with.
   * @return {EnumItem}                         The get result.
   */

  Enum.prototype.get = function get(key, offset) {
    if (key === null || key === undefined) {
      return;
    } // Buffer instance support, part of the ref Type interface
    if (Buffer.isBuffer(key)) {
      key = key["readUInt32" + this._options.endianness](offset || 0);
    }

    if (EnumItem.isEnumItem(key)) {
      var foundIndex = indexOf.call(this.enums, key);
      if (foundIndex >= 0) {
        return key;
      }
      if (!this.isFlaggable || this.isFlaggable && key.key.indexOf(this._options.separator) < 0) {
        return;
      }
      return this.get(key.key);
    } else if (isString(key)) {

      var enums = this;
      if (this._options.ignoreCase) {
        enums = this.getLowerCaseEnums();
        key = key.toLowerCase();
      }

      if (key.indexOf(this._options.separator) > 0) {
        var parts = key.split(this._options.separator);

        var value = 0;
        for (var i = 0; i < parts.length; i++) {
          var part = parts[i];

          value |= enums[part].value;
        }

        return new EnumItem(key, value);
      } else {
        return enums[key];
      }
    } else {
      for (var m in this) {
        if (this.hasOwnProperty(m)) {
          if (this[m].value === key) {
            return this[m];
          }
        }
      }

      var result = null;

      if (this.isFlaggable) {
        for (var n in this) {
          if (this.hasOwnProperty(n)) {
            if ((key & this[n].value) !== 0) {
              if (result) {
                result += this._options.separator;
              } else {
                result = "";
              }
              result += n;
            }
          }
        }
      }

      return this.get(result || null);
    }
  };

  /**
   * Sets the Enum "value" onto the give `buffer` at the specified `offset`.
   * Part of the ref "Type interface".
   *
   * @param  {Buffer} buffer The Buffer instance to write to.
   * @param  {Number} offset The offset in the buffer to write to. Default 0.
   * @param  {EnumItem || String || Number} value The EnumItem to write.
   */

  Enum.prototype.set = function set(buffer, offset, value) {
    var item = this.get(value);
    if (item) {
      return buffer["writeUInt32" + this._options.endianness](item.value, offset || 0);
    }
  };

  /**
   * Define freezeEnums() as a property of the prototype.
   * make enumerable items nonconfigurable and deep freeze the properties. Throw Error on property setter.
   */

  Enum.prototype.freezeEnums = function freezeEnums() {
    function envSupportsFreezing() {
      return Object.isFrozen && Object.isSealed && Object.getOwnPropertyNames && Object.getOwnPropertyDescriptor && Object.defineProperties && Object.__defineGetter__ && Object.__defineSetter__;
    }

    function freezer(o) {
      var props = Object.getOwnPropertyNames(o);
      props.forEach(function (p) {
        if (!Object.getOwnPropertyDescriptor(o, p).configurable) {
          return;
        }

        Object.defineProperties(o, p, { writable: false, configurable: false });
      });
      return o;
    }

    function getPropertyValue(value) {
      return value;
    }

    function deepFreezeEnums(o) {
      if (typeof o !== "object" || o === null || Object.isFrozen(o) || Object.isSealed(o)) {
        return;
      }
      for (var key in o) {
        if (o.hasOwnProperty(key)) {
          o.__defineGetter__(key, getPropertyValue.bind(null, o[key]));
          o.__defineSetter__(key, function throwPropertySetError(value) {
            throw TypeError("Cannot redefine property; Enum Type is not extensible.");
          });
          deepFreezeEnums(o[key]);
        }
      }
      if (Object.freeze) {
        Object.freeze(o);
      } else {
        freezer(o);
      }
    }

    if (envSupportsFreezing()) {
      deepFreezeEnums(this);
    }

    return this;
  };

  /**
   * Returns JSON object representation of this Enum.
   * @return {String} JSON object representation of this Enum.
   */

  Enum.prototype.toJSON = function toJSON() {
    return this._enumMap;
  };

  /**
   * Extends the existing Enum with a New Map.
   * @param  {Array}  map  Map to extend from
   */

  Enum.prototype.extend = function extend(map) {
    if (map.length) {
      var array = map;
      map = {};

      for (var i = 0; i < array.length; i++) {
        var exponent = this._enumLastIndex + i;
        map[array[i]] = Math.pow(2, exponent);
      }

      for (var member in map) {
        guardReservedKeys(this._options.name, member);
        this[member] = new EnumItem(member, map[member], { ignoreCase: this._options.ignoreCase });
        this.enums.push(this[member]);
      }

      for (var key in this._enumMap) {
        map[key] = this._enumMap[key];
      }

      this._enumLastIndex += map.length;
      this._enumMap = map;

      if (this._options.freez) {
        this.freezeEnums(); //this will make instances of new Enum non-extensible
      }
    }
  };

  /**
   * Registers the Enum Type globally in node.js.
   * @param  {String} key Global variable. [optional]
   */

  Enum.register = function register() {
    var key = arguments[0] === undefined ? "Enum" : arguments[0];

    if (!global[key]) {
      global[key] = Enum;
    }
  };

  return Enum;
})();

module.exports = Enum;

// private

var reservedKeys = ["_options", "get", "getKey", "getValue", "enums", "isFlaggable", "_enumMap", "toJSON", "_enumLastIndex"];

function guardReservedKeys(customName, key) {
  if (customName && key === "name" || indexOf.call(reservedKeys, key) >= 0) {
    throw new Error("Enum key " + key + " is a reserved word!");
  }
}
}).call(this,{"isBuffer":require("../../is-buffer/index.js")},typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../../is-buffer/index.js":36,"./enumItem":16,"./indexOf":17,"./isType":18,"os":39}],16:[function(require,module,exports){
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _isType = require("./isType");

var isObject = _isType.isObject;
var isString = _isType.isString;

/**
 * Represents an Item of an Enum.
 * @param {String} key   The Enum key.
 * @param {Number} value The Enum value.
 */

var EnumItem = (function () {

  /*constructor reference so that, this.constructor===EnumItem//=>true */

  function EnumItem(key, value) {
    var options = arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, EnumItem);

    this.key = key;
    this.value = value;

    this._options = options;
    this._options.ignoreCase = this._options.ignoreCase || false;
  }

  /**
   * Checks if the flagged EnumItem has the passing object.
   * @param  {EnumItem || String || Number} value The object to check with.
   * @return {Boolean}                            The check result.
   */

  EnumItem.prototype.has = function has(value) {
    if (EnumItem.isEnumItem(value)) {
      return (this.value & value.value) !== 0;
    } else if (isString(value)) {
      if (this._options.ignoreCase) {
        return this.key.toLowerCase().indexOf(value.toLowerCase()) >= 0;
      }
      return this.key.indexOf(value) >= 0;
    } else {
      return (this.value & value) !== 0;
    }
  };

  /**
   * Checks if the EnumItem is the same as the passing object.
   * @param  {EnumItem || String || Number} key The object to check with.
   * @return {Boolean}                          The check result.
   */

  EnumItem.prototype.is = function is(key) {
    if (EnumItem.isEnumItem(key)) {
      return this.key === key.key;
    } else if (isString(key)) {
      if (this._options.ignoreCase) {
        return this.key.toLowerCase() === key.toLowerCase();
      }
      return this.key === key;
    } else {
      return this.value === key;
    }
  };

  /**
   * Returns String representation of this EnumItem.
   * @return {String} String representation of this EnumItem.
   */

  EnumItem.prototype.toString = function toString() {
    return this.key;
  };

  /**
   * Returns JSON object representation of this EnumItem.
   * @return {String} JSON object representation of this EnumItem.
   */

  EnumItem.prototype.toJSON = function toJSON() {
    return this.key;
  };

  /**
   * Returns the value to compare with.
   * @return {String} The value to compare with.
   */

  EnumItem.prototype.valueOf = function valueOf() {
    return this.value;
  };

  EnumItem.isEnumItem = function isEnumItem(value) {
    return value instanceof EnumItem || isObject(value) && value.key !== undefined && value.value !== undefined;
  };

  return EnumItem;
})();

module.exports = EnumItem;
},{"./isType":18}],17:[function(require,module,exports){
"use strict";

exports.__esModule = true;
var indexOf = Array.prototype.indexOf || function (find, i /*opt*/) {
  if (i === undefined) i = 0;
  if (i < 0) i += this.length;
  if (i < 0) i = 0;
  for (var n = this.length; i < n; i++) if (i in this && this[i] === find) return i;
  return -1;
};
exports.indexOf = indexOf;
},{}],18:[function(require,module,exports){
"use strict";

exports.__esModule = true;
var isType = function (type, value) {
  return typeof value === type;
};
exports.isType = isType;
var isObject = function (value) {
  return isType("object", value);
};
exports.isObject = isObject;
var isString = function (value) {
  return isType("string", value);
};
exports.isString = isString;
},{}],19:[function(require,module,exports){
module.exports = require('./dist/enum');

},{"./dist/enum":15}],20:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],21:[function(require,module,exports){
(function (process,Buffer){

/**
 * Module dependencies.
 */

var assert = require('assert')
  , debug = require('debug')('ffi:_ForeignFunction')
  , ref = require('ref')
  , bindings = require('./bindings')
  , POINTER_SIZE = ref.sizeof.pointer
  , FFI_ARG_SIZE = bindings.FFI_ARG_SIZE


function ForeignFunction (cif, funcPtr, returnType, argTypes) {
  debug('creating new ForeignFunction', funcPtr)

  var numArgs = argTypes.length
  var argsArraySize = numArgs * POINTER_SIZE

  // "result" must point to storage that is sizeof(long) or larger. For smaller
  // return value sizes, the ffi_arg or ffi_sarg integral type must be used to
  // hold the return value
  var resultSize = returnType.size >= ref.sizeof.long ? returnType.size : FFI_ARG_SIZE
  assert(resultSize > 0)

  /**
   * This is the actual JS function that gets returned.
   * It handles marshalling input arguments into C values,
   * and unmarshalling the return value back into a JS value
   */

  var proxy = function () {
    debug('invoking proxy function')

    if (arguments.length !== numArgs) {
      throw new TypeError('Expected ' + numArgs +
          ' arguments, got ' + arguments.length)
    }

    // storage buffers for input arguments and the return value
    var result = new Buffer(resultSize)
      , argsList = new Buffer(argsArraySize)

    // write arguments to storage areas
    var i, argType, val, valPtr
    try {
      for (i = 0; i < numArgs; i++) {
        argType = argTypes[i]
        val = arguments[i]
        valPtr = ref.alloc(argType, val)
        argsList.writePointer(valPtr, i * POINTER_SIZE)
      }
    } catch (e) {
      e.message = 'error setting argument ' + i + ' - ' + e.message
      throw e
    }

    // invoke the `ffi_call()` function
    bindings.ffi_call(cif, funcPtr, result, argsList)

    result.type = returnType
    return result.deref()
  }

  /**
   * The asynchronous version of the proxy function.
   */

  proxy.async = function () {
    debug('invoking async proxy function')

    var argc = arguments.length
    if (argc !== numArgs + 1) {
      throw new TypeError('Expected ' + (numArgs + 1) +
          ' arguments, got ' + argc)
    }

    var callback = arguments[argc - 1]
    if (typeof callback !== 'function') {
      throw new TypeError('Expected a callback function as argument number: ' +
          (argc - 1))
    }

    // storage buffers for input arguments and the return value
    var result = new Buffer(resultSize)
    var argsList = new Buffer(argsArraySize)

    // write arguments to storage areas
    var i, argType, val, valPtr
    try {
      for (i = 0; i < numArgs; i++) {
        argType = argTypes[i]
        val = arguments[i]
        valPtr = ref.alloc(argType, val)
        argsList.writePointer(valPtr, i * POINTER_SIZE)
      }
    } catch (e) {
      e.message = 'error setting argument ' + i + ' - ' + e.message
      return process.nextTick(callback.bind(null, e));
    }

    // invoke the `ffi_call()` function asynchronously
    bindings.ffi_call_async(cif, funcPtr, result, argsList, function (err) {
      // make sure that the 4 Buffers passed in above don't get GC'd while we're
      // doing work on the thread pool...
      cif = cif;
      funcPtr = funcPtr;
      argsList = argsList;

      // now invoke the user-provided callback function
      if (err) {
        callback(err)
      } else {
        result.type = returnType
        callback(null, result.deref())
      }
    })
  }

  return proxy
}
module.exports = ForeignFunction

}).call(this,require('_process'),require("buffer").Buffer)
},{"./bindings":22,"_process":41,"assert":5,"buffer":10,"debug":13,"ref":43}],22:[function(require,module,exports){

module.exports = require('bindings')('ffi_bindings.node')

},{"bindings":7}],23:[function(require,module,exports){
(function (process){

/**
 * Module dependencies.
 */

var ref = require('ref')
  , CIF = require('./cif')
  , assert = require('assert')
  , debug = require('debug')('ffi:Callback')
  , _Callback = require('./bindings').Callback

// Function used to report errors to the current process event loop,
// When user callback function gets gced.
function errorReportCallback (err) {
  if (err) {
    process.nextTick(function () {
      if (typeof err === 'string') {
        throw new Error(err)
      } else {
        throw err
      }
    })
  }
}

/**
 * Turns a JavaScript function into a C function pointer.
 * The function pointer may be used in other C functions that
 * accept C callback functions.
 */

function Callback (retType, argTypes, abi, func) {
  debug('creating new Callback')

  if (typeof abi === 'function') {
    func = abi
    abi = void(0)
  }

  // check args
  assert(!!retType, 'expected a return "type" object as the first argument')
  assert(Array.isArray(argTypes), 'expected Array of arg "type" objects as the second argument')
  assert.equal(typeof func, 'function', 'expected a function as the third argument')

  // normalize the "types" (they could be strings, so turn into real type
  // instances)
  retType = ref.coerceType(retType)
  argTypes = argTypes.map(ref.coerceType)

  // create the `ffi_cif *` instance
  var cif = CIF(retType, argTypes, abi)
  var argc = argTypes.length

  var callback = _Callback(cif, retType.size, argc, errorReportCallback, function (retval, params) {
    debug('Callback function being invoked')
    try {
      var args = []
      for (var i = 0; i < argc; i++) {
        var type = argTypes[ i ]
        var argPtr = params.readPointer(i * ref.sizeof.pointer, type.size)
        argPtr.type = type
        args.push(argPtr.deref())
      }

      // Invoke the user-given function
      var result = func.apply(null, args)
      try {
        ref.set(retval, 0, result, retType)
      } catch (e) {
        e.message = 'error setting return value - ' + e.message
        throw e
      }
    } catch (e) {
      return e
    }
  })

  // store reference to the CIF Buffer so that it doesn't get
  // garbage collected before the callback Buffer does
  callback._cif = cif;

  return callback
}
module.exports = Callback

}).call(this,require('_process'))
},{"./bindings":22,"./cif":24,"_process":41,"assert":5,"debug":13,"ref":43}],24:[function(require,module,exports){
(function (Buffer){

/**
 * Module dependencies.
 */

var Type = require('./type')
  , assert = require('assert')
  , debug = require('debug')('ffi:cif')
  , ref = require('ref')
  , bindings = require('./bindings')
  , POINTER_SIZE = ref.sizeof.pointer
  , ffi_prep_cif = bindings.ffi_prep_cif
  , FFI_CIF_SIZE = bindings.FFI_CIF_SIZE
  , FFI_DEFAULT_ABI = bindings.FFI_DEFAULT_ABI
  // status codes
  , FFI_OK = bindings.FFI_OK
  , FFI_BAD_TYPEDEF = bindings.FFI_BAD_TYPEDEF
  , FFI_BAD_ABI = bindings.FFI_BAD_ABI

/**
 * JS wrapper for the `ffi_prep_cif` function.
 * Returns a Buffer instance representing a `ffi_cif *` instance.
 */

function CIF (rtype, types, abi) {
  debug('creating `ffi_cif *` instance')

  // the return and arg types are expected to be coerced at this point...
  assert(!!rtype, 'expected a return "type" object as the first argument')
  assert(Array.isArray(types), 'expected an Array of arg "type" objects as the second argument')

  // the buffer that will contain the return `ffi_cif *` instance
  var cif = new Buffer(FFI_CIF_SIZE)

  var numArgs = types.length
  var _argtypesptr = new Buffer(numArgs * POINTER_SIZE)
  var _rtypeptr = Type(rtype)

  for (var i = 0; i < numArgs; i++) {
    var type = types[i]
    var ffiType = Type(type)

    _argtypesptr.writePointer(ffiType, i * POINTER_SIZE)
  }

  // prevent GC of the arg type and rtn type buffers (not sure if this is required)
  cif.rtnTypePtr = _rtypeptr
  cif.argTypesPtr = _argtypesptr

  if (typeof abi === 'undefined') {
    debug('no ABI specified (this is OK), using FFI_DEFAULT_ABI')
    abi = FFI_DEFAULT_ABI
  }

  var status = ffi_prep_cif(cif, numArgs, _rtypeptr, _argtypesptr, abi)

  if (status !== FFI_OK) {
    switch (status) {
      case FFI_BAD_TYPEDEF:
        var err = new Error('ffi_prep_cif() returned an FFI_BAD_TYPEDEF error')
        err.code = 'FFI_BAD_TYPEDEF'
        err.errno = status
        throw err
        break;
      case FFI_BAD_ABI:
        var err = new Error('ffi_prep_cif() returned an FFI_BAD_ABI error')
        err.code = 'FFI_BAD_ABI'
        err.errno = status
        throw err
        break;
      default:
        throw new Error('ffi_prep_cif() returned an error: ' + status)
        break;
    }
  }

  return cif
}
module.exports = CIF

}).call(this,require("buffer").Buffer)
},{"./bindings":22,"./type":33,"assert":5,"buffer":10,"debug":13,"ref":43}],25:[function(require,module,exports){
(function (Buffer){

/**
 * Module dependencies.
 */

var Type = require('./type')
  , assert = require('assert')
  , debug = require('debug')('ffi:cif_var')
  , ref = require('ref')
  , bindings = require('./bindings')
  , POINTER_SIZE = ref.sizeof.pointer
  , ffi_prep_cif_var = bindings.ffi_prep_cif_var
  , FFI_CIF_SIZE = bindings.FFI_CIF_SIZE
  , FFI_DEFAULT_ABI = bindings.FFI_DEFAULT_ABI
  // status codes
  , FFI_OK = bindings.FFI_OK
  , FFI_BAD_TYPEDEF = bindings.FFI_BAD_TYPEDEF
  , FFI_BAD_ABI = bindings.FFI_BAD_ABI

/**
 * JS wrapper for the `ffi_prep_cif_var` function.
 * Returns a Buffer instance representing a variadic `ffi_cif *` instance.
 */

function CIF_var (rtype, types, numFixedArgs, abi) {
  debug('creating `ffi_cif *` instance with `ffi_prep_cif_var()`')

  // the return and arg types are expected to be coerced at this point...
  assert(!!rtype, 'expected a return "type" object as the first argument')
  assert(Array.isArray(types), 'expected an Array of arg "type" objects as the second argument')
  assert(numFixedArgs >= 1, 'expected the number of fixed arguments to be at least 1')

  // the buffer that will contain the return `ffi_cif *` instance
  var cif = new Buffer(FFI_CIF_SIZE)

  var numTotalArgs = types.length
  var _argtypesptr = new Buffer(numTotalArgs * POINTER_SIZE)
  var _rtypeptr = Type(rtype)

  for (var i = 0; i < numTotalArgs; i++) {
    var ffiType = Type(types[i])
    _argtypesptr.writePointer(ffiType, i * POINTER_SIZE)
  }

  // prevent GC of the arg type and rtn type buffers (not sure if this is required)
  cif.rtnTypePtr = _rtypeptr
  cif.argTypesPtr = _argtypesptr

  if (typeof abi === 'undefined') {
    debug('no ABI specified (this is OK), using FFI_DEFAULT_ABI')
    abi = FFI_DEFAULT_ABI
  }

  var status = ffi_prep_cif_var(cif, numFixedArgs, numTotalArgs, _rtypeptr, _argtypesptr, abi)

  if (status !== FFI_OK) {
    switch (status) {
      case FFI_BAD_TYPEDEF:
        var err = new Error('ffi_prep_cif_var() returned an FFI_BAD_TYPEDEF error')
        err.code = 'FFI_BAD_TYPEDEF'
        err.errno = status
        throw err
        break;
      case FFI_BAD_ABI:
        var err = new Error('ffi_prep_cif_var() returned an FFI_BAD_ABI error')
        err.code = 'FFI_BAD_ABI'
        err.errno = status
        throw err
        break;
      default:
        var err = new Error('ffi_prep_cif_var() returned an error: ' + status)
        err.errno = status
        throw err
        break;
    }
  }

  return cif
}
module.exports = CIF_var

}).call(this,require("buffer").Buffer)
},{"./bindings":22,"./type":33,"assert":5,"buffer":10,"debug":13,"ref":43}],26:[function(require,module,exports){
(function (Buffer){

/**
 * Module dependencies.
 */

var ForeignFunction = require('./foreign_function')
  , assert = require('assert')
  , debug = require('debug')('ffi:DynamicLibrary')
  , bindings = require('./bindings')
  , funcs = bindings.StaticFunctions
  , ref = require('ref')
  , read  = require('fs').readFileSync

// typedefs
var int = ref.types.int
  , voidPtr = ref.refType(ref.types.void)

var dlopen  = ForeignFunction(funcs.dlopen,  voidPtr, [ 'string', int ])
  , dlclose = ForeignFunction(funcs.dlclose, int,     [ voidPtr ])
  , dlsym   = ForeignFunction(funcs.dlsym,   voidPtr, [ voidPtr, 'string' ])
  , dlerror = ForeignFunction(funcs.dlerror, 'string', [ ])

/**
 * `DynamicLibrary` loads and fetches function pointers for dynamic libraries
 * (.so, .dylib, etc). After the libray's function pointer is acquired, then you
 * call `get(symbol)` to retreive a pointer to an exported symbol. You need to
 * call `get___()` on the pointer to dereference it into its actual value, or
 * turn the pointer into a callable function with `ForeignFunction`.
 */

function DynamicLibrary (path, mode) {
  if (!(this instanceof DynamicLibrary)) {
    return new DynamicLibrary(path, mode)
  }
  debug('new DynamicLibrary()', path, mode)

  if (null == mode) {
    mode = DynamicLibrary.FLAGS.RTLD_LAZY
  }

  this._handle = dlopen(path, mode)
  assert(Buffer.isBuffer(this._handle), 'expected a Buffer instance to be returned from `dlopen()`')

  if (this._handle.isNull()) {
    var err = this.error()

    // THIS CODE IS BASED ON GHC Trac ticket #2615
    // http://hackage.haskell.org/trac/ghc/attachment/ticket/2615

    // On some systems (e.g., Gentoo Linux) dynamic files (e.g. libc.so)
    // contain linker scripts rather than ELF-format object code. This
    // code handles the situation by recognizing the real object code
    // file name given in the linker script.

    // If an "invalid ELF header" error occurs, it is assumed that the
    // .so file contains a linker script instead of ELF object code.
    // In this case, the code looks for the GROUP ( ... ) linker
    // directive. If one is found, the first file name inside the
    // parentheses is treated as the name of a dynamic library and the
    // code attempts to dlopen that file. If this is also unsuccessful,
    // an error message is returned.

    // see if the error message is due to an invalid ELF header
    var match

    if (match = err.match(/^(([^ \t()])+\.so([^ \t:()])*):([ \t])*/)) {
      var content = read(match[1], 'ascii')
      // try to find a GROUP ( ... ) command
      if (match = content.match(/GROUP *\( *(([^ )])+)/)){
        return DynamicLibrary.call(this, match[1], mode)
      }
    }

    throw new Error('Dynamic Linking Error: ' + err)
  }
}
module.exports = DynamicLibrary

/**
 * Set the exported flags from "dlfcn.h"
 */

DynamicLibrary.FLAGS = {};
Object.keys(bindings).forEach(function (k) {
  if (!/^RTLD_/.test(k)) return;
  var desc = Object.getOwnPropertyDescriptor(bindings, k)
  Object.defineProperty(DynamicLibrary.FLAGS, k, desc)
});


/**
 * Close this library, returns the result of the dlclose() system function.
 */

DynamicLibrary.prototype.close = function () {
  debug('dlclose()')
  return dlclose(this._handle)
}

/**
 * Get a symbol from this library, returns a Pointer for (memory address of) the symbol
 */

DynamicLibrary.prototype.get = function (symbol) {
  debug('dlsym()', symbol)
  assert.equal('string', typeof symbol)

  var ptr = dlsym(this._handle, symbol)
  assert(Buffer.isBuffer(ptr))

  if (ptr.isNull()) {
    throw new Error('Dynamic Symbol Retrieval Error: ' + this.error())
  }

  ptr.name = symbol

  return ptr
}

/**
 * Returns the result of the dlerror() system function
 */

DynamicLibrary.prototype.error = function error () {
  debug('dlerror()')
  return dlerror()
}

}).call(this,{"isBuffer":require("../../is-buffer/index.js")})
},{"../../is-buffer/index.js":36,"./bindings":22,"./foreign_function":29,"assert":5,"debug":13,"fs":9,"ref":43}],27:[function(require,module,exports){
(function (process){
var DynamicLibrary = require('./dynamic_library')
  , ForeignFunction = require('./foreign_function')
  , bindings = require('./bindings')
  , funcs = bindings.StaticFunctions
  , ref = require('ref')
  , int = ref.types.int
  , intPtr = ref.refType(int)
  , errno = null

if (process.platform == 'win32') {
  var _errno = DynamicLibrary('msvcrt.dll').get('_errno')
  var errnoPtr = ForeignFunction(_errno, intPtr, [])
  errno = function() {
    return errnoPtr().deref()
  }
} else {
  errno = ForeignFunction(funcs._errno, 'int', [])
}


module.exports = errno

}).call(this,require('_process'))
},{"./bindings":22,"./dynamic_library":26,"./foreign_function":29,"_process":41,"ref":43}],28:[function(require,module,exports){

/**
 * Module dependencies.
 */

var ref = require('ref')
var assert = require('assert')
var debug = require('debug')('ffi:ffi')
var Struct = require('ref-struct')
var bindings = require('./bindings')

/**
 * Export some of the properties from the "bindings" file.
 */

;['HAS_OBJC', 'FFI_TYPES',
, 'FFI_OK', 'FFI_BAD_TYPEDEF', 'FFI_BAD_ABI'
, 'FFI_DEFAULT_ABI', 'FFI_FIRST_ABI', 'FFI_LAST_ABI', 'FFI_SYSV', 'FFI_UNIX64'
, 'FFI_WIN64', 'FFI_VFP', 'FFI_STDCALL', 'FFI_THISCALL', 'FFI_FASTCALL'
, 'RTLD_LAZY', 'RTLD_NOW', 'RTLD_LOCAL', 'RTLD_GLOBAL', 'RTLD_NOLOAD'
, 'RTLD_NODELETE', 'RTLD_FIRST', 'RTLD_NEXT', 'RTLD_DEFAULT', 'RTLD_SELF'
, 'RTLD_MAIN_ONLY', 'FFI_MS_CDECL'].forEach(function (prop) {
  if (!bindings.hasOwnProperty(prop)) {
    return debug('skipping exporting of non-existant property', prop)
  }
  var desc = Object.getOwnPropertyDescriptor(bindings, prop)
  Object.defineProperty(exports, prop, desc)
})

/**
 * Set the `ffi_type` property on the built-in types.
 */

Object.keys(bindings.FFI_TYPES).forEach(function (name) {
  var type = bindings.FFI_TYPES[name]
  type.name = name
  if (name === 'pointer') return // there is no "pointer" type...
  ref.types[name].ffi_type = type
})

// make `size_t` use the "ffi_type_pointer"
ref.types.size_t.ffi_type = bindings.FFI_TYPES.pointer

// make `Utf8String` use "ffi_type_pointer"
var CString = ref.types.CString || ref.types.Utf8String
CString.ffi_type = bindings.FFI_TYPES.pointer

// make `Object` use the "ffi_type_pointer"
ref.types.Object.ffi_type = bindings.FFI_TYPES.pointer


// libffi is weird when it comes to long data types (defaults to 64-bit),
// so we emulate here, since some platforms have 32-bit longs and some
// platforms have 64-bit longs.
switch (ref.sizeof.long) {
  case 4:
    ref.types.ulong.ffi_type = bindings.FFI_TYPES.uint32
    ref.types.long.ffi_type = bindings.FFI_TYPES.int32
    break;
  case 8:
    ref.types.ulong.ffi_type = bindings.FFI_TYPES.uint64
    ref.types.long.ffi_type = bindings.FFI_TYPES.int64
    break;
  default:
    throw new Error('unsupported "long" size: ' + ref.sizeof.long)
}

/**
 * Alias the "ref" types onto ffi's exports, for convenience...
 */

exports.types = ref.types

// Include our other modules
exports.CIF = require('./cif')
exports.CIF_var = require('./cif_var')
exports.Function = require('./function')
exports.ForeignFunction = require('./foreign_function')
exports.VariadicForeignFunction = require('./foreign_function_var')
exports.DynamicLibrary = require('./dynamic_library')
exports.Library = require('./library')
exports.Callback = require('./callback')
exports.errno = require('./errno')
exports.ffiType = require('./type')

// the shared library extension for this platform
exports.LIB_EXT = exports.Library.EXT

// the FFI_TYPE struct definition
exports.FFI_TYPE = exports.ffiType.FFI_TYPE

},{"./bindings":22,"./callback":23,"./cif":24,"./cif_var":25,"./dynamic_library":26,"./errno":27,"./foreign_function":29,"./foreign_function_var":30,"./function":31,"./library":32,"./type":33,"assert":5,"debug":13,"ref":43,"ref-struct":42}],29:[function(require,module,exports){
(function (Buffer){

/**
 * Module dependencies.
 */

var CIF = require('./cif')
  , _ForeignFunction = require('./_foreign_function')
  , debug = require('debug')('ffi:ForeignFunction')
  , assert = require('assert')
  , ref = require('ref')

/**
 * Represents a foreign function in another library. Manages all of the aspects
 * of function execution, including marshalling the data parameters for the
 * function into native types and also unmarshalling the return from function
 * execution.
 */

function ForeignFunction (funcPtr, returnType, argTypes, abi) {
  debug('creating new ForeignFunction', funcPtr)

  // check args
  assert(Buffer.isBuffer(funcPtr), 'expected Buffer as first argument')
  assert(!!returnType, 'expected a return "type" object as the second argument')
  assert(Array.isArray(argTypes), 'expected Array of arg "type" objects as the third argument')

  // normalize the "types" (they could be strings,
  // so turn into real type instances)
  returnType = ref.coerceType(returnType)
  argTypes = argTypes.map(ref.coerceType)

  // create the `ffi_cif *` instance
  var cif = CIF(returnType, argTypes, abi)

  // create and return the JS proxy function
  return _ForeignFunction(cif, funcPtr, returnType, argTypes)
}
module.exports = ForeignFunction

}).call(this,{"isBuffer":require("../../is-buffer/index.js")})
},{"../../is-buffer/index.js":36,"./_foreign_function":21,"./cif":24,"assert":5,"debug":13,"ref":43}],30:[function(require,module,exports){
(function (Buffer){

/**
 * Module dependencies.
 */

var CIF_var = require('./cif_var')
  , Type = require('./type')
  , _ForeignFunction = require('./_foreign_function')
  , assert = require('assert')
  , debug = require('debug')('ffi:VariadicForeignFunction')
  , ref = require('ref')
  , bindings = require('./bindings')
  , POINTER_SIZE = ref.sizeof.pointer
  , FFI_ARG_SIZE = bindings.FFI_ARG_SIZE

/**
 * For when you want to call to a C function with variable amount of arguments.
 * i.e. `printf()`.
 *
 * This function takes care of caching and reusing ForeignFunction instances that
 * contain the same ffi_type argument signature.
 */

function VariadicForeignFunction (funcPtr, returnType, fixedArgTypes, abi) {
  debug('creating new VariadicForeignFunction', funcPtr)

  // the cache of ForeignFunction instances that this
  // VariadicForeignFunction has created so far
  var cache = {}

  // check args
  assert(Buffer.isBuffer(funcPtr), 'expected Buffer as first argument')
  assert(!!returnType, 'expected a return "type" object as the second argument')
  assert(Array.isArray(fixedArgTypes), 'expected Array of arg "type" objects as the third argument')

  var numFixedArgs = fixedArgTypes.length

  // normalize the "types" (they could be strings,
  // so turn into real type instances)
  fixedArgTypes = fixedArgTypes.map(ref.coerceType)

  // get the names of the fixed arg types
  var fixedKey = fixedArgTypes.map(function (type) {
    return getId(type)
  })


  // what gets returned is another function that needs to be invoked with the rest
  // of the variadic types that are being invoked from the function.
  function variadic_function_generator () {
    debug('variadic_function_generator invoked')

    // first get the types of variadic args we are working with
    var argTypes = fixedArgTypes.slice()
    var key = fixedKey.slice()

    for (var i = 0; i < arguments.length; i++) {
      var type = ref.coerceType(arguments[i])
      argTypes.push(type)

      var ffi_type = Type(type)
      assert(ffi_type.name)
      key.push(getId(type))
    }

    // now figure out the return type
    var rtnType = ref.coerceType(variadic_function_generator.returnType)
    var rtnName = getId(rtnType)
    assert(rtnName)

    // first let's generate the key and see if we got a cache-hit
    key = rtnName + key.join('')

    var func = cache[key]
    if (func) {
      debug('cache hit for key:', key)
    } else {
      // create the `ffi_cif *` instance
      debug('creating the variadic ffi_cif instance for key:', key)
      var cif = CIF_var(returnType, argTypes, numFixedArgs, abi)
      func = cache[key] = _ForeignFunction(cif, funcPtr, rtnType, argTypes)
    }
    return func
  }

  // set the return type. we set it as a property of the function generator to
  // allow for monkey patching the return value in the very rare case where the
  // return type is variadic as well
  variadic_function_generator.returnType = returnType

  return variadic_function_generator
}

module.exports = VariadicForeignFunction

var idKey = '_ffiId'
function getId (type) {
  if (!type.hasOwnProperty(idKey)) {
    type[idKey] = (((1+Math.random())*0x10000)|0).toString(16)
  }
  return type[idKey]
}

}).call(this,{"isBuffer":require("../../is-buffer/index.js")})
},{"../../is-buffer/index.js":36,"./_foreign_function":21,"./bindings":22,"./cif_var":25,"./type":33,"assert":5,"debug":13,"ref":43}],31:[function(require,module,exports){
(function (Buffer){

/**
 * Module dependencies.
 */

var ref = require('ref')
  , assert = require('assert')
  , bindings = require('./bindings')
  , Callback = require('./callback')
  , ForeignFunction = require('./foreign_function')
  , debug = require('debug')('ffi:FunctionType')
 
/**
 * Module exports.
 */

module.exports = Function

/**
 * Creates and returns a "type" object for a C "function pointer".
 *
 * @api public
 */

function Function (retType, argTypes, abi) {
  if (!(this instanceof Function)) {
    return new Function(retType, argTypes, abi)
  }

  debug('creating new FunctionType')

  // check args
  assert(!!retType, 'expected a return "type" object as the first argument')
  assert(Array.isArray(argTypes), 'expected Array of arg "type" objects as the second argument')

  // normalize the "types" (they could be strings, so turn into real type
  // instances)
  this.retType = ref.coerceType(retType)
  this.argTypes = argTypes.map(ref.coerceType)
  this.abi = null == abi ? bindings.FFI_DEFAULT_ABI : abi
}

/**
 * The "ffi_type" is set for node-ffi functions.
 */

Function.prototype.ffi_type = bindings.FFI_TYPES.pointer

/**
 * The "size" is always pointer-sized.
 */

Function.prototype.size = ref.sizeof.pointer

/**
 * The "alignment" is always pointer-aligned.
 */

Function.prototype.alignment = ref.alignof.pointer

/**
 * The "indirection" is always 1 to ensure that our get()/set() get called.
 */

Function.prototype.indirection = 1

/**
 * Returns a ffi.Callback pointer (Buffer) of this function type for the
 * given `fn` Function.
 */

Function.prototype.toPointer = function toPointer (fn) {
  return Callback(this.retType, this.argTypes, this.abi, fn)
}

/**
 * Returns a ffi.ForeignFunction (Function) of this function type for the
 * given `buf` Buffer.
 */

Function.prototype.toFunction = function toFunction (buf) {
  return ForeignFunction(buf, this.retType, this.argTypes, this.abi)
}

/**
 * get function; return a ForeignFunction instance.
 */

Function.prototype.get = function get (buffer, offset) {
  debug('ffi FunctionType "get" function')
  var ptr = buffer.readPointer(offset)
  return this.toFunction(ptr)
}

/**
 * set function; return a Callback buffer.
 */

Function.prototype.set = function set (buffer, offset, value) {
  debug('ffi FunctionType "set" function')
  var ptr
  if ('function' == typeof value) {
    ptr = this.toPointer(value)
  } else if (Buffer.isBuffer(value)) {
    ptr = value
  } else {
    throw new Error('don\'t know how to set callback function for: ' + value)
  }
  buffer.writePointer(ptr, offset)
}

}).call(this,{"isBuffer":require("../../is-buffer/index.js")})
},{"../../is-buffer/index.js":36,"./bindings":22,"./callback":23,"./foreign_function":29,"assert":5,"debug":13,"ref":43}],32:[function(require,module,exports){
(function (process){

/**
 * Module dependencies.
 */

var DynamicLibrary = require('./dynamic_library')
  , ForeignFunction = require('./foreign_function')
  , VariadicForeignFunction = require('./foreign_function_var')
  , debug = require('debug')('ffi:Library')
  , RTLD_NOW = DynamicLibrary.FLAGS.RTLD_NOW

/**
 * The extension to use on libraries.
 * i.e.  libm  ->  libm.so   on linux
 */

var EXT = Library.EXT = {
    'linux':  '.so'
  , 'linux2': '.so'
  , 'sunos':  '.so'
  , 'solaris':'.so'
  , 'freebsd':'.so'
  , 'openbsd':'.so'
  , 'darwin': '.dylib'
  , 'mac':    '.dylib'
  , 'win32':  '.dll'
}[process.platform]

/**
 * Provides a friendly abstraction/API on-top of DynamicLibrary and
 * ForeignFunction.
 */

function Library (libfile, funcs, lib) {
  debug('creating Library object for', libfile)

  if (libfile && libfile.indexOf(EXT) === -1) {
    debug('appending library extension to library name', EXT)
    libfile += EXT
  }

  if (!lib) {
    lib = {}
  }
  var dl = new DynamicLibrary(libfile || null, RTLD_NOW)

  Object.keys(funcs || {}).forEach(function (func) {
    debug('defining function', func)

    var fptr = dl.get(func)
      , info = funcs[func]

    if (fptr.isNull()) {
      throw new Error('Library: "' + libfile
        + '" returned NULL function pointer for "' + func + '"')
    }

    var resultType = info[0]
      , paramTypes = info[1]
      , fopts = info[2]
      , abi = fopts && fopts.abi
      , async = fopts && fopts.async
      , varargs = fopts && fopts.varargs

    if (varargs) {
      lib[func] = VariadicForeignFunction(fptr, resultType, paramTypes, abi)
    } else {
      var ff = ForeignFunction(fptr, resultType, paramTypes, abi)
      lib[func] = async ? ff.async : ff
    }
  })

  return lib
}
module.exports = Library

}).call(this,require('_process'))
},{"./dynamic_library":26,"./foreign_function":29,"./foreign_function_var":30,"_process":41,"debug":13}],33:[function(require,module,exports){
(function (Buffer){

/**
 * Module dependencies.
 */

var ref = require('ref')
var assert = require('assert')
var debug = require('debug')('ffi:types')
var Struct = require('ref-struct')
var bindings = require('./bindings')

/**
 * Define the `ffi_type` struct (see deps/libffi/include/ffi.h) for use in JS.
 * This struct type is used internally to define custom struct rtn/arg types.
 */

var FFI_TYPE = Type.FFI_TYPE = Struct()
FFI_TYPE.defineProperty('size',      ref.types.size_t)
FFI_TYPE.defineProperty('alignment', ref.types.ushort)
FFI_TYPE.defineProperty('type',      ref.types.ushort)
// this last prop is a C Array of `ffi_type *` elements, so this is `ffi_type **`
var ffi_type_ptr_array = ref.refType(ref.refType(FFI_TYPE))
FFI_TYPE.defineProperty('elements',  ffi_type_ptr_array)
assert.equal(bindings.FFI_TYPE_SIZE, FFI_TYPE.size)

/**
 * Returns a `ffi_type *` Buffer appropriate for the given "type".
 *
 * @param {Type|String} type A "ref" type (or string) to get the `ffi_type` for
 * @return {Buffer} A buffer pointing to a `ffi_type` instance for "type"
 * @api private
 */

function Type (type) {
  type = ref.coerceType(type)
  debug('Type()', type.name || type)
  assert(type.indirection >= 1, 'invalid "type" given: ' + (type.name || type))
  var rtn

  // first we assume it's a regular "type". if the "indirection" is greater than
  // 1, then we can just use "pointer" ffi_type, otherwise we hope "ffi_type" is
  // set
  if (type.indirection === 1) {
    rtn = type.ffi_type
  } else {
    rtn = bindings.FFI_TYPES.pointer
  }

  // if "rtn" isn't set (ffi_type was not set) then we check for "ref-array" type
  if (!rtn && type.type) {
    // got a "ref-array" type
    // passing arrays to C functions are always by reference, so we use "pointer"
    rtn = bindings.FFI_TYPES.pointer
  }

  if (!rtn && type.fields) {
    // got a "ref-struct" type
    // need to create the `ffi_type` instance manually
    debug('creating an `ffi_type` for given "ref-struct" type')
    var fields = type.fields
      , fieldNames = Object.keys(fields)
      , numFields = fieldNames.length
      , numElements = 0
      , ffi_type = new FFI_TYPE
      , i = 0
      , field
      , ffi_type_ptr

    // these are the "ffi_type" values expected for a struct
    ffi_type.size = 0
    ffi_type.alignment = 0
    ffi_type.type = 13 // FFI_TYPE_STRUCT

    // first we have to figure out the number of "elements" that will go in the
    // array. this would normally just be "numFields" but we also have to account
    // for arrays, which each act as their own element
    for (i = 0; i < numFields; i++) {
      field = fields[fieldNames[i]]
      if (field.type.fixedLength > 0) {
        // a fixed-length "ref-array" type
        numElements += field.type.fixedLength
      } else {
        numElements += 1
      }
    }

    // hand-crafting a null-terminated array here.
    // XXX: use "ref-array"?
    var size = ref.sizeof.pointer * (numElements + 1) // +1 because of the NULL terminator
    var elements = ffi_type.elements = new Buffer(size)
    var index = 0
    for (i = 0; i < numFields; i++) {
      field = fields[fieldNames[i]]
      if (field.type.fixedLength > 0) {
        // a fixed-length "ref-array" type
        ffi_type_ptr = Type(field.type.type)
        for (var j = 0; j < field.type.fixedLength; j++) {
          elements.writePointer(ffi_type_ptr, (index++) * ref.sizeof.pointer)
        }
      } else {
        ffi_type_ptr = Type(field.type)
        elements.writePointer(ffi_type_ptr, (index++) * ref.sizeof.pointer)
      }
    }
    // final NULL pointer to terminate the Array
    elements.writePointer(ref.NULL, index * ref.sizeof.pointer)
    // also set the `ffi_type` property to that it's cached for next time
    rtn = type.ffi_type = ffi_type.ref()
  }

  if (!rtn && type.name) {
    // handle "ref" types other than the set that node-ffi is using (i.e.
    // a separate copy)
    if ('CString' == type.name) {
      rtn = type.ffi_type = bindings.FFI_TYPES.pointer
    } else {
      var cur = type
      while (!rtn && cur) {
        rtn = cur.ffi_type = bindings.FFI_TYPES[cur.name]
        cur = Object.getPrototypeOf(cur)
      }
    }
  }

  assert(rtn, 'Could not determine the `ffi_type` instance for type: ' + (type.name || type))
  debug('returning `ffi_type`', rtn.name)
  return rtn
}
module.exports = Type

}).call(this,require("buffer").Buffer)
},{"./bindings":22,"assert":5,"buffer":10,"debug":13,"ref":43,"ref-struct":42}],34:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],35:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],36:[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

},{}],37:[function(require,module,exports){
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],38:[function(require,module,exports){
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} options
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options){
  options = options || {};
  if ('string' == typeof val) return parse(val);
  return options.long
    ? long(val)
    : short(val);
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = '' + str;
  if (str.length > 10000) return;
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
  if (!match) return;
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function short(ms) {
  if (ms >= d) return Math.round(ms / d) + 'd';
  if (ms >= h) return Math.round(ms / h) + 'h';
  if (ms >= m) return Math.round(ms / m) + 'm';
  if (ms >= s) return Math.round(ms / s) + 's';
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function long(ms) {
  return plural(ms, d, 'day')
    || plural(ms, h, 'hour')
    || plural(ms, m, 'minute')
    || plural(ms, s, 'second')
    || ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) return;
  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
  return Math.ceil(ms / n) + ' ' + name + 's';
}

},{}],39:[function(require,module,exports){
exports.endianness = function () { return 'LE' };

exports.hostname = function () {
    if (typeof location !== 'undefined') {
        return location.hostname
    }
    else return '';
};

exports.loadavg = function () { return [] };

exports.uptime = function () { return 0 };

exports.freemem = function () {
    return Number.MAX_VALUE;
};

exports.totalmem = function () {
    return Number.MAX_VALUE;
};

exports.cpus = function () { return [] };

exports.type = function () { return 'Browser' };

exports.release = function () {
    if (typeof navigator !== 'undefined') {
        return navigator.appVersion;
    }
    return '';
};

exports.networkInterfaces
= exports.getNetworkInterfaces
= function () { return {} };

exports.arch = function () { return 'javascript' };

exports.platform = function () { return 'browser' };

exports.tmpdir = exports.tmpDir = function () {
    return '/tmp';
};

exports.EOL = '\n';

},{}],40:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":41}],41:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],42:[function(require,module,exports){
(function (Buffer){

/**
 * An interface for modeling and instantiating C-style data structures. This is
 * not a constructor per-say, but a constructor generator. It takes an array of
 * tuples, the left side being the type, and the right side being a field name.
 * The order should be the same order it would appear in the C-style struct
 * definition. It returns a function that can be used to construct an object that
 * reads and writes to the data structure using properties specified by the
 * initial field list.
 *
 * The only verboten field names are "ref", which is used used on struct
 * instances as a function to retrieve the backing Buffer instance of the
 * struct, and "ref.buffer" which contains the backing Buffer instance.
 *
 *
 * Example:
 *
 * ``` javascript
 * var ref = require('ref')
 * var Struct = require('ref-struct')
 *
 * // create the `char *` type
 * var charPtr = ref.refType(ref.types.char)
 * var int = ref.types.int
 *
 * // create the struct "type" / constructor
 * var PasswordEntry = Struct({
 *     'username': 'string'
 *   , 'password': 'string'
 *   , 'salt':     int
 * })
 *
 * // create an instance of the struct, backed a Buffer instance
 * var pwd = new PasswordEntry()
 * pwd.username = 'ricky'
 * pwd.password = 'rbransonlovesnode.js'
 * pwd.salt = (Math.random() * 1000000) | 0
 *
 * pwd.username // → 'ricky'
 * pwd.password // → 'rbransonlovesnode.js'
 * pwd.salt     // → 820088
 * ```
 */

/**
 * Module dependencies.
 */

var ref = require('ref')
var util = require('util')
var assert = require('assert')
var debug = require('debug')('ref:struct')

/**
 * Module exports.
 */

module.exports = Struct

/**
 * The Struct "type" meta-constructor.
 */

function Struct () {
  debug('defining new struct "type"')

  /**
   * This is the "constructor" of the Struct type that gets returned.
   *
   * Invoke it with `new` to create a new Buffer instance backing the struct.
   * Pass it an existing Buffer instance to use that as the backing buffer.
   * Pass in an Object containing the struct fields to auto-populate the
   * struct with the data.
   */

  function StructType (arg, data) {
    if (!(this instanceof StructType)) {
      return new StructType(arg, data)
    }
    debug('creating new struct instance')
    var store
    if (Buffer.isBuffer(arg)) {
      debug('using passed-in Buffer instance to back the struct', arg)
      assert(arg.length >= StructType.size, 'Buffer instance must be at least ' +
          StructType.size + ' bytes to back this struct type')
      store = arg
      arg = data
    } else {
      debug('creating new Buffer instance to back the struct (size: %d)', StructType.size)
      store = new Buffer(StructType.size)
    }

    // set the backing Buffer store
    store.type = StructType
    this['ref.buffer'] = store

    if (arg) {
      for (var key in arg) {
        // hopefully hit the struct setters
        this[key] = arg[key]
      }
    }
    StructType._instanceCreated = true
  }

  // make instances inherit from the `proto`
  StructType.prototype = Object.create(proto, {
    constructor: {
        value: StructType
      , enumerable: false
      , writable: true
      , configurable: true
    }
  })

  StructType.defineProperty = defineProperty
  StructType.toString = toString
  StructType.fields = {}

  var opt = (arguments.length > 0 && arguments[1]) ? arguments[1] : {};
  // Setup the ref "type" interface. The constructor doubles as the "type" object
  StructType.size = 0
  StructType.alignment = 0
  StructType.indirection = 1
  StructType.isPacked = opt.packed ? Boolean(opt.packed) : false
  StructType.get = get
  StructType.set = set

  // Read the fields list and apply all the fields to the struct
  // TODO: Better arg handling... (maybe look at ES6 binary data API?)
  var arg = arguments[0]
  if (Array.isArray(arg)) {
    // legacy API
    arg.forEach(function (a) {
      var type = a[0]
      var name = a[1]
      StructType.defineProperty(name, type)
    })
  } else if (typeof arg === 'object') {
    Object.keys(arg).forEach(function (name) {
      var type = arg[name]
      StructType.defineProperty(name, type)
    })
  }

  return StructType
}

/**
 * The "get" function of the Struct "type" interface
 */

function get (buffer, offset) {
  debug('Struct "type" getter for buffer at offset', buffer, offset)
  if (offset > 0) {
    buffer = buffer.slice(offset)
  }
  return new this(buffer)
}

/**
 * The "set" function of the Struct "type" interface
 */

function set (buffer, offset, value) {
  debug('Struct "type" setter for buffer at offset', buffer, offset, value)
  var isStruct = value instanceof this
  if (isStruct) {
    // optimization: copy the buffer contents directly rather
    // than going through the ref-struct constructor
    value['ref.buffer'].copy(buffer, offset, 0, this.size)
  } else {
    if (offset > 0) {
      buffer = buffer.slice(offset)
    }
    new this(buffer, value)
  }
}

/**
 * Custom `toString()` override for struct type instances.
 */

function toString () {
  return '[StructType]'
}

/**
 * Adds a new field to the struct instance with the given name and type.
 * Note that this function will throw an Error if any instances of the struct
 * type have already been created, therefore this function must be called at the
 * beginning, before any instances are created.
 */

function defineProperty (name, type) {
  debug('defining new struct type field', name)

  // allow string types for convenience
  type = ref.coerceType(type)

  assert(!this._instanceCreated, 'an instance of this Struct type has already ' +
      'been created, cannot add new "fields" anymore')
  assert.equal('string', typeof name, 'expected a "string" field name')
  assert(type && /object|function/i.test(typeof type) && 'size' in type &&
      'indirection' in type
      , 'expected a "type" object describing the field type: "' + type + '"')
  assert(type.indirection > 1 || type.size > 0,
      '"type" object must have a size greater than 0')
  assert(!(name in this.prototype), 'the field "' + name +
      '" already exists in this Struct type')

  var field = {
    type: type
  }
  this.fields[name] = field

  // define the getter/setter property
  var desc = { enumerable: true , configurable: true }
  desc.get = function () {
    debug('getting "%s" struct field (offset: %d)', name, field.offset)
    return ref.get(this['ref.buffer'], field.offset, type)
  }
  desc.set = function (value) {
    debug('setting "%s" struct field (offset: %d)', name, field.offset, value)
    return ref.set(this['ref.buffer'], field.offset, value, type)
  }

  // calculate the new size and field offsets
  recalc(this)

  Object.defineProperty(this.prototype, name, desc)
}

function recalc (struct) {

  // reset size and alignment
  struct.size = 0
  struct.alignment = 0

  var fieldNames = Object.keys(struct.fields)

  // first loop through is to determine the `alignment` of this struct
  fieldNames.forEach(function (name) {
    var field = struct.fields[name]
    var type = field.type
    var alignment = type.alignment || ref.alignof.pointer
    if (type.indirection > 1) {
      alignment = ref.alignof.pointer
    }
    if (struct.isPacked) {
      struct.alignment = Math.min(struct.alignment || alignment, alignment)
    } else {
      struct.alignment = Math.max(struct.alignment, alignment)
    }
  })

  // second loop through sets the `offset` property on each "field"
  // object, and sets the `struct.size` as we go along
  fieldNames.forEach(function (name) {
    var field = struct.fields[name]
    var type = field.type

    if (null != type.fixedLength) {
      // "ref-array" types set the "fixedLength" prop. don't treat arrays like one
      // contiguous entity. instead, treat them like individual elements in the
      // struct. doing this makes the padding end up being calculated correctly.
      field.offset = addType(type.type)
      for (var i = 1; i < type.fixedLength; i++) {
        addType(type.type)
      }
    } else {
      field.offset = addType(type)
    }
  })

  function addType (type) {
    var offset = struct.size
    var align = type.indirection === 1 ? type.alignment : ref.alignof.pointer
    var padding = struct.isPacked ? 0 : (align - (offset % align)) % align
    var size = type.indirection === 1 ? type.size : ref.sizeof.pointer

    offset += padding

    if (!struct.isPacked) {
      assert.equal(offset % align, 0, "offset should align")
    }

    // adjust the "size" of the struct type
    struct.size = offset + size

    // return the calulated offset
    return offset
  }

  // any final padding?
  var left = struct.size % struct.alignment
  if (left > 0) {
    debug('additional padding to the end of struct:', struct.alignment - left)
    struct.size += struct.alignment - left
  }
}

/**
 * this is the custom prototype of Struct type instances.
 */

var proto = {}

/**
 * set a placeholder variable on the prototype so that defineProperty() will
 * throw an error if you try to define a struct field with the name "buffer".
 */

proto['ref.buffer'] = ref.NULL

/**
 * Flattens the Struct instance into a regular JavaScript Object. This function
 * "gets" all the defined properties.
 *
 * @api public
 */

proto.toObject = function toObject () {
  var obj = {}
  Object.keys(this.constructor.fields).forEach(function (k) {
    obj[k] = this[k]
  }, this)
  return obj
}

/**
 * Basic `JSON.stringify(struct)` support.
 */

proto.toJSON = function toJSON () {
  return this.toObject()
}

/**
 * `.inspect()` override. For the REPL.
 *
 * @api public
 */

proto.inspect = function inspect () {
  var obj = this.toObject()
  // add instance's "own properties"
  Object.keys(this).forEach(function (k) {
    obj[k] = this[k]
  }, this)
  return util.inspect(obj)
}

/**
 * returns a Buffer pointing to this struct data structure.
 */

proto.ref = function ref () {
  return this['ref.buffer']
}

}).call(this,require("buffer").Buffer)
},{"assert":5,"buffer":10,"debug":13,"ref":43,"util":60}],43:[function(require,module,exports){
(function (Buffer){

var assert = require('assert')
var debug = require('debug')('ref')

exports = module.exports = require('bindings')('binding')

/**
 * A `Buffer` that references the C NULL pointer. That is, its memory address
 * points to 0. Its `length` is 0 because accessing any data from this buffer
 * would cause a _segmentation fault_.
 *
 * ```
 * console.log(ref.NULL);
 * <SlowBuffer@0x0 >
 * ```
 *
 * @name NULL
 * @type Buffer
 */

/**
 * A string that represents the native endianness of the machine's processor.
 * The possible values are either `"LE"` or `"BE"`.
 *
 * ```
 * console.log(ref.endianness);
 * 'LE'
 * ```
 *
 * @name endianness
 * @type String
 */

/**
 * Accepts a `Buffer` instance and returns the memory address of the buffer
 * instance.
 *
 * ```
 * console.log(ref.address(new Buffer(1)));
 * 4320233616
 *
 * console.log(ref.address(ref.NULL)));
 * 0
 * ```
 *
 * @param {Buffer} buffer The buffer to get the memory address of.
 * @return {Number} The memory address the buffer instance.
 * @name address
 * @type method
 */

/**
 * Accepts a `Buffer` instance and returns _true_ if the buffer represents the
 * NULL pointer, _false_ otherwise.
 *
 * ```
 * console.log(ref.isNull(new Buffer(1)));
 * false
 *
 * console.log(ref.isNull(ref.NULL));
 * true
 * ```
 *
 * @param {Buffer} buffer The buffer to check for NULL.
 * @return {Boolean} true or false.
 * @name isNull
 * @type method
 */

/**
 * Reads a JavaScript Object that has previously been written to the given
 * _buffer_ at the given _offset_.
 *
 * ```
 * var obj = { foo: 'bar' };
 * var buf = ref.alloc('Object', obj);
 *
 * var obj2 = ref.readObject(buf, 0);
 * console.log(obj === obj2);
 * true
 * ```
 *
 * @param {Buffer} buffer The buffer to read an Object from.
 * @param {Number} offset The offset to begin reading from.
 * @return {Object} The Object that was read from _buffer_.
 * @name readObject
 * @type method
 */

/**
 * Reads a Buffer instance from the given _buffer_ at the given _offset_.
 * The _size_ parameter specifies the `length` of the returned Buffer instance,
 * which defaults to __0__.
 *
 * ```
 * var buf = new Buffer('hello world');
 * var pointer = ref.alloc('pointer');
 *
 * var buf2 = ref.readPointer(pointer, 0, buf.length);
 * console.log(buf.toString());
 * 'hello world'
 * ```
 *
 * @param {Buffer} buffer The buffer to read a Buffer from.
 * @param {Number} offset The offset to begin reading from.
 * @param {Number} length (optional) The length of the returned Buffer. Defaults to 0.
 * @return {Buffer} The Buffer instance that was read from _buffer_.
 * @name readPointer
 * @type method
 */

/**
 * Returns a JavaScript String read from _buffer_ at the given _offset_. The
 * C String is read until the first NULL byte, which indicates the end of the
 * String.
 *
 * This function can read beyond the `length` of a Buffer.
 *
 * ```
 * var buf = new Buffer('hello\0world\0');
 *
 * var str = ref.readCString(buf, 0);
 * console.log(str);
 * 'hello'
 * ```
 *
 * @param {Buffer} buffer The buffer to read a Buffer from.
 * @param {Number} offset The offset to begin reading from.
 * @return {String} The String that was read from _buffer_.
 * @name readCString
 * @type method
 */

/**
 * Returns a big-endian signed 64-bit int read from _buffer_ at the given
 * _offset_.
 *
 * If the returned value will fit inside a JavaScript Number without losing
 * precision, then a Number is returned, otherwise a String is returned.
 *
 * ```
 * var buf = ref.alloc('int64');
 * ref.writeInt64BE(buf, 0, '9223372036854775807');
 *
 * var val = ref.readInt64BE(buf, 0)
 * console.log(val)
 * '9223372036854775807'
 * ```
 *
 * @param {Buffer} buffer The buffer to read a Buffer from.
 * @param {Number} offset The offset to begin reading from.
 * @return {Number|String} The Number or String that was read from _buffer_.
 * @name readInt64BE
 * @type method
 */

/**
 * Returns a little-endian signed 64-bit int read from _buffer_ at the given
 * _offset_.
 *
 * If the returned value will fit inside a JavaScript Number without losing
 * precision, then a Number is returned, otherwise a String is returned.
 *
 * ```
 * var buf = ref.alloc('int64');
 * ref.writeInt64LE(buf, 0, '9223372036854775807');
 *
 * var val = ref.readInt64LE(buf, 0)
 * console.log(val)
 * '9223372036854775807'
 * ```
 *
 * @param {Buffer} buffer The buffer to read a Buffer from.
 * @param {Number} offset The offset to begin reading from.
 * @return {Number|String} The Number or String that was read from _buffer_.
 * @name readInt64LE
 * @type method
 */

/**
 * Returns a big-endian unsigned 64-bit int read from _buffer_ at the given
 * _offset_.
 *
 * If the returned value will fit inside a JavaScript Number without losing
 * precision, then a Number is returned, otherwise a String is returned.
 *
 * ```
 * var buf = ref.alloc('uint64');
 * ref.writeUInt64BE(buf, 0, '18446744073709551615');
 *
 * var val = ref.readUInt64BE(buf, 0)
 * console.log(val)
 * '18446744073709551615'
 * ```
 *
 * @param {Buffer} buffer The buffer to read a Buffer from.
 * @param {Number} offset The offset to begin reading from.
 * @return {Number|String} The Number or String that was read from _buffer_.
 * @name readUInt64BE
 * @type method
 */

/**
 * Returns a little-endian unsigned 64-bit int read from _buffer_ at the given
 * _offset_.
 *
 * If the returned value will fit inside a JavaScript Number without losing
 * precision, then a Number is returned, otherwise a String is returned.
 *
 * ```
 * var buf = ref.alloc('uint64');
 * ref.writeUInt64LE(buf, 0, '18446744073709551615');
 *
 * var val = ref.readUInt64LE(buf, 0)
 * console.log(val)
 * '18446744073709551615'
 * ```
 *
 * @param {Buffer} buffer The buffer to read a Buffer from.
 * @param {Number} offset The offset to begin reading from.
 * @return {Number|String} The Number or String that was read from _buffer_.
 * @name readUInt64LE
 * @type method
 */

/**
 * Writes the _input_ Number or String as a big-endian signed 64-bit int into
 * _buffer_ at the given _offset_.
 *
 * ```
 * var buf = ref.alloc('int64');
 * ref.writeInt64BE(buf, 0, '9223372036854775807');
 * ```
 *
 * @param {Buffer} buffer The buffer to write to.
 * @param {Number} offset The offset to begin writing from.
 * @param {Number|String} input This String or Number which gets written.
 * @name writeInt64BE
 * @type method
 */

/**
 * Writes the _input_ Number or String as a little-endian signed 64-bit int into
 * _buffer_ at the given _offset_.
 *
 * ```
 * var buf = ref.alloc('int64');
 * ref.writeInt64LE(buf, 0, '9223372036854775807');
 * ```
 *
 * @param {Buffer} buffer The buffer to write to.
 * @param {Number} offset The offset to begin writing from.
 * @param {Number|String} input This String or Number which gets written.
 * @name writeInt64LE
 * @type method
 */

/**
 * Writes the _input_ Number or String as a big-endian unsigned 64-bit int into
 * _buffer_ at the given _offset_.
 *
 * ```
 * var buf = ref.alloc('uint64');
 * ref.writeUInt64BE(buf, 0, '18446744073709551615');
 * ```
 *
 * @param {Buffer} buffer The buffer to write to.
 * @param {Number} offset The offset to begin writing from.
 * @param {Number|String} input This String or Number which gets written.
 * @name writeUInt64BE
 * @type method
 */

/**
 * Writes the _input_ Number or String as a little-endian unsigned 64-bit int
 * into _buffer_ at the given _offset_.
 *
 * ```
 * var buf = ref.alloc('uint64');
 * ref.writeUInt64LE(buf, 0, '18446744073709551615');
 * ```
 *
 * @param {Buffer} buffer The buffer to write to.
 * @param {Number} offset The offset to begin writing from.
 * @param {Number|String} input This String or Number which gets written.
 * @name writeUInt64LE
 * @type method
 */

/**
 * Returns a new clone of the given "type" object, with its
 * `indirection` level incremented by **1**.
 *
 * Say you wanted to create a type representing a `void *`:
 *
 * ```
 * var voidPtrType = ref.refType(ref.types.void);
 * ```
 *
 * @param {Object|String} type The "type" object to create a reference type from. Strings get coerced first.
 * @return {Object} The new "type" object with its `indirection` incremented by 1.
 */

exports.refType = function refType (type) {
  var _type = exports.coerceType(type)
  var rtn = Object.create(_type)
  rtn.indirection++
  if (_type.name) {
    rtn.name = _type.name + '*'
  }
  return rtn
}

/**
 * Returns a new clone of the given "type" object, with its
 * `indirection` level decremented by 1.
 *
 * @param {Object|String} type The "type" object to create a dereference type from. Strings get coerced first.
 * @return {Object} The new "type" object with its `indirection` decremented by 1.
 */

exports.derefType = function derefType (type) {
  var _type = exports.coerceType(type)
  if (_type.indirection === 1) {
    throw new Error('Cannot create deref\'d type for type with indirection 1')
  }
  var rtn = Object.getPrototypeOf(_type)
  if (rtn.indirection !== _type.indirection - 1) {
    // slow case
    rtn = Object.create(_type)
    rtn.indirection--
  }
  return rtn
}

/**
 * Coerces a "type" object from a String or an actual "type" object. String values
 * are looked up from the `ref.types` Object. So:
 *
 *   * `"int"` gets coerced into `ref.types.int`.
 *   * `"int *"` gets translated into `ref.refType(ref.types.int)`
 *   * `ref.types.int` gets translated into `ref.types.int` (returns itself)
 *
 * Throws an Error if no valid "type" object could be determined. Most `ref`
 * functions use this function under the hood, so anywhere a "type" object is
 * expected, a String may be passed as well, including simply setting the
 * `buffer.type` property.
 *
 * ```
 * var type = ref.coerceType('int **');
 *
 * console.log(type.indirection);
 * 3
 * ```
 *
 * @param {Object|String} type The "type" Object or String to coerce.
 * @return {Object} A "type" object
 */

exports.coerceType = function coerceType (type) {
  var rtn = type
  if (typeof rtn === 'string') {
    rtn = exports.types[type]
    if (rtn) return rtn

    // strip whitespace
    rtn = type.replace(/\s+/g, '').toLowerCase()
    if (rtn === 'pointer') {
      // legacy "pointer" being used :(
      rtn = exports.refType(exports.types.void) // void *
    } else if (rtn === 'string') {
      rtn = exports.types.CString // special char * type
    } else {
      var refCount = 0
      rtn = rtn.replace(/\*/g, function () {
        refCount++
        return ''
      })
      // allow string names to be passed in
      rtn = exports.types[rtn]
      if (refCount > 0) {
        if (!(rtn && 'size' in rtn && 'indirection' in rtn)) {
          throw new TypeError('could not determine a proper "type" from: ' + JSON.stringify(type))
        }
        for (var i = 0; i < refCount; i++) {
          rtn = exports.refType(rtn)
        }
      }
    }
  }
  if (!(rtn && 'size' in rtn && 'indirection' in rtn)) {
    throw new TypeError('could not determine a proper "type" from: ' + JSON.stringify(type))
  }
  return rtn
}

/**
 * Returns the "type" property of the given Buffer.
 * Creates a default type for the buffer when none exists.
 *
 * @param {Buffer} buffer The Buffer instance to get the "type" object from.
 * @return {Object} The "type" object from the given Buffer.
 */

exports.getType = function getType (buffer) {
  if (!buffer.type) {
    debug('WARN: no "type" found on buffer, setting default "type"', buffer)
    buffer.type = {}
    buffer.type.size = buffer.length
    buffer.type.indirection = 1
    buffer.type.get = function get () {
      throw new Error('unknown "type"; cannot get()')
    }
    buffer.type.set = function set () {
      throw new Error('unknown "type"; cannot set()')
    }
  }
  return exports.coerceType(buffer.type)
}

/**
 * Calls the `get()` function of the Buffer's current "type" (or the
 * passed in _type_ if present) at the given _offset_.
 *
 * This function handles checking the "indirection" level and returning a
 * proper "dereferenced" Bufffer instance when necessary.
 *
 * @param {Buffer} buffer The Buffer instance to read from.
 * @param {Number} offset (optional) The offset on the Buffer to start reading from. Defaults to 0.
 * @param {Object|String} type (optional) The "type" object to use when reading. Defaults to calling `getType()` on the buffer.
 * @return {?} Whatever value the "type" used when reading returns.
 */

exports.get = function get (buffer, offset, type) {
  if (!offset) {
    offset = 0
  }
  if (type) {
    type = exports.coerceType(type)
  } else {
    type = exports.getType(buffer)
  }
  debug('get(): (offset: %d)', offset, buffer)
  assert(type.indirection > 0, '"indirection" level must be at least 1')
  if (type.indirection === 1) {
    // need to check "type"
    return type.get(buffer, offset)
  } else {
    // need to create a deref'd Buffer
    var size = type.indirection === 2 ? type.size : exports.sizeof.pointer
    var reference = exports.readPointer(buffer, offset, size)
    reference.type = exports.derefType(type)
    return reference
  }
}

/**
 * Calls the `set()` function of the Buffer's current "type" (or the
 * passed in _type_ if present) at the given _offset_.
 *
 * This function handles checking the "indirection" level writing a pointer rather
 * than calling the `set()` function if the indirection is greater than 1.
 *
 * @param {Buffer} buffer The Buffer instance to write to.
 * @param {Number} offset The offset on the Buffer to start writing to.
 * @param {?} value The value to write to the Buffer instance.
 * @param {Object|String} type (optional) The "type" object to use when reading. Defaults to calling `getType()` on the buffer.
 */

exports.set = function set (buffer, offset, value, type) {
  if (!offset) {
    offset = 0
  }
  if (type) {
    type = exports.coerceType(type)
  } else {
    type = exports.getType(buffer)
  }
  debug('set(): (offset: %d)', offset, buffer, value)
  assert(type.indirection >= 1, '"indirection" level must be at least 1')
  if (type.indirection === 1) {
    type.set(buffer, offset, value)
  } else {
    exports.writePointer(buffer, offset, value)
  }
}


/**
 * Returns a new Buffer instance big enough to hold `type`,
 * with the given `value` written to it.
 *
 * ``` js
 * var intBuf = ref.alloc(ref.types.int)
 * var int_with_4 = ref.alloc(ref.types.int, 4)
 * ```
 *
 * @param {Object|String} type The "type" object to allocate. Strings get coerced first.
 * @param {?} value (optional) The initial value set on the returned Buffer, using _type_'s `set()` function.
 * @return {Buffer} A new Buffer instance with it's `type` set to "type", and (optionally) "value" written to it.
 */

exports.alloc = function alloc (_type, value) {
  var type = exports.coerceType(_type)
  debug('allocating Buffer for type with "size"', type.size)
  var size
  if (type.indirection === 1) {
    size = type.size
  } else {
    size = exports.sizeof.pointer
  }
  var buffer = new Buffer(size)
  buffer.type = type
  if (arguments.length >= 2) {
    debug('setting value on allocated buffer', value)
    exports.set(buffer, 0, value, type)
  }
  return buffer
}

/**
 * Returns a new `Buffer` instance with the given String written to it with the
 * given encoding (defaults to __'utf8'__). The buffer is 1 byte longer than the
 * string itself, and is NUL terminated.
 *
 * ```
 * var buf = ref.allocCString('hello world');
 *
 * console.log(buf.toString());
 * 'hello world\u0000'
 * ```
 *
 * @param {String} string The JavaScript string to be converted to a C string.
 * @param {String} encoding (optional) The encoding to use for the C string. Defaults to __'utf8'__.
 * @return {Buffer} The new `Buffer` instance with the specified String wrtten to it, and a trailing NUL byte.
 */

exports.allocCString = function allocCString (string, encoding) {
  if (null == string || (Buffer.isBuffer(string) && exports.isNull(string))) {
    return exports.NULL
  }
  var size = Buffer.byteLength(string, encoding) + 1
  var buffer = new Buffer(size)
  exports.writeCString(buffer, 0, string, encoding)
  buffer.type = charPtrType
  return buffer
}

/**
 * Writes the given string as a C String (NULL terminated) to the given buffer
 * at the given offset. "encoding" is optional and defaults to __'utf8'__.
 *
 * Unlike `readCString()`, this function requires the buffer to actually have the
 * proper length.
 *
 * @param {Buffer} buffer The Buffer instance to write to.
 * @param {Number} offset The offset of the buffer to begin writing at.
 * @param {String} string The JavaScript String to write that will be written to the buffer.
 * @param {String} encoding (optional) The encoding to read the C string as. Defaults to __'utf8'__.
 */

exports.writeCString = function writeCString (buffer, offset, string, encoding) {
  assert(Buffer.isBuffer(buffer), 'expected a Buffer as the first argument')
  assert.equal('string', typeof string, 'expected a "string" as the third argument')
  if (!offset) {
    offset = 0
  }
  if (!encoding) {
    encoding = 'utf8'
  }
  var size = buffer.length - offset
  var len = buffer.write(string, offset, size, encoding)
  buffer.writeUInt8(0, offset + len)  // NUL terminate
}

exports['readInt64' + exports.endianness] = exports.readInt64
exports['readUInt64' + exports.endianness] = exports.readUInt64
exports['writeInt64' + exports.endianness] = exports.writeInt64
exports['writeUInt64' + exports.endianness] = exports.writeUInt64

var opposite = exports.endianness == 'LE' ? 'BE' : 'LE'
var int64temp = new Buffer(exports.sizeof.int64)
var uint64temp = new Buffer(exports.sizeof.uint64)

exports['readInt64' + opposite] = function (buffer, offset) {
  for (var i = 0; i < exports.sizeof.int64; i++) {
    int64temp[i] = buffer[offset + exports.sizeof.int64 - i - 1]
  }
  return exports.readInt64(int64temp, 0)
}
exports['readUInt64' + opposite] = function (buffer, offset) {
  for (var i = 0; i < exports.sizeof.uint64; i++) {
    uint64temp[i] = buffer[offset + exports.sizeof.uint64 - i - 1]
  }
  return exports.readUInt64(uint64temp, 0)
}
exports['writeInt64' + opposite] = function (buffer, offset, value) {
  exports.writeInt64(int64temp, 0, value)
  for (var i = 0; i < exports.sizeof.int64; i++) {
    buffer[offset + i] = int64temp[exports.sizeof.int64 - i - 1]
  }
}
exports['writeUInt64' + opposite] = function (buffer, offset, value) {
  exports.writeUInt64(uint64temp, 0, value)
  for (var i = 0; i < exports.sizeof.uint64; i++) {
    buffer[offset + i] = uint64temp[exports.sizeof.uint64 - i - 1]
  }
}

/**
 * `ref()` accepts a Buffer instance and returns a new Buffer
 * instance that is "pointer" sized and has its data pointing to the given
 * Buffer instance. Essentially the created Buffer is a "reference" to the
 * original pointer, equivalent to the following C code:
 *
 * ``` c
 * char *buf = buffer;
 * char **ref = &buf;
 * ```
 *
 * @param {Buffer} buffer A Buffer instance to create a reference to.
 * @return {Buffer} A new Buffer instance pointing to _buffer_.
 */

exports.ref = function ref (buffer) {
  debug('creating a reference to buffer', buffer)
  var type = exports.refType(exports.getType(buffer))
  return exports.alloc(type, buffer)
}

/**
 * Accepts a Buffer instance and attempts to "dereference" it.
 * That is, first it checks the `indirection` count of _buffer_'s "type", and if
 * it's greater than __1__ then it merely returns another Buffer, but with one
 * level less `indirection`.
 *
 * When _buffer_'s indirection is at __1__, then it checks for `buffer.type`
 * which should be an Object with its own `get()` function.
 *
 * ```
 * var buf = ref.alloc('int', 6);
 *
 * var val = ref.deref(buf);
 * console.log(val);
 * 6
 * ```
 *
 *
 * @param {Buffer} buffer A Buffer instance to dereference.
 * @return {?} The returned value after dereferencing _buffer_.
 */

exports.deref = function deref (buffer) {
  debug('dereferencing buffer', buffer)
  return exports.get(buffer)
}

/**
 * Attaches _object_ to _buffer_ such that it prevents _object_ from being garbage
 * collected until _buffer_ does.
 *
 * @param {Buffer} buffer A Buffer instance to attach _object_ to.
 * @param {Object|Buffer} object An Object or Buffer to prevent from being garbage collected until _buffer_ does.
 * @api private
 */

exports._attach = function _attach (buf, obj) {
  if (!buf._refs) {
    buf._refs = []
  }
  buf._refs.push(obj)
}

/**
 * Same as `ref.writeObject()`, except that this version does not _attach_ the
 * Object to the Buffer, which is potentially unsafe if the garbage collector
 * runs.
 *
 * @param {Buffer} buffer A Buffer instance to write _object_ to.
 * @param {Number} offset The offset on the Buffer to start writing at.
 * @param {Object} object The Object to be written into _buffer_.
 * @api private
 */

exports._writeObject = exports.writeObject

/**
 * Writes a pointer to _object_ into _buffer_ at the specified _offset.
 *
 * This function "attaches" _object_ to _buffer_ to prevent it from being garbage
 * collected.
 *
 * ```
 * var buf = ref.alloc('Object');
 * ref.writeObject(buf, 0, { foo: 'bar' });
 *
 * ```
 *
 * @param {Buffer} buffer A Buffer instance to write _object_ to.
 * @param {Number} offset The offset on the Buffer to start writing at.
 * @param {Object} object The Object to be written into _buffer_.
 */

exports.writeObject = function writeObject (buf, offset, obj, persistent) {
  debug('writing Object to buffer', buf, offset, obj, persistent)
  exports._writeObject(buf, offset, obj, persistent)
  exports._attach(buf, obj)
}

/**
 * Same as `ref.writePointer()`, except that this version does not attach
 * _pointer_ to _buffer_, which is potentially unsafe if the garbage collector
 * runs.
 *
 * @param {Buffer} buffer A Buffer instance to write _pointer to.
 * @param {Number} offset The offset on the Buffer to start writing at.
 * @param {Buffer} pointer The Buffer instance whose memory address will be written to _buffer_.
 * @api private
 */

exports._writePointer = exports.writePointer

/**
 * Writes the memory address of _pointer_ to _buffer_ at the specified _offset_.
 *
 * This function "attaches" _object_ to _buffer_ to prevent it from being garbage
 * collected.
 *
 * ```
 * var someBuffer = new Buffer('whatever');
 * var buf = ref.alloc('pointer');
 * ref.writePointer(buf, 0, someBuffer);
 * ```
 *
 * @param {Buffer} buffer A Buffer instance to write _pointer to.
 * @param {Number} offset The offset on the Buffer to start writing at.
 * @param {Buffer} pointer The Buffer instance whose memory address will be written to _buffer_.
 */

exports.writePointer = function writePointer (buf, offset, ptr) {
  debug('writing pointer to buffer', buf, offset, ptr)
  exports._writePointer(buf, offset, ptr)
  exports._attach(buf, ptr)
}

/**
 * Same as `ref.reinterpret()`, except that this version does not attach
 * _buffer_ to the returned Buffer, which is potentially unsafe if the
 * garbage collector runs.
 *
 * @param {Buffer} buffer A Buffer instance to base the returned Buffer off of.
 * @param {Number} size The `length` property of the returned Buffer.
 * @param {Number} offset The offset of the Buffer to begin from.
 * @return {Buffer} A new Buffer instance with the same memory address as _buffer_, and the requested _size_.
 * @api private
 */

exports._reinterpret = exports.reinterpret

/**
 * Returns a new Buffer instance with the specified _size_, with the same memory
 * address as _buffer_.
 *
 * This function "attaches" _buffer_ to the returned Buffer to prevent it from
 * being garbage collected.
 *
 * @param {Buffer} buffer A Buffer instance to base the returned Buffer off of.
 * @param {Number} size The `length` property of the returned Buffer.
 * @param {Number} offset The offset of the Buffer to begin from.
 * @return {Buffer} A new Buffer instance with the same memory address as _buffer_, and the requested _size_.
 */

exports.reinterpret = function reinterpret (buffer, size, offset) {
  debug('reinterpreting buffer to "%d" bytes', size)
  var rtn = exports._reinterpret(buffer, size, offset || 0)
  exports._attach(rtn, buffer)
  return rtn
}

/**
 * Same as `ref.reinterpretUntilZeros()`, except that this version does not
 * attach _buffer_ to the returned Buffer, which is potentially unsafe if the
 * garbage collector runs.
 *
 * @param {Buffer} buffer A Buffer instance to base the returned Buffer off of.
 * @param {Number} size The number of sequential, aligned `NULL` bytes that are required to terminate the buffer.
 * @param {Number} offset The offset of the Buffer to begin from.
 * @return {Buffer} A new Buffer instance with the same memory address as _buffer_, and a variable `length` that is terminated by _size_ NUL bytes.
 * @api private
 */

exports._reinterpretUntilZeros = exports.reinterpretUntilZeros

/**
 * Accepts a `Buffer` instance and a number of `NULL` bytes to read from the
 * pointer. This function will scan past the boundary of the Buffer's `length`
 * until it finds `size` number of aligned `NULL` bytes.
 *
 * This is useful for finding the end of NUL-termintated array or C string. For
 * example, the `readCString()` function _could_ be implemented like:
 *
 * ```
 * function readCString (buf) {
 *   return ref.reinterpretUntilZeros(buf, 1).toString('utf8')
 * }
 * ```
 *
 * This function "attaches" _buffer_ to the returned Buffer to prevent it from
 * being garbage collected.
 *
 * @param {Buffer} buffer A Buffer instance to base the returned Buffer off of.
 * @param {Number} size The number of sequential, aligned `NULL` bytes are required to terminate the buffer.
 * @param {Number} offset The offset of the Buffer to begin from.
 * @return {Buffer} A new Buffer instance with the same memory address as _buffer_, and a variable `length` that is terminated by _size_ NUL bytes.
 */

exports.reinterpretUntilZeros = function reinterpretUntilZeros (buffer, size, offset) {
  debug('reinterpreting buffer to until "%d" NULL (0) bytes are found', size)
  var rtn = exports._reinterpretUntilZeros(buffer, size, offset || 0)
  exports._attach(rtn, buffer)
  return rtn
}


// the built-in "types"
var types = exports.types = {}

/**
 * The `void` type.
 *
 * @section types
 */

types.void = {
    size: 0
  , indirection: 1
  , get: function get (buf, offset) {
      debug('getting `void` type (returns `null`)')
      return null
    }
  , set: function set (buf, offset, val) {
      debug('setting `void` type (no-op)')
    }
}

/**
 * The `int8` type.
 */

types.int8 = {
    size: exports.sizeof.int8
  , indirection: 1
  , get: function get (buf, offset) {
      return buf.readInt8(offset || 0)
    }
  , set: function set (buf, offset, val) {
      if (typeof val === 'string') {
        val = val.charCodeAt(0)
      }
      return buf.writeInt8(val, offset || 0)
    }
}

/**
 * The `uint8` type.
 */

types.uint8 = {
    size: exports.sizeof.uint8
  , indirection: 1
  , get: function get (buf, offset) {
      return buf.readUInt8(offset || 0)
    }
  , set: function set (buf, offset, val) {
      if (typeof val === 'string') {
        val = val.charCodeAt(0)
      }
      return buf.writeUInt8(val, offset || 0)
    }
}

/**
 * The `int16` type.
 */

types.int16 = {
    size: exports.sizeof.int16
  , indirection: 1
  , get: function get (buf, offset) {
      return buf['readInt16' + exports.endianness](offset || 0)
    }
  , set: function set (buf, offset, val) {
      return buf['writeInt16' + exports.endianness](val, offset || 0)
    }
}

/**
 * The `uint16` type.
 */

types.uint16 = {
    size: exports.sizeof.uint16
  , indirection: 1
  , get: function get (buf, offset) {
      return buf['readUInt16' + exports.endianness](offset || 0)
    }
  , set: function set (buf, offset, val) {
      return buf['writeUInt16' + exports.endianness](val, offset || 0)
    }
}

/**
 * The `int32` type.
 */

types.int32 = {
    size: exports.sizeof.int32
  , indirection: 1
  , get: function get (buf, offset) {
      return buf['readInt32' + exports.endianness](offset || 0)
    }
  , set: function set (buf, offset, val) {
      return buf['writeInt32' + exports.endianness](val, offset || 0)
    }
}

/**
 * The `uint32` type.
 */

types.uint32 = {
    size: exports.sizeof.uint32
  , indirection: 1
  , get: function get (buf, offset) {
      return buf['readUInt32' + exports.endianness](offset || 0)
    }
  , set: function set (buf, offset, val) {
      return buf['writeUInt32' + exports.endianness](val, offset || 0)
    }
}

/**
 * The `int64` type.
 */

types.int64 = {
    size: exports.sizeof.int64
  , indirection: 1
  , get: function get (buf, offset) {
      return buf['readInt64' + exports.endianness](offset || 0)
    }
  , set: function set (buf, offset, val) {
      return buf['writeInt64' + exports.endianness](val, offset || 0)
    }
}

/**
 * The `uint64` type.
 */

types.uint64 = {
    size: exports.sizeof.uint64
  , indirection: 1
  , get: function get (buf, offset) {
      return buf['readUInt64' + exports.endianness](offset || 0)
    }
  , set: function set (buf, offset, val) {
      return buf['writeUInt64' + exports.endianness](val, offset || 0)
    }
}

/**
 * The `float` type.
 */

types.float = {
    size: exports.sizeof.float
  , indirection: 1
  , get: function get (buf, offset) {
      return buf['readFloat' + exports.endianness](offset || 0)
    }
  , set: function set (buf, offset, val) {
      return buf['writeFloat' + exports.endianness](val, offset || 0)
    }
}

/**
 * The `double` type.
 */

types.double = {
    size: exports.sizeof.double
  , indirection: 1
  , get: function get (buf, offset) {
      return buf['readDouble' + exports.endianness](offset || 0)
    }
  , set: function set (buf, offset, val) {
      return buf['writeDouble' + exports.endianness](val, offset || 0)
    }
}

/**
 * The `Object` type. This can be used to read/write regular JS Objects
 * into raw memory.
 */

types.Object = {
    size: exports.sizeof.Object
  , indirection: 1
  , get: function get (buf, offset) {
      return buf.readObject(offset || 0)
    }
  , set: function set (buf, offset, val) {
      return buf.writeObject(val, offset || 0)
    }
}

/**
 * The `CString` (a.k.a `"string"`) type.
 *
 * CStrings are a kind of weird thing. We say it's `sizeof(char *)`, and
 * `indirection` level of 1, which means that we have to return a Buffer that
 * is pointer sized, and points to a some utf8 string data, so we have to create
 * a 2nd "in-between" buffer.
 */

types.CString = {
    size: exports.sizeof.pointer
  , alignment: exports.alignof.pointer
  , indirection: 1
  , get: function get (buf, offset) {
      var _buf = exports.readPointer(buf, offset)
      if (exports.isNull(_buf)) {
        return null
      }
      return exports.readCString(_buf, 0)
    }
  , set: function set (buf, offset, val) {
      var _buf
      if (Buffer.isBuffer(val)) {
        _buf = val
      } else {
        // assume string
        _buf = exports.allocCString(val)
      }
      return exports.writePointer(buf, offset, _buf)
    }
}

// alias Utf8String
var utfstringwarned = false
Object.defineProperty(types, 'Utf8String', {
    enumerable: false
  , configurable: true
  , get: function () {
      if (!utfstringwarned) {
        utfstringwarned = true
        console.error('"Utf8String" type is deprecated, use "CString" instead')
      }
      return types.CString
    }
})

/**
 * The `bool` type.
 *
 * Wrapper type around `types.uint8` that accepts/returns `true` or
 * `false` Boolean JavaScript values.
 *
 * @name bool
 *
 */

/**
 * The `byte` type.
 *
 * @name byte
 */

/**
 * The `char` type.
 *
 * @name char
 */

/**
 * The `uchar` type.
 *
 * @name uchar
 */

/**
 * The `short` type.
 *
 * @name short
 */

/**
 * The `ushort` type.
 *
 * @name ushort
 */

/**
 * The `int` type.
 *
 * @name int
 */

/**
 * The `uint` type.
 *
 * @name uint
 */

/**
 * The `long` type.
 *
 * @name long
 */

/**
 * The `ulong` type.
 *
 * @name ulong
 */

/**
 * The `longlong` type.
 *
 * @name longlong
 */

/**
 * The `ulonglong` type.
 *
 * @name ulonglong
 */

/**
 * The `size_t` type.
 *
 * @name size_t
 */

// "typedef"s for the variable-sized types
;[ 'bool', 'byte', 'char', 'uchar', 'short', 'ushort', 'int', 'uint', 'long'
, 'ulong', 'longlong', 'ulonglong', 'size_t' ].forEach(function (name) {
  var unsigned = name === 'bool'
              || name === 'byte'
              || name === 'size_t'
              || name[0] === 'u'
  var size = exports.sizeof[name]
  assert(size >= 1 && size <= 8)
  var typeName = 'int' + (size * 8)
  if (unsigned) {
    typeName = 'u' + typeName
  }
  var type = exports.types[typeName]
  assert(type)
  exports.types[name] = Object.create(type)
})

// set the "alignment" property on the built-in types
Object.keys(exports.alignof).forEach(function (name) {
  if (name === 'pointer') return
  exports.types[name].alignment = exports.alignof[name]
  assert(exports.types[name].alignment > 0)
})

// make the `bool` type work with JS true/false values
exports.types.bool.get = (function (_get) {
  return function get (buf, offset) {
    return _get(buf, offset) ? true : false
  }
})(exports.types.bool.get)
exports.types.bool.set = (function (_set) {
  return function set (buf, offset, val) {
    if (typeof val !== 'number') {
      val = val ? 1 : 0
    }
    return _set(buf, offset, val)
  }
})(exports.types.bool.set)

/*!
 * Set the `name` property of the types. Used for debugging...
 */

Object.keys(exports.types).forEach(function (name) {
  exports.types[name].name = name
})

/*!
 * This `char *` type is used by "allocCString()" above.
 */

var charPtrType = exports.refType(exports.types.char)

/*!
 * Set the `type` property of the `NULL` pointer Buffer object.
 */

exports.NULL.type = exports.types.void

/**
 * `NULL_POINTER` is a pointer-sized `Buffer` instance pointing to `NULL`.
 * Conceptually, it's equivalent to the following C code:
 *
 * ``` c
 * char *null_pointer;
 * null_pointer = NULL;
 * ```
 *
 * @type Buffer
 */

exports.NULL_POINTER = exports.ref(exports.NULL)

/**
 * All these '...' comment blocks below are for the documentation generator.
 *
 * @section buffer
 */

Buffer.prototype.address = function address () {
  return exports.address(this, 0)
}

/**
 * ...
 */

Buffer.prototype.hexAddress = function hexAddress () {
  return exports.hexAddress(this, 0)
}

/**
 * ...
 */

Buffer.prototype.isNull = function isNull () {
  return exports.isNull(this, 0)
}

/**
 * ...
 */

Buffer.prototype.ref = function ref () {
  return exports.ref(this)
}

/**
 * ...
 */

Buffer.prototype.deref = function deref () {
  return exports.deref(this)
}

/**
 * ...
 */

Buffer.prototype.readObject = function readObject (offset) {
  return exports.readObject(this, offset)
}

/**
 * ...
 */

Buffer.prototype.writeObject = function writeObject (obj, offset) {
  return exports.writeObject(this, offset, obj)
}

/**
 * ...
 */

Buffer.prototype.readPointer = function readPointer (offset, size) {
  return exports.readPointer(this, offset, size)
}

/**
 * ...
 */

Buffer.prototype.writePointer = function writePointer (ptr, offset) {
  return exports.writePointer(this, offset, ptr)
}

/**
 * ...
 */

Buffer.prototype.readCString = function readCString (offset) {
  return exports.readCString(this, offset)
}

/**
 * ...
 */

Buffer.prototype.writeCString = function writeCString (string, offset, encoding) {
  return exports.writeCString(this, offset, string, encoding)
}

/**
 * ...
 */

Buffer.prototype.readInt64BE = function readInt64BE (offset) {
  return exports.readInt64BE(this, offset)
}

/**
 * ...
 */

Buffer.prototype.writeInt64BE = function writeInt64BE (val, offset) {
  return exports.writeInt64BE(this, offset, val)
}

/**
 * ...
 */

Buffer.prototype.readUInt64BE = function readUInt64BE (offset) {
  return exports.readUInt64BE(this, offset)
}

/**
 * ...
 */

Buffer.prototype.writeUInt64BE = function writeUInt64BE (val, offset) {
  return exports.writeUInt64BE(this, offset, val)
}

/**
 * ...
 */

Buffer.prototype.readInt64LE = function readInt64LE (offset) {
  return exports.readInt64LE(this, offset)
}

/**
 * ...
 */

Buffer.prototype.writeInt64LE = function writeInt64LE (val, offset) {
  return exports.writeInt64LE(this, offset, val)
}

/**
 * ...
 */

Buffer.prototype.readUInt64LE = function readUInt64LE (offset) {
  return exports.readUInt64LE(this, offset)
}

/**
 * ...
 */

Buffer.prototype.writeUInt64LE = function writeUInt64LE (val, offset) {
  return exports.writeUInt64LE(this, offset, val)
}

/**
 * ...
 */

Buffer.prototype.reinterpret = function reinterpret (size, offset) {
  return exports.reinterpret(this, size, offset)
}

/**
 * ...
 */

Buffer.prototype.reinterpretUntilZeros = function reinterpretUntilZeros (size, offset) {
  return exports.reinterpretUntilZeros(this, size, offset)
}

/**
 * `ref` overwrites the default `Buffer#inspect()` function to include the
 * hex-encoded memory address of the Buffer instance when invoked.
 *
 * This is simply a nice-to-have.
 *
 * **Before**:
 *
 * ``` js
 * console.log(new Buffer('ref'));
 * <Buffer 72 65 66>
 * ```
 *
 * **After**:
 *
 * ``` js
 * console.log(new Buffer('ref'));
 * <Buffer@0x103015490 72 65 66>
 * ```
 */

Buffer.prototype.inspect = overwriteInspect(Buffer.prototype.inspect)

// does SlowBuffer inherit from Buffer? (node >= v0.7.9)
if (!(exports.NULL instanceof Buffer)) {
  debug('extending SlowBuffer\'s prototype since it doesn\'t inherit from Buffer.prototype')

  /*!
   * SlowBuffer convenience methods.
   */

  var SlowBuffer = require('buffer').SlowBuffer

  SlowBuffer.prototype.address = Buffer.prototype.address
  SlowBuffer.prototype.hexAddress = Buffer.prototype.hexAddress
  SlowBuffer.prototype.isNull = Buffer.prototype.isNull
  SlowBuffer.prototype.ref = Buffer.prototype.ref
  SlowBuffer.prototype.deref = Buffer.prototype.deref
  SlowBuffer.prototype.readObject = Buffer.prototype.readObject
  SlowBuffer.prototype.writeObject = Buffer.prototype.writeObject
  SlowBuffer.prototype.readPointer = Buffer.prototype.readPointer
  SlowBuffer.prototype.writePointer = Buffer.prototype.writePointer
  SlowBuffer.prototype.readCString = Buffer.prototype.readCString
  SlowBuffer.prototype.writeCString = Buffer.prototype.writeCString
  SlowBuffer.prototype.reinterpret = Buffer.prototype.reinterpret
  SlowBuffer.prototype.reinterpretUntilZeros = Buffer.prototype.reinterpretUntilZeros
  SlowBuffer.prototype.readInt64BE = Buffer.prototype.readInt64BE
  SlowBuffer.prototype.writeInt64BE = Buffer.prototype.writeInt64BE
  SlowBuffer.prototype.readUInt64BE = Buffer.prototype.readUInt64BE
  SlowBuffer.prototype.writeUInt64BE = Buffer.prototype.writeUInt64BE
  SlowBuffer.prototype.readInt64LE = Buffer.prototype.readInt64LE
  SlowBuffer.prototype.writeInt64LE = Buffer.prototype.writeInt64LE
  SlowBuffer.prototype.readUInt64LE = Buffer.prototype.readUInt64LE
  SlowBuffer.prototype.writeUInt64LE = Buffer.prototype.writeUInt64LE
  SlowBuffer.prototype.inspect = overwriteInspect(SlowBuffer.prototype.inspect)
}

function overwriteInspect (inspect) {
  if (inspect.name === 'refinspect') {
    return inspect
  } else {
    return function refinspect () {
      var v = inspect.apply(this, arguments)
      return v.replace('Buffer', 'Buffer@0x' + this.hexAddress())
    }
  }
}

}).call(this,require("buffer").Buffer)
},{"assert":5,"bindings":7,"buffer":10,"debug":13}],44:[function(require,module,exports){
var hasProp = Object.prototype.hasOwnProperty;

function throwsMessage(err) {
	return '[Throws: ' + (err ? err.message : '?') + ']';
}

function safeGetValueFromPropertyOnObject(obj, property) {
	if (hasProp.call(obj, property)) {
		try {
			return obj[property];
		}
		catch (err) {
			return throwsMessage(err);
		}
	}

	return obj[property];
}

function ensureProperties(obj) {
	var seen = [ ]; // store references to objects we have seen before

	function visit(obj) {
		if (obj === null || typeof obj !== 'object') {
			return obj;
		}

		if (seen.indexOf(obj) !== -1) {
			return '[Circular]';
		}
		seen.push(obj);

		if (typeof obj.toJSON === 'function') {
			try {
				return visit(obj.toJSON());
			} catch(err) {
				return throwsMessage(err);
			}
		}

		if (Array.isArray(obj)) {
			return obj.map(visit);
		}

		return Object.keys(obj).reduce(function(result, prop) {
			// prevent faulty defined getter properties
			result[prop] = visit(safeGetValueFromPropertyOnObject(obj, prop));
			return result;
		}, {});
	};

	return visit(obj);
}

module.exports = function(data) {
	return JSON.stringify(ensureProperties(data));
}

module.exports.ensureProperties = ensureProperties;

},{}],45:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Stream;

var EE = require('events').EventEmitter;
var inherits = require('inherits');

inherits(Stream, EE);
Stream.Readable = require('readable-stream/readable.js');
Stream.Writable = require('readable-stream/writable.js');
Stream.Duplex = require('readable-stream/duplex.js');
Stream.Transform = require('readable-stream/transform.js');
Stream.PassThrough = require('readable-stream/passthrough.js');

// Backwards-compat with node 0.4.x
Stream.Stream = Stream;



// old-style streams.  Note that the pipe method (the only relevant
// part of this class) is overridden in the Readable class.

function Stream() {
  EE.call(this);
}

Stream.prototype.pipe = function(dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    if (typeof dest.destroy === 'function') dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (EE.listenerCount(this, 'error') === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};

},{"events":20,"inherits":35,"readable-stream/duplex.js":47,"readable-stream/passthrough.js":53,"readable-stream/readable.js":54,"readable-stream/transform.js":55,"readable-stream/writable.js":56}],46:[function(require,module,exports){
module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

},{}],47:[function(require,module,exports){
module.exports = require("./lib/_stream_duplex.js")

},{"./lib/_stream_duplex.js":48}],48:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.

module.exports = Duplex;

/*<replacement>*/
var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
}
/*</replacement>*/


/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var Readable = require('./_stream_readable');
var Writable = require('./_stream_writable');

util.inherits(Duplex, Readable);

forEach(objectKeys(Writable.prototype), function(method) {
  if (!Duplex.prototype[method])
    Duplex.prototype[method] = Writable.prototype[method];
});

function Duplex(options) {
  if (!(this instanceof Duplex))
    return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false)
    this.readable = false;

  if (options && options.writable === false)
    this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false)
    this.allowHalfOpen = false;

  this.once('end', onend);
}

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended)
    return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  process.nextTick(this.end.bind(this));
}

function forEach (xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

}).call(this,require('_process'))
},{"./_stream_readable":50,"./_stream_writable":52,"_process":41,"core-util-is":12,"inherits":35}],49:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.

module.exports = PassThrough;

var Transform = require('./_stream_transform');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough))
    return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function(chunk, encoding, cb) {
  cb(null, chunk);
};

},{"./_stream_transform":51,"core-util-is":12,"inherits":35}],50:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Readable;

/*<replacement>*/
var isArray = require('isarray');
/*</replacement>*/


/*<replacement>*/
var Buffer = require('buffer').Buffer;
/*</replacement>*/

Readable.ReadableState = ReadableState;

var EE = require('events').EventEmitter;

/*<replacement>*/
if (!EE.listenerCount) EE.listenerCount = function(emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

var Stream = require('stream');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var StringDecoder;


/*<replacement>*/
var debug = require('util');
if (debug && debug.debuglog) {
  debug = debug.debuglog('stream');
} else {
  debug = function () {};
}
/*</replacement>*/


util.inherits(Readable, Stream);

function ReadableState(options, stream) {
  var Duplex = require('./_stream_duplex');

  options = options || {};

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  var defaultHwm = options.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = (hwm || hwm === 0) ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  this.buffer = [];
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;


  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex)
    this.objectMode = this.objectMode || !!options.readableObjectMode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // when piping, we only care about 'readable' events that happen
  // after read()ing all the bytes and not getting any pushback.
  this.ranOut = false;

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder)
      StringDecoder = require('string_decoder/').StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  var Duplex = require('./_stream_duplex');

  if (!(this instanceof Readable))
    return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  Stream.call(this);
}

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function(chunk, encoding) {
  var state = this._readableState;

  if (util.isString(chunk) && !state.objectMode) {
    encoding = encoding || state.defaultEncoding;
    if (encoding !== state.encoding) {
      chunk = new Buffer(chunk, encoding);
      encoding = '';
    }
  }

  return readableAddChunk(this, state, chunk, encoding, false);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function(chunk) {
  var state = this._readableState;
  return readableAddChunk(this, state, chunk, '', true);
};

function readableAddChunk(stream, state, chunk, encoding, addToFront) {
  var er = chunkInvalid(state, chunk);
  if (er) {
    stream.emit('error', er);
  } else if (util.isNullOrUndefined(chunk)) {
    state.reading = false;
    if (!state.ended)
      onEofChunk(stream, state);
  } else if (state.objectMode || chunk && chunk.length > 0) {
    if (state.ended && !addToFront) {
      var e = new Error('stream.push() after EOF');
      stream.emit('error', e);
    } else if (state.endEmitted && addToFront) {
      var e = new Error('stream.unshift() after end event');
      stream.emit('error', e);
    } else {
      if (state.decoder && !addToFront && !encoding)
        chunk = state.decoder.write(chunk);

      if (!addToFront)
        state.reading = false;

      // if we want the data now, just emit it.
      if (state.flowing && state.length === 0 && !state.sync) {
        stream.emit('data', chunk);
        stream.read(0);
      } else {
        // update the buffer info.
        state.length += state.objectMode ? 1 : chunk.length;
        if (addToFront)
          state.buffer.unshift(chunk);
        else
          state.buffer.push(chunk);

        if (state.needReadable)
          emitReadable(stream);
      }

      maybeReadMore(stream, state);
    }
  } else if (!addToFront) {
    state.reading = false;
  }

  return needMoreData(state);
}



// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended &&
         (state.needReadable ||
          state.length < state.highWaterMark ||
          state.length === 0);
}

// backwards compatibility.
Readable.prototype.setEncoding = function(enc) {
  if (!StringDecoder)
    StringDecoder = require('string_decoder/').StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
  return this;
};

// Don't raise the hwm > 128MB
var MAX_HWM = 0x800000;
function roundUpToNextPowerOf2(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2
    n--;
    for (var p = 1; p < 32; p <<= 1) n |= n >> p;
    n++;
  }
  return n;
}

function howMuchToRead(n, state) {
  if (state.length === 0 && state.ended)
    return 0;

  if (state.objectMode)
    return n === 0 ? 0 : 1;

  if (isNaN(n) || util.isNull(n)) {
    // only flow one buffer at a time
    if (state.flowing && state.buffer.length)
      return state.buffer[0].length;
    else
      return state.length;
  }

  if (n <= 0)
    return 0;

  // If we're asking for more than the target buffer level,
  // then raise the water mark.  Bump up to the next highest
  // power of 2, to prevent increasing it excessively in tiny
  // amounts.
  if (n > state.highWaterMark)
    state.highWaterMark = roundUpToNextPowerOf2(n);

  // don't have that much.  return null, unless we've ended.
  if (n > state.length) {
    if (!state.ended) {
      state.needReadable = true;
      return 0;
    } else
      return state.length;
  }

  return n;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function(n) {
  debug('read', n);
  var state = this._readableState;
  var nOrig = n;

  if (!util.isNumber(n) || n > 0)
    state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 &&
      state.needReadable &&
      (state.length >= state.highWaterMark || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended)
      endReadable(this);
    else
      emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0)
      endReadable(this);
    return null;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;
  debug('need readable', doRead);

  // if we currently have less than the highWaterMark, then also read some
  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  }

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  }

  if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0)
      state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
  }

  // If _read pushed data synchronously, then `reading` will be false,
  // and we need to re-evaluate how much data we can return to the user.
  if (doRead && !state.reading)
    n = howMuchToRead(nOrig, state);

  var ret;
  if (n > 0)
    ret = fromList(n, state);
  else
    ret = null;

  if (util.isNull(ret)) {
    state.needReadable = true;
    n = 0;
  }

  state.length -= n;

  // If we have nothing in the buffer, then we want to know
  // as soon as we *do* get something into the buffer.
  if (state.length === 0 && !state.ended)
    state.needReadable = true;

  // If we tried to read() past the EOF, then emit end on the next tick.
  if (nOrig !== n && state.ended && state.length === 0)
    endReadable(this);

  if (!util.isNull(ret))
    this.emit('data', ret);

  return ret;
};

function chunkInvalid(state, chunk) {
  var er = null;
  if (!util.isBuffer(chunk) &&
      !util.isString(chunk) &&
      !util.isNullOrUndefined(chunk) &&
      !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}


function onEofChunk(stream, state) {
  if (state.decoder && !state.ended) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // emit 'readable' now to make sure it gets picked up.
  emitReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    if (state.sync)
      process.nextTick(function() {
        emitReadable_(stream);
      });
    else
      emitReadable_(stream);
  }
}

function emitReadable_(stream) {
  debug('emit readable');
  stream.emit('readable');
  flow(stream);
}


// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    process.nextTick(function() {
      maybeReadMore_(stream, state);
    });
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended &&
         state.length < state.highWaterMark) {
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;
    else
      len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function(n) {
  this.emit('error', new Error('not implemented'));
};

Readable.prototype.pipe = function(dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

  var doEnd = (!pipeOpts || pipeOpts.end !== false) &&
              dest !== process.stdout &&
              dest !== process.stderr;

  var endFn = doEnd ? onend : cleanup;
  if (state.endEmitted)
    process.nextTick(endFn);
  else
    src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable) {
    debug('onunpipe');
    if (readable === src) {
      cleanup();
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  function cleanup() {
    debug('cleanup');
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', cleanup);
    src.removeListener('data', ondata);

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (state.awaitDrain &&
        (!dest._writableState || dest._writableState.needDrain))
      ondrain();
  }

  src.on('data', ondata);
  function ondata(chunk) {
    debug('ondata');
    var ret = dest.write(chunk);
    if (false === ret) {
      debug('false write response, pause',
            src._readableState.awaitDrain);
      src._readableState.awaitDrain++;
      src.pause();
    }
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EE.listenerCount(dest, 'error') === 0)
      dest.emit('error', er);
  }
  // This is a brutally ugly hack to make sure that our error handler
  // is attached before any userland ones.  NEVER DO THIS.
  if (!dest._events || !dest._events.error)
    dest.on('error', onerror);
  else if (isArray(dest._events.error))
    dest._events.error.unshift(onerror);
  else
    dest._events.error = [onerror, dest._events.error];



  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function() {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain)
      state.awaitDrain--;
    if (state.awaitDrain === 0 && EE.listenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}


Readable.prototype.unpipe = function(dest) {
  var state = this._readableState;

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0)
    return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes)
      return this;

    if (!dest)
      dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest)
      dest.emit('unpipe', this);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var i = 0; i < len; i++)
      dests[i].emit('unpipe', this);
    return this;
  }

  // try to find the right one.
  var i = indexOf(state.pipes, dest);
  if (i === -1)
    return this;

  state.pipes.splice(i, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1)
    state.pipes = state.pipes[0];

  dest.emit('unpipe', this);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function(ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  // If listening to data, and it has not explicitly been paused,
  // then call resume to start the flow of data on the next tick.
  if (ev === 'data' && false !== this._readableState.flowing) {
    this.resume();
  }

  if (ev === 'readable' && this.readable) {
    var state = this._readableState;
    if (!state.readableListening) {
      state.readableListening = true;
      state.emittedReadable = false;
      state.needReadable = true;
      if (!state.reading) {
        var self = this;
        process.nextTick(function() {
          debug('readable nexttick read 0');
          self.read(0);
        });
      } else if (state.length) {
        emitReadable(this, state);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function() {
  var state = this._readableState;
  if (!state.flowing) {
    debug('resume');
    state.flowing = true;
    if (!state.reading) {
      debug('resume read 0');
      this.read(0);
    }
    resume(this, state);
  }
  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    process.nextTick(function() {
      resume_(stream, state);
    });
  }
}

function resume_(stream, state) {
  state.resumeScheduled = false;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading)
    stream.read(0);
}

Readable.prototype.pause = function() {
  debug('call pause flowing=%j', this._readableState.flowing);
  if (false !== this._readableState.flowing) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }
  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);
  if (state.flowing) {
    do {
      var chunk = stream.read();
    } while (null !== chunk && state.flowing);
  }
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function(stream) {
  var state = this._readableState;
  var paused = false;

  var self = this;
  stream.on('end', function() {
    debug('wrapped end');
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length)
        self.push(chunk);
    }

    self.push(null);
  });

  stream.on('data', function(chunk) {
    debug('wrapped data');
    if (state.decoder)
      chunk = state.decoder.write(chunk);
    if (!chunk || !state.objectMode && !chunk.length)
      return;

    var ret = self.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (util.isFunction(stream[i]) && util.isUndefined(this[i])) {
      this[i] = function(method) { return function() {
        return stream[method].apply(stream, arguments);
      }}(i);
    }
  }

  // proxy certain important events.
  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
  forEach(events, function(ev) {
    stream.on(ev, self.emit.bind(self, ev));
  });

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  self._read = function(n) {
    debug('wrapped _read', n);
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return self;
};



// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
function fromList(n, state) {
  var list = state.buffer;
  var length = state.length;
  var stringMode = !!state.decoder;
  var objectMode = !!state.objectMode;
  var ret;

  // nothing in the list, definitely empty.
  if (list.length === 0)
    return null;

  if (length === 0)
    ret = null;
  else if (objectMode)
    ret = list.shift();
  else if (!n || n >= length) {
    // read it all, truncate the array.
    if (stringMode)
      ret = list.join('');
    else
      ret = Buffer.concat(list, length);
    list.length = 0;
  } else {
    // read just some of it.
    if (n < list[0].length) {
      // just take a part of the first list item.
      // slice is the same for buffers and strings.
      var buf = list[0];
      ret = buf.slice(0, n);
      list[0] = buf.slice(n);
    } else if (n === list[0].length) {
      // first list is a perfect match
      ret = list.shift();
    } else {
      // complex case.
      // we have enough to cover it, but it spans past the first buffer.
      if (stringMode)
        ret = '';
      else
        ret = new Buffer(n);

      var c = 0;
      for (var i = 0, l = list.length; i < l && c < n; i++) {
        var buf = list[0];
        var cpy = Math.min(n - c, buf.length);

        if (stringMode)
          ret += buf.slice(0, cpy);
        else
          buf.copy(ret, c, 0, cpy);

        if (cpy < buf.length)
          list[0] = buf.slice(cpy);
        else
          list.shift();

        c += cpy;
      }
    }
  }

  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0)
    throw new Error('endReadable called on non-empty stream');

  if (!state.endEmitted) {
    state.ended = true;
    process.nextTick(function() {
      // Check that we didn't get one last unshift.
      if (!state.endEmitted && state.length === 0) {
        state.endEmitted = true;
        stream.readable = false;
        stream.emit('end');
      }
    });
  }
}

function forEach (xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

function indexOf (xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}

}).call(this,require('_process'))
},{"./_stream_duplex":48,"_process":41,"buffer":10,"core-util-is":12,"events":20,"inherits":35,"isarray":46,"stream":45,"string_decoder/":57,"util":8}],51:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.


// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.

module.exports = Transform;

var Duplex = require('./_stream_duplex');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(Transform, Duplex);


function TransformState(options, stream) {
  this.afterTransform = function(er, data) {
    return afterTransform(stream, er, data);
  };

  this.needTransform = false;
  this.transforming = false;
  this.writecb = null;
  this.writechunk = null;
}

function afterTransform(stream, er, data) {
  var ts = stream._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb)
    return stream.emit('error', new Error('no writecb in Transform class'));

  ts.writechunk = null;
  ts.writecb = null;

  if (!util.isNullOrUndefined(data))
    stream.push(data);

  if (cb)
    cb(er);

  var rs = stream._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    stream._read(rs.highWaterMark);
  }
}


function Transform(options) {
  if (!(this instanceof Transform))
    return new Transform(options);

  Duplex.call(this, options);

  this._transformState = new TransformState(options, this);

  // when the writable side finishes, then flush out anything remaining.
  var stream = this;

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  this.once('prefinish', function() {
    if (util.isFunction(this._flush))
      this._flush(function(er) {
        done(stream, er);
      });
    else
      done(stream);
  });
}

Transform.prototype.push = function(chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function(chunk, encoding, cb) {
  throw new Error('not implemented');
};

Transform.prototype._write = function(chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform ||
        rs.needReadable ||
        rs.length < rs.highWaterMark)
      this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function(n) {
  var ts = this._transformState;

  if (!util.isNull(ts.writechunk) && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};


function done(stream, er) {
  if (er)
    return stream.emit('error', er);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  var ws = stream._writableState;
  var ts = stream._transformState;

  if (ws.length)
    throw new Error('calling transform done when ws.length != 0');

  if (ts.transforming)
    throw new Error('calling transform done when still transforming');

  return stream.push(null);
}

},{"./_stream_duplex":48,"core-util-is":12,"inherits":35}],52:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// A bit simpler than readable streams.
// Implement an async ._write(chunk, cb), and it'll handle all
// the drain event emission and buffering.

module.exports = Writable;

/*<replacement>*/
var Buffer = require('buffer').Buffer;
/*</replacement>*/

Writable.WritableState = WritableState;


/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var Stream = require('stream');

util.inherits(Writable, Stream);

function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
}

function WritableState(options, stream) {
  var Duplex = require('./_stream_duplex');

  options = options || {};

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  var defaultHwm = options.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = (hwm || hwm === 0) ? hwm : defaultHwm;

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex)
    this.objectMode = this.objectMode || !!options.writableObjectMode;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // when true all writes will be buffered until .uncork() call
  this.corked = 0;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function(er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.buffer = [];

  // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted
  this.pendingcb = 0;

  // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams
  this.prefinished = false;

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;
}

function Writable(options) {
  var Duplex = require('./_stream_duplex');

  // Writable ctor is applied to Duplexes, though they're not
  // instanceof Writable, they're instanceof Readable.
  if (!(this instanceof Writable) && !(this instanceof Duplex))
    return new Writable(options);

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function() {
  this.emit('error', new Error('Cannot pipe. Not readable.'));
};


function writeAfterEnd(stream, state, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  process.nextTick(function() {
    cb(er);
  });
}

// If we get something that is not a buffer, string, null, or undefined,
// and we're not in objectMode, then that's an error.
// Otherwise stream chunks are all considered to be of length=1, and the
// watermarks determine how many objects to keep in the buffer, rather than
// how many bytes or characters.
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  if (!util.isBuffer(chunk) &&
      !util.isString(chunk) &&
      !util.isNullOrUndefined(chunk) &&
      !state.objectMode) {
    var er = new TypeError('Invalid non-string/buffer chunk');
    stream.emit('error', er);
    process.nextTick(function() {
      cb(er);
    });
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function(chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;

  if (util.isFunction(encoding)) {
    cb = encoding;
    encoding = null;
  }

  if (util.isBuffer(chunk))
    encoding = 'buffer';
  else if (!encoding)
    encoding = state.defaultEncoding;

  if (!util.isFunction(cb))
    cb = function() {};

  if (state.ended)
    writeAfterEnd(this, state, cb);
  else if (validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, chunk, encoding, cb);
  }

  return ret;
};

Writable.prototype.cork = function() {
  var state = this._writableState;

  state.corked++;
};

Writable.prototype.uncork = function() {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;

    if (!state.writing &&
        !state.corked &&
        !state.finished &&
        !state.bufferProcessing &&
        state.buffer.length)
      clearBuffer(this, state);
  }
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode &&
      state.decodeStrings !== false &&
      util.isString(chunk)) {
    chunk = new Buffer(chunk, encoding);
  }
  return chunk;
}

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, chunk, encoding, cb) {
  chunk = decodeChunk(state, chunk, encoding);
  if (util.isBuffer(chunk))
    encoding = 'buffer';
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret)
    state.needDrain = true;

  if (state.writing || state.corked)
    state.buffer.push(new WriteReq(chunk, encoding, cb));
  else
    doWrite(stream, state, false, len, chunk, encoding, cb);

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (writev)
    stream._writev(chunk, state.onwrite);
  else
    stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  if (sync)
    process.nextTick(function() {
      state.pendingcb--;
      cb(er);
    });
  else {
    state.pendingcb--;
    cb(er);
  }

  stream._writableState.errorEmitted = true;
  stream.emit('error', er);
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er)
    onwriteError(stream, state, sync, er, cb);
  else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(stream, state);

    if (!finished &&
        !state.corked &&
        !state.bufferProcessing &&
        state.buffer.length) {
      clearBuffer(stream, state);
    }

    if (sync) {
      process.nextTick(function() {
        afterWrite(stream, state, finished, cb);
      });
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished)
    onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}


// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;

  if (stream._writev && state.buffer.length > 1) {
    // Fast case, write everything using _writev()
    var cbs = [];
    for (var c = 0; c < state.buffer.length; c++)
      cbs.push(state.buffer[c].callback);

    // count the one we are adding, as well.
    // TODO(isaacs) clean this up
    state.pendingcb++;
    doWrite(stream, state, true, state.length, state.buffer, '', function(err) {
      for (var i = 0; i < cbs.length; i++) {
        state.pendingcb--;
        cbs[i](err);
      }
    });

    // Clear buffer
    state.buffer = [];
  } else {
    // Slow case, write chunks one-by-one
    for (var c = 0; c < state.buffer.length; c++) {
      var entry = state.buffer[c];
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;

      doWrite(stream, state, false, len, chunk, encoding, cb);

      // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.
      if (state.writing) {
        c++;
        break;
      }
    }

    if (c < state.buffer.length)
      state.buffer = state.buffer.slice(c);
    else
      state.buffer.length = 0;
  }

  state.bufferProcessing = false;
}

Writable.prototype._write = function(chunk, encoding, cb) {
  cb(new Error('not implemented'));

};

Writable.prototype._writev = null;

Writable.prototype.end = function(chunk, encoding, cb) {
  var state = this._writableState;

  if (util.isFunction(chunk)) {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (util.isFunction(encoding)) {
    cb = encoding;
    encoding = null;
  }

  if (!util.isNullOrUndefined(chunk))
    this.write(chunk, encoding);

  // .end() fully uncorks
  if (state.corked) {
    state.corked = 1;
    this.uncork();
  }

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished)
    endWritable(this, state, cb);
};


function needFinish(stream, state) {
  return (state.ending &&
          state.length === 0 &&
          !state.finished &&
          !state.writing);
}

function prefinish(stream, state) {
  if (!state.prefinished) {
    state.prefinished = true;
    stream.emit('prefinish');
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(stream, state);
  if (need) {
    if (state.pendingcb === 0) {
      prefinish(stream, state);
      state.finished = true;
      stream.emit('finish');
    } else
      prefinish(stream, state);
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished)
      process.nextTick(cb);
    else
      stream.once('finish', cb);
  }
  state.ended = true;
}

}).call(this,require('_process'))
},{"./_stream_duplex":48,"_process":41,"buffer":10,"core-util-is":12,"inherits":35,"stream":45}],53:[function(require,module,exports){
module.exports = require("./lib/_stream_passthrough.js")

},{"./lib/_stream_passthrough.js":49}],54:[function(require,module,exports){
(function (process){
exports = module.exports = require('./lib/_stream_readable.js');
exports.Stream = require('stream');
exports.Readable = exports;
exports.Writable = require('./lib/_stream_writable.js');
exports.Duplex = require('./lib/_stream_duplex.js');
exports.Transform = require('./lib/_stream_transform.js');
exports.PassThrough = require('./lib/_stream_passthrough.js');
if (!process.browser && process.env.READABLE_STREAM === 'disable') {
  module.exports = require('stream');
}

}).call(this,require('_process'))
},{"./lib/_stream_duplex.js":48,"./lib/_stream_passthrough.js":49,"./lib/_stream_readable.js":50,"./lib/_stream_transform.js":51,"./lib/_stream_writable.js":52,"_process":41,"stream":45}],55:[function(require,module,exports){
module.exports = require("./lib/_stream_transform.js")

},{"./lib/_stream_transform.js":51}],56:[function(require,module,exports){
module.exports = require("./lib/_stream_writable.js")

},{"./lib/_stream_writable.js":52}],57:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var Buffer = require('buffer').Buffer;

var isBufferEncoding = Buffer.isEncoding
  || function(encoding) {
       switch (encoding && encoding.toLowerCase()) {
         case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;
         default: return false;
       }
     }


function assertEncoding(encoding) {
  if (encoding && !isBufferEncoding(encoding)) {
    throw new Error('Unknown encoding: ' + encoding);
  }
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters. CESU-8 is handled as part of the UTF-8 encoding.
//
// @TODO Handling all encodings inside a single object makes it very difficult
// to reason about this code, so it should be split up in the future.
// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
// points as used by CESU-8.
var StringDecoder = exports.StringDecoder = function(encoding) {
  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
  assertEncoding(encoding);
  switch (this.encoding) {
    case 'utf8':
      // CESU-8 represents each of Surrogate Pair by 3-bytes
      this.surrogateSize = 3;
      break;
    case 'ucs2':
    case 'utf16le':
      // UTF-16 represents each of Surrogate Pair by 2-bytes
      this.surrogateSize = 2;
      this.detectIncompleteChar = utf16DetectIncompleteChar;
      break;
    case 'base64':
      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
      this.surrogateSize = 3;
      this.detectIncompleteChar = base64DetectIncompleteChar;
      break;
    default:
      this.write = passThroughWrite;
      return;
  }

  // Enough space to store all bytes of a single character. UTF-8 needs 4
  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
  this.charBuffer = new Buffer(6);
  // Number of bytes received for the current incomplete multi-byte character.
  this.charReceived = 0;
  // Number of bytes expected for the current incomplete multi-byte character.
  this.charLength = 0;
};


// write decodes the given buffer and returns it as JS string that is
// guaranteed to not contain any partial multi-byte characters. Any partial
// character found at the end of the buffer is buffered up, and will be
// returned when calling write again with the remaining bytes.
//
// Note: Converting a Buffer containing an orphan surrogate to a String
// currently works, but converting a String to a Buffer (via `new Buffer`, or
// Buffer#write) will replace incomplete surrogates with the unicode
// replacement character. See https://codereview.chromium.org/121173009/ .
StringDecoder.prototype.write = function(buffer) {
  var charStr = '';
  // if our last write ended with an incomplete multibyte character
  while (this.charLength) {
    // determine how many remaining bytes this buffer has to offer for this char
    var available = (buffer.length >= this.charLength - this.charReceived) ?
        this.charLength - this.charReceived :
        buffer.length;

    // add the new bytes to the char buffer
    buffer.copy(this.charBuffer, this.charReceived, 0, available);
    this.charReceived += available;

    if (this.charReceived < this.charLength) {
      // still not enough chars in this buffer? wait for more ...
      return '';
    }

    // remove bytes belonging to the current character from the buffer
    buffer = buffer.slice(available, buffer.length);

    // get the character that was split
    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
    var charCode = charStr.charCodeAt(charStr.length - 1);
    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
      this.charLength += this.surrogateSize;
      charStr = '';
      continue;
    }
    this.charReceived = this.charLength = 0;

    // if there are no more bytes in this buffer, just emit our char
    if (buffer.length === 0) {
      return charStr;
    }
    break;
  }

  // determine and set charLength / charReceived
  this.detectIncompleteChar(buffer);

  var end = buffer.length;
  if (this.charLength) {
    // buffer the incomplete character bytes we got
    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
    end -= this.charReceived;
  }

  charStr += buffer.toString(this.encoding, 0, end);

  var end = charStr.length - 1;
  var charCode = charStr.charCodeAt(end);
  // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
    var size = this.surrogateSize;
    this.charLength += size;
    this.charReceived += size;
    this.charBuffer.copy(this.charBuffer, size, 0, size);
    buffer.copy(this.charBuffer, 0, 0, size);
    return charStr.substring(0, end);
  }

  // or just emit the charStr
  return charStr;
};

// detectIncompleteChar determines if there is an incomplete UTF-8 character at
// the end of the given buffer. If so, it sets this.charLength to the byte
// length that character, and sets this.charReceived to the number of bytes
// that are available for this character.
StringDecoder.prototype.detectIncompleteChar = function(buffer) {
  // determine how many bytes we have to check at the end of this buffer
  var i = (buffer.length >= 3) ? 3 : buffer.length;

  // Figure out if one of the last i bytes of our buffer announces an
  // incomplete char.
  for (; i > 0; i--) {
    var c = buffer[buffer.length - i];

    // See http://en.wikipedia.org/wiki/UTF-8#Description

    // 110XXXXX
    if (i == 1 && c >> 5 == 0x06) {
      this.charLength = 2;
      break;
    }

    // 1110XXXX
    if (i <= 2 && c >> 4 == 0x0E) {
      this.charLength = 3;
      break;
    }

    // 11110XXX
    if (i <= 3 && c >> 3 == 0x1E) {
      this.charLength = 4;
      break;
    }
  }
  this.charReceived = i;
};

StringDecoder.prototype.end = function(buffer) {
  var res = '';
  if (buffer && buffer.length)
    res = this.write(buffer);

  if (this.charReceived) {
    var cr = this.charReceived;
    var buf = this.charBuffer;
    var enc = this.encoding;
    res += buf.slice(0, cr).toString(enc);
  }

  return res;
};

function passThroughWrite(buffer) {
  return buffer.toString(this.encoding);
}

function utf16DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 2;
  this.charLength = this.charReceived ? 2 : 0;
}

function base64DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 3;
  this.charLength = this.charReceived ? 3 : 0;
}

},{"buffer":10}],58:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"dup":35}],59:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],60:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":59,"_process":41,"inherits":58}]},{},[1]);

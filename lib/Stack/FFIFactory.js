// import bunyan from 'bunyan';
import ffi from 'ffi';
import StackMethodMap from './StackMethodMap';

/** @module FFIFactory */

// const log = bunyan.createLogger({ name: 'Stack' });
/**
  * @constant {string} RTLD_NOW - `ffi` flag that determines if `dlopen`
  * operates such that all necessary relocations shall be performed when
  * the object is first loaded.
  * [ref](http://pubs.opengroup.org/onlinepubs/009695399/functions/dlopen.html)
  */
const RTLD_NOW = ffi.DynamicLibrary.FLAGS.RTLD_NOW;
/**
  * @constant {string} RTLD_GLOBAL - `ffi` flag that determines if `dlopen`
  * operates such that The object's symbols shall be made available for the
  * relocation processing of any other object.
  * [ref](http://pubs.opengroup.org/onlinepubs/009695399/functions/dlopen.html)
  */
const RTLD_GLOBAL = ffi.DynamicLibrary.FLAGS.RTLD_GLOBAL;
/**
  * @constant {string} MODE - Determines the `dlopen` mode obtained from `ffi`.
  */
const MODE = RTLD_NOW | RTLD_GLOBAL;

/**
  * @function jsMethodName
  * Generates the Javascript method name from the method name in the map.
  */
function jsMethodName(methodName) {
  return methodName.replace(/^./, methodName[0].toLowerCase());
}

export default class {
  /**
    * @constructor FFIFactory
    * @classdesc Create a FFIFactory instance
    * @param {string} libPath - The absolute path to the shared library to hook into
    */
  constructor(libPath) {
    this.dynamicLibrary = ffi.DynamicLibrary(libPath, MODE);
    this.buildMethods();
    return this.dynamicLibrary;
  }

  /**
    * Loops through array of objects representing functions to generate with `ffi`.
    */
  buildMethods() {
    for (let i = 0, len = StackMethodMap.length; i < len; i++) {
      const method = StackMethodMap[i];
      const ptr = this.dynamicLibrary.get(`StackInterface${method.methodName}`);
      this.dynamicLibrary[jsMethodName(method.methodName)] = ffi.ForeignFunction(
        ptr,
        method.returnType,
        method.paramTypes
      );
    }
  }
}

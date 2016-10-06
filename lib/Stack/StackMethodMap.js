/** @module StackMethodMap */

/**
  * Exports an array of objects for `ffi` method definitions.
  */
export default [
  {
    methodName: 'SetDataCallback',
    returnType: 'void',
    paramTypes: ['pointer'],
  },
  // What is the parameter type for this method?
  {
    methodName: 'SetSIPLogHandler',
    returnType: 'void',
    paramTypes: ['void'],
  },
  // What is the parameter type for this method?
  // It *should* be an `enum` but trying `int`
  {
    methodName: 'SetDeviceType',
    returnType: 'void',
    paramTypes: ['uint32'],
  },
  {
    methodName: 'GetDeviceType',
    returnType: 'int',
    paramTypes: ['void'],
  },
  // How the frack am I supposed to get this value?
  // Garth suggested to use 1 (2016-03-09)
  {
    methodName: 'SetApplicationVersion',
    returnType: 'void',
    paramTypes: ['pointer'],
  },
  {
    methodName: 'InitializeConfig',
    returnType: 'void',
    paramTypes: ['pointer'],
  },
  {
    methodName: 'Initialize',
    returnType: 'void',
    paramTypes: ['void'],
  },
   // What is the param type for this method?
  {
    methodName: 'SetVideoCaptureParameters',
    returnType: 'void',
    paramTypes: ['pointer'],
  },
  {
    methodName: 'SetAudioInputDevice',
    returnType: 'void',
    paramTypes: ['int'],
  },
  {
    methodName: 'SetAudioOutputDevice',
    returnType: 'void',
    paramTypes: ['int'],
  },
  {
    methodName: 'SetVideoCaptureDevice',
    returnType: 'void',
    paramTypes: ['pointer'],
  },
  // Hmmm ... what's our `self.window` equivalent?
  {
    methodName: 'SetVideoRenderView',
    returnType: 'void',
    paramTypes: ['pointer', 'int', 'int', 'int', 'int'],
  },
  // Again, `self.window`?
  {
    methodName: 'SetSelfVideoDisplayView',
    returnType: 'void',
    paramTypes: ['pointer', 'int', 'int', 'int', 'int'],
  },
  // Should this point to the .WAV file in the framework?
  // Absolute or relative path?
  {
    methodName: 'SetAudioRingtoneFilename',
    returnType: 'void',
    paramTypes: ['pointer'],
  },
  {
    methodName: 'SetAudioRingtoneVolume',
    returnType: 'void',
    paramTypes: ['double'],
  },
  {
    methodName: 'SetConfigParameter',
    returnType: 'void',
    paramTypes: ['string', 'string'],
  },
  {
    methodName: 'StartVoIPStack',
    returnType: 'void',
    paramTypes: [],
  },
  {
    methodName: 'StopVoIPStack',
    returnType: 'void',
    paramTypes: ['bool'],
  },
  {
    methodName: 'PlaceCall',
    returnType: 'void',
    paramTypes: ['string', 'string', 'bool'],
  },
  {
    methodName: 'GetConfigParameter',
    returnType: 'long',
    paramTypes: ['pointer', 'pointer', 'int'],
  },
  {
    methodName: 'SetOSVersion',
    returnType: 'void',
    paramTypes: ['float'],
  },
  {
    methodName: 'GetOSVersion',
    returnType: 'float',
    paramTypes: ['void'],
  },
  {
    methodName: 'SendUserEvent',
    returnType: 'void',
    paramTypes: ['int'],
  }
];

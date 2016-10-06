import bunyan from 'bunyan';
import ref from 'ref';
import StructType from 'ref-struct';
import Enum from 'enum';
import path from 'path';
import FFIFactory from './FFIFactory';

/** @module Stack */

const log = bunyan.createLogger({ name: 'Stack' });
/**
  * @constant {string} VOCLIENT_PATH - Absolute path to the shared C library
  */
// const VOCLIENT_PATH = `${__dirname}/../shared-libs/VOClient.framework/VOClient`;
const VOCLIENT_PATH = path.resolve(
  __dirname,
  '../../app/Stack/shared-libs/VOClient.framework/VOClient'
);

console.log(`The voclient path is: ${VOCLIENT_PATH}.`);

const UI_EVENTS = new Enum({
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
  UI_EVENT_KEY0_DOWN: 100 + '0'.charCodeAt(),
  UI_EVENT_KEY1_DOWN: 100 + '1'.charCodeAt(),
  UI_EVENT_KEY2_DOWN: 100 + '2'.charCodeAt(),
  UI_EVENT_KEY3_DOWN: 100 + '3'.charCodeAt(),
  UI_EVENT_KEY4_DOWN: 100 + '4'.charCodeAt(),
  UI_EVENT_KEY5_DOWN: 100 + '5'.charCodeAt(),
  UI_EVENT_KEY6_DOWN: 100 + '6'.charCodeAt(),
  UI_EVENT_KEY7_DOWN: 100 + '7'.charCodeAt(),
  UI_EVENT_KEY8_DOWN: 100 + '8'.charCodeAt(),
  UI_EVENT_KEY9_DOWN: 100 + '9'.charCodeAt(),
  UI_EVENT_KEYSTAR_DOWN: 100 + '*'.charCodeAt(),
  UI_EVENT_KEYPOUND_DOWN: 100 + '#'.charCodeAt(),
  UI_EVENT_KEY0_UP: 200 + '0'.charCodeAt(),
  UI_EVENT_KEY1_UP: 200 + '1'.charCodeAt(),
  UI_EVENT_KEY2_UP: 200 + '2'.charCodeAt(),
  UI_EVENT_KEY3_UP: 200 + '3'.charCodeAt(),
  UI_EVENT_KEY4_UP: 200 + '4'.charCodeAt(),
  UI_EVENT_KEY5_UP: 200 + '5'.charCodeAt(),
  UI_EVENT_KEY6_UP: 200 + '6'.charCodeAt(),
  UI_EVENT_KEY7_UP: 200 + '7'.charCodeAt(),
  UI_EVENT_KEY8_UP: 200 + '8'.charCodeAt(),
  UI_EVENT_KEY9_UP: 200 + '9'.charCodeAt(),
  UI_EVENT_KEYSTAR_UP: 200 + '*'.charCodeAt(),
  UI_EVENT_KEYPOUND_UP: 200 + '#'.charCodeAt(),
});

export default class {
  /**
    * @constructor Stack
    * @classdesc Creates a new Stack instance using FFIFactory
    */
  constructor() {
    this.client = new FFIFactory(VOCLIENT_PATH);
  }

  /**
    * Initializes and registers the media stack
    */
  startup() {
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

  setDataCallback() {
    log.info('setDataCallback');
    // this.client.setDataCallback();
  }

  setSIPLogHandler() {
    log.info('setSIPLogHandler');
    // this.client.setSIPLogHandler();
  }

  setDeviceType() {
    const deviceTypeEnum = new Enum({
      DEVICE_UNKNOWN: 0,
      DEVICE_IOS_IPHONE: 1,
      DEVICE_IOS_IPOD: 2,
      DEVICE_IOS_IPAD: 3,
      DEVICE_WINDOWS_PC: 4,
      DEVICE_WINDOWS_PHONE: 5,
      DEVICE_WINDOWS_TABLET: 6,
      DEVICE_MAC: 7,
    }, { name: 'E_DEVICE_TYPE' });
    log.info(deviceTypeEnum);
    this.client.setDeviceType(deviceTypeEnum.DEVICE_MAC.value);
    // this.client.setDeviceType(7);
  }

  getDeviceType() {
    const deviceType = this.client.getDeviceType(ref.types.void);
    log.info(deviceType, 'Device Type Gotten');
  }

  setApplicationVersion() {
    const appVersionBuf = ref.alloc(ref.types.char, '1');
    this.client.setApplicationVersion(appVersionBuf);
  }

  initializeConfig() {
    this.client.initializeConfig(ref.NULL);
  }

  initialize() {
    this.client.initialize(ref.types.void);
  }

  setVideoCaptureParameters() {
    // Requires a struct of VIDEO_CAPTURE_PARAMETERS
    // (See StackInterface.h ln:530 for typdef)
    const videoCaptureParametersStruct = StructType({
      nFrameRate: ref.types.int,
      nImageWidth: ref.types.int,
      nImageHeight: ref.types.int,
    });
    const vcp = new videoCaptureParametersStruct({
      nFrameRate: 10,
      nImageHeight: 352,
      nImageWidth: 288,
    });
    this.client.setVideoCaptureParameters(vcp.ref());
  }

  setDeviceLists(devices) {
    const audioInputs = devices.audioInputs;
    const audioOutputs = devices.audioOutputs;
    const videoInputs = devices.videoInputs;

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

  setVideoRenderView() {
    log.info('setVideoRenderView');
    // this.client.setVideoRenderView();
  }

  setSelfVideoDisplayView() {
    log.info('setSelfVideoDisplayView');
    // this.client.setSelfVideoDisplayView();
  }

  setAudioRingtoneFilename() {
    const ringtonePath = `${__dirname}/../assets/RING1.wav`;
    const ringtoneBuf = ref.alloc(ref.types.char, ringtonePath);
    this.client.setAudioRingtoneFilename(ringtoneBuf);
  }

  setAudioRingtoneVolume() {
    this.client.setAudioRingtoneVolume(1.0);
  }

  startVoIPStack(cb) {
    this.client.startVoIPStack.async(cb);
  }

  stopVoIPStack() {
    this.client.stopVoIPStack(true);
  }

  sendUserEvent(event) {
    this.client.sendUserEvent(event);
  }

  startCall(phoneNumber, phoneName = null, startWithVideo = false) {
    this.client.placeCall(phoneNumber, phoneName, startWithVideo);
    const callEvent = startWithVideo ? 'UI_EVENT_DIAL_VIDEO' : 'UI_EVENT_DIAL';
    this.client.sendUserEvent(UI_EVENTS.get(callEvent));
  }

  endCall() {
    this.sendUserEvent(UI_EVENTS.get('UI_EVENT_END'));
  }

  setConfigParameters(params) {
    Object.keys(params).forEach((key) => {
      const val = params[key];
      this.setConfigParameter(key, val);
    });
  }

  getConfigParameters(params) {
    const gotten = [];
    Object.keys(params).forEach((key) => {
      const val = params[key];
      gotten.push(this.getConfigParameter(key, val));
    });

    return gotten;
  }

  setConfigParameter(paramName, paramValue) {
    // const pNameBuf = ref.alloc(ref.types.char, paramName);
    // const pValueBuf = ref.alloc(ref.types.char, paramValue);
    // this.client.setConfigParameter(pNameBuf, pValueBuf);
    this.client.setConfigParameter(paramName, paramValue);
  }

  getConfigParameter(paramName) {
    const pNameBuf = ref.alloc(ref.types.char, paramName);
    const returnBuf = ref.alloc(ref.types.char, 100);
    this.client.getConfigParameter(pNameBuf, returnBuf, 100);
    return ref.get(returnBuf);
  }

  getOSVersion() {
    return this.client.getOSVersion('void');
  }

  setOSVersion(version) {
    this.client.setOSVersion(version);
  }
}

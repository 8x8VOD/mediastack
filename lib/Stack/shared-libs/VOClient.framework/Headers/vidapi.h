//
//  vidapi.h
//
//  Created by Garth Judge on 10/11/14.
//  Copyright (c) 2014 8x8, Inc. All rights reserved.
//

#ifndef VIDAPI_H
#define VIDAPI_H

#ifdef _WIN32
typedef unsigned char uint8_t;
#endif

#include "mediastream.h"

#define VIDEO_STREAM_DECODE_SUCCESS		0
#define VIDEO_STREAM_DECODE_ERROR		1
#define VIDEO_STREAM_DECODE_ASYNC		2
#define VIDEO_STREAM_DECODE_NEEDMORE	3


typedef void (*VIDEO_DEVICE_CHANGE_CALLBACK_FUNCTION)();


typedef enum {
  VIDEO_STREAM_ENCODE = 0x1,
  VIDEO_STREAM_DECODE = 0x2
} VIDEO_STREAM_TYPE;


typedef enum {
  VIDEO_CODEC_H264,
  VIDEO_CODEC_UNDEFINED,
  VIDEO_CODEC_MAX_TYPE
} VIDEO_CODEC_TYPE;


typedef enum {
  VIDEO_STREAM_MESSAGE_ENCODER_IFRAME
} VIDEO_STREAM_MESSAGE;


typedef enum {
	VIDEO_FORMAT_RGBA,
	VIDEO_FORMAT_ARGB,
	VIDEO_FORMAT_BGRA,
	VIDEO_FORMAT_AGBR,
	VIDEO_FORMAT_RGB24,
	VIDEO_FORMAT_BGR24,
	VIDEO_FORMAT_YUV420P,
	VIDEO_FORMAT_CV_IMAGE_BUFFER_REF
} VIDEO_FORMAT;


typedef struct {
	VIDEO_CODEC_TYPE eCodecType;
	int nWidth;
	int nHeight;
	int nBitrate;
	int nFrameRate;
	int nMaxH264SliceBytes;
	int nKeyFrameInterval;
	VIDEO_FORMAT eVideoFormat;
	H_MEDIA_STREAM hParentMediaStream;
} VIDEO_STREAM_PARAMETERS;


typedef struct {
	uint8_t *plane[3];
	int stride[3];
	int nPlanes;
	int nWidth;
	int nHeight;
	VIDEO_FORMAT eFormat;
} VIDEO_PICTURE;


typedef void * VIDEO_ENCODER;
typedef void * VIDEO_DECODER;

typedef struct VIDEO_STREAM {
  VIDEO_STREAM_TYPE eType;
	
  union {
	struct {
		VIDEO_ENCODER *pEncoder;
	} xEncoder;
	  
	struct {
		VIDEO_DECODER *pDecoder;
		BOOL bCurrentFrameCorrupt;
		DWORD dwFrameTimestamp;
		
		VIDEO_PICTURE xPicture;
		
		uint8_t *frameBuffer;
		int frameBufferSize;
		
		uint8_t *sps, *pps;
		int sps_len, pps_len;
		
	} xDecoder;
  } u;
} VIDEO_STREAM;

typedef VIDEO_STREAM* H_VIDEO_STREAM;

#define VIDEO_CAPTURE_DEVICE_ID_MAX_LEN             256
#define VIDEO_CAPTURE_DEVICE_NAME_MAX_LEN           256
#define VIDEO_CAPTURE_DEVICE_MANUFACTURER_MAX_LEN   256

#define VIDEO_CAPTURE_DEVICE_FLAG_IS_DEFAULT        0x04
#define VIDEO_CAPTURE_DEVICE_FLAG_IS_SELECTED       0x08

typedef struct {
	char deviceId[VIDEO_CAPTURE_DEVICE_ID_MAX_LEN];
	int deviceFlags;
	char deviceName[VIDEO_CAPTURE_DEVICE_NAME_MAX_LEN];
	char manufacturerName[VIDEO_CAPTURE_DEVICE_MANUFACTURER_MAX_LEN];
} VIDEO_CAPTURE_DEVICE;


typedef struct {
	int nNumberDevices;
	VIDEO_CAPTURE_DEVICE *pDevices;
} VIDEO_CAPTURE_DEVICES;


// Video Capture API
VIDEO_CAPTURE_DEVICES *VideoEnumerateVideoCaptureDevices();
void VideoFreeVideoCaptureDeviceList(VIDEO_CAPTURE_DEVICES **ppDeviceList);
LONG VideoCaptureInitialize(VIDEO_DEVICE_CHANGE_CALLBACK_FUNCTION pfnCallback);
LONG VideoCaptureSetDeviceId(char *deviceId);
LONG VideoCaptureConfigure(int nDesiredWidth, int nDesiredHeight, int nDesiredFrameRate);
LONG VideoCaptureSetSelfViewWindow(void *windowId, int x, int y, int width, int height);
LONG VideoCaptureRemoveSelfViewWindow(void);
LONG VideoCaptureDestroy(void);
LONG VideoCaptureStart(void);
LONG VideoCaptureStop(void);


// Video Render API
LONG VideoRendererSetRenderViewInWindow(void *windowId, int x, int y, int width, int height);
LONG VideoRendererRemoveRenderView(void);
LONG VideoRendererRenderVideoImage(VIDEO_PICTURE *pPicture);


// Stream library API
LONG VideoStreamLibInit(VIDEO_DEVICE_CHANGE_CALLBACK_FUNCTION pfnCallback);
LONG VideoStreamLibTerminate(void);

// Stream functions
LONG VideoStreamCreate(H_VIDEO_STREAM *, VIDEO_STREAM_TYPE, VIDEO_STREAM_PARAMETERS *);
LONG VideoStreamDestroy(H_VIDEO_STREAM);
LONG VideoStreamStart(H_VIDEO_STREAM);
LONG VideoStreamStop(H_VIDEO_STREAM);
LONG VideoStreamMessage(H_VIDEO_STREAM, VIDEO_STREAM_MESSAGE);
VIDEO_PICTURE *VideoStreamDecodeData(H_VIDEO_STREAM, uint8_t *, int, BOOL, DWORD, BOOL, int *, int *);
LONG VideoStreamEncodeFrame(H_VIDEO_STREAM, void *pAbstractImageStruct);

// OSX Encoder functions
LONG VideoEncoderCreate_OSX(VIDEO_ENCODER **, VIDEO_STREAM_PARAMETERS *);
LONG VideoEncoderDestroy_OSX(VIDEO_ENCODER *);
LONG VideoEncoderStart_OSX(VIDEO_ENCODER *);
LONG VideoEncoderStop_OSX(VIDEO_ENCODER *);
LONG VideoEncoderMessage_OSX(VIDEO_ENCODER *, VIDEO_STREAM_MESSAGE);
LONG VideoEncoderEncodeFrame_OSX(VIDEO_ENCODER *, void *pAbstractImageStruct);

// OSX Decoder functions
LONG VideoDecoderCreate_OSX(VIDEO_DECODER **, VIDEO_STREAM_PARAMETERS *);
LONG VideoDecoderDestroy_OSX(VIDEO_DECODER *);
LONG VideoDecoderStart_OSX(VIDEO_DECODER *);
LONG VideoDecoderStop_OSX(VIDEO_DECODER *);
LONG VideoDecoderSetParameterSets_OSX(VIDEO_DECODER *, uint8_t *, int, uint8_t *, int);
LONG VideoDecoderMessage_OSX(VIDEO_DECODER *, VIDEO_STREAM_MESSAGE);
LONG VideoDecoderDecodeFrame_OSX(VIDEO_DECODER *, uint8_t *, int, VIDEO_PICTURE *, int *);

// x264 Encoder functions
LONG VideoEncoderCreate_x264(VIDEO_ENCODER **, VIDEO_STREAM_PARAMETERS *);
LONG VideoEncoderDestroy_x264(VIDEO_ENCODER *);
LONG VideoEncoderStart_x264(VIDEO_ENCODER *);
LONG VideoEncoderStop_x264(VIDEO_ENCODER *);
LONG VideoEncoderMessage_x264(VIDEO_ENCODER *, VIDEO_STREAM_MESSAGE);
LONG VideoEncoderEncodeFrame_x264(VIDEO_ENCODER *, void *pAbstractImageStruct);

// FFMPEG Decoder functions
LONG VideoDecoderCreate_FFMPEG(VIDEO_DECODER **, VIDEO_STREAM_PARAMETERS *);
LONG VideoDecoderDestroy_FFMPEG(VIDEO_DECODER *);
LONG VideoDecoderStart_FFMPEG(VIDEO_DECODER *);
LONG VideoDecoderStop_FFMPEG(VIDEO_DECODER *);
LONG VideoDecoderSetParameterSets_FFMPEG(VIDEO_DECODER *, uint8_t *, int, uint8_t *, int);
LONG VideoDecoderMessage_FFMPEG(VIDEO_DECODER *, VIDEO_STREAM_MESSAGE);
LONG VideoDecoderDecodeFrame_FFMPEG(VIDEO_DECODER *, uint8_t *, int, VIDEO_PICTURE *, int *);

#ifdef __cplusplus
extern "C"
{
#endif
// OpenH264 Decoder functions
LONG VideoDecoderCreate_OpenH264(VIDEO_DECODER **, VIDEO_STREAM_PARAMETERS *);
LONG VideoDecoderDestroy_OpenH264(VIDEO_DECODER *);
LONG VideoDecoderStart_OpenH264(VIDEO_DECODER *);
LONG VideoDecoderStop_OpenH264(VIDEO_DECODER *);
LONG VideoDecoderSetParameterSets_OpenH264(VIDEO_DECODER *, uint8_t *, int, uint8_t *, int);
LONG VideoDecoderMessage_OpenH264(VIDEO_DECODER *, VIDEO_STREAM_MESSAGE);
LONG VideoDecoderDecodeFrame_OpenH264(VIDEO_DECODER *, uint8_t *, int, VIDEO_PICTURE *, int *);
	
// x264 Encoder functions
LONG VideoEncoderCreate_OpenH264(VIDEO_ENCODER **, VIDEO_STREAM_PARAMETERS *);
LONG VideoEncoderDestroy_OpenH264(VIDEO_ENCODER *);
LONG VideoEncoderStart_OpenH264(VIDEO_ENCODER *);
LONG VideoEncoderStop_OpenH264(VIDEO_ENCODER *);
LONG VideoEncoderMessage_OpenH264(VIDEO_ENCODER *, VIDEO_STREAM_MESSAGE);
LONG VideoEncoderEncodeFrame_OpenH264(VIDEO_ENCODER *, void *pAbstractImageStruct);
#ifdef __cplusplus
}
#endif

#endif

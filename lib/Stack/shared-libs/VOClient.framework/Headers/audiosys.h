/***************************************************************
 * File:	audiosys.h	
 * Description:	API/Inlcude file for audiosys library.
 * Revisions:
 *		30-Apr-2001		Added header
 *
 * Copyright 2001 Netergy Networks, Inc. All rights reserved.
 ***************************************************************/

#ifndef __AUDIOSYS_H__
#define __AUDIOSYS_H__

/**********************************************************************
 * Includes
 *********************************************************************/
#include <stdarg.h>
#include "NNstyle.h"
#include "sysbuf.h"
#include "tonesynth.h"

/**********************************************************************
 * Supported codec types
 *********************************************************************/
typedef enum {
  AUDIO_CODEC_G711_ALAW,
  AUDIO_CODEC_G711_ULAW,
  AUDIO_CODEC_G729_AB,
  AUDIO_CODEC_G729_E,
  AUDIO_CODEC_G723_LORATE,
  AUDIO_CODEC_G723_HIRATE,
  AUDIO_CODEC_G726_40KBPS,
  AUDIO_CODEC_G726_32KBPS,
  AUDIO_CODEC_G726_24KBPS,
  AUDIO_CODEC_G726_16KBPS,
  AUDIO_CODEC_PCM,
  AUDIO_CODEC_CALLER_ID,
  AUDIO_CODEC_TONE,
  AUDIO_CODEC_ILBC_20MS,
  AUDIO_CODEC_ILBC_30MS,
  AUDIO_CODEC_OPUS,
  AUDIO_CODEC_UNDEFINED,
  AUDIO_CODEC_MAX_TYPE
} AUDIO_CODEC_TYPE;

/**********************************************************************
 * Jitter Buffer Modes
 *********************************************************************/
typedef enum {
  AUDIO_ADAPTIVE_JITTER_BUFFER = 0x0,
  AUDIO_FIXED_JITTER_BUFFER = 0x1,
  AUDIO_JB_NO_CHANGE
} AUDIO_JITTER_BUFFER_MODE;

/**********************************************************************
 * data structure used as an argument to AudioChannelMessage()
 *********************************************************************/
typedef union {

  struct {
    AUDIO_CODEC_TYPE eEncodeType;
    DWORD dwPacketDuration;
    H_SYS_BUFFER hDataBuf;
  } xAudioAddEncodeType;

  struct {
    H_SYS_BUFFER hDataBuf;
  } xAudioRemoveEncodeType;

  struct {
    H_SYS_BUFFER hDataBuf;
    DWORD dwAttrib;
    DWORD dwStatus;
  } xAudioUpdEncodeStreamAttrib;

  struct {
    H_SYS_BUFFER hDataBuf;
    DWORD eToneType;
    DWORD dwStatus;
  } xAudioUpdEncodeStreamTone;

  struct {
    AUDIO_CODEC_TYPE eDecodeType;
    DWORD dwPacketDuration;
	AUDIO_JITTER_BUFFER_MODE eJitterBufferMode;
    DWORD dwJitterBufferInitDuration;
    DWORD dwJitterBufferMinDuration;
    DWORD dwJitterBufferMaxDuration;
    H_SYS_BUFFER hDataBuf;
  } xAudioAddDecodeType;

  struct {
    H_SYS_BUFFER hDataBuf;
  } xAudioRemoveDecodeType;

  struct {
    H_SYS_BUFFER hDataBuf;
    DWORD dwStatus;
  } xAudioUpdAudioStreamStatus;

  struct {
    H_SYS_BUFFER hDataBuf;
    DWORD eNewCodecType;
    DWORD dwNewPacketDuration;
	AUDIO_JITTER_BUFFER_MODE eNewJitterBufferMode;
    DWORD dwNewJitterBufferInitDuration;
    DWORD dwNewJitterBufferMinDuration;
    DWORD dwNewJitterBufferMaxDuration;
    DWORD dwNewSampleRate;
    DWORD dwNewBitRate;
  } xAudioChangeCodecType;

  struct {
    DWORD                       eToneType;
    DWORD                       dwNumFreqs;
    DWORD                       dwNumStates;
    TONE_FREQS_AND_LEVELS*      pFreqsAndLevels;
    TONE_STATES_AND_DURATIONS*  pStatesAndDurations;
  } xAudioConfigTone;

  struct {
    DWORD eToneType;
    DWORD dwStatus;
  } xAudioUpdToneStatus;

  struct {
    DWORD dwStatus;
  } xAudioUpdAudioAECStatus;

  struct {
    DWORD dwAecType;
  } xAudioAECSetMode;

  struct {
    DWORD dwAecType;
  } xAudioAECQueryMode;

  struct {
    LONG lHandsetCallIn;
    LONG lNLPAttn;
    LONG lAECLength;
    LONG lEchoReturnThreshold;
    LONG lMinRefEnergy;
    LONG lERLEMargin1;
    LONG lERLEMargin2;
    LONG lERLEBase;
    LONG lFESClipFactor;
    BOOL bIsERLEOn;
    BOOL bIsFESAGCOn;
    BOOL bIsCNGOn;
  } xAudioAECConfigFullDuplex;

  struct {
    LONG lHandsetCallIn;
    LONG lNLPAttn;
    LONG lAECLength;
    LONG lEchoReturnThreshold;
    LONG lMinRefEnergy;
    LONG lERLEMargin1;
    LONG lERLEMargin2;
    LONG lERLEBase;
    LONG lFESClipFactor;
    BOOL bIsERLEOn;
    BOOL bIsFESAGCOn;
    BOOL bIsCNGOn;
  } xAudioAECQueryConfigFullDuplex;

  struct {
    LONG lAttnLevel;
    LONG lNESNoiseBase;
    BOOL bIsHiMicOn;
    BOOL bIsEchoEnhancementOn;
    BOOL bIsSwitchEnhancementOn;
    BOOL bIsCNGOn;
    LONG lEEHShift;
    LONG lFESBaseShift;
    LONG lFESMarginShift;
    LONG lNESBaseShift;
    LONG lNESMargin1Shift;
    LONG lNESMargin2Shift;
    LONG lNESMargin2Thres;
    LONG lCNGMaxLevelOffset;
  } xAudioAECConfigHalfDuplex;

  struct {
    LONG lAttnLevel;
    LONG lNESNoiseBase;
    BOOL bIsHiMicOn;
    BOOL bIsEchoEnhancementOn;
    BOOL bIsSwitchEnhancementOn;
    BOOL bIsCNGOn;
    LONG lEEHShift;
    LONG lFESBaseShift;
    LONG lFESMarginShift;
    LONG lNESBaseShift;
    LONG lNESMargin1Shift;
    LONG lNESMargin2Shift;
    LONG lNESMargin2Thres;
    LONG lCNGMaxLevelOffset;
  } xAudioAECQueryConfigHalfDuplex;

  struct {
    DWORD dwAttrib;
    DWORD dwStatus;
  } xAudioUpdAudioChannelAttrib;

  struct {
    LONG lOutputGain;
  } xAudioUpdOutputGain;

  struct {
    DWORD dwOnHook;
    DWORD dwMonth;
    DWORD dwDay;
    DWORD dwHour;
    DWORD dwMinute;
    CHAR* pcDirNum;
    CHAR cAbsentDN;
    CHAR* pcCallerName;
    CHAR cAbsentCN;
  } xAudioCIDBFSKBellCore;

  struct {
    DWORD dwFormat;
    DWORD dwStatus;
  } xAudioVmwiBFSKBellCore;

  struct {
    CHAR* pcCallingNumber;
    CHAR* pcRedirectingNumber;
    DWORD dwFlags;
  } xAudioCIDDTMFSwedish;

  struct {
    H_SYS_BUFFER  hEncoder;
    H_SYS_BUFFER  hDecoder;
    DWORD dwStatus;
  } xAudioMixConferenceCall;

  struct {
    DWORD dwStatus;
  } xAudioUpdInputMute;

  struct {
    DWORD dwStatus;
  } xAudioUpdOutputMute;

  struct {
    DWORD eDeviceType;
    DWORD eDeviceId;
  } xAudioAssociateDevice;

#ifdef _CN_MODIFY_
  struct {
    H_SYS_BUFFER hDataBuf;
    DWORD oNoiseEnergy;
  } xAudioUpdNoiseFloor;
#endif //_CN_MODIFY_

} uAudioChannelMessage;


/**********************************************************************
 * Constants
 *********************************************************************/
#define AUDIO_MIX_OVERWRITE		0x10000


/**********************************************************************
 * Typedefs
 *********************************************************************/

/**********************************************************************
 * Out-of-band signalling
 *********************************************************************/
typedef struct {
  DWORD dwTimeStamp;
  WORD wAveJitter;
  WORD wPayloadSize;
  WORD wSeqNum;
  OCTET oTSI;
  OCTET oNewMediaSrc;
  LONG lDelayEstimate;
} AUDIO_OOB_SIGNAL;


/**********************************************************************
 * Audio device handling
 *********************************************************************/
#define AUDIO_OS_DEVICE_NAME_MAX_LEN			256
#define AUDIO_OS_DEVICE_UID_MAX_LEN				256
#define AUDIO_OS_DEVICE_MANUFACTURER_MAX_LEN	256

#define AUDIO_OS_DEVICE_FLAG_IS_INPUT		0x01
#define AUDIO_OS_DEVICE_FLAG_IS_OUTPUT		0x02
#define AUDIO_OS_DEVICE_FLAG_IS_DEFAULT		0x04
#define AUDIO_OS_DEVICE_FLAG_IS_SELECTED	0x08
typedef struct AUDIO_OS_DEVICE {
	int deviceId;
	int deviceFlags;
	char deviceName[AUDIO_OS_DEVICE_NAME_MAX_LEN];
	char deviceUID[AUDIO_OS_DEVICE_UID_MAX_LEN];
	char manufacturerName[AUDIO_OS_DEVICE_MANUFACTURER_MAX_LEN];
} AUDIO_OS_DEVICE;

typedef struct AUDIO_OS_DEVICES {
	int nNumberDevices;
	AUDIO_OS_DEVICE *pDevices;
} AUDIO_OS_DEVICES;


/**********************************************************************
 * channel messages
 *********************************************************************/
typedef enum {
  AUDIO_ADD_ENCODE_TYPE,
  AUDIO_REMOVE_ENCODE_TYPE,
  AUDIO_UPD_ENCODE_STREAM_ATTRIB,
  AUDIO_UPD_ENCODE_STREAM_TONE,
  AUDIO_ADD_DECODE_TYPE,
  AUDIO_REMOVE_DECODE_TYPE,
  AUDIO_UPD_AUDIO_STREAM_STATUS,
  AUDIO_CHANGE_CODEC_TYPE,
  AUDIO_UPD_TONE_CONFIGURE,
  AUDIO_UPD_TONE_STATUS,
  AUDIO_UPD_AUDIO_AEC_STATUS,
  AUDIO_AEC_SET_MODE,
  AUDIO_AEC_QUERY_MODE,
  AUDIO_AEC_CONFIG_FULL_DUPLEX,
  AUDIO_AEC_QUERY_CONFIG_FULL_DUPLEX,
  AUDIO_AEC_CONFIG_HALF_DUPLEX,
  AUDIO_AEC_QUERY_CONFIG_HALF_DUPLEX,
  AUDIO_UPD_AUDIO_CHANNEL_ATTRIB,
  AUDIO_UPD_OUTPUT_GAIN,
  AUDIO_CALLER_ID_START_BFSK_BELLCORE,
  AUDIO_CALLER_ID_START_DTMF_SWEDISH,
  AUDIO_CALLER_ID_ABORT,
  AUDIO_VMWI_BFSK_BELLCORE,
  AUDIO_CONFERENCE_CALL_MIX_DECODER,
  AUDIO_UPD_INPUT_MUTE,
  AUDIO_UPD_OUTPUT_MUTE,
  AUDIO_ASSOCIATE_DEVICE,
  AUDIO_CODEC_PRINT,
  AUDIO_PROFILE_INIT,
#ifndef _CN_MODIFY_
  AUDIO_PROFILE_DUMP
#else
  AUDIO_PROFILE_DUMP,
  AUDIO_UPD_NOISE_FLOOR
#endif //_CN_MODIFY_
} AUDIO_CHANNEL_MESSAGES;

/**********************************************************************
 * supported tones
 *********************************************************************/
typedef enum {
  AUDIO_DTMF_KEY_0		=	TONE_DTMF_0,
  AUDIO_DTMF_KEY_1		=	TONE_DTMF_1,
  AUDIO_DTMF_KEY_2		=	TONE_DTMF_2,
  AUDIO_DTMF_KEY_3		=	TONE_DTMF_3,
  AUDIO_DTMF_KEY_4		=	TONE_DTMF_4,
  AUDIO_DTMF_KEY_5		=	TONE_DTMF_5,
  AUDIO_DTMF_KEY_6		=	TONE_DTMF_6,
  AUDIO_DTMF_KEY_7		=	TONE_DTMF_7,
  AUDIO_DTMF_KEY_8		=	TONE_DTMF_8,
  AUDIO_DTMF_KEY_9		=	TONE_DTMF_9,
  AUDIO_DTMF_KEY_STAR		=	TONE_DTMF_STAR,
  AUDIO_DTMF_KEY_POUND		=	TONE_DTMF_POUND,
  AUDIO_DTMF_KEY_A		=	TONE_DTMF_A,
  AUDIO_DTMF_KEY_B		=	TONE_DTMF_B,
  AUDIO_DTMF_KEY_C		=	TONE_DTMF_C,
  AUDIO_DTMF_KEY_D		=	TONE_DTMF_D,
  AUDIO_DIALTONE		=	TONE_DIALTONE,
  AUDIO_RINGBACK		=	TONE_RINGBACK,
  AUDIO_CALLWAITING		=	TONE_CALLWAITING,
  AUDIO_CALLWAITING2		=	TONE_CALLWAITING_TYPE2,
  AUDIO_CALLWAITING3		=	TONE_CALLWAITING_TYPE3,
  AUDIO_CALLWAITING4		=	TONE_CALLWAITING_TYPE4,
  AUDIO_BUSY			=	TONE_BUSY,
  AUDIO_NETWORKBUSY		=	TONE_NETWORKBUSY,
  AUDIO_CONFIRM			=	TONE_CONFIRM,
  AUDIO_STUTTER_DIAL		=	TONE_STUTTER_DIAL,
  AUDIO_RECEIVER_OFF_HOOK	=	TONE_RECEIVER_OFF_HOOK,
  AUDIO_MSG_WAITING_INDICATOR	=	TONE_MESSAGE_WAITING_INDICATOR,
  AUDIO_RINGTONE		=	TONE_RINGTONE,
  AUDIO_DTMF_KEY_0_CONT		=	TONE_DTMF_CONT_0,
  AUDIO_DTMF_KEY_1_CONT		=	TONE_DTMF_CONT_1,
  AUDIO_DTMF_KEY_2_CONT		=	TONE_DTMF_CONT_2,
  AUDIO_DTMF_KEY_3_CONT		=	TONE_DTMF_CONT_3,
  AUDIO_DTMF_KEY_4_CONT		=	TONE_DTMF_CONT_4,
  AUDIO_DTMF_KEY_5_CONT		=	TONE_DTMF_CONT_5,
  AUDIO_DTMF_KEY_6_CONT		=	TONE_DTMF_CONT_6,
  AUDIO_DTMF_KEY_7_CONT		=	TONE_DTMF_CONT_7,
  AUDIO_DTMF_KEY_8_CONT		=	TONE_DTMF_CONT_8,
  AUDIO_DTMF_KEY_9_CONT		=	TONE_DTMF_CONT_9,
  AUDIO_DTMF_KEY_STAR_CONT	=	TONE_DTMF_CONT_STAR,
  AUDIO_DTMF_KEY_POUND_CONT	=	TONE_DTMF_CONT_POUND,
  AUDIO_REORDER_TONE		=	TONE_NETWORKBUSY,
  AUDIO_TONE_CUSTOM_1		=	TONE_CUSTOM_1,
  AUDIO_TONE_CUSTOM_2		=	TONE_CUSTOM_2,
  AUDIO_TONE_CUSTOM_3		=	TONE_CUSTOM_3,
  AUDIO_TONE_CUSTOM_4		=	TONE_CUSTOM_4,
  AUDIO_TONE_CUSTOM_5		=	TONE_CUSTOM_5,
  AUDIO_TONE_CUSTOM_6		=	TONE_CUSTOM_6,
  AUDIO_TONE_CUSTOM_7		=	TONE_CUSTOM_7,
  AUDIO_TONE_CUSTOM_8		=	TONE_CUSTOM_8,
  AUDIO_TONE_CUSTOM_9		=	TONE_CUSTOM_9,
  AUDIO_TONE_CUSTOM_10		=	TONE_CUSTOM_10,
  AUDIO_TONE_CUSTOM_11		=	TONE_CUSTOM_11,
  AUDIO_TONE_CUSTOM_12		=	TONE_CUSTOM_12,
  AUDIO_TONE_CUSTOM_13		=	TONE_CUSTOM_13,
  AUDIO_TONE_CUSTOM_14		=	TONE_CUSTOM_14,
  AUDIO_TONE_CUSTOM_15		=	TONE_CUSTOM_15,
  AUDIO_TONE_CUSTOM_16		=	TONE_CUSTOM_16,
  AUDIO_TONE_CUSTOM_17		=	TONE_CUSTOM_17,
  AUDIO_TONE_CUSTOM_18		=	TONE_CUSTOM_18,
  AUDIO_TONE_CUSTOM_19		=	TONE_CUSTOM_19,
  AUDIO_TONE_CUSTOM_20		=	TONE_CUSTOM_20,
  AUDIO_TONE_ALL		=	TONE_MAX_TYPE
} AUDIO_CHANNEL_TONES;

/**********************************************************************
 * status of DTMF/FAX/Modem tone detection
 *********************************************************************/
typedef enum {
  AUDIO_TONE_DETECT_START,	/* tone active */
  AUDIO_TONE_DETECT_END		/* tone inactive */
} AUDIO_TONE_DETECT_STATUS;

/**********************************************************************
 * status of Caller ID generation
 *********************************************************************/
typedef enum {
  AUDIO_CALLER_ID_DONE
} AUDIO_CALLER_ID_STATUS;

/**********************************************************************
 * supported format for VMWI generation
 *********************************************************************/
typedef enum {
  AUDIO_VMWI_FORMAT_SDMF,
  AUDIO_VMWI_FORMAT_MDMF
} AUDIO_VMWI_FORMATS;

/**********************************************************************
 * status of an audio stream
 *********************************************************************/
typedef enum {
  AUDIO_STREAM_MAKE_INACTIVE = 0x0,	/* activates stream */
  AUDIO_STREAM_MAKE_ACTIVE = 0x1	/* deactivates stream */
} AUDIO_STREAM_STATUS;

/**********************************************************************
 * status of AEC on a channel
 *********************************************************************/
typedef enum {
  AUDIO_AEC_DISABLE = 0x0,      	/* disables AEC */
  AUDIO_AEC_ENABLE = 0x1        	/* enables AEC */
} AUDIO_AEC_STATUS;

/**********************************************************************
 * Encoder stream attributes
 *********************************************************************/
typedef enum {
  AUDIO_ENC_ATTRIB_SILENCE_SUPPRESS	=	0x01,
  AUDIO_ENC_ATTRIB_TONE	                =	0x02
} AUDIO_ENC_ATTRIB;

/**********************************************************************
 * Channel attributes
 *********************************************************************/
typedef enum {
  AUDIO_CHANNEL_ATTRIB_SQUELCH_DTMF	=	0x01
} AUDIO_CHANNEL_ATTRIB;

/**********************************************************************
 * Audio Devices
 *********************************************************************/
typedef enum {
  AUDIO_DEV_MIC		=	0x0,
  AUDIO_DEV_SPKR	=	0x1
} AUDIO_DEVICES;

/**********************************************************************
 * Audio IO Type
 *********************************************************************/
typedef enum {
  AUDIO_IO_INPUT	=	0x0,
  AUDIO_IO_OUTPUT	=	0x1
} AUDIO_IO;

/**********************************************************************
 * Return values of AudioConfig()
 *********************************************************************/
typedef enum {
  AUDIO_CONFIG_NOERR,		/* No Error */
  AUDIO_CONFIG_OVERLAY_ERROR,   /* Code overlay error */
  AUDIO_CONFIG_CODEC_UNKNOWN	/* The codec type is unknown */
} AUDIO_CONFIG_RETURN_VALS;

/**********************************************************************
 * Return values of AudioInit()
 *********************************************************************/
typedef enum {
  AUDIO_INIT_NOERR,		/* No Error */
  AUDIO_INIT_ERROR_NOMEM,	/* Out of memory */
  AUDIO_INIT_ERROR_CODEC,       /* Codec initialization error */
  AUDIO_INIT_ERROR_G711,	/* G711Initialize() failed */
  AUDIO_INIT_ERROR_AJB,		/* AJBInit() failed */
  AUDIO_INIT_ERROR_PLC,		/* PLCInit() failed */
  AUDIO_INIT_ERROR_DRIVER	/* Audio Device Driver Init failed */
} AUDIO_INIT_RETURN_VALS;

/**********************************************************************
 * Return values of AudioChannelInit()
 *********************************************************************/
typedef enum {
  AUDIO_CHANNEL_INIT_NOERR,		/* No Error */
  AUDIO_CHANNEL_INIT_ERROR_NOINIT,	/* AudioInit() not called */
  AUDIO_CHANNEL_INIT_ERROR_NOCHANNEL,	/* exceeded number of channels supported */
  AUDIO_CHANNEL_INIT_ERROR_EXISTS,	/* channel already intialized */
  AUDIO_CHANNEL_INIT_ERROR_NOMEM,	/* out of memory */
  AUDIO_CHANNEL_INIT_ERROR_AEC,		/* AEC instantiation failed */
  AUDIO_CHANNEL_INIT_ERROR_DTMF         /* DTMF instantiation failed */
} AUDIO_CHANNEL_INIT_RETURN_VALS;

/**********************************************************************
 * Return values of AudioChannelMessage()
 *********************************************************************/
typedef enum {
  AUDIO_CHANNEL_MESSAGE_NOERR,				/* No error */
  AUDIO_CHANNEL_MESSAGE_ERROR_GENERAL,			/* No error */
  AUDIO_CHANNEL_MESSAGE_ERROR_NOINIT,			/* channel not initialized */
  AUDIO_CHANNEL_MESSAGE_ERROR_NOMEM,			/* out of memory */
  AUDIO_CHANNEL_MESSAGE_ERROR_TONE_CONFIGURE,		/* tone configuration error */
  AUDIO_CHANNEL_MESSAGE_ERROR_CALLER_ID_ACTIVE,		/* Caller ID already active
						   	   in the channel for which
						   	   the current registration
						   	   of Caller ID is being
						   	   invoked. */
  AUDIO_CHANNEL_MESSAGE_ERROR_VMWI_ACTIVE,		/* VMWI already active
						   	   in the channel for which
						   	   the current registration
						   	   of VMWI is being
						   	   invoked. */
  AUDIO_CHANNEL_MESSAGE_ERROR_CONFERENCE_CALL_MIX,	/* The conference connection
							   being released does
							   not exist. */
  AUDIO_CHANNEL_MESSAGE_ERROR_DEV_INVALID,		/* Trying to associate an
							   invalid device. */
  AUDIO_CHANNEL_MESSAGE_ERROR_DEV_MULTIPLE,		/* Given device is already
							   associated with some
							   other channel. */
  AUDIO_CHANNEL_MESSAGE_ERROR_BAD_MESSAGE		/* bad message type */
} AUDIO_CHANNEL_MESSAGE_RETURN_VALS;

/**********************************************************************
 * Packet playout status in AUDIO_PLAYOUT_CALLBACK_FUNCTION
 *********************************************************************/
typedef enum {
  AUDIO_STREAM_PACKET_PLAYED,      /* Packet was played out */
  AUDIO_STREAM_PACKET_DISCARDED    /* Packet was discarded */
} AUDIO_STREAM_PACKET_PLAYOUT_STATUS;

/**********************************************************************
 * Callback functions
 *********************************************************************/
typedef	void (*AUDIO_DTMF_CALLBACK_FUNCTION)(DWORD, CHAR);
typedef void (*AUDIO_DEVICE_CHANGE_CALLBACK_FUNCTION)();
typedef void (*AUDIO_NO_INPUT_AUDIO_CALLBACK_FUNCTION)();
typedef	void (*AUDIO_DTMF_CALLBACK1_FUNCTION)(DWORD, CHAR, DWORD, DWORD, SHORT);
typedef	void (*AUDIO_CALLERIDSTATUS_CALLBACK_FUNCTION)(DWORD, AUDIO_CALLER_ID_STATUS);
typedef	void (*AUDIO_LOST_PACKET_CALLBACK_FUNCTION)(DWORD, INT);
typedef void (*AUDIO_PLAYOUT_CALLBACK_FUNCTION)(H_SYS_BUFFER, WORD, AUDIO_STREAM_PACKET_PLAYOUT_STATUS);

/**********************************************************************
 * Functions
 *********************************************************************/
LONG AudioConfig(AUDIO_CODEC_TYPE eAudioCodec);
LONG AudioInit(DWORD dwNumAudioChannels);
void AudioTerm(void);
LONG AudioChannelInit(DWORD dwChannel);
void AudioChannelTerm(DWORD dwChannel);
LONG AudioChannelMessage(DWORD dwChannel, DWORD dwMessage, uAudioChannelMessage* uMsg);
void AudioRegisterDtmfCallback(AUDIO_DTMF_CALLBACK_FUNCTION);
void AudioRegisterDtmfCallback1(AUDIO_DTMF_CALLBACK1_FUNCTION);
void AudioRegisterLostAudioCallback(AUDIO_LOST_PACKET_CALLBACK_FUNCTION);
void AudioRegisterNoInputAudioCallback(AUDIO_NO_INPUT_AUDIO_CALLBACK_FUNCTION);
void AudioRegisterCallerIDStatusCallback(AUDIO_CALLERIDSTATUS_CALLBACK_FUNCTION);
DWORD AudioGetEncodeData(H_SYS_BUFFER hSysBuf, void* pvDst, DWORD dwDstSize, AUDIO_OOB_SIGNAL* pxOOB);
void AudioPutDecodeData(H_SYS_BUFFER hSysBuf, void* pvSrc, DWORD dwSrcSize, AUDIO_OOB_SIGNAL* pxOOB);
DWORD AudioGetEncodeTimestamp(H_SYS_BUFFER hSysBuf);
void AudioProcess(void);
AUDIO_OS_DEVICES *AudioEnumerateAudioDevices(AUDIO_IO io);
void AudioFreeAudioDevices(AUDIO_OS_DEVICES **ppDeviceList);
LONG AudioSetInputDevice(int deviceId);
LONG AudioSetOutputDevice(int deviceId);
void AudioSpeakerphone(BOOL);
void AudioMediaPlaybackMode(BOOL bOnOff);
int AudioPlayBufferSpaceAvailable();
int AudioInputAudioAvailable();
int AudioOSInCallMode(DWORD dwChannel, BOOL bInCallMode);
int AudioOSVidyoCallMode(DWORD dwChannel, BOOL bInVidyoMode);
DWORD AudioGetSystemClockrate();

LONG AudioSoundPlayerPlaySoundFile(char *filePath, int deviceId, float volume, BOOL bLoop);
LONG AudioSoundPlayerStopSoundFile(void);
LONG AudioSoundPlayerSetVolume(float volume);

DWORD AudioGetRandomNumber(void);

#endif /* __AUDIOSYS_H__ */

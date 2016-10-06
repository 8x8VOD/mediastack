//
//  StackUserInterface.h
//  i8x8
//
//  Created by Garth Judge on 9/5/14.
//  Copyright (c) 2014 8x8, Inc. All rights reserved.
//

#include "protocol.h"
#include "vidapi.h"
#include "audiosys.h"
#include <time.h>

#ifndef i8x8_StackUserInterface_h
#define i8x8_StackUserInterface_h

#ifdef _WIN32
# ifdef DLL_EXPORT
#  define _PREFIX_   __declspec(dllexport)
# else
#  define _PREFIX_   __declspec(dllimport)
# endif
#else
#  define _PREFIX_   // Not applicable on non-Windows platforms
#endif

#define IS_DEVICE_IOS_IPAD     (DEVICE_IOS_IPAD == StackInterfaceGetDeviceType())
#define IS_DEVICE_IOS_IPHONE   (DEVICE_IOS_IPHONE == StackInterfaceGetDeviceType())

#define PACKET_LOG_FILENAME    "CallPacketLog.log"


typedef struct SIP_URL_INFO {
	char szSipUrlTarget[128];
	char szSipUrlHost[256];
	WORD wSipUrlHostPort;
	char szSipUrlUserId[128];
	char szSipUrlUserName[128];
	char szSipUrlUserAuth[128];
	char szSipUrlUserPswd[128];
	int iSipUrlTransport;
} SIP_URL_INFO;


extern char g_chNumber[], g_chName[];
extern SIP_URL_INFO *g_pxSipUrlInfo;



/*****************************************************************************
 * Call state callback data
 *****************************************************************************/
typedef enum {
	RPC_CALL_IDLE = 0,
	RPC_CALL_DIALING,
	RPC_CALL_DIALING_FWD,
	RPC_CALL_INCOMING,
	RPC_CALL_OUTGOING,
	RPC_CALL_ALERT,
	RPC_CALL_CONNECT,
	RPC_CALL_HOLD,
	RPC_CALL_HELD,
	RPC_CALL_XFER,
	RPC_CALL_XFERRED,
	RPC_CALL_CONNECT_PENDING,
	RPC_CALL_HOLD_PENDING,
	RPC_CALL_DISCONNECTED,
	RPC_CALL_FAILED,
	RPC_CALL_ANY = 0xFF
} E_CALL_STATE;

#define RPC_STRING_LENGTH			32
#define RPC_STRING_LENGTH_CALLID	128
typedef struct {
	E_CALL_STATE eCallState;
	BOOL bInboundCall;
	BOOL bVideoCall;
	BOOL bRecording;
	BOOL bEncrypted;
	BOOL bHDAudio;
	BOOL bVirtualMeetingCall;
	E_PROTOCOL_CODEC eCurrentCodec;
	E_PROTOCOL_ALERT_INFO_CALL_TYPE eAlertInfoType;
	double dAccumulatedMOSLQ;
	int  nVideoState;
	int  nErrorCode;
	unsigned int nCallStartTime;
	char cPhoneNumber[RPC_STRING_LENGTH];
	char cName[RPC_STRING_LENGTH];
	char cCallId[RPC_STRING_LENGTH_CALLID];
	char cPreviousCallId[RPC_STRING_LENGTH_CALLID];
} RPC_CALL_STATE;

#define CALL_OPTION_NONE			0x00000000
#define CALL_OPTION_HOLD			0x00000001
#define CALL_OPTION_RETRIEVE		0x00000002
#define CALL_OPTION_CONF			0x00000004
#define CALL_OPTION_DROPCONF		0x00000008
#define CALL_OPTION_ALTERNATE		0x00000010
#define CALL_OPTION_ANSWER_HOLD		0x00000020
#define CALL_OPTION_ANSWER_CONF		0x00000040
#define CALL_OPTION_REJECT			0x00000080
#define CALL_OPTION_TRANSFER		0x00000100
#define CALL_OPTION_JOIN			0x00000200
#define CALL_OPTION_END				0x00000400
#define CALL_OPTION_ANSWER			0x00000800
#define CALL_OPTION_ADD				0x00001000
#define CALL_OPTION_PARK			0x00002000
#define CALL_OPTION_RECORD			0x00004000
#define CALL_OPTION_START_VIDEO		0x00008000
#define CALL_OPTION_STOP_VIDEO		0x00010000
#define CALL_OPTION_ANSWER_VIDEO	0x00020000
typedef struct {
	RPC_CALL_STATE xCallState[2];
	int dwStateOptions;
} RPC_DATA_CALL_PROGRESS;

typedef struct {
	int nCallQualityLine1;
	int nCallQualityLine2;
} RPC_DATA_CALL_QUALITY;


/*****************************************************************************
 * General status callback data
 *****************************************************************************/
#define NETWORK_UNKNOWN			 PROTOCOL_NETWORK_UNKNOWN
#define NETWORK_NONE			 PROTOCOL_NETWORK_NONE
#define NETWORK_WIFI			 PROTOCOL_NETWORK_WIFI
#define NETWORK_3G				 PROTOCOL_NETWORK_3G
#define NETWORK_4G				 PROTOCOL_NETWORK_4G
#define NETWORK_LTE				 PROTOCOL_NETWORK_LTE
#define NETWORK_EDGE			 PROTOCOL_NETWORK_EDGE
#define NETWORK_CELLULAR		 PROTOCOL_NETWORK_CELLULAR
#define NETWORK_ETHERNET		 PROTOCOL_NETWORK_WIRED

#define OFFLINE					0
#define REGISTERED				1
#define REGISTER_FAILED			2
#define REGISTERING				3

typedef struct {
	int dwIPAddress;
	int nNetworkStatus;
	int nNetworkFlags;
	int nRegistered;
	BOOL bNetworkSwitch;
	char cSipServer[RPC_STRING_LENGTH];
	int wServerPort;
} RPC_DATA_STATUS;


/*****************************************************************************
 * Call log entry callback data
 *****************************************************************************/
#define CALL_LOG_INCOMING    0
#define CALL_LOG_OUTGOING    1
#define CALL_LOG_MISSED      2

// callFlags:
#define CALL_FLAGS_NONE				0x00000000
#define CALL_FLAGS_RING_GROUP		0x00000001

typedef struct {
	char *pcName;
	char *pcNumber;
	int nDateTime;
	int nCallDuration;
	char oType;
	char oNetwork;
	int callFlags; // for flags like RingGroup
} RPC_DATA_CALL_LOG_ITEM;


/*****************************************************************************
 * Call end summary
 *****************************************************************************/
typedef struct {
	char *pcCallId;                     // SIP Call-ID string
	char *pcPeerNumber;                 // Phone number of peer
	int nNetworkSwitchReconnectCount;   // Number of times the network switched, or disconnected/reconnected during a call
	float fLostPacketRatio;             // Packet loss rate (0-100%)
	float fJitterDiscardRatio;          // Jitter buffer discard rate (0-100%)
	float fJitterSpikeDiscardRatio;		// Jitter buffer discard rate during a spike (0-100%)
	int nPacketsSent;                   // Number of RTP packets sent
	int nPacketsReceived;               // Number of RTP packets received
	int nMainLoopOverruns;              // Number of main loop overruns
	int nAveJitter;                     // Average jitter (ms)
	int nMaxJitter;                     // Maximum jitter (ms)
	int nDecryptErrors;                 // Number of RTP packet decrypt errors (if SRTP used)
	int nEncryptErrors;                 // Number of RTP packet encrypt errors (if SRTP used)
	int nDecodeErrors;                  // Number of audio decoder errors
	int nBurstLossDensity;              // Burst loss density (defined in RFC3611)
	int nGapLossDensity;                // Gap loss density (defined in RFC3611)
	int nBurstDuration;                 // Burst duration (defined in RFC3611)
	int nGapDuration;                   // Gap duration (defined in RFC3611)
	int nLatency;                       // Average computed call latency
	double dMOS_LQ;                     // Estimated MOS-LQ score
	double dMOS_CQ;                     // Estimated MOS-CQ score
	OCTET oNetwork;                     // Network type
	E_PROTOCOL_CODEC eCodec;            // Audio codec used on call
	BOOL bSRTPEnabled;                  // Was the call encrypted using SRTP?
	struct tm tmCallStartTime;          // Call start time
	int nCallDuration;                  // Call duration (seconds)
    OCTET oType;                        // Call Type (Incoming/Outgoing/etc.)
} RPC_DATA_CALL_END_SUMMARY;


/*****************************************************************************
 * Cellular call callback data
 *****************************************************************************/
typedef struct {
	char *pcSteeringNumber;
	char *pcDialedNumber;
} RPC_DATA_CELLULAR_CALL;


/*****************************************************************************
 * Voicemail status callback data
 *****************************************************************************/
typedef struct {
	int nNew;
	int nOld;
} RPC_DATA_VOICEMAIL;


/*****************************************************************************
 * Audio parameters (used only by Android)
 *****************************************************************************/
typedef struct {
	int nSampleRate;
	int nIOBufferSize;
} RPC_DATA_AUDIO_PARAMETERS;


/*****************************************************************************
 * Error codes
 *****************************************************************************/
#define ERRCODE_DNS_ERROR					1
#define ERRCODE_DNS_SRV_ERROR				2
#define ERRCODE_REGISTER_ERROR				3
#define ERRCODE_REGISTER_TIMEOUT			4
#define ERRCODE_REGISTER_AUTHFAIL			5
#define ERRCODE_START_VIDEO_FAILED			77
#define ERRCODE_START_VIDEO_UNSUPPORTED		78
#define ERRCODE_DEVICE_CONFLICT				100
#define ERRCODE_CELLULAR_CALL_FAILED		101

_PREFIX_
void StackInterfaceSendErrorEvent(int nErrorCode);

/*****************************************************************************
 * Stack events or commands (no data associated with these)
 *****************************************************************************/
#define STACK_MESSAGE_PLAY_RING_TONE		310
#define STACK_MESSAGE_STOP_RING_TONE		311
#define STACK_MESSAGE_ENABLE_CCR			330
#define STACK_MESSAGE_DISABLE_CCR			331
#define STACK_MESSAGE_ENABLE_PUSH_NOTIFICATION_SUPPORT		350
#define STACK_MESSAGE_DISABLE_PUSH_NOTIFICATION_SUPPORT		351
#define STACK_MESSAGE_START_AUDIO			400
#define STACK_MESSAGE_STOP_AUDIO			401
#define STACK_MESSAGE_START_VIDEO			500
#define STACK_MESSAGE_STOP_VIDEO			501
#define STACK_MESSAGE_UPDATE_AUDIO_DEVICES	600
#define STACK_MESSAGE_UPDATE_VIDEO_DEVICES	601
#define STACK_MESSAGE_CHECK_CONNECTIVITY	602
#define STACK_MESSAGE_NO_INPUT_AUDIO		603
#define STACK_MESSAGE_NETWORK_CHANGE_EVENT	604
#define STACK_MESSAGE_AUDIO_THREAD_UNDERRUN	700
#define STACK_MESSAGE_STARTUP_COMPLETE		800
#define STACK_MESSAGE_SHUTDOWN_COMPLETE		801

_PREFIX_
void StackInterfaceSendEventCommand(int nCommandCode);


/*****************************************************************************
 * Stack call transfer status
 *****************************************************************************/
#define STACK_MESSAGE_XFER_INIT				200
#define STACK_MESSAGE_XFER_FAILED			201
#define STACK_MESSAGE_XFER_SUCCESS			202

_PREFIX_
void StackInterfaceSendTransferStatus(int nTransferStatus);


/*****************************************************************************
 * Set/get the device type and ID
 *****************************************************************************/
typedef enum {
	DEVICE_UNKNOWN,
	DEVICE_IOS_IPHONE,
	DEVICE_IOS_IPOD,
	DEVICE_IOS_IPAD,
	DEVICE_WINDOWS_PC,
	DEVICE_WINDOWS_PHONE,
	DEVICE_WINDOWS_TABLET,
	DEVICE_MAC
} E_DEVICE_TYPE;

extern E_DEVICE_TYPE g_eDeviceType;

_PREFIX_
E_DEVICE_TYPE StackInterfaceGetDeviceType(void);
_PREFIX_
float StackInterfaceGetOSVersion(void);

_PREFIX_
void StackInterfaceSetDeviceType(E_DEVICE_TYPE deviceType);

_PREFIX_
void StackInterfaceSetDeviceID(char *pchDeviceID);
_PREFIX_
char * StackInterfaceGetDeviceID(void);

_PREFIX_
void StackInterfaceSetOSVersion(float version);

typedef void (*STACK_INTERFACE_SIP_LOG_HANDLER)(const char *format, ...);
void StackInterfaceSetSIPLogHandler(STACK_INTERFACE_SIP_LOG_HANDLER);


/*****************************************************************************
 * Configure stack for inbound/outbound call methods
 *****************************************************************************/
typedef enum {
	DIAL_MODE_VOIP,
	DIAL_MODE_CELL_OUTBOUND,
	DIAL_MODE_CELL_CLICK2CALL,
	DIAL_MODE_ASK
} E_DIAL_MODE;

typedef enum {
	INBOUND_MODE_VOIP,
	INBOUND_MODE_CELLULAR,
	INBOUND_MODE_OFF
} E_INBOUND_MODE;

_PREFIX_
void StackInterfaceSetInboundCallOptions(BOOL bNewMobileNumber, E_INBOUND_MODE eInboundCallMode);
_PREFIX_
void StackInterfaceSetMobilePhoneNumber(char *pcNumber);


/*****************************************************************************
 * User interface events that can be sent to the stack
 *****************************************************************************/
#define UI_EVENT_NONE				0
#define UI_EVENT_DIAL				1
#define UI_EVENT_DIAL_VIDEO			2
#define UI_EVENT_END				3
#define UI_EVENT_ANSWER				4
#define UI_EVENT_ANSWER_VIDEO		5
#define UI_EVENT_HOLD				6
#define UI_EVENT_RETRIEVE			7
#define UI_EVENT_CONF				8
#define UI_EVENT_DROPCONF			9
#define UI_EVENT_ALTERNATE			10
#define UI_EVENT_ANSWERHOLD			11
#define UI_EVENT_ANSWERCONF			12
#define UI_EVENT_REJECT_486			13
#define UI_EVENT_REJECT_600			14
#define UI_EVENT_TRANSFER			15
#define UI_EVENT_JOIN				16
#define UI_EVENT_PARK				17
#define UI_EVENT_RECORDSTART		18
#define UI_EVENT_RECORDSTOP			19

#define UI_EVENT_MUTE				20
#define UI_EVENT_UNMUTE				21

#define UI_EVENT_START_VIDEO		22
#define UI_EVENT_STOP_VIDEO			23

#define UI_EVENT_END_CALL_1			24
#define UI_EVENT_END_CALL_2			25

#define UI_EVENT_DIAL_BLIND_XFER	26

#define UI_EVENT_DIAL_CELLULAR_OUTBOUND		50
#define UI_EVENT_DIAL_CELLULAR_CLICK2CALL	51

#define UI_EVENT_KEY0_DOWN      100 + '0'
#define UI_EVENT_KEY1_DOWN      100 + '1'
#define UI_EVENT_KEY2_DOWN      100 + '2'
#define UI_EVENT_KEY3_DOWN      100 + '3'
#define UI_EVENT_KEY4_DOWN      100 + '4'
#define UI_EVENT_KEY5_DOWN      100 + '5'
#define UI_EVENT_KEY6_DOWN      100 + '6'
#define UI_EVENT_KEY7_DOWN      100 + '7'
#define UI_EVENT_KEY8_DOWN      100 + '8'
#define UI_EVENT_KEY9_DOWN      100 + '9'
#define UI_EVENT_KEYSTAR_DOWN   100 + '*'
#define UI_EVENT_KEYPOUND_DOWN  100 + '#'

#define UI_EVENT_KEY0_UP        200 + '0'
#define UI_EVENT_KEY1_UP        200 + '1'
#define UI_EVENT_KEY2_UP        200 + '2'
#define UI_EVENT_KEY3_UP        200 + '3'
#define UI_EVENT_KEY4_UP        200 + '4'
#define UI_EVENT_KEY5_UP        200 + '5'
#define UI_EVENT_KEY6_UP        200 + '6'
#define UI_EVENT_KEY7_UP        200 + '7'
#define UI_EVENT_KEY8_UP        200 + '8'
#define UI_EVENT_KEY9_UP        200 + '9'
#define UI_EVENT_KEYSTAR_UP     200 + '*'
#define UI_EVENT_KEYPOUND_UP    200 + '#'

_PREFIX_
void StackInterfaceSendUserEvent(int event);
_PREFIX_
void StackInterfaceSetPendingCallHandlingEvent(int event);
_PREFIX_
void StackInterfacePlaceCall(char *pcNumber, char *pcName, BOOL bStartWithVideo);
_PREFIX_
void StackInterfaceBlindTransferCallOnHold(char *pcNumber);
_PREFIX_
void StackInterfacePlaceSIPURICall(char *pcURITarget,
								   char *pcURIHost,
								   WORD wURIHostPort,
								   char *pcUserName,
								   char *pcUserId,
								   char *pcUserAuth,
								   char *pcUserPswd,
								   BOOL bSecureCall,
								   BOOL bStartWithVideo);
_PREFIX_
void StackInterfacePlaceVirtualMeetingCall(char *pcAccessNumber,
										   char *pcPinCode);


/*****************************************************************************
 * VoIP Stack control
 *****************************************************************************/
typedef enum {
	STACK_INTERFACE_SIP_TRANSPORT_UDP,
	STACK_INTERFACE_SIP_TRANSPORT_TCP,
	STACK_INTERFACE_SIP_TRANSPORT_TLS,
} E_STACK_INTERFACE_SIP_TRANSPORT;

extern int NN_main();
extern void NN_restart();
extern void NN_reconnect(DWORD);
extern void NN_shutdown(BOOL);
extern void * _MainAppThread(void *);
extern void NN_initializeAV();
extern void NN_terminateAV();
extern void NN_networkChange();

_PREFIX_
void StackInterfaceStartVoIPStackWithDetails(char *pcDisplayName,
											 char *pcAuthUsername,
											 char *pcAuthPassword,
											 char *pcAuthRealm,
											 char *pcRPIDUsername,
											 char *pcSIPProxyDomain,
											 WORD wSIPProxyPort,
											 char *pcCallQualityServer,
											 char *pcUserAgent,
											 BOOL bEnableSRTP,
											 BOOL bSendRegister,
											 E_STACK_INTERFACE_SIP_TRANSPORT eTransportType);
_PREFIX_
void StackInterfaceStartVoIPStack();
_PREFIX_
void StackInterfaceRestartVoIPStack();
_PREFIX_
void StackInterfaceStopVoIPStack(BOOL bDeRegister);
_PREFIX_
void StackInterfaceNetworkChangeEvent();
_PREFIX_
void StackInterfaceReconnectVoIPStack(DWORD dwNewIPAddress);
_PREFIX_
void StackInterfaceReRegister(void);


/*****************************************************************************
 * Main callback interface. This is registered by the user interface layer to
 * receive events and information from the stack
 *****************************************************************************/
typedef enum {
	UI_STACK_MSG_COMMAND_MSG,
	UI_STACK_MSG_XFER_STATUS,
	UI_STACK_MSG_ERROR_MSG,
	UI_STACK_MSG_GENERAL_STATUS,
	UI_STACK_MSG_CALL_PROGRESS,
	UI_STACK_MSG_VOICEMAIL_STATUS,
	UI_STACK_MSG_MAKE_CELLULAR_CALL,
	UI_STACK_MSG_ADD_CALL_LOG_ENTRY,
	UI_STACK_MSG_GET_CELLULAR_DATA_NETWORK,
	UI_STACK_MSG_RENDER_VIDEO_PICTURE,
	UI_STACK_MSG_CALL_QUALITY,
	UI_STACK_MSG_CALL_END_SUMMARY,
	UI_STACK_MSG_GET_AUDIO_PARAMETERS            // Used by Android
} E_STACK_UI_CBK_MESSAGE;

typedef void* (*STACK_USER_INTERFACE_CBK)(E_STACK_UI_CBK_MESSAGE, void *);
_PREFIX_
void StackInterfaceSetDataCallback(STACK_USER_INTERFACE_CBK fpCbkFunction);
_PREFIX_
void* StackInterfaceDataCallback(E_STACK_UI_CBK_MESSAGE eMsg, void *pData);


/*****************************************************************************
 * Set application version
 *****************************************************************************/
extern char *g_pcVersion;
_PREFIX_
void StackInterfaceSetApplicationVersion(char *pchVersion);


/*****************************************************************************
 * Application state controls
 *****************************************************************************/
typedef enum {
	APPLICATION_STATE_BACKGROUND,
	APPLICATION_STATE_FOREGROUND
} E_APPLICATION_STATE;

extern void NN_appState(E_APPLICATION_STATE);
_PREFIX_
void StackInterfaceSetApplicationState(E_APPLICATION_STATE);


/*****************************************************************************
 * Video image handling
 *****************************************************************************/
typedef struct VIDEO_CAPTURE_PARAMETERS {
	int nImageWidth;
	int nImageHeight;
	int nFrameRate;
	VIDEO_FORMAT eVideoFormat;
	OCTET aoProfile[4];
} VIDEO_CAPTURE_PARAMETERS;

_PREFIX_
VIDEO_CAPTURE_DEVICES *StackInterfaceGetVideoCaptureDevices(void);
_PREFIX_
void StackInterfaceFreeVideoCaptureDeviceList(VIDEO_CAPTURE_DEVICES **ppDeviceList);
_PREFIX_
void StackInterfaceSetVideoCaptureDevice(char *deviceId);
_PREFIX_
void StackInterfaceStartVideoCapture(void);
_PREFIX_
void StackInterfaceStopVideoCapture(void);
_PREFIX_
void StackInterfaceSetVideoCaptureParameters(VIDEO_CAPTURE_PARAMETERS *pParameters);
_PREFIX_
void StackInterfaceSendDecodedImage(VIDEO_PICTURE *pImagePicture);
_PREFIX_
void StackInterfaceSendImageForEncoding(void *pAbstractImageStructure);
_PREFIX_
void StackInterfaceSetVideoRenderView(void *windowId, int x, int y, int width, int height);
_PREFIX_
void StackInterfaceRenderVideoImage(VIDEO_PICTURE *pImagePicture);
_PREFIX_
void StackInterfaceSetSelfVideoDisplayView(void *windowId, int x, int y, int width, int height);
_PREFIX_
BOOL StackInterfaceIsVideoAllowed();


/*****************************************************************************
 * Audio device handling
 *****************************************************************************/
_PREFIX_
AUDIO_OS_DEVICES *StackInterfaceGetAudioInputDevices(void);
_PREFIX_
AUDIO_OS_DEVICES *StackInterfaceGetAudioOutputDevices(void);
_PREFIX_
void StackInterfaceFreeAudioDeviceList(AUDIO_OS_DEVICES **ppDeviceList);
_PREFIX_
void StackInterfaceSetAudioInputDevice(int deviceId);
_PREFIX_
void StackInterfaceSetAudioOutputDevice(int deviceId);
_PREFIX_
void StackInterfaceSetAudioInputVolume(double volume);
_PREFIX_
void StackInterfaceSetAudioOutputVolume(double volume);
_PREFIX_
void StackInterfaceSetAudioRingtoneVolume(double volume);
_PREFIX_
void StackInterfaceSetAudioRingtoneFilename(char *filename);

typedef enum {
	AUDIO_OUTPUT_EARPHONE,
	AUDIO_OUTPUT_SPEAKERPHONE,
	AUDIO_OUTPUT_HEADPHONE,
	AUDIO_OUTPUT_BLUETOOTH
} E_AUDIO_OUTPUT;

_PREFIX_
void StackInterfaceSetAudioOutputRoute(E_AUDIO_OUTPUT);
_PREFIX_
void StackInterfacePlaySound(char *fileName, int deviceId, float volume, BOOL bLoopContinuously);
_PREFIX_
void StackInterfaceStopSound(void);

_PREFIX_
void StackInterfacePlayRingtone(void);
_PREFIX_
void StackInterfaceStopRingtone(void);


/*****************************************************************************
 * Config handling
 *****************************************************************************/
_PREFIX_
void StackInterfaceInitializeConfig(char *);
_PREFIX_
char *StackInterfaceGetConfigureDirectoryPath(void);
_PREFIX_
void StackInterfaceSetConfigParameter(char *, char *);
_PREFIX_
LONG StackInterfaceGetConfigParameter(char *, char *, int);


/*****************************************************************************
 * Virtual Meeting support
 *****************************************************************************/
_PREFIX_
void StackInterfaceSetVirtualMeetingStatus(BOOL bInMeeting);
_PREFIX_
void StackInterfaceSetVidyoCallMode(BOOL bVidyoCallMode);


/*****************************************************************************
 * PUSH notification handling
 *****************************************************************************/
_PREFIX_
void StackInterfaceSetPushNotificationKey(char *);

/*****************************************************************************
 * Initialization
 *****************************************************************************/
_PREFIX_
void StackInterfaceInitialize(void);


/*****************************************************************************
 * Clean-up and shut-down
 *****************************************************************************/
_PREFIX_
void StackInterfaceTerminate(void);


/*****************************************************************************
 * Logging
 *****************************************************************************/
_PREFIX_
STACK_INTERFACE_SIP_LOG_HANDLER StackInterfaceLogger(void);



#endif

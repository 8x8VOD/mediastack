/********************************************************************
 *
 * File:	protocol.h
 *
 * Description:
 *	Protocol interface.
 *
 * Copyright 2000-2001, Netergy Microelectronics.  All rights reserved.
 *
 ********************************************************************/
#ifndef __PROTOCOL_H__
#define __PROTOCOL_H__

#ifndef _WIN32
# include <syslog.h>
#endif

#include "NNstyle.h"


/*****************************************************************************
 *
 * Defines
 *
 *****************************************************************************/

/*****************************************************************************
 * Return values
 *****************************************************************************/
#define PROTOCOL_SUCCESS        0       /* successful */
#define PROTOCOL_MEM_FAIL       (-1)    /* insufficent memory failure */
#define PROTOCOL_SRC_FAIL       (-2)    /* resource shortage failure */
#define PROTOCOL_OPEN_FAIL      (-3)    /* open file/msgq/socket/etc error */
#define PROTOCOL_CLOSE_FAIL     (-4)    /* closed file/msgq/socket/etc error */
#define PROTOCOL_READ_FAIL      (-5)    /* read file/msgq/socket/etc error */
#define PROTOCOL_WRITE_FAIL     (-6)    /* write file/msgq/socket/etc error */
#define PROTOCOL_NTWK_FAIL      (-7)    /* other network error */
#define PROTOCOL_THR_FAIL       (-8)    /* failure related to threads */
#define PROTOCOL_MSGQ_FAIL      (-9)    /* other msgq error */
#define PROTOCOL_CBK_FAIL      (-10)    /* function callback is failed  */
#define PROTOCOL_GEN_FAIL      (-11)    /* general failure */
#define PROTOCOL_NOTIMPL_FAIL  (-12)    /* function not implemented */
#define PROTOCOL_BADCALL_FAIL  (-13)    /* call handle is not valid */
#define PROTOCOL_NOTREADY_FAIL (-14)    /* data not yet available */

/*****************************************************************************
 * RTP payload/codec types
 *****************************************************************************/
#define PROTOCOL_RTPPAYLOAD_PCMU     0
#define PROTOCOL_RTPPAYLOAD_1016     1
#define PROTOCOL_RTPPAYLOAD_G726     2
#define PROTOCOL_RTPPAYLOAD_GSM      3
#define PROTOCOL_RTPPAYLOAD_G723     4
#define PROTOCOL_RTPPAYLOAD_DVI4_1   5
#define PROTOCOL_RTPPAYLOAD_DVI4_2   6
#define PROTOCOL_RTPPAYLOAD_LPC      7
#define PROTOCOL_RTPPAYLOAD_PCMA     8
#define PROTOCOL_RTPPAYLOAD_G722     9
#define PROTOCOL_RTPPAYLOAD_L16_1    10
#define PROTOCOL_RTPPAYLOAD_L16_2    11
#define PROTOCOL_RTPPAYLOAD_CN       13
#define PROTOCOL_RTPPAYLOAD_MPA      14
#define PROTOCOL_RTPPAYLOAD_G728     15
#define PROTOCOL_RTPPAYLOAD_G729     18
#define PROTOCOL_RTPPAYLOAD_H261     31
#define PROTOCOL_RTPPAYLOAD_H263     34

#define PROTOCOL_PAYLOAD_T38         129
#define PROTOCOL_PAYLOAD_RFCTEL      253
#define PROTOCOL_PAYLOAD_RFCTONE     254
#define PROTOCOL_PAYLOAD_UNDEFINED   255

/*****************************************************************************
 * Audio/Video codecs
 *****************************************************************************/
typedef enum {
  PROTOCOL_CODEC_UNKNOWN,
  PROTOCOL_CODEC_PCMU,
  PROTOCOL_CODEC_PCMA,
  PROTOCOL_CODEC_G723,
  PROTOCOL_CODEC_G726,
  PROTOCOL_CODEC_G729,
  PROTOCOL_CODEC_ILBC_20MS,
  PROTOCOL_CODEC_ILBC_30MS,
  PROTOCOL_CODEC_OPUS,
  PROTOCOL_CODEC_H261,
  PROTOCOL_CODEC_H263,
  PROTOCOL_CODEC_H264,
  PROTOCOL_CODEC_T38,
  PROTOCOL_CODEC_TELEPHONE_EVENTS,
  PROTOCOL_CODEC_CISCO_NSE_EVENTS,
  PROTOCOL_CODEC_RTP_REDUNDANCY
} E_PROTOCOL_CODEC;

/*****************************************************************************
 * Call place control flags
 *****************************************************************************/
#define PROTOCOL_FLAGS_STOPMEDIA  (0)
#define PROTOCOL_FLAGS_STARTMEDIA (0x1)

/*****************************************************************************
 * Misc.
 *****************************************************************************/
#define ENCODE_NAME_SIZE            24

/* ICE */
#define DERIVED_ADDRESSES           3     /* Local, STUN, TURN */
#define LOCAL_ADDRESS_INDEX         0
#define STUN_ADDRESS_INDEX          1
#define TURN_ADDRESS_INDEX          2

/*****************************************************************************
 *
 * Typedefs
 *
 *****************************************************************************/

/*****************************************************************************
 * Handles
 *****************************************************************************/
typedef unsigned long H_PROTOCOL_INSTANCE;
typedef unsigned long H_CALL;

/*****************************************************************************
 * Media types
 *****************************************************************************/
typedef enum {
  PROTOCOL_MEDIA_UNDEFINED = -1,
  PROTOCOL_MEDIA_AUDIO = 0,      // must be zero, breaks otherwise
  PROTOCOL_MEDIA_VIDEO,
  PROTOCOL_MEDIA_DATA,
  PROTOCOL_MEDIA_IMAGE,
  PROTOCOL_MEDIA_LINE,
  PROTOCOL_MEDIA_UNKNOWN
} E_PROTOCOL_MEDIA;

/*****************************************************************************
 * Capbility direction
 *****************************************************************************/
typedef enum {
  PROTOCOL_TXRX_STOP = 0x00,
  PROTOCOL_TXRX_TX = 0x01,                 // transmit cap
  PROTOCOL_TXRX_RX = 0x10,                 // receive cap
  PROTOCOL_TXRX_TXRX = 0x11                // bidirectional cap
} E_PROTOCOL_TXRX;

#define PROTOCOL_TX_MASK 0x01
#define PROTOCOL_RX_MASK 0x10

typedef enum {
  PROTOCOL_TRANSPORT_RTP, 
  PROTOCOL_TRANSPORT_UDPTL,
  PROTOCOL_TRANSPORT_UDP,
  PROTOCOL_TRANSPORT_TCP,
  PROTOCOL_TRANSPORT_TLS,
  PROTOCOL_TRANSPORT_UNKNOWN
} E_PROTOCOL_TRANSPORT;

/*****************************************************************************
 * Association direction
 *****************************************************************************/
typedef enum {
  PROTOCOL_ASSOCIATE_BIDIRECTION,
  PROTOCOL_ASSOCIATE_ISOLATE,
  PROTOCOL_ASSOCIATE_ONEWAY,
  PROTOCOL_ASSOCIATE_ONEWAY_R
} E_PROTOCOL_ASSOCIATE;

/*****************************************************************************
 * Network type
 *****************************************************************************/
typedef enum {
  PROTOCOL_NETWORK_NONE = -1,
  PROTOCOL_NETWORK_UNKNOWN = 0,
  PROTOCOL_NETWORK_WIFI,
  PROTOCOL_NETWORK_3G,
  PROTOCOL_NETWORK_4G,
  PROTOCOL_NETWORK_LTE,
  PROTOCOL_NETWORK_EDGE,
  PROTOCOL_NETWORK_WIRED,
  PROTOCOL_NETWORK_CELLULAR
} E_PROTOCOL_NETWORK;

#define PROTOCOL_VALUE_UNKNOWN  0xff

/*****************************************************************************
 * SRTP Crypto types
 *****************************************************************************/
#define PROTOCOL_CRYPTO_MASTER_KEY_LEN  30
#define PROTOCOL_MAX_CRYPTO_LINES       3

typedef enum {
  CRYPTO_NONE,
  CRYPTO_F8_128_HMAC_SHA1_32,
  CRYPTO_AES_CM_128_HMAC_SHA1_32,
  CRYPTO_AES_CM_128_HMAC_SHA1_80,
  CRYPTO_AES_CM_256_HMAC_SHA1_32,
  CRYPTO_AES_CM_256_HMAC_SHA1_80
} E_PROTOCOL_CRYPTO_TYPE;

/*****************************************************************************
 * Alert-Info call type
 *****************************************************************************/
typedef enum {
  PROTOCOL_ALERT_INFO_UNKNOWN,
  PROTOCOL_ALERT_INFO_INTERNAL_CALL,
  PROTOCOL_ALERT_INFO_EXTERNAL_CALL,
  PROTOCOL_ALERT_INFO_GROUP_CALL,
  PROTOCOL_ALERT_INFO_AUTOANSWER,
} E_PROTOCOL_ALERT_INFO_CALL_TYPE;

/*****************************************************************************
 * Media capability
 *****************************************************************************/
typedef struct {
  DWORD            dwIPAddress;
  WORD             wPort;
  WORD             wPriority;       // 1000x(q value); i.e 1000=1.0, 898=0.898
  char*            pcUsername;
  char*            pcPassword;
} PROTOCOL_ICE_ADDRESS;

typedef struct {
  DWORD            dwTag;
  E_PROTOCOL_CRYPTO_TYPE eCryptoType;
  BOOL             bPreffered;
  OCTET            aoKey[PROTOCOL_CRYPTO_MASTER_KEY_LEN];
} PROTOCOL_CRYPTO_LINE;

typedef struct {
  E_PROTOCOL_TXRX  eTxRx;           // direction
  PROTOCOL_ICE_ADDRESS   xRtpIceAddressList[DERIVED_ADDRESSES];
  PROTOCOL_ICE_ADDRESS   xRtcpIceAddressList[DERIVED_ADDRESSES];
  WORD             wRtpPriority;
  WORD             wRtcpPriority;
  char             pcEncodeName[ENCODE_NAME_SIZE];    // Encoder name (method)
  OCTET            oPayload;
  E_PROTOCOL_CODEC eCodec;
  E_PROTOCOL_NETWORK eNetwork;
  OCTET            oRedundant;
  WORD             wPort;   
  WORD             wCtlPort;
  DWORD            dwIPAddress;
  DWORD            dwCtlIPAddress;
  DWORD            dwClockRate;
  DWORD            dwBitRate;
  PROTOCOL_CRYPTO_LINE  xSrtpCryptoList[PROTOCOL_MAX_CRYPTO_LINES];
} PROTOCOL_CAP_COMMON;

typedef struct {
  OCTET            oPacketization;  // in msec
  OCTET            bSilenceSuppression;  // TRUE = silence suppression on
  BOOL             bComfortNoise;
  OCTET            oTelEventPayload;
  OCTET            oNSEventPayload;
} PROTOCOL_CAP_AUDIO;

typedef struct {
  DWORD            dwBandwidth;
#define PROTOCOL_RTCPFB_PLI   0x01
#define PROTOCOL_RTCPFB_APP   0x02
  OCTET            fRtcpFbSupport;
} PROTOCOL_CAP_VIDEO;

typedef struct {
#define T38_TCF_UNKNOWN       0
#define T38_TCF_LOCAL         1
#define T38_TCF_TRANSFERRED   2
  OCTET  oRateManagement;
#define T38_UDPEC_UNKNOWN 0
#define T38_UDPEC_FEC         1
#define T38_UDPEC_REDUNDANCY  2
  OCTET  oUdpEC;
#define T38_TRANSPORT_UDPTL   0
#define T38_TRANSPORT_TCP     1
  OCTET  oTransport;
  BOOL   bFillBitRemoval;
  BOOL   bTranscodingMMR;
  BOOL   bTranscodingJBIG;
  WORD   wMaxBitRate;
  WORD   wMaxBuffer;	   /* UDP option: Maximum Buffer Size */
  WORD   wMaxDatagram;     /* UDP option: Maximum Datagram Size */
} PROTOCOL_CAP_DATA;

typedef struct {
  OCTET oLineNumber;
  BOOL  bEchoCancellation;
} PROTOCOL_CAP_LINE;

typedef struct {
  E_PROTOCOL_MEDIA eMedia;          // audio or video
  PROTOCOL_CAP_COMMON xCmn;
  union {
    PROTOCOL_CAP_AUDIO xAudio;
    PROTOCOL_CAP_VIDEO xVideo;
    PROTOCOL_CAP_DATA  xData;
    PROTOCOL_CAP_LINE  xLine;
  } u;
} PROTOCOL_CAP;

/*****************************************************************************
 * Reject reasons
 *****************************************************************************/
typedef enum {
  PROTOCOL_REJECT_NOT_FOUND,
  PROTOCOL_REJECT_UNAVAIL,
  PROTOCOL_REJECT_DECLINED,
  PROTOCOL_REJECT_BUSY,
  PROTOCOL_REJECT_BY_ACR,
  PROTOCOL_REJECT_ENUMMAX
} E_PROTOCOL_REJECT;

/*****************************************************************************
 * Disconnect reasons
 *****************************************************************************/
typedef enum {
  PROTOCOL_DISCONNECT_NOT_FOUND,
  PROTOCOL_DISCONNECT_BUSY,
  PROTOCOL_DISCONNECT_NETWORKCONGESTION,
  PROTOCOL_DISCONNECT_UNSPECIFIED,
  PROTOCOL_DISCONNECT_ENUMMAX
} E_PROTOCOL_DISCONNECT;

/*****************************************************************************
 * Log levels
 *****************************************************************************/
typedef enum {
#ifdef _WIN32
	LEVEL_FATAL = 1,
	LEVEL_ERROR = 3,
	LEVEL_NOTICE = 5,
	LEVEL_WARNING = 4,
	LEVEL_INFO = 6,
	LEVEL_DEBUG = 7,
#else
  LEVEL_FATAL   = LOG_ALERT,
  LEVEL_ERROR   = LOG_ERR,
  LEVEL_NOTICE  = LOG_NOTICE,
  LEVEL_WARNING = LOG_WARNING,
  LEVEL_INFO    = LOG_INFO,
  LEVEL_DEBUG   = LOG_DEBUG,
#endif
  LEVEL_ENUMMAX
} E_LOG_LEVEL;

/*****************************************************************************
 * Call Agent / MGC / Sip Server / Gatekeeper / etc.
 *****************************************************************************/
typedef struct {
  OCTET* pcUserName;
  OCTET* pcHostName;
  WORD wPort;
  WORD wPriority;
  WORD wWeight;
} PROTOCOL_CALL_CONTROL_AGENT;

#include "protcbk.h"

#endif /* __PROTOCOL_H__ */

/**************************** END OF FILE ************************************/



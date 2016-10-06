/********************************************************************
 *
 * File:  mediastream.h
 *
 * Description:
 *	Media Stream API header file
 *
 * Copyright 2000-2001, Netergy Microelectronics.  All rights reserved.
 *
 ********************************************************************/
#ifndef __MEDIA_STREAM__
#define __MEDIA_STREAM__

#include "protocol.h"
#include "stunapi.h"
#include "packet_logger.h"


/********************************************************************
 * Definitions
 ********************************************************************/
#define DEFAULT_AUDIO_RX_AJB_INIT_DELAY  100        /* milliseconds */
#define DEFAULT_AUDIO_RX_AJB_MIN_DELAY   60         /* milliseconds */
#define DEFAULT_AUDIO_RX_AJB_MAX_DELAY   280        /* milliseconds */
#define DEFAULT_AUDIO_RX_FJB_DELAY       80         /* milliseconds */

#define DEFAULT_VIDEO_BITRATE          64           /* kbps */

// Network Congestion Threshold special values:
#define MS_IGNORE_NET_CONGESTION_THRESHOLD 0xFFFFFFFF
#define MS_DONT_CHANGE_NET_CONGESTION_THRESHOLD 0xFFFFFFFE
#define MS_MAX_NET_CONGESTION_LATENCY_THRESHOLD 0xFFFFFFF0
#define MS_MAX_NET_CONGESTION_LOSTPKTPER_THRESHOLD 256

/********************************************************************
 * Callback function prototypes
 ********************************************************************/
typedef LONG (*MEDIA_STREAM_CBK)();

struct MEDIA_STREAM;
typedef struct MEDIA_STREAM* H_MEDIA_STREAM;

typedef void *H_MEDIA_STREAM_SET;

typedef enum {
  MS_DTMF_0      = '0',
  MS_DTMF_1      = '1',
  MS_DTMF_2      = '2', 
  MS_DTMF_3      = '3', 
  MS_DTMF_4      = '4', 
  MS_DTMF_5      = '5', 
  MS_DTMF_6      = '6', 
  MS_DTMF_7      = '7', 
  MS_DTMF_8      = '8', 
  MS_DTMF_9      = '9', 
  MS_DTMF_STAR   = '*', 
  MS_DTMF_POUND  = '#', 
  MS_DTMF_A      = 'A', 
  MS_DTMF_B      = 'B', 
  MS_DTMF_C      = 'C', 
  MS_DTMF_D      = 'D', 
  MS_HOOK_FLASH,
  MS_FAXMODEM_ANS,
  MS_FAXMODEM_V21,
  MS_FAXMODEM_CNG,
  MS_FAXMODEM_OTHER,
  MS_OFF_HOOK,
  MS_ON_HOOK,
  MS_RINGER_ON,
  MS_RING_OFF,
  MS_NSE_SWITCH_TO_FAX,
  MS_NSE_PACK_NSE,
  MS_NSE_NACK_NSE,
  MS_UNKNOWN
} E_MS_EVENT;

typedef enum {
  MS_JITTER_BUFFER_ADAPTIVE = 0,
  MS_JITTER_BUFFER_FIXED = 1
} E_MS_JITTER_BUFFER_MODE;

typedef enum {
  ABCD_TRANSITION,
  ABCD_CONTINUOUS
} E_ABCD_MODE;

typedef enum {
  MS_CBKMSG_NO_AUDIO_RX_ON_CHANNEL = 1,
  MS_CBKMSG_FIRST_PACKET,
  MS_CBKMSG_LOST_AUDIO,
  MS_CBKMSG_LOST_VIDEO,
  MS_CBKMSG_RECVD_RTCPFB,
  MS_CBKMSG_NET_CONGESTION_TXPKTLOSS,
  MS_CBKMSG_NET_CONGESTION_LATENCY,
} E_MS_CBKMSG;

typedef enum {
  NAT_TRAVERSAL_STATUS_IDLE,
  NAT_TRAVERSAL_STATUS_PENDING,
  NAT_TRAVERSAL_STATUS_FAILED,
  NAT_TRAVERSAL_STATUS_COMPLETE
} E_NAT_TRAVERSAL_STATUS;


/* NAT Traversal settings flags */
#define MS_NAT_TRAVERSAL_NONE       0x0000
#define MS_NAT_TRAVERSAL_STUN       0x0001
#define MS_NAT_TRAVERSAL_TURN       0x0002
#define MS_NAT_TRAVERSAL_ICE        0x0004
#ifdef PACKET8_NAT_TRAVERSAL
#define MS_NAT_TRAVERSAL_PACKET8    0x0008
#endif
#define MS_NAT_TRAVERSAL_HNP        0x0010
#define MS_NAT_TRAVERSAL_HALFTURN   0x1000  // Bypass TURN server during RTP
                                            // transmission

typedef struct MS_RTP_PARAMS {
  DWORD dwPacketRxExpectedRTP;
  DWORD dwPacketRxExpectedAudio;
  DWORD dwPacketReceived;
  DWORD dwOctetReceived;
  DWORD dwPacketLostRTP;
  DWORD dwPacketLostAudio;
  DWORD dwPacketDiscard;
  DWORD dwPacketDiscardDuringSpike;
  DWORD dwJitterBufferAdjustmentCount;
  DWORD dwJitterBufferPlayoutSkewCorrections;
  DWORD dwJitterBufferNominalDelay;
  DWORD dwJitterBufferMinDelay;
  DWORD dwJitterBufferMaxDelay;
  DWORD dwJitterBufferAbsMaxDelay;
  DWORD dwInputBufferDiscard;
  DWORD dwOutputBufferDiscard;
  DWORD dwMaxPacketLossDiscardBurst;
  DWORD dwPacketSent;
  DWORD dwOctetSent;
  DWORD dwDecoderReceived;
  DWORD dwPacketDecryptError;
  DWORD dwPacketEncryptError;
  DWORD dwPacketDecodeError;
  DWORD dwRoguePacketReceived;
  DWORD dwNoAudioPlayout;
  DWORD dwMediaStreamReconnects;
  DWORD dwInputAudioAvailable;
  DWORD dwNoInputAudioAvailable;
  DWORD dwSilentInputAudioDetected;
  DWORD dwAudioRecorderOverflows;
  DWORD dwAudioPlayerUnderflows;
  WORD  wMaxJitter;
  WORD  wAveJitter;
  WORD  wBurstLength;
  WORD  wGapLength;
  WORD  wLatency;
  WORD  wMinLatency;
  WORD  wMaxLatency;
  WORD  wInstLatency;
  WORD  wMaxPacketsProcessedInBurst;
  DWORD dwFarSidePacketsSent;
  DWORD dwFarSideOctetsSent;
  DWORD dwReceiverSSRC;
  DWORD dwFarSideSsrc;
  OCTET oBurstDensity;
  OCTET oGapDensity;
  OCTET oTxLostPktFraction;
  DOUBLE doubleBurstRatio;
  DOUBLE doubleR_LQ;
  DOUBLE doubleR_CQ;
  DOUBLE doubleMOS_LQ;
  DOUBLE doubleMOS_CQ;
} MS_RTP_PARAMS;

typedef struct MS_SVCQ_REPORT {
  BOOL bFixedJitterBuffer;
  OCTET oGmin;
  OCTET oBurstDensity; 
  OCTET oGapDensity;
  OCTET oPlcType; /* See MS_PLC definition */
  OCTET oRerl;    /* in dB. MS_RERL_UNKNOWN=127 means unknown */
  WORD wRtpFecRxPort;
  DWORD dwAdaptationRate; // 0 -> not avail
  DWORD dwNominalDelay;
  DWORD dwCurrMaxDelay;
  DWORD dwAbsMaxDelay;
  DWORD dwReceivedPkts;   // total since beg, 0xFFFFFFFF -> not avail (e.g. tx)
  DWORD dwExpectedPkts;   // total since beg, 0xFFFFFFFF -> not avail (e.g. tx)
  DWORD dwGoodPkts;       // total since beg, 0xFFFFFFFF -> not avail (e.g. tx)
  DWORD dwDroppedPkts;    // total since beg, 0xFFFFFFFF -> not avail (e.g. tx)
  DWORD dwDroppedSpikePkts;    // total since beg, 0xFFFFFFFF -> not avail (e.g. tx)
  DWORD dwLostPkts;       // total since beg, 0xFFFFFFFF -> not avail (e.g. tx)
  DWORD dwInputBufferDroppedPkts;
  DWORD dwOutputBufferDroppedPkts;
  DWORD dwDecryptErrorPkts;
  DWORD dwEncryptErrorPkts;
  DWORD dwNoAudioPlayoutCount;
  DWORD dwDecoderReceivedPkts;
  DWORD dwDecodeErrorPkts;
  DWORD dwJitterBufferAdjustmentCount;
  DWORD dwJitterBufferPlayoutSkewCorrections;
  WORD wBurstDuration;
  WORD wGapDuration;
  DWORD dwNtpUpper;
  DWORD dwNtpLower;
  DWORD dwRtpRxSsrc;
  DWORD dwRtpTxSsrc;
  DWORD dwRtpFecRxSsrc;
  DWORD dwRtpFecRxAddr;
  WORD wVCodecFrameSize; /* In bytes */
  DWORD dwVCodecSampleRate;
  WORD wRtpVPayloadSize; /* In bytes */
  BOOL bVRedundancy;
  BOOL bVFec;
  OCTET oLossRate; 
  OCTET oDiscardRate;
  DOUBLE doubleBurstRatio;
  DOUBLE doubleR_LQ;
  DOUBLE doubleR_CQ;
  DOUBLE doubleMOS_LQ;
  DOUBLE doubleMOS_CQ;
} MS_SVCQ_REPORT;

#define MS_PLC_UNSPECIFIED            0
#define MS_PLC_DISABLED               1
#define MS_PLC_ENHANCED               2
#define MS_PLC_STANDARD               3

#define MS_RERL_UNKNOWN                127


#define APPLICATION_FEEDBACK_VIDEO_BITRATES        0x88FEAA01
#define APPLICATION_FEEDBACK_VIDEO_BITRATES_ACK    0x88FEAA02
typedef struct MS_AFB_BITRATE_CONTROL {
  DWORD dwAfbCode;
  DWORD dwTxBitrate;
  DWORD dwRxBitrate;
} MS_AFB_BITRATE_CONTROL;


/* Received telephone event callback definition */
typedef LONG (*TELEVENT_CBKFN)(OCTET, E_MS_EVENT, BOOL, DWORD);

typedef void (*MEDIA_NAT_HANDLER)(DWORD, H_MEDIA_STREAM, BOOL);

typedef void (*MEDIASTREAM_CBK_HANDLER)(OCTET, H_MEDIA_STREAM, E_MS_CBKMSG);

/********************************************************************
 * MediaStream API Functions
 ********************************************************************/
LONG MediaStreamInit(OCTET oInterface, DWORD dwLocalIPAddr, OCTET *poMacAddress);
LONG MediaStreamUpdateLocalInterface(OCTET oInterface, DWORD dwLocalIPAddr, OCTET *poMacAddress);
void MediaStreamTerm();
void MediaStreamLock();
void MediaStreamUnlock();
void MediaStreamEnableEncryption(BOOL bEnableEncryption);
void MediaStreamRegisterMediaCallBack(MEDIASTREAM_CBK_HANDLER pfn);
void MediaStreamAddCap(PROTOCOL_CAP*);
void MediaStreamProcess();
LONG MediaStreamQuerySysCap(PROTOCOL_CAP *axCaps, OCTET oNumCap, BOOL bT38en);
PROTOCOL_CAP* MediaStreamSystemCapEnabled(PROTOCOL_CAP* pCap);
void MediaStreamSendTelEvent(OCTET oLine, DWORD dwEvent, BOOL bStatus, BOOL bNoDtmfEndEvent);

H_MEDIA_STREAM MediaStreamCreate(E_PROTOCOL_MEDIA, void *dwReferenceId, void *dwGroupId);
void MediaStreamDestroy(H_MEDIA_STREAM hStream);

/* Set the capability of the media stream */
PROTOCOL_CAP* MediaStreamSystemCap(PROTOCOL_CAP* pCap);
LONG MediaStreamSetCap(H_MEDIA_STREAM, PROTOCOL_CAP*);
LONG MediaStreamReserveCap(H_MEDIA_STREAM, PROTOCOL_CAP*, E_PROTOCOL_TXRX);

/* Get the current capability of the media stream */
LONG MediaStreamGetCap(H_MEDIA_STREAM, PROTOCOL_CAP*, E_PROTOCOL_TXRX);
LONG MediaStreamQueryCap(H_MEDIA_STREAM, PROTOCOL_CAP*, OCTET, BOOL);
LONG MediaStreamSystemCapContent(OCTET, PROTOCOL_CAP*, OCTET);
E_PROTOCOL_MEDIA MediaStreamType(H_MEDIA_STREAM);
E_PROTOCOL_TXRX MediaStreamMode(H_MEDIA_STREAM);

H_MEDIA_STREAM MediaStreamFind(void *dwStreamId);
H_MEDIA_STREAM MediaStreamFindByChannel(OCTET oChannel);

void MediaStreamStatus(H_MEDIA_STREAM hStream, E_PROTOCOL_TXRX eMode);
void MediaStreamStart(H_MEDIA_STREAM pStream, E_PROTOCOL_TXRX eTxRx);
void MediaStreamStop(H_MEDIA_STREAM pStream, E_PROTOCOL_TXRX eTxRx);

LONG MediaStreamAssociate(H_MEDIA_STREAM hStream1, H_MEDIA_STREAM hStream2,
                          E_PROTOCOL_ASSOCIATE eAssociate);
LONG MediaStreamAssociateChannel(H_MEDIA_STREAM hStream, DWORD dwChannel);

LONG MediaStreamSetTOS(H_MEDIA_STREAM, DWORD dwTOS);
LONG MediaStreamSetJitterBufferStatus(H_MEDIA_STREAM pStream,
                                      E_MS_JITTER_BUFFER_MODE eJitterBufferMode,
                                      DWORD dwJitterBufferInitialDuration,
                                      DWORD dwJitterBufferMinimumDuration,
                                      DWORD dwJitterBufferMaximumDuration,
                                      BOOL bDisablePLCandCNG);
LONG MediaStreamSetTelephoneEvent(H_MEDIA_STREAM, BOOL bStatus,
                                  BOOL bDropVoiceDuringEvents, E_ABCD_MODE eABCDMode, 
                                  TELEVENT_CBKFN pfnTeleventCBK);
LONG MediaStreamUpdEncodeTone(H_MEDIA_STREAM hStream, LONG lTone, BOOL bStatus);
LONG MediaStreamChannelUpdEncodeTone(DWORD dwLine, LONG lTone, BOOL bStatus);
LONG MediaStreamChannelUpdJitterBufferStatus(DWORD dwLine, 
                                             E_MS_JITTER_BUFFER_MODE eJitterBufferMode, 
                                             DWORD dwJitterBufferInitialDuration,
                                             DWORD dwJitterBufferMinimumDuration,
                                             DWORD dwJitterBufferMaximumDuration,
                                             BOOL bDisablePLCandCNG);
LONG MediaStreamGetRTPStatus(H_MEDIA_STREAM hStream, MS_RTP_PARAMS *pParams);
LONG MediaStreamGetLocalServiceQuality(H_MEDIA_STREAM hStream, MS_SVCQ_REPORT *pXR);
LONG MediaStreamGetRxServiceQualityReport(H_MEDIA_STREAM hStream, MS_SVCQ_REPORT *pXR);
LONG MediaStreamGetTxServiceQualityReport(H_MEDIA_STREAM hStream, MS_SVCQ_REPORT *pXR);
LONG MediaStreamSetRTPNetCongestionThresholds(H_MEDIA_STREAM hStream, 
                                              DWORD dwLostPktsPer256,
                                              DWORD dwLatencyMs);
LONG MediaStreamGetRTPNetCongestionThresholds(H_MEDIA_STREAM hStream, 
                                              DWORD *pdwLostPktsPer256,
                                              DWORD *pdwLatencyMs);

void MediaStreamAddLineCap(OCTET oLine, PROTOCOL_CAP* pCap);
LONG MediaStreamQueryLineCap(OCTET oLine, PROTOCOL_CAP *axCaps, OCTET oNumCap, BOOL bT38en);

void MediaStreamSuppressAudio(H_MEDIA_STREAM pStream, BOOL bSuppress);

#ifdef PACKET8_NAT_TRAVERSAL
LONG MediaStreamSetSendUDP(H_MEDIA_STREAM pStream, BOOL bSend);
LONG MediaStreamSetSwitchNetworkInfo(H_MEDIA_STREAM pStream, PROTOCOL_CAP *pCap);
#endif // PACKET8_NAT_TRAVERSAL

LONG MediaStreamSetNatTraversalLookup(H_MEDIA_STREAM pStream, 
                                      WORD wNatTraversalMethod,
                                      E_NAT_TYPE eNatType,
                                      char *pcStunTurnUsername,
                                      char *pcStunTurnPassword);
LONG MediaStreamStopNatTraversalLookup(H_MEDIA_STREAM pStream);
E_NAT_TRAVERSAL_STATUS MediaStreamGetNatStatus(H_MEDIA_STREAM pStream);

void MediaStreamSendPli(H_MEDIA_STREAM hStream);
void MediaStreamReceivedPli(H_MEDIA_STREAM hStream);
LONG MediaStreamSendBitrateAfb(H_MEDIA_STREAM hStream, DWORD dwRxBitrate);

H_MEDIA_STREAM_SET MediaStreamSetCreate(void);
LONG MediaStreamSetAdd(H_MEDIA_STREAM_SET hSet, H_MEDIA_STREAM pStream);
void MediaStreamSetFindReset(H_MEDIA_STREAM_SET hSet);
H_MEDIA_STREAM MediaStreamSetFindNext(H_MEDIA_STREAM_SET hSet);
H_MEDIA_STREAM MediaStreamSetFindNextByType(H_MEDIA_STREAM_SET hSet, 
                                            E_PROTOCOL_MEDIA eType);
LONG MediaStreamSetRemove(H_MEDIA_STREAM_SET hSet, H_MEDIA_STREAM pStream);
LONG MediaStreamSetDestroy(H_MEDIA_STREAM_SET hSet);

void *MediaStreamGetProxyInstanceHandle(H_MEDIA_STREAM pStream);

void MediaStreamGetRtpInst(H_MEDIA_STREAM pStream, 
                           H_PROTOCOL_INSTANCE **hRtpInstTx,
                           H_PROTOCOL_INSTANCE **hRtpInstRx);

void MediaStreamSetRtpInst(H_MEDIA_STREAM pStream, int nSocket, 
                           H_PROTOCOL_INSTANCE hRtpInstTx,
                           H_PROTOCOL_INSTANCE hRtpInstRx);

BOOL MediaStreamIsEncrypted(H_MEDIA_STREAM pStream);
BOOL MediaStreamIsWidebandAudio(H_MEDIA_STREAM pStream);

LONG MediaStreamReconnectLocalAddress(H_MEDIA_STREAM pStream);

void MediaStreamAllowVideo(BOOL bAllow);
BOOL MediaStreamVideoAllowed();

PACKET_LOGGER *MediaStreamGetPacketLogger(H_MEDIA_STREAM pStream);

#ifdef VIDEO_SUPPORT
#ifdef __cplusplus
extern "C"
{
#endif
void MediaStreamProcessSendVideo(H_MEDIA_STREAM pStream, OCTET* pNals, DWORD dwSize, BOOL bPrependSPSPPS, BOOL bLockThread);
void MediaStreamSetVideoSPSPPS(H_MEDIA_STREAM pStream, OCTET* pSPSPPS, DWORD dwSPSSize, DWORD dwPPSSize);
#ifdef __cplusplus
}
#endif
void MediaStreamSendImageForEncoding(void *pAbstractImageStructure);
void MediaStreamSetVideoCaptureParameters(int nPictureWidth, int nPictureHeight, int nPictureFrameRate);
#endif

#endif   //__MEDIA_STREAM__


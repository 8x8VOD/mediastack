#ifndef __PROTCBK_H__
#define __PROTCBK_H__

#include "NNstyle.h"
#include "protocol.h"

/*****************************************************************************
 * Callback message types
 *****************************************************************************/
typedef enum {
  PROTOCOL_CBKMSG_INCOMING,        // incoming call
  PROTOCOL_CBKMSG_RINGING,         // far end is ringing/alerting user
  PROTOCOL_CBKMSG_CONNECTED,       // call connected
  PROTOCOL_CBKMSG_DISCONNECTED,    // call has ended
  PROTOCOL_CBKMSG_HOLD,            // far end wants to put call on hold
  PROTOCOL_CBKMSG_RETRIEVE,        // far end wants to retrieve a call
  PROTOCOL_CBKMSG_TRANSFER,        // far end wants to transfer a call
  PROTOCOL_CBKMSG_REJECT,          // far end rejected call
  PROTOCOL_CBKMSG_MEDIA_CREATE,      // a media channel has been negotiated
  PROTOCOL_CBKMSG_MEDIA_DESTROY,       // a media channel has been removed
  PROTOCOL_CBKMSG_MEDIA_SETCAP,      // a media channel has been negotiated
  PROTOCOL_CBKMSG_MEDIA_START,      // a media channel has been started
  PROTOCOL_CBKMSG_MEDIA_STOP,      // a media channel has been stoped
  PROTOCOL_CBKMSG_MEDIA_STATUS,       // a media channel state has been changed
  PROTOCOL_CBKMSG_TRANSFERRED,     // incoming transferred call
  PROTOCOL_CBKMSG_USERINFO,        // user info such as DTMF
  PROTOCOL_CBKMSG_USEREXTENSION,   // marker for adding user extensions
  PROTOCOL_CBKMSG_ENUMMAX
} E_PROTOCOL_CBKMSG;

/*****************************************************************************
 * callback message INCOMING
 * The far end has called this node
 *****************************************************************************/
typedef struct {
  char* pchCalleeAddress;          // the destination of the call
  char* pchCallerIdName;           // the callers name
  char* pchCallerIdNumber;         // the callers number
  BOOL bRestrictPresentation;      // restrict presentation of callerID
  OCTET oScreenIndication;         // call ID screening indication
  OCTET oNumCaps;                  // number of capabilities
  PROTOCOL_CAP* pCaps;             // list of capabilities
} PROTOCOL_CBKDATA_INCOMING;

/*****************************************************************************
 * callback message RINGING
 * Far end is alerting user (ringing)
 *****************************************************************************/
typedef struct {
  char* pchAlertingName;
  BOOL bRestrictPresentation;      // restrict presentation of alertingID
  OCTET oScreenIndication;         // call ID screening indication
  BOOL bLocalRingback;             // locally generate ringback tone
} PROTOCOL_CBKDATA_RINGING;

/*****************************************************************************
 * callback message CONNECTED
 * Far end has accepted call and call is connected
 *****************************************************************************/
typedef struct {
  char* pchConnectedName;
  BOOL bRestrictPresentation;      // restrict presentation of connectedID
  OCTET oScreenIndication;         // call ID screening indication
  OCTET oNumCaps;                  // number of capabilities
  PROTOCOL_CAP* pCaps;             // list of capabilities
} PROTOCOL_CBKDATA_CONNECTED;

/*****************************************************************************
 * callback message DISCONNECTED
 * Call has ended
 *****************************************************************************/
typedef struct {
  char* pchBusyName;
  BOOL bRestrictPresentation;      // restrict presentation of busyID
  OCTET oScreenIndication;         // call ID screening indication
  BOOL bNoResp;                    // no response from GK
  DWORD dwAltGkIPAddr;             // alternate gatekeeper IP address
  WORD* pwAltGkId;                 // alternate gatekeeper identifier
  WORD wAltGkIdLen;                // length of alternate gatekeeper identifier
  WORD wAltGkPort;		// alternate gatekeeper port number
  WORD bRegister;		// new registration required when using Alt GK
  OCTET oPriority;		// priority
  BOOL bPermanent;                 // change gatekeeper permanently
  BOOL bUseAgk;                    // registration to alternate GK recommended
  E_PROTOCOL_DISCONNECT eDiscReason; // reason for disconnection
} PROTOCOL_CBKDATA_DISCONNECTED;

/*****************************************************************************
 * callback message HOLD
 *****************************************************************************/
typedef struct {
  int nBogus; // some compilers cannot handle empty structs
} PROTOCOL_CBKDATA_HOLD;

/*****************************************************************************
 * callback message RETRIEVE
 *****************************************************************************/
typedef struct {
  OCTET oNumCaps;                  // number of capabilities
  PROTOCOL_CAP* pCaps;             // list of capabilities
} PROTOCOL_CBKDATA_RETRIEVE;

/*****************************************************************************
 * callback message TRANSFER
 *****************************************************************************/
typedef struct {
  char* pchTransfereeAddress;      // who to transfer to
  char* pchTransferRequestedBy;    // who requested the transfer
} PROTOCOL_CBKDATA_TRANSFER;

/*****************************************************************************
 * callback message REJECT
 *****************************************************************************/
typedef struct {
  E_PROTOCOL_REJECT eRejectReason; // reason call is being rejected
} PROTOCOL_CBKDATA_REJECT;

/*****************************************************************************
 * callback message MEDIA
 *****************************************************************************/
typedef struct {
  void *dwMediaChannelId;          // media channel identifier
  void *dwReferenceId;          // media channel identifier
  PROTOCOL_CAP capMedia;           // media channel caps
} PROTOCOL_CBKDATA_MEDIA_CREATE;

typedef struct {
  void *dwMediaChannelId;          // media channel identifier
  void *dwReferenceId;          // media channel identifier
} PROTOCOL_CBKDATA_MEDIA_DESTROY;

typedef struct {
  void *dwMediaChannelId;          // media channel identifier
  void *dwReferenceId;          // media channel identifier
  PROTOCOL_CAP capMedia;           // media channel caps
} PROTOCOL_CBKDATA_MEDIA_SETCAP;

typedef struct {
  void *dwMediaChannelId;          // media channel identifier
  void *dwReferenceId;          // media channel identifier
  E_PROTOCOL_TXRX eTxRx;
} PROTOCOL_CBKDATA_MEDIA_STATUS;

typedef struct {
  void *dwMediaChannelId;          // media channel identifier
  void *dwReferenceId;          // media channel identifier
  E_PROTOCOL_TXRX eTxRx;
} PROTOCOL_CBKDATA_MEDIA_START;

typedef struct {
  void *dwMediaChannelId;          // media channel identifier
  void *dwReferenceId;          // media channel identifier
  E_PROTOCOL_TXRX eTxRx;
} PROTOCOL_CBKDATA_MEDIA_STOP;


/*****************************************************************************
 * callback message TRANSFERRED
 * Incoming transferred call
 *****************************************************************************/
typedef struct {
  char* pchCalleeAddress;          // the destination of the call
  char* pchCallerIdName;           // the callers name
  char* pchCallerIdNumber;         // the callers number
  char* pchTransferRequestedBy;    // the node which requested the transfer
  OCTET oNumCaps;                  // number of capabilities
  PROTOCOL_CAP* pCaps;             // list of capabilities
} PROTOCOL_CBKDATA_TRANSFERRED;

typedef struct {
  char chKey;
} PROTOCOL_CBKDATA_USERINFO;

/*****************************************************************************
 * callback message USEREXTENSION
 *****************************************************************************/
typedef struct {
  DWORD dwExtensionType;           // user extension type
  // Rest of extension message follows here
} PROTOCOL_CBKDATA_USEREXTENSION;

/*****************************************************************************
 * Callback message union
 *****************************************************************************/
typedef union {
  PROTOCOL_CBKDATA_INCOMING Incoming;
  PROTOCOL_CBKDATA_RINGING Ringing;
  PROTOCOL_CBKDATA_CONNECTED Connected;
  PROTOCOL_CBKDATA_DISCONNECTED Disconnected;
  PROTOCOL_CBKDATA_HOLD Hold;
  PROTOCOL_CBKDATA_RETRIEVE Retrieve;
  PROTOCOL_CBKDATA_TRANSFER Transfer;
  PROTOCOL_CBKDATA_REJECT Reject;
  PROTOCOL_CBKDATA_MEDIA_CREATE  MediaCreate;
  PROTOCOL_CBKDATA_MEDIA_DESTROY MediaDestroy;
  PROTOCOL_CBKDATA_MEDIA_SETCAP  MediaSetCap;
  PROTOCOL_CBKDATA_MEDIA_STATUS  MediaStatus;
  PROTOCOL_CBKDATA_MEDIA_START   MediaStart;
  PROTOCOL_CBKDATA_MEDIA_STOP   MediaStop;
  PROTOCOL_CBKDATA_TRANSFERRED Transferred;
  PROTOCOL_CBKDATA_USERINFO UserInfo;
  PROTOCOL_CBKDATA_USEREXTENSION UserExtension;
} PROTOCOL_CBKDATA;

/*****************************************************************************
 * Callback function prototypes
 *****************************************************************************/
typedef LONG (*PROTOCOL_CBK)(H_PROTOCOL_INSTANCE, H_CALL, void *dwUser,
			     E_PROTOCOL_CBKMSG, PROTOCOL_CBKDATA*);

#endif

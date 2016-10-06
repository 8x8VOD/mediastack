/**************************************************************************
 *
 * stunapi.h 
 *
 *    STUN API header file
 *
 * Copyright 2003-2004 8x8, Inc
 *
 **************************************************************************/

#ifndef __STUNAPI_H__
#define __STUNAPI_H__

#include "NNstyle.h"
#include "protocol.h"
#ifdef _WIN32
# include <WinSock2.h>
#else
# include <netinet/in.h>
#endif

#define STUN_HEADER_SIZE          20

#define LOCAL_ADDRESS_PRIORITY    1000
#define STUN_ADDRESS_PRIORITY     800
#define TURN_ADDRESS_PRIORITY     400

#define STUN_RESPONSE_FLAG        0x0001
#define TURN_RESPONSE_FLAG        0x0002

#define STUN_SUCCESS              (0x0010 | STUN_RESPONSE_FLAG)
#define TURN_SUCCESS              (0x0010 | TURN_RESPONSE_FLAG)

#define STUN_INSTANCE_BUSY        (0x0020 | STUN_RESPONSE_FLAG)
#define TURN_INSTANCE_BUSY        (0x0020 | TURN_RESPONSE_FLAG)

#define STUN_ERROR_RESPONSE       (0x0040 | STUN_RESPONSE_FLAG)
#define TURN_ERROR_RESPONSE       (0x0040 | TURN_RESPONSE_FLAG)

#define STUN_ERROR_TIMEOUT        (0x0080 | STUN_RESPONSE_FLAG)
#define TURN_ERROR_TIMEOUT        (0x0080 | TURN_RESPONSE_FLAG)

#define STUN_REMOTE_PEER_CONNECT_TIMEOUT  (0x0100 | STUN_RESPONSE_FLAG)
#define STUN_REMOTE_PEER_CONNECTIVITY     (0x0200 | STUN_RESPONSE_FLAG)
#define STUN_LOCAL_PEER_CONNECTIVITY      (0x0400 | STUN_RESPONSE_FLAG)

#define TURN_REFRESH_FAILED               (0x0100 | TURN_RESPONSE_FLAG)

#define DEFAULT_STUN_PORT         3478
#define DEFAULT_TURN_PORT         3479

/*
 * NAT types
 */
typedef enum {
  NAT_ERROR,
  NAT_DIRECT_INTERNET,
  NAT_SYMMETRICAL_FIREWALL,
  NAT_FULL_CONE_NAT,
  NAT_SYMMETRICAL_NAT,
  NAT_PORT_RESTRICTED_NAT,
  NAT_RESTRICTED_NAT
} E_NAT_TYPE;


typedef BOOL (*STUN_PKT_HANDLER)(int,                     // socket
                                 OCTET **,                // packet
                                 LONG *,                  // packet length
                                 struct sockaddr_in *);   // packet origin

typedef void (*STUN_RSP_HANDLER)(H_PROTOCOL_INSTANCE,     // handle
                                 void *,                  // user
                                 LONG,                    // error code
                                 DWORD,                   // public IP
                                 WORD,                    // public port
                                 DWORD,                   // data 1
                                 DWORD);                  // data 2


/***********************************************************************
 * StunStart()
 *   Starts the STUN/TURN module. This function MUST be called before
 *   all other API functions in this library.
 * 
 *   Arguments:
 *     pcStunServerAddress          : STUN server address
 *     wStunServerPort              : STUN server port
 *     pcTurnServerAddress          : TURN server address
 *     wTurnServerPort              : TURN server port
 *
 *   Returns:
 *     LONG                         : 1 - Success
 *                                    0 - Failure
 *
 ***********************************************************************/
LONG StunStart(char *pcStunServerAddress,
               WORD wStunServerPort,
               char *pcTurnServerAddress,
               WORD wTurnServerPort);

/***********************************************************************
 * StunStop()
 *   Stop the STUN/TURN module. This function will destroy all STUN/TURN
 *   clients and free all resources used by the STUN/TURN module.
 * 
 *   Arguments:
 *     none
 *
 *   Returns:
 *     LONG                         : 0
 *
 ***********************************************************************/
LONG StunStop(void);

/***********************************************************************
 * StunInstanceCreate()
 *   Create a STUN client instance.
 *
 *   Arguments:
 *     dwUser                       : User data from calling library
 *     dwLocalIp                    : Local IP Address
 *     wLocalPort                   : Local Port
 *     iSocket                      : Provide a socket from which to
 *                                    send STUN queries. 
 *                                    iSocket = -1 forces the STUN client
 *                                    to generate its own socket
 *     pfnCbk                       : Callback function to call upon
 *                                    STUN/TURN events
 *
 *   Returns:
 *     H_PROTOCOL_INSTANCE          : Handle on the created instance
 *
 ***********************************************************************/
H_PROTOCOL_INSTANCE StunInstanceCreate(void *dwUser,
                                       DWORD dwLocalIp,
                                       WORD wLocalPort,
                                       int iSocket,
                                       STUN_RSP_HANDLER pfnCbk);

/***********************************************************************
 * StunInstanceDestroy()
 *   Destroy a STUN client instance
 * 
 *   Arguments:
 *     hStunInstance                : Instance to destroy
 *
 *   Returns:
 *     LONG                         : STUN_SUCCESS
 *
 ***********************************************************************/
LONG StunInstanceDestroy(H_PROTOCOL_INSTANCE hStunInstance);

/***********************************************************************
 * StunInstanceTask()
 *   Main STUN client instance state machine task
 * 
 *   Arguments:
 *     hStunInstance                : Instance to process
 *
 *   Returns:
 *     LONG                         : STUN_SUCCESS
 *
 ***********************************************************************/
LONG StunInstanceTask(H_PROTOCOL_INSTANCE hStunInstance);

/***********************************************************************
 * StunInstanceGetNATType()
 *   Starts the STUN client procedure to determine the most restrictive 
 *   type of NAT between the client and the public STUN server.
 * 
 *   Arguments:
 *     hStunInstance                : Instance to begin procedure on
 *
 *   Returns:
 *     LONG                         : STUN_SUCCESS - Success
 *                                    STUN_INSTANCE_BUSY - Failure
 *
 ***********************************************************************/
LONG StunInstanceGetNATType(H_PROTOCOL_INSTANCE hStunInstance);

/***********************************************************************
 * StunInstanceGetPublicNatAddress()
 *   Starts the STUN client procedure to determine the most public
 *   IP address of the outermost NAT device (i.e. the public Internet
 *   address and port after all NAT devices)
 * 
 *   Arguments:
 *     hStunInstance                : Instance to begin procedure on
 *     bKeepAlive                   : Keep this binding alive
 *
 *   Returns:
 *     LONG                         : STUN_SUCCESS - Success
 *                                    STUN_INSTANCE_BUSY - Failure
 *
 ***********************************************************************/
LONG StunInstanceGetPublicNatAddress(H_PROTOCOL_INSTANCE hStunInstance,
                                     BOOL bKeepAlive);


/***********************************************************************
 * StunInstanceSetSocket()
 *   Modify the socket to be used by the STUN/TURN client.
 * 
 *   Arguments:
 *     hStunInstance                : STUN/TURN Instance
 *     iSocket                      : Socket handle
 *
 *   Returns:
 *     LONG                         : STUN_SUCCESS - Success
 *                                    STUN_INSTANCE_BUSY - Failure
 *
 ***********************************************************************/
LONG StunInstanceSetSocket(H_PROTOCOL_INSTANCE hStunInstance,
                           int iSocket);


/***********************************************************************
 * StunInstanceStopStunBinding()
 *   Terminates the NAT binding derivation procedure, and stops
 *   the keepalive process on an open NAT port
 * 
 *   Arguments:
 *     hStunInstance                : Instance to end procedure on
 *
 *   Returns:
 *     LONG                         : STUN_SUCCESS - Success
 *                                    STUN_INSTANCE_BUSY - Failure
 *
 ***********************************************************************/
LONG StunInstanceStopStunBinding(H_PROTOCOL_INSTANCE hStunInstance);


/***********************************************************************
 * StunInstanceGetTurnAllocation()
 *   Starts the TURN client procedure to allocate a port on a public
 *   TURN server.
 * 
 *   Arguments:
 *     hStunInstance                : Instance to begin procedure on
 *     dwGroupId                    : Group handle to allow serveral
 *                                    allocations to be handled by the
 *                                    same server. 
 *     dwBandwidth                  : Bandwidth (Kbits) to reserve
 *     pcUsername                   : Username for authentication
 *     pcPassword                   : Password for authentication
 *
 *   Returns:
 *     LONG                         : TURN_SUCCESS - Success
 *                                    TURN_INSTANCE_BUSY - Failure
 *
 ***********************************************************************/
LONG StunInstanceGetTurnAllocation(H_PROTOCOL_INSTANCE hStunInstance,
                                   void *dwGroupId,
                                   DWORD dwBandwidth,
                                   char *pcUsername,
                                   char *pcPassword);


/***********************************************************************
 * StunInstanceAddTurnPermission()
 *   Add a remote peer to the TURN binding permission list.
 * 
 *   Arguments:
 *     hStunInstance                : Instance to begin procedure on
 *     dwDestinationIp              : Peer destination IP address
 *     wDestinationPort             : Peer destination port
 *
 *   Returns:
 *     LONG                         : TURN_SUCCESS - Success
 *                                    TURN_INSTANCE_BUSY - Failure
 *
 ***********************************************************************/
LONG StunInstanceAddTurnPermission(H_PROTOCOL_INSTANCE hStunInstance,
                                   DWORD dwDestinationIp,
                                   WORD wDestinationPort);


/***********************************************************************
 * StunInstanceSetActiveDestination()
 *   Set the active destination address and port for a TURN binding.
 * 
 *   Arguments:
 *     hStunInstance                : Instance to begin procedure on
 *     dwDestinationIp              : Active destination IP address
 *     wDestinationPort             : Active destination port
 *
 *   Returns:
 *     LONG                         : TURN_SUCCESS - Success
 *                                    TURN_INSTANCE_BUSY - Failure
 *
 ***********************************************************************/
LONG StunInstanceSetActiveDestination(H_PROTOCOL_INSTANCE hStunInstance,
                                      DWORD dwDestinationIp,
                                      WORD wDestinationPort);


/***********************************************************************
 * StunInstanceFreeTurnAllocation()
 *   Starts the TURN client procedure to free up a previously allocated 
 *   port on the TURN server
 * 
 *   Arguments:
 *     hStunInstance                : Instance to begin procedure on
 *
 *   Returns:
 *     LONG                         : TURN_SUCCESS - Success
 *                                    TURN_INSTANCE_BUSY - Failure
 *
 ***********************************************************************/
LONG StunInstanceFreeTurnAllocation(H_PROTOCOL_INSTANCE hStunInstance);


/***********************************************************************
 * StunInstanceTestPeerConnectivity()
 *   Starts the STUN client procedure to test connectivity to a set
 *   of addresses and ports provided by a remote peer.
 * 
 *   Arguments:
 *     hStunInstance                : Instance to begin procedure on
 *     pxRemoteAddresses            : List of remote ICE addresses,
 *                                    usernames and passwords
 *     pxLocalAddresses             : List of local ICE addresses,
 *                                    usernames and passwords
 *
 *   Returns:
 *     LONG                         : STUN_SUCCESS - Success
 *                                    STUN_INSTANCE_BUSY - Failure
 *
 ***********************************************************************/
LONG StunInstanceStartICE(H_PROTOCOL_INSTANCE hStunInstance,
                          PROTOCOL_ICE_ADDRESS *pxRemoteAddresses,
                          PROTOCOL_ICE_ADDRESS *pxLocalAddresses);


/***********************************************************************
 * StunPacketHandlerCbk()
 *   Default callback function to handle STUN/TURN packets received
 *   on a socket. This function can be registered with any other
 *   module, so that STUN/TURN packets received by that module may be
 *   forwarded to this STUN module.
 *
 *   Arguments:
 *     iSocket                      : Socket handle on which packet was
 *                                    received
 *     ppoPacket                    : Pointer to packet payload
 *     plPacketLen                  : Length of packet received
 *     pxOriginAddr                 : Pointer to (struct sockaddr_in)
 *                                    structure containing the source
 *                                    address details of the packet
 *
 *   Returns:
 *     BOOL                         : Whether or not the packet is a
 *                                    TURN Data-Indication packet with a
 *                                    DATA attribute payload which is
 *                                    NOT a STUN packet
 * 
 ***********************************************************************/
BOOL StunPacketHandlerCbk(int iSocket,
                          OCTET **ppoPacket,
                          LONG *plPacketLen,
                          struct sockaddr_in *pxOriginAddr);


/***********************************************************************
 * StunInstanceSendThroughTurnServer()
 *   Redirect an outgoing packet through the TURN server
 *
 *   Arguments:
 *     hStunInstance                : Instance to begin procedure on
 *     iSocket                      : Socket to send on
 *     pDestination                 : Destination address
 *     poPacket                     : Pointer to packet payload
 *     wPacketLen                   : Length of packet received
 *
 *   Returns:
 *     LONG                         : Number of bytes sent
 * 
 ***********************************************************************/
LONG StunInstanceSendThroughTurnServer(H_PROTOCOL_INSTANCE hStunInstance,
                                       int iSocket,
                                       struct sockaddr_in *pDestination,
                                       OCTET *poPacket,
                                       WORD wPacketLen);


/***********************************************************************
 * StunInstanceGetLocalInfo()
 *   Gets local ip and port
 *
 *   Arguments:
 *     hStunInstance                : Instance to begin procedure on
 *     pdwIpAddr                    : Local IP address 
 *     pwPort                       : Local port
 *
 *   Returns:
 *     NONE                          
 * 
 ***********************************************************************/
void StunInstanceGetLocalInfo(H_PROTOCOL_INSTANCE hStunInstance,
                              DWORD *pdwIpAddr,
                              WORD  *pwPort);
#endif  /* __STUNAPI_H__ */

/**************************************************************************/
/*********************** END OF FILE **************************************/
/**************************************************************************/

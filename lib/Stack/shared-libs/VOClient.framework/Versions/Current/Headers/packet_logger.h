//
//  packet_logger.h
//
//  Created by Garth Judge on 6/23/16.
//  Copyright © 2016 8x8, Inc. All rights reserved.
//

#ifndef __PACKET_LOGGER_H__
#define __PACKET_LOGGER_H__

#include "NNstyle.h"

#ifdef _WIN32
#  include <stdint.h>
#endif

#define PACKET_LOGGER_VERSION					1

#define PACKET_LOGGER_DEFAULT_LOG_SIZE			1000000L

#define SEQUENTIAL_SEQUENCE_OFFSET_LIMIT		((1 << RTP_SEQUENCE_DELTA_BIT_SIZE) >> 1)
#define SEQUENTIAL_TIMESTAMP_OFFSET_LIMIT       ((1 << RTP_TIMESTAMP_DELTA_BIT_SIZE) >> 1)
#define SEQUENTIAL_TIME_OFFSET_LIMIT            (1 << 8)


typedef enum {
	PACKET_DESC_TYPE_FULL_INPUT_PACKET,
	PACKET_DESC_TYPE_SEQUENTIAL_INPUT_PACKET,
	PACKET_DESC_TYPE_FULL_PLAYED_PACKET,
	PACKET_DESC_TYPE_SEQUENTIAL_PLAYED_PACKET
} E_PACKET_LOGGER_PACKET_DESC_TYPE;


/*
 * Received RTP packet meta-data
 */
typedef struct PACKET_LOGGER_INPUT_PACKET {
	uint16_t rtpHeader;
	uint16_t rtpSeq;
	uint32_t rtpTimestamp;
	uint32_t rtpSSRC;
	uint32_t srcIP;
	uint16_t srcPort;
	uint32_t captureTime;
	uint16_t rtpPayloadLength;
} PACKET_LOGGER_INPUT_PACKET;


/*
 * Played/discarded RTP packet meta-data
 */
typedef struct PACKET_LOGGER_PLAYED_PACKET {
	uint32_t playoutTime;
	uint16_t rtpSeq;
	BOOL discarded;
} PACKET_LOGGER_PLAYED_PACKET;


/*
 * Packet log header
 */
#define PACKET_LOGGER_HEADER_COOKIE					0x999
#define PACKET_LOGGER_MAX_NUMBER_LENGTH				128
#define PACKET_LOGGER_CALL_TYPE_INCOMING			1
#define PACKET_LOGGER_CALL_TYPE_OUTGOING			2

#define VERSION_BIT_SIZE							4
#define VERSION_SHIFT								(32 - VERSION_BIT_SIZE)
#define VERSION_MASK								0xF0000000

#define COOKIE_BIT_SIZE								12
#define COOKIE_SHIFT								(32 - VERSION_BIT_SIZE - COOKIE_BIT_SIZE)
#define COOKIE_MASK									0x0FFF0000

#define CALL_TYPE_BIT_SIZE							2
#define CALL_TYPE_SHIFT								(32 - VERSION_BIT_SIZE - COOKIE_BIT_SIZE - CALL_TYPE_BIT_SIZE)
#define CALL_TYPE_MASK								0x0000C000

#define CALL_DURATION_BIT_SIZE						14
#define CALL_DURATION_SHIFT							0
#define CALL_DURATION_MASK							0x00003FFF

#define CALL_NUMBER_BYTE_SIZE						PACKET_LOGGER_MAX_NUMBER_LENGTH

#define SetPacketLogHeaderDescVersion(D, V)			((D)->header |= (((V) << VERSION_SHIFT) & VERSION_MASK))
#define SetPacketLogHeaderDescCookie(D, C)			((D)->header |= (((C) << COOKIE_SHIFT) & COOKIE_MASK))
#define SetPacketLogHeaderDescCallType(D, T)		((D)->header |= (((T) << CALL_TYPE_SHIFT) & CALL_TYPE_MASK))
#define SetPacketLogHeaderDescCallDuration(D, T)    ((D)->header |= (((T) << CALL_DURATION_SHIFT) & CALL_DURATION_MASK))
#define SetPacketLogHeaderDescCallTime(D, T)        ((D)->callTime = (T))
#define SetPacketLogHeaderDescLogSize(D, S)			((D)->logSize = (S))
#define SetPacketLogHeaderDescNumber(D, N)			{ if ((N)) strncpy((D)->number, (N), CALL_NUMBER_BYTE_SIZE - 1); }

#define GetPacketLogHeaderDescVersion(D)			(((D)->header & VERSION_MASK) >> VERSION_SHIFT)
#define GetPacketLogHeaderDescCookie(D)				(((D)->header & COOKIE_MASK) >> COOKIE_SHIFT)
#define GetPacketLogHeaderDescCallType(D)			(((D)->header & CALL_TYPE_MASK) >> CALL_TYPE_SHIFT)
#define GetPacketLogHeaderDescCallDuration(D)		(((D)->header & CALL_DURATION_MASK) >> CALL_DURATION_SHIFT)
#define GetPacketLogHeaderDescCallTime(D)			((D)->callTime)
#define GetPacketLogHeaderDescLogSize(D)			((D)->logSize)
#define GetPacketLogHeaderDescNumber(D)				((D)->number)

#define PACKET_LOG_HEADER_DESC_SIZE					(12 + PACKET_LOGGER_MAX_NUMBER_LENGTH)
typedef struct PACKET_LOG_HEADER_DESC {
	uint32_t header;
	uint32_t callTime;
	uint32_t logSize;
	char number[PACKET_LOGGER_MAX_NUMBER_LENGTH];
} PACKET_LOG_HEADER_DESC;


#define PACKET_DESC_TYPE_BIT_SIZE					2
#define PACKET_DESC_TYPE_SHIFT						(16 - PACKET_DESC_TYPE_BIT_SIZE)
#define PACKET_DESC_TYPE_MASK						0xC000

#define PACKET_DESC_LAST_PACKET_BIT_SIZE			1
#define PACKET_DESC_LAST_PACKET_SHIFT				(16 - PACKET_DESC_TYPE_BIT_SIZE - PACKET_DESC_LAST_PACKET_BIT_SIZE)
#define PACKET_DESC_LAST_PACKET_MASK				0x2000

#define SetPacketLogPacketDescType(D, T)			((D)->header |= (((T) << PACKET_DESC_TYPE_SHIFT) & PACKET_DESC_TYPE_MASK))
#define SetPacketLogPacketDescLastPacket(D, L)		{ if ((L) != 0) (D)->header |= PACKET_DESC_LAST_PACKET_MASK; else (D)->header &= ~PACKET_DESC_LAST_PACKET_MASK; }

#define GetPacketLogPacketDescType(D)				(((D)->header & PACKET_DESC_TYPE_MASK) >> PACKET_DESC_TYPE_SHIFT)
#define GetPacketLogPacketDescLastPacket(D)			(((D)->header & PACKET_DESC_LAST_PACKET_MASK) >> PACKET_DESC_LAST_PACKET_SHIFT)


#define RTP_PAYLOAD_LENGTH_BIT_SIZE					13
#define RTP_PAYLOAD_LENGTH_SHIFT					0
#define RTP_PAYLOAD_LENGTH_MASK						0x1FFF

#define SetPacketLogInputPacketLength(D, L)			((D)->header |= (((L) << RTP_PAYLOAD_LENGTH_SHIFT) & RTP_PAYLOAD_LENGTH_MASK))
#define GetPacketLogInputPacketLength(D)			(((D)->header & RTP_PAYLOAD_LENGTH_MASK) >> RTP_PAYLOAD_LENGTH_SHIFT)

/*
 * This structure is used for the first packet in a sequence, or when
 * a packet differs from the previous packet by a non-normal or unexpected
 * amount. For example, the SSRC changes, or the sequence number or timestamp
 * are far off from what is expected, or the source IP address of a packet
 * suddenly changes.
 */
#define SetPacketLogInputFullPacketRTPHeader(D, H)	((D)->rtpHeader = (H))
#define SetPacketLogInputFullPacketCaptureDelta(D, T)		((D)->captureTimeDelta = (T))
#define SetPacketLogInputFullPacketSeq(D, S)		((D)->rtpSeq = (S))
#define SetPacketLogInputFullPacketTimestamp(D, T)	((D)->rtpTimestamp = (T))
#define SetPacketLogInputFullPacketSSRC(D, S)		((D)->rtpSSRC = (S))
#define SetPacketLogInputFullPacketSrcIP(D, I)		((D)->srcIP = (I))
#define SetPacketLogInputFullPacketSrcPort(D, P)	((D)->srcPort = (P))

#define GetPacketLogInputFullPacketRTPHeader(D)		((D)->rtpHeader)
#define GetPacketLogInputFullPacketCaptureDelta(D)	((D)->captureTimeDelta)
#define GetPacketLogInputFullPacketSeq(D)			((D)->rtpSeq)
#define GetPacketLogInputFullPacketTimestamp(D)		((D)->rtpTimestamp)
#define GetPacketLogInputFullPacketSSRC(D)			((D)->rtpSSRC)
#define GetPacketLogInputFullPacketSrcIP(D)			((D)->srcIP)
#define GetPacketLogInputFullPacketSrcPort(D)		((D)->srcPort)

#define FULL_INPUT_PACKET_DESC_SIZE		22
typedef struct FULL_PACKET_DESC {
	uint16_t header;
	uint16_t rtpHeader;
	uint16_t captureTimeDelta;
	uint16_t rtpSeq;
	uint32_t rtpTimestamp;
	uint32_t rtpSSRC;
	uint32_t srcIP;
	uint16_t srcPort;
} FULL_INPUT_PACKET_DESC;


/*
 * This structure is used when a packet differs from the previous
 * packet by a normal expected amount. For example, the RTP sequence
 * number and timestamp are within a small/expected amount of variation,
 * and the SSRC and source IP address are unchanged.
 */
#define RTP_SEQUENCE_DELTA_BIT_SIZE						3
#define RTP_SEQUENCE_DELTA_SHIFT						(16 - RTP_SEQUENCE_DELTA_BIT_SIZE)
#define RTP_SEQUENCE_DELTA_MASK							0xE000

#define RTP_TIMESTAMP_DELTA_BIT_SIZE					13
#define RTP_TIMESTAMP_DELTA_SHIFT						(16 - RTP_SEQUENCE_DELTA_BIT_SIZE - RTP_TIMESTAMP_DELTA_BIT_SIZE)
#define RTP_TIMESTAMP_DELTA_MASK						0x1FFF

#define SetPacketLogInputSeqPacketSequenceDelta(D, S)	((D)->rtpDeltas |= (((S) << RTP_SEQUENCE_DELTA_SHIFT) & RTP_SEQUENCE_DELTA_MASK))
#define SetPacketLogInputSeqPacketTimestampDelta(D, T)	((D)->rtpDeltas |= (((T) << RTP_TIMESTAMP_DELTA_SHIFT) & RTP_TIMESTAMP_DELTA_MASK))
#define SetPacketLogInputSeqPacketCaptureDelta(D, T)	((D)->captureTimeDelta = (T))

#define GetPacketLogInputSeqPacketSequenceDelta(D)		(((D)->rtpDeltas & RTP_SEQUENCE_DELTA_MASK) >> RTP_SEQUENCE_DELTA_SHIFT)
#define GetPacketLogInputSeqPacketTimestampDelta(D)		(((D)->rtpDeltas & RTP_TIMESTAMP_DELTA_MASK) >> RTP_TIMESTAMP_DELTA_SHIFT)
#define GetPacketLogInputSeqPacketCaptureDelta(D)		((D)->captureTimeDelta)

#define SEQUENTIAL_INPUT_PACKET_DESC_SIZE		5
typedef struct SEQUENTIAL_PACKET_DESC {
	uint16_t header;
	uint16_t rtpDeltas;
	uint8_t  captureTimeDelta;
} SEQUENTIAL_INPUT_PACKET_DESC;


/* 
 * This structure is used when a played packet sequence number differs
 * from the previous played packet by more than RTP_SEQUENCE_DELTA_BIT_SIZE bits
 */
#define PLAYED_PACKET_DISCARDED_BIT_SIZE				1
#define PLAYED_PACKET_DISCARDED_SHIFT					(16 - PACKET_DESC_TYPE_BIT_SIZE - PACKET_DESC_LAST_PACKET_BIT_SIZE - PLAYED_PACKET_DISCARDED_BIT_SIZE)
#define PLAYED_PACKET_DISCARDED_MASK					0x1000

#define SetPacketLogFullPlayedPacketDiscarded(D, Y)		((D)->header |= PLAYED_PACKET_DISCARDED_MASK)
#define SetPacketLogFullPlayedPacketSeq(D, S)			((D)->rtpSeq = (S))
#define SetPacketLogFullPlayedPacketPlayoutDelta(D, T)	((D)->playoutTimeDelta = (T))

#define GetPacketLogFullPlayedPacketDiscarded(D)		(((D)->header & PLAYED_PACKET_DISCARDED_MASK) >> PLAYED_PACKET_DISCARDED_SHIFT)
#define GetPacketLogFullPlayedPacketSeq(D)				((D)->rtpSeq)
#define GetPacketLogFullPlayedPacketPlayoutDelta(D)		((D)->playoutTimeDelta)

#define FULL_PLAYOUT_PACKET_DESC_SIZE					6
typedef struct FULL_PLAYOUT_DESC {
	uint16_t header;
	uint16_t rtpSeq;
	uint16_t playoutTimeDelta;
} FULL_PLAYOUT_PACKET_DESC;


/* 
 * This structure is used when a played packet sequence number differs
 * from the previous played packet by more than the SEQUENTIAL_SEQUENCE_OFFSET_LIMIT
 */
#define PLAYED_PACKET_SEQUENCE_DELTA_BIT_SIZE			3
#define PLAYED_PACKET_SEQUENCE_DELTA_SHIFT				(16 - PACKET_DESC_TYPE_BIT_SIZE - PACKET_DESC_LAST_PACKET_BIT_SIZE - PLAYED_PACKET_DISCARDED_BIT_SIZE - PLAYED_PACKET_SEQUENCE_DELTA_BIT_SIZE)
#define PLAYED_PACKET_SEQUENCE_DELTA_MASK				0x0FFF

#define SetPacketLogSeqPlayedPacketDiscarded(D, Y)		((D)->header |= (((Y) << PLAYED_PACKET_DISCARDED_SHIFT) & PLAYED_PACKET_DISCARDED_MASK))
#define SetPacketLogSeqPlayedPacketSequenceDelta(D, S)	((D)->header |= (((S) << PLAYED_PACKET_SEQUENCE_DELTA_SHIFT) & PLAYED_PACKET_SEQUENCE_DELTA_MASK))
#define SetPacketLogSeqPlayedPacketPlayoutDelta(D, T)	((D)->playoutTimeDelta = (T))

#define GetPacketLogSeqPlayedPacketDiscarded(D)			(((D)->header & PLAYED_PACKET_DISCARDED_MASK) >> PLAYED_PACKET_DISCARDED_SHIFT)
#define GetPacketLogSeqPlayedPacketSequenceDelta(D)		(((D)->header & PLAYED_PACKET_SEQUENCE_DELTA_MASK) >> PLAYED_PACKET_SEQUENCE_DELTA_SHIFT)
#define GetPacketLogSeqPlayedPacketPlayoutDelta(D)		((D)->playoutTimeDelta)

#define SEQUENTIAL_PLAYOUT_PACKET_DESC_SIZE				3
typedef struct SEQUENTIAL_PLAYOUT_DESC {
	uint16_t header;
	uint8_t playoutTimeDelta;
} SEQUENTIAL_PLAYOUT_PACKET_DESC;


/*
 * Packet logger structure
 */
typedef struct PACKET_LOGGER {
	OCTET *poPacketLogBuffer;
	int nPacketLogBufferOffset;
	DWORD dwBufferSize;
	
	DWORD dwRunningTimeOffset;
	
	// Input/capture
	WORD wRunningInputSeqNumber;
	DWORD dwRunningInputTimestamp;
	FULL_INPUT_PACKET_DESC* pxLastFullInputPacketDesc;
	SEQUENTIAL_INPUT_PACKET_DESC *pxLastSeqInputPacketDesc;
	
	// Playout
	FULL_PLAYOUT_PACKET_DESC *pxLastFullPlayoutPacketDesc;
	SEQUENTIAL_PLAYOUT_PACKET_DESC *pxLastSeqPlayoutPacketDesc;
	WORD wRunningPlayoutSeqNumber;
	
} PACKET_LOGGER;


/*
 * PacketLogBufferCreate()
 *		Create a packet log buffer
 * Inputs
 *		int nBufferSize			Size of the buffer log
 * Outputs
 *		none
 * Returns
 *		PACKET_LOGGER *			Pointer to the packet log structure
 */
PACKET_LOGGER* PacketLogBufferCreate(int nBufferSize);


/*
 * PacketLogBufferDelete()
 *		Destroy a packet log buffer and free up its resources
 * Inputs
 *		PACKET_LOGGER *pxLogger		Handle on the packet logger
 * Outputs
 *		none
 * Returns
 *		DWORD						0 for success, or non-zero for error (see Protocol.h)
 */
LONG PacketLogBufferDelete(PACKET_LOGGER* pxLogger);


/*
 * PacketLogBufferSetHeader()
 *		Configure the packet log buffer header
 * Inputs
 *		PACKET_LOGGER *pxLogger		Handle on the packet logger
 *		DWORD dwCallStartTime		Call start time (in system seconds)
 *      DWORD dwCallDuration		Call duration (in seconds)
 *      char *pchNumber				Called or caller number
 *      int nCallType               Inbound, Outbound etc...
 * Outputs
 *		none
 * Returns
 *		DWORD						0 for success, or non-zero for error (see Protocol.h)
 */
LONG PacketLogBufferSetHeader(PACKET_LOGGER* pxLogger, DWORD dwCallStartTime, DWORD dwCallDuration, char *pchNumber, int nCallType);


/*
 * PacketLogBufferGetLogSize()
 *		Get the current size of the packet log
 * Inputs
 *		PACKET_LOGGER *pxLogger		Handle on the packet logger
 * Outputs
 *		none
 * Returns
 *		DWORD						Size of the log
 */
DWORD PacketLogBufferGetLogSize(PACKET_LOGGER* pxLogger);


/*
 * PacketLogBufferLogInputPacket()
 *		Add an input (received) RTP packet to the log
 * Inputs
 *		PACKET_LOGGER *pxLogger		Handle on the packet logger
 *		PACKET_LOGGER_INPUT_PACKET *pxPacket	Received packet meta-data
 * Outputs
 *		none
 * Returns
 *		DWORD						0 for success, or non-zero for error (see Protocol.h)
 */
LONG PacketLogBufferLogInputPacket(PACKET_LOGGER* pxLogger, PACKET_LOGGER_INPUT_PACKET *pxPacket);


/*
 * PacketLogBufferLogPlayedPacket()
 *		Add a played/discarded RTP packet to the log
 * Inputs
 *		PACKET_LOGGER *pxLogger		Handle on the packet logger
 *		PACKET_LOGGER_PLAYED_PACKET *pxPacket	Played/discarded packet meta-data
 * Outputs
 *		none
 * Returns
 *		DWORD						0 for success, or non-zero for error (see Protocol.h)
 */
LONG PacketLogBufferLogPlayedPacket(PACKET_LOGGER* pxLogger, PACKET_LOGGER_PLAYED_PACKET *pxPacket);


/*
 * PacketLogBufferCopy()
 *		Copy the contents of the packet log buffer to the provided memory location
 * Inputs
 *      void *pvDst					Pointer to destination memory
 *		PACKET_LOGGER *pxLogger		Handle on the packet logger
 * Outputs
 *		none
 * Returns
 *		DWORD						0 for success, or non-zero for error (see Protocol.h)
 */
LONG PacketLogBufferCopy(void *pvDst, PACKET_LOGGER* pxLogger);


void PacketLogBufferPrint(OCTET* poLogBuffer);



#endif /* __PACKET_LOGGER_H__ */


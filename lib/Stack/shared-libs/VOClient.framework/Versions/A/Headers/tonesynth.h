/*
** File: 	tonesynth.h	
** Contents:	interface to the Tone Synthesizer library
** Usage:	Included as necessary
** Description: 
** Revisions:
**
** 	31-Oct-98	Doug		Initial.
**
** Copyright 2000 Netergy Networks, Inc.
** All rights reserved 
*/

#ifndef __TONESYNTH_H__
#define __TONESYNTH_H__


/*
Includes
*/
#include "NNstyle.h"

/*
Handles to tone synthesizer session
*/
typedef struct TONES_SESSION	TONES_SESSION;
typedef	TONES_SESSION*		TONES_HSESSION;

/*
Enums
*/
typedef enum {
  TONE_OFF,
  TONE_ON,
  TONE_IDLE,
  TONE_REPEAT,
  TONE_END,
  TONE_STATE_MAX
} TONE_STATE;

typedef enum {
  TONE_DTMF_0,
  TONE_DTMF_1,
  TONE_DTMF_2,
  TONE_DTMF_3,
  TONE_DTMF_4,
  TONE_DTMF_5,
  TONE_DTMF_6,
  TONE_DTMF_7,
  TONE_DTMF_8,
  TONE_DTMF_9,
  TONE_DTMF_STAR,
  TONE_DTMF_POUND,
  TONE_DTMF_A,
  TONE_DTMF_B,
  TONE_DTMF_C,
  TONE_DTMF_D,
  TONE_DTMF_MAX,
  TONE_DTMF_CID_0,
  TONE_DTMF_CID_1,
  TONE_DTMF_CID_2,
  TONE_DTMF_CID_3,
  TONE_DTMF_CID_4,
  TONE_DTMF_CID_5,
  TONE_DTMF_CID_6,
  TONE_DTMF_CID_7,
  TONE_DTMF_CID_8,
  TONE_DTMF_CID_9,
  TONE_DTMF_CID_STAR,
  TONE_DTMF_CID_POUND,
  TONE_DTMF_CID_A,
  TONE_DTMF_CID_B,
  TONE_DTMF_CID_C,
  TONE_DTMF_CID_D,
  TONE_DTMF_CID_MAX,
  TONE_DIALTONE,
  TONE_RINGBACK,
  TONE_CALLWAITING,
  TONE_BUSY,
  TONE_NETWORKBUSY,
  TONE_CONFIRM,
  TONE_STUTTER_DIAL,
  TONE_RECEIVER_OFF_HOOK,
  TONE_CAS,
  TONE_SAS,
  TONE_CALLWAITING_TYPE2,
  TONE_CALLWAITING_TYPE3,
  TONE_CALLWAITING_TYPE4,
  TONE_MESSAGE_WAITING_INDICATOR,
  TONE_RINGTONE,
  TONE_DTMF_CONT_0,
  TONE_DTMF_CONT_1,
  TONE_DTMF_CONT_2,
  TONE_DTMF_CONT_3,
  TONE_DTMF_CONT_4,
  TONE_DTMF_CONT_5,
  TONE_DTMF_CONT_6,
  TONE_DTMF_CONT_7,
  TONE_DTMF_CONT_8,
  TONE_DTMF_CONT_9,
  TONE_DTMF_CONT_STAR,
  TONE_DTMF_CONT_POUND,
  TONE_CUSTOM_1,
  TONE_CUSTOM_2,
  TONE_CUSTOM_3,
  TONE_CUSTOM_4,
  TONE_CUSTOM_5,
  TONE_CUSTOM_6,
  TONE_CUSTOM_7,
  TONE_CUSTOM_8,
  TONE_CUSTOM_9,
  TONE_CUSTOM_10,
  TONE_CUSTOM_11,
  TONE_CUSTOM_12,
  TONE_CUSTOM_13,
  TONE_CUSTOM_14,
  TONE_CUSTOM_15,
  TONE_CUSTOM_16,
  TONE_CUSTOM_17,
  TONE_CUSTOM_18,
  TONE_CUSTOM_19,
  TONE_CUSTOM_20,
  TONE_MAX_CUSTOM_TYPE,
  TONE_MAX_TYPE
} TONE_TYPE;

#define	TONE_REORDER		TONE_NETWORKBUSY	/* same freqs. and cadence */
#define	TONE_CALLWAITING_TYPE1	TONE_CALLWAITING


/*
Typedefs
*/
typedef struct {
  TONE_STATE	eToneState;
  LONG		lDuration;	/* in terms of number of samples at 8 KHz sampling rate */
} TONE_STATES_AND_DURATIONS;

typedef struct {
  SHORT	nFreq;	/* in Hz */
  SHORT	nLevel;	/* in dBm */
} TONE_FREQS_AND_LEVELS;



/*
Function Protos
*/
TONES_HSESSION TonesInitialize(void);
void TonesTerminate(TONES_HSESSION hTones);
LONG TonesRegisterTone(TONES_HSESSION hTones, TONE_TYPE eTone);
void TonesTerminateActive(TONES_HSESSION hTones);
void TonesTerminateTone(TONES_HSESSION hTones, TONE_TYPE eTone);
void TonesTerminateAll(TONES_HSESSION hTones);
LONG TonesActiveTone(TONES_HSESSION hTones);
LONG TonesProcess(TONES_HSESSION hTones, SHORT* pnDest, DWORD dwLen);
LONG TonesConfigureTone(TONE_TYPE eTone,
			DWORD dwNumFreqs,
			TONE_FREQS_AND_LEVELS* pFreqsAndLevels,
			DWORD dwNumStates,
			TONE_STATES_AND_DURATIONS* pStatesAndDurations);
LONG TonesConfigureToneReduceBellcoreCWCIDLevel(void);
void TonesResetTone(TONE_TYPE eTone);

/*
Return values
*/
typedef enum {
  TONES_REGISTER_TONE_NOERR,		/* registration successful */
  TONES_REGISTER_TONE_INVALID_SESSION,  /* invalid tone session */
  TONES_REGISTER_TONE_BAD_TONE_TYPE, 	/* unsupported tone type */
  TONES_REGISTER_TONE_NOMEM		/* out of memory */
} TONES_REGISTER_TONE_RETURN_VALS;

typedef enum {
  TONES_PROCESS_NORMAL_OUTPUT =  0,	/* the active tone was synthesized
					   and output buffer filled */
  TONES_PROCESS_NO_TONES =	-1,	/* no tone to process */
} TONES_PROCESS_RETURN_VALS;

typedef enum {
  TONES_CONFIGURE_TONE_NOERR,		/* configuration successful */
  TONES_CONFIGURE_TONE_BAD_TONE_TYPE, 	/* unsupported tone type */
  TONES_CONFIGURE_TONE_NOMEM		/* out of memory */
} TONES_CONFIGURE_TONE_RETURN_VALS;


#endif /* __TONESYNTH_H__ */

/********************************************************************
 *
 * File:	dbg.h
 *
 * Description:
 *	debug macros, see sdev/src/misc/doc/dbg.api for details
 *
 *
 * Revisions:
 * 	01-Feb-99	J.Kleck		initial version
 *	10-feb-99	J.Kleck		change dbg_*PauseGo to a count
 *	27-apr-99	J.Kleck		std __DBG_H__, add comments
 *	13-May-99	J.Kleck		move DEBUG() macro from NNstyle.h
 *	13-May-99	J.Kleck		create dbg.c and move DBG_DEFS there
 *	01-Jun-99	J.Kleck		use under NDEBUG if NDEBUG_DBG defined
 *	11-jun-99	J.Kleck		add DBG_MARK
 *	23-jun-99	J.Kleck		move DEBUG() macro from NNstyle.h
 *	23-jul-99	J.Kleck		add ASSERT_EXTENSION
 *	30-jul-99	J.Kleck		add ASSERT_REPORT
 *	30-nov-99	J.Kleck		use ISO C 9x extensions for DBG_PRINTF()
 *	03-Mar-00	J.Kleck		add DBG_CHK_DWTAG
 *
 * Copyright 1999, 2000 8x8, Inc.  All rights reserved.
 * Copyright 2000 Netergy Networks, Inc.  All rights reserved.
 *
 ********************************************************************/
#ifndef __DBG_H__
#define __DBG_H__

#include "NNstyle.h"     

/********************************************************************
 *
 * enum name maps and DBG_MARK are available for DEBUG or NDEBUG
 *
 ********************************************************************/
     
     
/*
 * typdef defining an enum name map
 *
 * NOTE: use of this and the FILL_ENUM_NAME_MAP macro calls must be
 *	 surrounded by #ifndef NDEBUG
 */
typedef struct {
  char *szName;
  DWORD dwLen;
} ENUM_NAME_MAP;


     
/*
 * macro to fill in an enum name map
 *
 * NOTE: use of this and the ENUM_NAME_MAP declarations must be
 *	 surrounded by #ifndef NDEBUG
 */
#define FILL_ENUM_NAME_MAP(e, map) do {					\
	  map[e].szName = #e;						\
	  map[e].dwLen = strlen(#e);					\
	} while (0)



/*
 * Save the current line # in dbg_nMarkLine, this macro helps in
 * locating a piece of code in the .dmp file. Locating code in the
 * .dmp file is needed when chasing compiler or code trashing bugs 
 * to compare the C code with the resulting executable or to compare
 * the unassembled runtime code with the virgin executable. 
 *
 * Proceedure:
 * 1. place this macro near the suspect C code in the src
 * 2. do a make and edit the resulting .dmp file (in same directory
 *     as the executable
 * 3. search for dbg_nMarkLine in the symbol table and get its addr
 * 4. search for the ASM statement that references that addr
 * 5a. for compiler bugs, you are now in the region of the suspected
 *      problem so compare the C code with the resulting ASM
 * 5b. for code trashing, you are now in the region of the suspected
 *      code so unassemble the suspected code at runtime using the 
 *      VCPI "u" cmd and compare it with the ASM from the .dmp file.
 *
 * NOTE: This macro looses effectiveness if it is used more than 
 * a couple of times in an executable because it becomes harder to
 * match the DBG_MACRO invocation with the resulting dbg_nMarkLine
 * references in the .dmp file. Thus I recommend removing the invocation
 * as soon as you are done tracking down a particular problem.
 *
 * parms: none
 */
extern int dbg_nMarkLine;
#define DBG_MARK do {							\
	  dbg_nMarkLine = __LINE__;					\
	} while (0)



#ifdef LOG_ASSERTS
extern char *g_pcAssertFilename;
# define ASSERT_LOG(p) do {						         \
       if (!(p)) {                                       \
         FILE* clf = fopen(g_pcAssertFilename, "a");       \
         if (clf) {                                      \
           char log[300];                                \
           sprintf(log, "%s:%d\n", __FILE__, __LINE__);  \
           fwrite(log, 1, strlen(log), clf);             \
           fclose(clf);                                  \
         }                                               \
       }                                                 \
	} while (0)

#else
# define ASSERT_LOG(p)
#endif

/*
 * Various flavors of ASSERT
 */

#if defined(NDEBUG)

#  include <assert.h>

# if defined(NDEBUG_ASSERT_ALIGNEXC)
#   define ASSERT(p) assert(p)
# else
#   define ASSERT(p)
# endif
#else /* if defined(NDEBUG) */

#  include <assert.h>

#    if !defined(ASSERT_EXTENSION)
#      define ASSERT_EXTENSION(p)
#    endif

#    if !defined(ASSERT_REPORT)
#      define ASSERT_REPORT(p) do					\
	      {								\
		printf("ASSERT (" #p ") failed\n");			\
		printf("  at line %d in file %s\n", __LINE__, __FILE__);\
	      } while (0)
#    endif

#    if defined(ASSERT_CRASH_ISR)
#      include "vcpdefs.h"
#      define CRASH_ISR do {						\
	    register temp;						\
	    temp = PSW_DISABLE_IRQ;					\
	    asm volatile("movtos %0,psw" :  :"r" (temp) );		\
	    WAIT2;							\
	  } while (1)
#    else /* if defined(ASSERT_CRASH_ISR) */
#      define CRASH_ISR
#    endif /* if defined(ASSERT_CRASH_ISR) else */

#    define ASSERT(p) do						\
	      {								\
		if (!(p)) {						\
          ASSERT_LOG(p);                \
		  ASSERT_EXTENSION(p);					\
		  CRASH_ISR;						\
		  assert(p);						\
		}							\
	      } while (0)

#endif /* if defined(NDEBUG) else */




#if defined(NDEBUG) && !defined(NDEBUG_DBG)

/*
 * no DBG
 */
#define DBG_CHKPT
#define DBG_PAUSE
#define DEBUG(x)
#define DEBUG_VAR(x)
#define DBG_CHK_DWTAG(t, dwt)


/*
 * use the ISO C 9x extensions allowing variable # parms for macros
 * (if the compiler does not support these extensions then all
 * DBG_(F)PRINTF() calls must be changed to DBG(F)PRINTFn() 
 * and the section below which defines them restored)
 *
 * Note: NO_MACRO_VARARG allows applications to still use the vararg
 *       versions as long as the functions dbg_{printf,fprintf} are
 *       implemented.
 */
#ifndef NO_MACRO_VARARG
# ifdef _WIN32
#  define DBG_PRINTF(fmt, ...)
#  define DBG_FPRINTF(fp, fmt, ...)
# else
#  define DBG_PRINTF(fmt, args...)
#  define DBG_FPRINTF(fp, fmt, args...)
# endif
#else
#define DBG_PRINTF dbg_printf
#define DBG_FPRINTF dbg_fprintf
#endif

/* NOTE: if the fmt string has comma in it, then the string MUST	*/
/*   be enclosed in parens, e.g. DBG_PRINTF(("look, %d dogs!"), nDogs);	*/
#if 0
#define DBG_PRINTF(fmt)
#define DBG_FPRINTF(fp, fmt)
#endif
#define DBG_PRINTF1(fmt, a1)
#define DBG_FPRINTF1(fp, fmt, a1)
#define DBG_PRINTF2(fmt, a1, a2)
#define DBG_FPRINTF2(fp, fmt, a1, a2)
#define DBG_PRINTF3(fmt, a1, a2, a3)
#define DBG_FPRINTF3(fp, fmt, a1, a2, a3)
#define DBG_PRINTF4(fmt, a1, a2, a3, a4)
#define DBG_FPRINTF4(fp, fmt, a1, a2, a3, a4)




#else /* if defined(NDEBUG) && !defined(NDEBUG_DBG) */


/*
 * DBG enabled
 */
#include <string.h>
#include <stdarg.h>

/********************************************************************
 *
 * Includes
 *
 ********************************************************************/

#include "NNstyle.h"
#include <stdio.h>

#define HOST_TASK() 

/********************************************************************
 *
 * Constants
 *
 ********************************************************************/

/* none */


/********************************************************************
 *
 * Macros
 *
 ********************************************************************/

#define DEBUG(x) do {x;} while (0)
#define DEBUG_VAR(x) x
 

#define DBG_CHKPT do {							\
	  dbg_nChkPtLine = __LINE__;					\
	  dbg_pChkPtFile = __FILE__;					\
	} while (0)


#define DBG_PAUSE do {							\
	  dbg_nPauseLine = __LINE__;					\
	  dbg_pPauseFile = __FILE__;					\
	  if (dbg_bPausePrint)						\
	    printf("DBG_PAUSE: line %d in %s\n",			\
		   dbg_nPauseLine, dbg_pPauseFile);			\
	  if (dbg_bPauseHold) {						\
	    dbg_bPausing = TRUE;					\
	    while (0 == dbg_nPauseGo) HOST_TASK();			\
	  }								\
	  dbg_bPausing = FALSE;						\
	  if (dbg_nPauseGo > 0) dbg_nPauseGo--;				\
	} while (0)

/*
 * use the ISO C 9x extensions allowing variable # parms for macros
 * (if the compiler does not support these extensions then all
 * DBG_(F)PRINTF() calls must be changed to DBG(F)PRINTFn() 
 * and the section below which defines them restored)
 *
 * Note: NO_MACRO_VARARG allows applications to still use the vararg
 *       versions as long as the functions dbg_{printf,fprintf} are
 *       implemented.
 */
#ifndef NO_MACRO_VARARG

#ifdef _WIN32
# define DBG_PRINTF(fmt, ...) printf(fmt, __VA_ARGS__)
# define DBG_FPRINTF(fp, fmt, ...) fprintf(fp, fmt, __VA_ARGS__)
#else
# define DBG_PRINTF(fmt, args...) printf(fmt, ## args)
# define DBG_FPRINTF(fp, fmt, args...) fprintf(fp, fmt, ## args)
#endif

#else
#define DBG_PRINTF dbg_printf
#define DBG_FPRINTF dbg_fprintf
#endif


/* NOTE: if the fmt string has comma in it, then the string MUST	*/
/*   be enclosed in parens, e.g. DBG_PRINTF(("look, %d dogs!"), nDogs);	*/
#if 0
#define DBG_PRINTF(fmt) printf(fmt)
#define DBG_FPRINTF(fp, fmt) fprintf(fp, fmt)
#endif
#define DBG_PRINTF1(fmt, a1) printf(fmt, a1)
#define DBG_FPRINTF1(fp, fmt, a1) fprintf(fp, fmt, a1)
#define DBG_PRINTF2(fmt, a1, a2) printf(fmt, a1, a2)
#define DBG_FPRINTF2(fp, fmt, a1, a2) fprintf(fp, fmt, a1, a2)
#define DBG_PRINTF3(fmt, a1, a2, a3) printf(fmt, a1, a2, a3)
#define DBG_FPRINTF3(fp, fmt, a1, a2, a3) fprintf(fp, fmt, a1, a2, a3)
#define DBG_PRINTF4(fmt, a1, a2, a3, a4) printf(fmt, a1, a2, a3, a4)
#define DBG_FPRINTF4(fp, fmt, a1, a2, a3, a4) fprintf(fp, fmt, a1, a2, a3, a4)


/*
 * check a DWORD tag without dereferencing the tag field as a DWORD,
 * this way if the tag field is NOT DWORD aligned we will
 * hit an assert (assuming the struct pointer is bad, thus
 * the tag data will be wrong as well as misaligned) rather
 * than crashing.
 */
#define DBG_CHK_DWTAG(t, dwt) do {					\
	  OCTET *poTag;							\
	  DWORD dwEndianTest = 1;					\
	  poTag = (OCTET *) &(dwEndianTest);				\
	  if (1 == *poTag) {						\
	    poTag = (OCTET *) &(dwt);					\
	    ASSERT((((t) >>  0) & 0xFF) == *(poTag + 0));		\
	    ASSERT((((t) >>  8) & 0xFF) == *(poTag + 1));		\
	    ASSERT((((t) >> 16) & 0xFF) == *(poTag + 2));		\
	    ASSERT((((t) >> 24) & 0xFF) == *(poTag + 3));		\
	  } else {							\
	    ASSERT(1 == *(poTag + 3));					\
	    poTag = (OCTET *) &(dwt);					\
	    ASSERT((((t) >>  0) & 0xFF) == *(poTag + 3));		\
	    ASSERT((((t) >>  8) & 0xFF) == *(poTag + 2));		\
	    ASSERT((((t) >> 16) & 0xFF) == *(poTag + 1));		\
	    ASSERT((((t) >> 24) & 0xFF) == *(poTag + 0));		\
	  }								\
	} while (0) 



/********************************************************************
 *
 * Global Variables
 *
 ********************************************************************/

extern int   dbg_nChkPtLine;
extern char  *dbg_pChkPtFile;
extern int   dbg_nPauseLine;
extern char  *dbg_pPauseFile;
extern int   dbg_bPausePrint;
extern int   dbg_bPauseHold;
extern volatile int   dbg_nPauseGo;
extern int   dbg_bPausing;



/********************************************************************
 *
 * Functional API
 *
 ********************************************************************/

/* none */



#endif /* ifdef NDEBUG else */


#endif	/* __DBG_H__ */




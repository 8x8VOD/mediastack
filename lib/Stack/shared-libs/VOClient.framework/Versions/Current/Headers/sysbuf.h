/********************************************************************
 *
 * File:        SysBuf.h
 *
 * Description:
 *      API for the audio buffer library
 *
 * Revisions:
 * 
 *	Dec-2000     J.Huang Rewritten
 *
 * Copyright 2000 Netergy Networks, Inc.  All rights reserved.
 *
 ********************************************************************/

#ifndef __SYSBUF_H__
#define __SYSBUF_H__

/* define the following to detect outdated packets
   (also see SYSBUF_GARBAGECOLLECTING_TIMEOUT_SEC definition)
#define SYSBUF_GARBAGECOLLECTING_CHECK
#define SYSBUF_WITHFILEANDLINE
*/

/* Error number definition */
extern DWORD dwSysBufErr;

#define SYSBUF_ERR_BLK_USED  1
#define SYSBUF_ERR_NO_BLK    2
#define SYSBUF_ERR_OOB_SIZE  3
#define SYSBUF_ERR_BUF_SIZE  4

typedef struct SYS_BUFFER* H_SYS_BUFFER;
typedef struct SYS_BLK*    H_SYS_BLK;

typedef struct SYS_BLK {
  struct SYS_BLK *pNext;   
  H_SYS_BUFFER hSysBuf;
  void *pBase;
  WORD wLen;
  WORD wUsedLen;

#ifdef SYSBUF_GARBAGECOLLECTING_CHECK
  struct timespec tsLastAccess;
#ifdef SYSBUF_WITHFILEANDLINE
#define SYSBUF_MAXFILELENGTH 256
  LONG lLine;
  char acFile[SYSBUF_MAXFILELENGTH];
#endif
#endif


#ifdef VALIDITY_CHECK
  WORD wFlag;
  DWORD dwMagicCookie;
#endif
} SYS_BLK;

/* Init */
H_SYS_BUFFER SysBufInit(DWORD dwBufSize, DWORD dwBlkNum, DWORD dwOOBSize);
void SysBufTerm(H_SYS_BUFFER hSysBuf);
H_SYS_BUFFER SysBufReinit(H_SYS_BUFFER pSysBuf,
			  DWORD dwBufSize,
			  DWORD dwBlkNum,
			  DWORD dwOOBSize);

/* Physical Read/Write */
#ifdef SYSBUF_WITHFILEANDLINE
LONG SysBufReadWithFileAndLine(H_SYS_BUFFER hSysBuf, 
                               void *pData, DWORD dwDataSize,
                               void *pOOB, DWORD dwOOBSize, 
                               char *pcFile, int lLine);
#define SysBufRead(hSysBuf, pData, dwDataSize, pOOB, dwOOBSize)         \
  SysBufReadWithFileAndLine((hSysBuf), (pData), (dwDataSize),           \
                            (pOOB), (dwOOBSize),                        \
                            __FILE__,__LINE__)
LONG SysBufWriteWithFileAndLine(H_SYS_BUFFER hSysBuf, 
                                void *pData, DWORD dwDataSize,
                                void *pOOB, DWORD dwOOBSize,
                                char *pcFile, int lLine);
#define SysBufWrite(hSysBuf, pData, dwDataSize, pOOB, dwOOBSize)        \
  SysBufWriteWithFileAndLine((hSysBuf), (pData), (dwDataSize),          \
                             (pOOB), (dwOOBSize), __FILE__, __LINE__)

/* Virtual Read/Write */
H_SYS_BLK SysBufGetBlkWithFileAndLine(H_SYS_BUFFER pSysBuf, DWORD dwDataSize,
                                      char *pcFile, int lLine);
#define SysBufGetBlk(pSysBuf, dwDataSize)               \
  SysBufGetBlkWithFileAndLine((pSysBuf), (dwDataSize),  \
                              __FILE__, __LINE__)

LONG SysBufWriteBlkWithFileAndLine(H_SYS_BUFFER pSysBuf, H_SYS_BLK pBlk,
                                   char *pcFile, int lLine);
#define SysBufWriteBlk(pSysBuf, pBlk)           \
  SysBufWriteBlkWithFileAndLine((pSysBuf), (pBlk), __FILE__, __LINE__)

H_SYS_BLK SysBufReadBlkWithFileAndLine(H_SYS_BUFFER pSysBuf, char *pcFile,
                                       int lLine);
#define SysBufReadBlk(pSysBuf) \
  SysBufReadBlkWithFileAndLine((pSysBuf), __FILE__, __LINE__)

/* Data Block pointer maintainence */
#ifdef SYSBUF_GARBAGECOLLECTING_CHECK
#define SysBlkResetWithFileAndLine(pBlk, pcFile, iLine) do {  \
    (pBlk)->wUsedLen = 0;                                     \
    strncpy((pBlk)->acFile, pcFile, SYSBUF_MAXFILELENGTH);    \
    pBlk->lLine = (LONG)iLine;                                \
    clock_gettime(CLOCK_REALTIME, &(pBlk->tsLastAccess));     \
  } while (0)
#define SysBlkReset(pBlk) SysBlkResetWithFileAndLine((pBlk), __FILE__, __LINE__)
#define SysBlkUpdPtrWithFileAndLine(pBlk, L, pcFile, iLine) do { \
    (pBlk)->wUsedLen += (L);                                     \
    ASSERT((pBlk)->wUsedLen <= (pBlk)->wLen);                    \
    (pBlk)->lLine = (iLine);                                     \
    strncpy((pBlk)->acFile, (pcFile), SYSBUF_MAXFILELENGTH);     \
    clock_gettime(CLOCK_REALTIME, &((pBlk)->tsLastAccess));      \
  } while(0)
#define SysBlkUpdPtr(pBlk,L) SysBlkUpdPtrWithFileAndLine((pBlk), (L),   \
                                                         __FILE__, __LINE__)

#else
#define SysBlkReset(pBlk)	((pBlk)->wUsedLen = 0)
#define SysBlkUpdPtr(pBlk,L) do {		\
 (pBlk)->wUsedLen += L;				\
 ASSERT((pBlk)->wUsedLen <= (pBlk)->wLen);	\
} while(0)
#endif

#else /* #ifdef SYSBUF_WITHFILEANDLINE */

LONG SysBufRead(H_SYS_BUFFER hSysBuf, void *pData, DWORD dwDataSize,
		void *pOOB, DWORD dwOOBSize);
#define SysBufReadWithFileAndLine(hSysBuf, pData, dwDataSize,   \
                                  pOOB, dwOOBSize, file, line)  \
  SysBufRead((hSysBuf), (pData), (dwDataSize),                  \
             (pOOB), (dwOOBSize))

LONG SysBufWrite(H_SYS_BUFFER hSysBuf, void *pData, DWORD dwDataSize,
		 void *pOOB, DWORD dwOOBSize);
#define SysBufWriteWithFileAndLine(hSysBuf, pData, dwDataSize,  \
                                   pOOB, dwOOBSize, file, line) \
  SysBufWrite((hSysBuf), (pData), (dwDataSize),                 \
              (pOOB), (dwOOBSize))

/* Virtual Read/Write */
H_SYS_BLK SysBufGetBlk(H_SYS_BUFFER pSysBuf, DWORD dwDataSize);
#define SysBufGetBlkWithFileAndLine(pSysBuf, dwDataSize, file, line)    \
  SysBufGetBlk((pSysBuf), (dwDataSize))

LONG SysBufWriteBlk(H_SYS_BUFFER pSysBuf, H_SYS_BLK pBlk);
#define SysBufWriteBlkWithFileAndLine(pSysBuf, pBlk, file, line)        \
  SysBufWriteBlk((pSysBuf), (pBlk))

H_SYS_BLK SysBufReadBlk(H_SYS_BUFFER pSysBuf);
#define SysBufReadBlkWithFileAndLine(pSysBuf, file, line)       \
  SysBufReadBlk(pSysBuf)

/* Data Block pointer maintainence */
#define SysBlkReset(pBlk)	((pBlk)->wUsedLen = 0)
#define SysBlkResetWithFileAndLine(pBlk, pcFile, lLine) \
  SysBlkReset((pBlk))

#define SysBlkUpdPtr(pBlk,L) do {		\
 (pBlk)->wUsedLen += L;				\
 ASSERT((pBlk)->wUsedLen <= (pBlk)->wLen);	\
} while(0)
#define SysBlkUpdPtrWithFileAndLine(pBlk,L, pcFile, lLine)      \
  SysBlkUpdPtr((pBlk),(L))

#endif /* #ifdef SYSBUF_WITHFILEANDLINE #else */


void SysBufFreeBlk(H_SYS_BLK pBlk);



#define SysBlkPtr(pBlk)		(((CHAR*)(pBlk)->pBase) + (pBlk)->wUsedLen)
#define SysBlkLen(pBlk)		((pBlk)->wLen)
#define SysBlkUsedLen(pBlk)	((pBlk)->wUsedLen)
#define SysBlkUnusedLen(pBlk)	((pBlk)->wLen - (pBlk)->wUsedLen)
#define SysBlkOOBPtr(BLK)	((CHAR*)(BLK) + sizeof(struct SYS_BLK))


/* Utilities */
void SysBufSetUserData(H_SYS_BUFFER hSysBuf, void* pvData);
void* SysBufQueryUserData(H_SYS_BUFFER hSysBuf);
DWORD SysBufQueryNumPackets(H_SYS_BUFFER hSysBuf);

#endif

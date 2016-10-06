/*****************************************************************************
 *
 * File: NNstyle.h
 *
 * Description:
 *      General defines and prototypes.
 *
 * Copyright 2000 Netergy Networks, Inc. All rights reserved.
 *
 *****************************************************************************/

#ifndef __NNSTYLE_H__
#define __NNSTYLE_H__

//#include <os.h>      /* allows for customization to each os */
#include <limits.h>

/* 
 * Constants
 */

#ifndef FALSE
#  define FALSE      0
#endif
#ifndef TRUE
#  define TRUE       1
#endif

#define TRI_TRUE     31
#define TRI_UNKNOWN  32
#define TRI_FALSE    33

#define OK           0
#define FAILURE      (-1)
#define CONTINUE     1

#define DONE         1
#define NOT_DONE     0

#ifndef NULL
#define	NULL        ((void *)0)
#endif

#define PTHREAD_RECURSIVE_MUTEX_INITIALIZER_NP    PTHREAD_MUTEX_INITIALIZER

/* 
 * Typedefs
 *
 * - integers
 *
 *                 8-bit   16-bit  32-bit  64-bit
 *      unsigned   OCTET   WORD    DWORD   QWORD
 *      signed     CHAR    SHORT   LONG    LLONG
 *
 * - misc (floats, enums, ...)
 */

#if (defined(OCTET) || defined(WORD) || defined(DWORD) || defined(QWORD) || \
     defined(CHAR) || defined(SHORT) || defined(LONG) || defined(LLONG))
#  error "Some integer types previously declared"
#endif

/* 8-bit integers */
#if (UCHAR_MAX == 0xFFU)
   typedef unsigned char OCTET;
   typedef char CHAR;
#else
#  error "Unsupported OCTET/CHAR size"
#endif

/* 16-bit integers */
#if (UINT_MAX == 0xFFFFU)
#  define SCANF_WORD "%u"
#  define SCANF_SHORT "%d"
   typedef unsigned int WORD;
   typedef int SHORT;
#elif (USHRT_MAX == 0xFFFFU)
#  define SCANF_WORD "%hu"
#  define SCANF_SHORT "%hd"
   typedef unsigned short WORD;
   typedef short SHORT;
#else
#  error "Unsupported WORD/SHORT size"
#endif

/* 32-bit integers */
#if (ULONG_MAX == 0xFFFFFFFFUL)
   typedef unsigned long DWORD;
   typedef long LONG;
#elif (UINT_MAX == 0xFFFFFFFFUL)
   typedef unsigned int DWORD;
   typedef int LONG;
#else
#  error "Unsupported DWORD/LONG size"
#endif

/* 64-bit integers */
#ifndef NCHECK_ULLONG
#if (ULLONG_MAX == 0xFFFFFFFFFFFFFFFFULL)
   typedef unsigned long long QWORD;
   typedef long long LLONG;
#else
/* don't complain if there is no long long */
#endif
#endif

/* convenience integer types */
typedef OCTET BYTE;

#ifdef _WIN32
typedef int INT;
#else
typedef SHORT INT;
#endif

#define SCANF_INT SCANF_SHORT
#if !defined(BOOL_DECLARED) && !defined(OBJC_BOOL_DEFINED)
	#ifdef _WIN32	
	typedef int BOOL;
	#else
	typedef OCTET BOOL;
	#endif
#endif

/* floating point */
typedef float FLOAT;
typedef double DOUBLE;

/* special pointer types */
typedef DWORD DRAM_P;
typedef DWORD SRAM_P;
typedef DWORD DM_P;
typedef DWORD DP_P;
typedef DWORD UCODE_P;
typedef DWORD VP_P;

/* others */
typedef enum {
  E_TRI_TRUE = TRI_TRUE,
  E_TRI_FALSE = TRI_FALSE,
  E_TRI_UNKNOWN = TRI_UNKNOWN
} E_TRI;

/* 
 * Syslog 
 */
#ifdef _WIN32
#  define __FILENAME__ (strrchr(__FILE__, '\\') ? strrchr(__FILE__, '\\') + 1 : __FILE__)
#else
#  define __FILENAME__ (strrchr(__FILE__, '/') ? strrchr(__FILE__, '/') + 1 : __FILE__)
#endif

#ifdef _NNOS /*LINUX_ENDPOINT*/
#define SYSLOG syslog
#else
#include "string.h"
#ifndef NDEBUG
	#ifdef _WIN32
	# define SYSLOG(pri, fmt, ...) printf(fmt, __VA_ARGS__)
	#else
	# define SYSLOG(pri, fmt, args...) printf(fmt, ## args)
	#endif
#else
	#ifdef _WIN32
	# define SYSLOG(pri, fmt, ...)
	#else
	# define SYSLOG(pri, fmt, args...)
	#endif
#endif
#endif
/*
 * Debugging
 */

#include "dbg.h"
#ifndef NDEBUG
#  include <stdio.h>
#endif


/* 
 * malloc warpper
 */
#if defined(MALLOC_WRAPPER) || defined(MALLOC_WRAPPER_DLL)
#  if !defined(NO_MALLOC_WRAPPER) && !defined(_NNOS)
#ifdef strdup
#undef strdup
#endif
#include "/usr/include/stdlib.h"
extern void *callocWithFileAndLine(char*,int,size_t, size_t);
extern void freeWithFileAndLine(char*,int,void *);
extern void *mallocWithFileAndLine(char*,int,size_t);
extern void *reallocWithFileAndLine(char*,int,void *, size_t);
extern char *strdupWithFileAndLine(char*,int,const char*);
extern unsigned long InterceptDumpMemory();
#define malloc(x) mallocWithFileAndLine(__FILE__,__LINE__,x)
#define calloc(y,x) callocWithFileAndLine(__FILE__,__LINE__,y,x)
#define realloc(p,x) reallocWithFileAndLine(__FILE__,__LINE__,p,x)
#define free(p) freeWithFileAndLine(__FILE__,__LINE__,p)
#define strdup(p) strdupWithFileAndLine(__FILE__,__LINE__,p)
#  endif
#endif

/*
 * socket wrapper
 */
#if defined(SOCKET_WITH_FILE_AND_LINE)
# if !defined(_NNOS) && !defined(NO_SOCKET_WRAPPER)
#include <unistd.h>
#include <sys/types.h>
#include <sys/socket.h>
extern int socketWithFileAndLine(int domain, int type, int protocol, 
				 char *chFILE, int iLINE);
extern int closeWithFileAndLine(int fd, char *chFILE, int iLINE);
extern int connectWithFileAndLine(int sockfd, struct sockaddr *serv_addr, 
				  socklen_t addrlen, char *chFILE, int iLINE);
extern int acceptWithFileAndLine(int sockfd, struct sockaddr *cli_addr, 
				 socklen_t *length, char *chFILE, int iLINE);
extern int bindWithFileAndLine(int sockfd, struct sockaddr *my_addr, 
			       socklen_t addrlen, char *chFILE, int iLINE);
extern int sendWithFileAndLine(int s, const void *msg, size_t len, int flags,
			       char *chFILE, int iLINE);
extern int  sendtoWithFileAndLine(int  s,  const  void  *msg,  size_t len, 
				  int flags, const struct sockaddr *to, 
				  socklen_t tolen, char *chFILE, int iLINE);
extern void PrintAllSocketInfo(void);
extern void SocketWrapperTerminate(void);
#define socket(domain,type,protocol)					\
  socketWithFileAndLine((domain),(type),(protocol),__FILE__, __LINE__)
#define close(fd)				\
  closeWithFileAndLine((fd),__FILE__,__LINE__)
#define connect(sockfd,serv_addr,addrlen)				\
  connectWithFileAndLine((sockfd),(serv_addr),(addrlen),__FILE__,__LINE__)
#define accept(sockfd,cli_addr,length)					\
  acceptWithFileAndLine((sockfd),(cli_addr),(length),__FILE__,__LINE__)
#define bind(sockfd,my_addr,addrlen)					\
  bindWithFileAndLine((sockfd),(my_addr),(addrlen),__FILE__,__LINE__)
#define send(s,msg,len,flags)					\
  sendWithFileAndLine((s),(msg),(len),(flags), __FILE__,__LINE__)
#define sendto(s,msg,len,flags,to,tolen)				\
  sendtoWithFileAndLine((s),(msg),(len),(flags),(to),(tolen),__FILE__,__LINE__)
# endif
#endif

#endif  /* __NNSTYLE_H__ */

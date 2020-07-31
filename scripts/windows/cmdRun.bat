:: Run Batch File
@echo off
@setlocal enabledelayedexpansion
:: Arguments:fileNameNoExtension, input, output, result, finalResult, No , timeLimit
set fileNameNoExtension=%1
set input=%2
set output=%3
set result=%4
set finalResult=%5
set no=%6
set timeLimit=%7
set ext=%8
set tlms=%timeLimit% * 1000
set "escapeb=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^="
set "escapec=^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>^>"
if %no%==1 echo Compilation Successful^^! > %finalResult% && CLS && echo Running Against Test-Cases: && echo (Process Will be halted automatically after 1 min to avoid infinte loop execution)
if %ext%==cpp (
    set start=!time!
    %fileNameNoExtension% < %input% > %result% 2>&1
    set end=!time!
)   
if %ext%==c set start=!time! & %fileNameNoExtension% < %input% > %result% 2>&1 & set end=!time!
if %ext%==java set start=!time! & java %fileNameNoExtension% < %input% > %result% 2>&1 & set end=!time!
if %ext%==python set start=!time! & py %fileNameNoExtension%.py < %input% > %result% 2>&1 & set end=!time!

set /A STARTTIME=(1%start:~0,2%-100)*360000 + (1%start:~3,2%-100)*6000 + (1%start:~6,2%-100)*100 + (1%start:~9,2%-100)
set /A ENDTIME=(1%end:~0,2%-100)*360000 + (1%end:~3,2%-100)*6000 + (1%end:~6,2%-100)*100 + (1%end:~9,2%-100)

rem calculating the duratyion is easy
set /A DURATION=%ENDTIME%-%STARTTIME%

rem we might have measured the time inbetween days
if %ENDTIME% LSS %STARTTIME% set set /A DURATION=%STARTTIME%-%ENDTIME%

rem now break the centiseconds down to hors, minutes, seconds and the remaining centiseconds
set /A DURATIONCC=%DURATION% * 10
REM set /A DURATIONM=(%DURATION% - %DURATIONH%*360000) / 6000
REM set /A DURATIONS=(%DURATION% - %DURATIONH%*360000 - %DURATIONM%*6000) / 100
REM set /A DURATIONHS=(%DURATION% - %DURATIONH%*360000 - %DURATIONM%*6000 - %DURATIONS%*100)

rem some formatting
REM if %DURATIONH% LSS 10 set DURATIONH=0%DURATIONH%
REM if %DURATIONM% LSS 10 set DURATIONM=0%DURATIONM%
REM if %DURATIONS% LSS 10 set DURATIONS=0%DURATIONS%
REM if %DURATIONHS% LSS 10 set DURATIONHS=0%DURATIONHS%
fc /A %result% %output% 
if %errorlevel%==0 set verdict=AC (Accepted) & set DIFFACTIVE=0
if %errorlevel%==1 set verdict=WA (Wrong Answer) & set DIFFACTIVE=1
if %DURATIONCC% GTR %tlms% set verdict=TLE (Time Limit Exceeded)
echo %escapec% >> %finalResult% & echo Test Case %no%: >> %finalResult% & echo %escapeb% >> %finalResult% & echo Input: >> %finalResult% & type %input% >> %finalResult% & echo. >> %finalResult% & echo %escapeb% >> %finalResult% & echo Expected Output: >> %finalResult% & type %output% >> %finalResult%  & echo. >> %finalResult% & echo %escapeb% >> %finalResult%  &  echo Your Answer: >> %finalResult% & type %result% >> %finalResult% & echo. >> %finalResult% &  echo %escapeb% >> %finalResult%  & echo Verdict:%verdict% >> %finalResult% & echo Process Run Time: %DURATION% ms >> %finalResult% 
if %DIFFACTIVE%==1 echo %escapeb% >> %finalResult% & echo Difference (Your Answer Vs Expected Output): >> %finalResult% & fc /A %result% %output% >> %finalResult% & echo %escapec% >> %finalResult% & echo. >> %finalResult%
if %DIFFACTIVE%==0 echo %escapec% >> %finalResult% & echo. >> %finalResult%
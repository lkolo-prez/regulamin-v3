@echo off
:: SSPO Debug API Tester - Windows Version
:: Test all API endpoints and monitor performance

echo 🧪 SSPO Regulamin Platform - API Debug Suite
echo =============================================
echo ⏰ Started: %date% %time%
echo.

set BASE_URL=http://localhost

echo 🔍 Testing API Health...
curl -s -w "HTTPSTATUS:%%{http_code}\nTIME:%%{time_total}" "%BASE_URL%/api/health" > health_response.tmp
findstr "HTTPSTATUS" health_response.tmp > health_code.tmp
findstr "TIME" health_response.tmp > health_time.tmp
for /f "tokens=2 delims=:" %%i in (health_code.tmp) do set HEALTH_CODE=%%i
for /f "tokens=2 delims=:" %%i in (health_time.tmp) do set HEALTH_TIME=%%i

if "%HEALTH_CODE%"=="200" (
    echo   ✅ Health Check: PASSED ^(%HEALTH_TIME%s^)
) else (
    echo   ❌ Health Check: FAILED ^(HTTP %HEALTH_CODE%^)
)

echo 🤖 Testing AI Analysis...
curl -s -w "HTTPSTATUS:%%{http_code}\nTIME:%%{time_total}" -X POST -H "Content-Type: application/json" -d "{\"text\":\"Test regulamin content\",\"document\":\"01-regulamin-sspo.md\"}" "%BASE_URL%/api/analyze" > analysis_response.tmp
findstr "HTTPSTATUS" analysis_response.tmp > analysis_code.tmp
findstr "TIME" analysis_response.tmp > analysis_time.tmp
for /f "tokens=2 delims=:" %%i in (analysis_code.tmp) do set ANALYSIS_CODE=%%i
for /f "tokens=2 delims=:" %%i in (analysis_time.tmp) do set ANALYSIS_TIME=%%i

if "%ANALYSIS_CODE%"=="200" (
    echo   ✅ AI Analysis: PASSED ^(%ANALYSIS_TIME%s^)
) else (
    echo   ❌ AI Analysis: FAILED ^(HTTP %ANALYSIS_CODE%^)
)

echo 📊 Testing Statistics...
curl -s -w "HTTPSTATUS:%%{http_code}\nTIME:%%{time_total}" "%BASE_URL%/api/stats" > stats_response.tmp
findstr "HTTPSTATUS" stats_response.tmp > stats_code.tmp
findstr "TIME" stats_response.tmp > stats_time.tmp
for /f "tokens=2 delims=:" %%i in (stats_code.tmp) do set STATS_CODE=%%i
for /f "tokens=2 delims=:" %%i in (stats_time.tmp) do set STATS_TIME=%%i

if "%STATS_CODE%"=="200" (
    echo   ✅ Statistics: PASSED ^(%STATS_TIME%s^)
) else (
    echo   ❌ Statistics: FAILED ^(HTTP %STATS_CODE%^)
)

echo 📄 Testing Document Retrieval...
curl -s -w "HTTPSTATUS:%%{http_code}\nTIME:%%{time_total}" "%BASE_URL%/documents/01-regulamin-sspo" > doc_response.tmp
findstr "HTTPSTATUS" doc_response.tmp > doc_code.tmp
findstr "TIME" doc_response.tmp > doc_time.tmp
for /f "tokens=2 delims=:" %%i in (doc_code.tmp) do set DOC_CODE=%%i
for /f "tokens=2 delims=:" %%i in (doc_time.tmp) do set DOC_TIME=%%i

if "%DOC_CODE%"=="200" (
    echo   ✅ Document Retrieval: PASSED ^(%DOC_TIME%s^)
) else (
    echo   ❌ Document Retrieval: FAILED ^(HTTP %DOC_CODE%^)
)

echo ⚖️  Testing Conflict Check...
curl -s -w "HTTPSTATUS:%%{http_code}\nTIME:%%{time_total}" -X POST -H "Content-Type: application/json" -d "{\"currentText\":\"Test content\",\"proposedChanges\":\"Modified content\"}" "%BASE_URL%/api/check" > conflict_response.tmp
findstr "HTTPSTATUS" conflict_response.tmp > conflict_code.tmp
findstr "TIME" conflict_response.tmp > conflict_time.tmp
for /f "tokens=2 delims=:" %%i in (conflict_code.tmp) do set CONFLICT_CODE=%%i
for /f "tokens=2 delims=:" %%i in (conflict_time.tmp) do set CONFLICT_TIME=%%i

if "%CONFLICT_CODE%"=="200" (
    echo   ✅ Conflict Check: PASSED ^(%CONFLICT_TIME%s^)
) else (
    echo   ❌ Conflict Check: FAILED ^(HTTP %CONFLICT_CODE%^)
)

:: Cleanup temp files
del *.tmp 2>nul

echo.
echo =============================================
echo ⏰ Completed: %date% %time%
echo 🎯 Debug Summary:
echo    - All core API endpoints tested
echo    - Response times measured
echo    - Error codes captured
echo    - Ready for production monitoring
echo.
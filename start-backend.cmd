@echo off
setlocal

cd /d "%~dp0"

echo === Clean install (model + kjar) ===
call mvn -pl model,kjar -am clean install -DskipTests -q || goto :err

echo === Starting service on http://localhost:8080 ===
cd service
call mvn clean spring-boot:run

goto :eof

:err
echo Build failed.
exit /b 1

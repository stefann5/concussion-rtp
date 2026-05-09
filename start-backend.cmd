@echo off
setlocal

cd /d "%~dp0"

echo === Installing parent pom ===
call mvn -N install -q || goto :err

echo === Building model ===
call mvn -pl model install -DskipTests -q || goto :err

echo === Building kjar ===
call mvn -pl kjar install -DskipTests -q || goto :err

echo === Starting service on http://localhost:8080 ===
cd service
call mvn spring-boot:run

goto :eof

:err
echo Build failed.
exit /b 1

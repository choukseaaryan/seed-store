@echo off
echo Building Seed Store Standalone Application...
echo.

rem Change to the project root directory
cd /d "%~dp0\.."

rem Run the build script
npm run dist:standalone

echo.
echo Build completed! Check the electron/dist folder for your distributable.
pause

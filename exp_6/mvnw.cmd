@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    https://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@REM Begin all REM://maven.apache.org/download.cgi
@REM and target directory
@REM Maven Wrapper script for Windows

@echo off
setlocal

set "MAVEN_PROJECTBASEDIR=%~dp0"

@REM Find java.exe
if defined JAVA_HOME goto findJavaFromJavaHome

set JAVA_EXE=java.exe
%JAVA_EXE% -version >NUL 2>&1
if %ERRORLEVEL% equ 0 goto execute
echo ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH. >&2
echo Please set the JAVA_HOME variable in your environment to match the location of your Java installation. >&2
goto error

:findJavaFromJavaHome
set "JAVA_HOME=%JAVA_HOME:"=%"
set "JAVA_EXE=%JAVA_HOME%\bin\java.exe"

if exist "%JAVA_EXE%" goto execute
echo ERROR: JAVA_HOME is set to an invalid directory: %JAVA_HOME% >&2
echo Please set the JAVA_HOME variable in your environment to match the location of your Java installation. >&2
goto error

:execute
@REM Check for maven wrapper jar
set "WRAPPER_JAR=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"

if exist "%WRAPPER_JAR%" (
    "%JAVA_EXE%" %MAVEN_OPTS% ^
        "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" ^
        -classpath "%WRAPPER_JAR%" ^
        org.apache.maven.wrapper.MavenWrapperMain %*
) else (
    @REM Download maven-wrapper.jar if it doesn't exist
    set "WRAPPER_URL=https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar"
    echo Downloading Maven Wrapper...
    powershell -Command "Invoke-WebRequest -Uri '%WRAPPER_URL%' -OutFile '%WRAPPER_JAR%'"
    if %ERRORLEVEL% equ 0 (
        "%JAVA_EXE%" %MAVEN_OPTS% ^
            "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" ^
            -classpath "%WRAPPER_JAR%" ^
            org.apache.maven.wrapper.MavenWrapperMain %*
    ) else (
        echo ERROR: Could not download maven-wrapper.jar >&2
        goto error
    )
)

goto end

:error
set ERROR_CODE=1

:end
endlocal & exit /b %ERROR_CODE%

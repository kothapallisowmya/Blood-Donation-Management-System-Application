# PowerShell script to run the backend application with limited memory settings
Write-Host "Setting JVM environment variables to restrict memory use..." -ForegroundColor Cyan
$env:MAVEN_OPTS = "-Xmx256m -XX:+UseSerialGC"
$env:JAVA_TOOL_OPTIONS = "-Xmx256m -XX:+UseSerialGC"
$env:JAVA_HOME = "C:\Program Files\Java\jdk-25"

# Set your local MySQL database credentials here:
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = "root"

Write-Host "Building project using Maven with memory limits..." -ForegroundColor Cyan
.\mvnw.cmd clean package -DskipTests

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build successful! Launching Spring Boot application with a 256MB memory cap..." -ForegroundColor Green
    java -Xmx256m -XX:+UseSerialGC -jar target/blood-donation-management-system-0.0.1-SNAPSHOT.jar
} else {
    Write-Host "Maven build failed. Please ensure you have Maven (mvn) installed on your system PATH, or try running via Docker Compose." -ForegroundColor Red
}

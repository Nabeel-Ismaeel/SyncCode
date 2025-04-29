FROM openjdk:17-slim

RUN apt-get update && \
    apt-get install -y curl gnupg2 lsb-release && \
    curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg && \
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list && \
    apt-get update && \
    apt-get install -y docker-ce-cli && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY /target/CodeExecutor-0.0.1-SNAPSHOT.jar /app/demo.jar

RUN echo '#!/bin/bash\n\
set -e\n\
echo "🔄 Checking for required Docker images..."\n\
docker image inspect python:3.11 > /dev/null 2>&1 || docker pull python:3.11\n\
docker image inspect gcc:latest > /dev/null 2>&1 || docker pull gcc:latest\n\
echo "✅ Images ready. Starting Java app..."\n\
exec java -jar /app/demo.jar' > /entrypoint.sh && \
    chmod +x /entrypoint.sh

EXPOSE 8080

USER root

ENTRYPOINT ["/entrypoint.sh"]

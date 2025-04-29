FROM openjdk:17-jdk
WORKDIR /app
COPY /target/CodeSync-0.0.1-SNAPSHOT.jar /app/demo.jar
EXPOSE 9090
CMD ["java" ,"-jar","demo.jar"]
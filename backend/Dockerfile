# Use an official OpenJDK runtime as a parent image
FROM openjdk:17-jdk-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the executable JAR file from the host machine to the container
COPY build/libs/mamdaero-0.0.1-SNAPSHOT.jar app.jar

# Expose the port that your application runs on
EXPOSE 8080

# Run the JAR file
ENTRYPOINT ["java", "-jar", "app.jar"]

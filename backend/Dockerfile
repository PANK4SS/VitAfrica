# ===== BUILD STAGE =====
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# ── 1. Installer accesscore dans le repo Maven local ──
COPY accesscore/pom.xml ./accesscore/pom.xml
COPY accesscore/src     ./accesscore/src
RUN mvn -f ./accesscore/pom.xml clean install -DskipTests

# ── 2. Builder backend (accesscore est maintenant dispo) ──
COPY backend/pom.xml ./backend/pom.xml
RUN mvn -f ./backend/pom.xml dependency:go-offline -B
COPY backend/src ./backend/src
RUN mvn -f ./backend/pom.xml clean package -DskipTests

# ===== RUN STAGE =====
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=build /app/backend/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
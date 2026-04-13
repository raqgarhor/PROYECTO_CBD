# Configuración de Neo4j

## Para ejecutar el proyecto localmente:

### 1. **Crear archivo de configuración local**
Copia el archivo `application-example.properties` a `application-local.properties`:
```bash
cp src/main/resources/application-example.properties src/main/resources/application-local.properties
```

### 2. **Actualizar credenciales**
Abre `application-local.properties` y reemplaza con tus datos:
```properties
spring.neo4j.uri=bolt://localhost:7687
spring.neo4j.authentication.username=neo4j
spring.neo4j.authentication.password=TU_CONTRASEÑA_AQUI
```

### 3. **Asegurate que Neo4j esté corriendo**
Opción A - Con Docker:
```bash
docker run --name neo4j -p 7687:7687 -e NEO4J_AUTH=neo4j/password neo4j:latest
```

Opción B - Instalado localmente:
```bash
# Inicia Neo4j desde tu instalación local
```

### 4. **Ejecutar el proyecto**
```bash
mvn spring-boot:run -Dspring.profiles.active=local
```

O compilar y ejecutar:
```bash
mvn clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=local
```

## 📌 Notas importantes:
- **NO SUBAS `application-local.properties` a GitHub** (está en `.gitignore`)
- El archivo `application-example.properties` es compartido (sin credenciales reales)
- Cada developer tendrá su propia copia de `application-local.properties`


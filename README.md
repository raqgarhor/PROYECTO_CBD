# G35 Backend + Neo4j Explorer

## Descripción
Este proyecto modela tecnologias y temas en Neo4j y los expone por API REST con Spring Boot.

Tambien incluye una interfaz web (servida por el propio backend) para consultar y visualizar el grafo con un panel lateral de resultados, estilo explorador de nodos.

## Contexto de la asignatura CBD
El proyecto esta orientado a contenidos de la asignatura CBD (Complementos de Bases de Datos), donde se relacionan temas teoricos con tecnologias reales.

Temas trabajados en el grafo:
- Mineria de Datos
- NoSQL
- SIG / GIS
- Blockchain
- Data Warehouse
- Bases de Datos Moviles
- Web Semantica
- Big Data
- BBDD Distribuidas

Tecnologias modeladas en el grafo (ejemplos):
- Neo4j
- Spring Boot
- MongoDB
- Redis
- Apache Spark
- Apache Jena
- PostGIS
- Ethereum
- Couchbase
- Snowflake

## Stack
- Java 17+
- Spring Boot
- Spring Data Neo4j
- Neo4j
- Frontend estatico en `resources/static`

## Modelo de datos (resumen)
- Nodo `Tech`: tecnologia (`nombre`, `categoria`)
- Nodo `Tema`: tema de la asignatura (`id`, `nombre`)
- Relacion `VISTO_EN`: `(:Tech)-[:VISTO_EN]->(:Tema)`
- Relacion `SE_INTEGRA_CON`: `(:Tech)-[:SE_INTEGRA_CON]->(:Tech)`

## Requisitos
- JDK 17 o superior
- Maven 3.6+
- Neo4j corriendo en `bolt://localhost:7687`

## Configuracion local
1. Crea tu archivo local desde el ejemplo:

```bash
# PowerShell
Copy-Item backend/src/main/resources/application-example.properties backend/src/main/resources/application-local.properties
```

2. Ajusta credenciales en `backend/src/main/resources/application-local.properties`.

## Arranque rapido
1. Levanta Neo4j (Desktop o Docker).
2. Desde `backend`, arranca la app:

```bash
mvn spring-boot:run "-Dspring.profiles.active=local"
```

3. Abre en navegador:
- Frontend: `http://localhost:8080/`
- API tecnologias: `http://localhost:8080/api/tecnologias`
- API temas: `http://localhost:8080/api/temas`

## Seed de datos
El seed se ejecuta al iniciar mediante `Neo4jSeedRunner`.

- Toggle: `app.seed.enabled=true|false` en `backend/src/main/resources/application.properties`
- Script: `backend/src/main/resources/data.cypher`

Importante: el script actual comienza borrando el grafo completo (`MATCH (n) DETACH DELETE n;`).
Si no quieres reinicializar datos en cada arranque, pon `app.seed.enabled=false`.

## Endpoints disponibles
- `GET /api/tecnologias` -> lista tecnologias (con compatibles)
- `GET /api/tecnologias/{tema}` -> tecnologias filtradas por tema
- `GET /api/temas` -> lista de temas

## Estructura principal
```text
backend/
   src/main/java/com/G35/backend/
      config/Neo4jSeedRunner.java
      tecnologias/
      temas/
   src/main/resources/
      application.properties
      application-local.properties
      data.cypher
      static/
         index.html
         styles.css
         app.js
```

## Problemas comunes
- Puerto 8080 ocupado:

```bash
mvn spring-boot:run "-Dspring.profiles.active=local" "-Dspring-boot.run.arguments=--server.port=8081"
```

- No conecta a Neo4j:
   - Verifica Neo4j encendido
   - Verifica usuario/password en `application-local.properties`
   - Verifica puerto Bolt `7687`

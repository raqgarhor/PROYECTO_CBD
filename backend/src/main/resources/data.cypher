// LIMPIEZA INICIAL
MATCH (n) DETACH DELETE n;

// --- NODOS: TEMAS DE LA ASIGNATURA ---
CREATE (t01:Tema {id: "01", nombre: "Minería de Datos"})
CREATE (t02:Tema {id: "02", nombre: "NoSQL"})
CREATE (t03:Tema {id: "03", nombre: "SIG / GIS"})
CREATE (t05:Tema {id: "05", nombre: "Blockchain"})
CREATE (t06:Tema {id: "06", nombre: "Data Warehouse"})
CREATE (t07:Tema {id: "07", nombre: "Bases de Datos Móviles"})
CREATE (t08:Tema {id: "08", nombre: "La Web Semántica"})
CREATE (t09:Tema {id: "09", nombre: "Big Data"})
CREATE (t10:Tema {id: "10", nombre: "BBDD Distribuidas"})

// --- NODOS: TECNOLOGÍAS ---
CREATE (neo4j:Tech {nombre: "Neo4j", categoria: "Grafos"})
CREATE (spring:Tech {nombre: "Spring Boot", categoria: "Backend"})
CREATE (mongo:Tech {nombre: "MongoDB", categoria: "Documental"})
CREATE (redis:Tech {nombre: "Redis", categoria: "Key-Value"})
CREATE (spark:Tech {nombre: "Apache Spark", categoria: "Procesamiento"})
CREATE (jena:Tech {nombre: "Apache Jena", categoria: "Web Semántica"})
CREATE (postgis:Tech {nombre: "PostGIS", categoria: "GIS"})
CREATE (ethereum:Tech {nombre: "Ethereum", categoria: "Blockchain"})
CREATE (couchbase:Tech {nombre: "Couchbase", categoria: "Móvil"})
CREATE (snowflake:Tech {nombre: "Snowflake", categoria: "Warehouse"})

// --- RELACIONES: VISTO_EN (Tema) ---
CREATE (neo4j)-[:VISTO_EN]->(t02), (neo4j)-[:VISTO_EN]->(t08)
CREATE (mongo)-[:VISTO_EN]->(t02), (mongo)-[:VISTO_EN]->(t10)
CREATE (postgis)-[:VISTO_EN]->(t03)
CREATE (ethereum)-[:VISTO_EN]->(t05)
CREATE (spark)-[:VISTO_EN]->(t09), (spark)-[:VISTO_EN]->(t01)
CREATE (jena)-[:VISTO_EN]->(t08)
CREATE (couchbase)-[:VISTO_EN]->(t07)
CREATE (snowflake)-[:VISTO_EN]->(t06)

// --- RELACIONES: SE_INTEGRA_CON (Compatibilidad) ---
CREATE (spring)-[:SE_INTEGRA_CON]->(neo4j)
CREATE (spring)-[:SE_INTEGRA_CON]->(mongo)
CREATE (spring)-[:SE_INTEGRA_CON]->(redis)
CREATE (spark)-[:SE_INTEGRA_CON]->(neo4j)
CREATE (spark)-[:SE_INTEGRA_CON]->(mongo)
CREATE (jena)-[:SE_INTEGRA_CON]->(neo4j)
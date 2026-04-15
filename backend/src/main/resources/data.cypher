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
// ---TECNOLOGIAS TEMA 1 ---
CREATE (dvelox:Tech {nombre: "dVelox de APARA", categoria: "Minería empresarial"})
CREATE (kxen:Tech {nombre: "KXEN", categoria: "AutoML"})
CREATE (knime:Tech {nombre: "KNIME", categoria: "Framework multipropósito"})
CREATE (neuralDesigner:Tech {nombre: "Neural Designer", categoria: "Redes Neuronales"})
CREATE (opennn:Tech {nombre: "OpenNN", categoria: "Redes Neuronales"})
CREATE (klinkview:Tech {nombre: "KLinkView", categoria: "Minería visual"})
CREATE (orange:Tech {nombre: "Orange", categoria: "Minería visual"})
CREATE (powerhouse:Tech {nombre: "Powerhouse", categoria: "Minería empresarial"})
CREATE (quiterian:Tech {nombre: "Quiterian", categoria: "Minería empresarial"})
CREATE (rapidminer:Tech {nombre: "RapidMiner", categoria: "Framework multipropósito"})
CREATE (rLang:Tech {nombre: "R", categoria: "Métodos estadísticos"})
CREATE (spssClementine:Tech {nombre: "SPSS Clementine", categoria: "Minería empresarial"})
CREATE (sasEnterpriseMiner:Tech {nombre: "SAS Enterprise Miner", categoria: "Minería empresarial"})
CREATE (statisticaDataMiner:Tech {nombre: "STATISTICA Data Miner", categoria: "Métodos estadísticos"})
CREATE (weka:Tech {nombre: "Weka", categoria: "Framework multipropósito"})
CREATE (keel:Tech {nombre: "KEEL", categoria: "Aprendizaje automático"})

// ---TECNOLOGIAS TEMA 2 ---
// Clave-Valor
CREATE (dynamoDb:Tech {nombre: "DynamoDB", categoria: "Clave-Valor"})
CREATE (simpleDb:Tech {nombre: "SimpleDB", categoria: "Clave-Valor"})
CREATE (voldemort:Tech {nombre: "Voldemort", categoria: "Clave-Valor"})
CREATE (tokyoCabinet:Tech {nombre: "Tokyo Cabinet", categoria: "Clave-Valor"})
CREATE (riak:Tech {nombre: "Riak", categoria: "Clave-Valor"})
CREATE (scalaris:Tech {nombre: "Scalaris", categoria: "Clave-Valor"})
CREATE (memcached:Tech {nombre: "Memcached", categoria: "Clave-Valor"})
// Columnar / Tabulares
CREATE (bigTable:Tech {nombre: "BigTable", categoria: "Columnar"})
CREATE (cassandra:Tech {nombre: "Cassandra", categoria: "Columnar"})
CREATE (hbase:Tech {nombre: "HBase", categoria: "Columnar"})
CREATE (hypertable:Tech {nombre: "Hypertable", categoria: "Columnar"})
// Documentales
CREATE (couchDb:Tech {nombre: "CouchDB", categoria: "Documental"})
CREATE (terrastore:Tech {nombre: "Terrastore", categoria: "Documental"})
// Grafos
CREATE (hyperbaseDb:Tech {nombre: "Hyperbase-DB", categoria: "Grafos"})
CREATE (infoGrid:Tech {nombre: "InfoGrid", categoria: "Grafos"})
CREATE (virtuoso:Tech {nombre: "Virtuoso", categoria: "Grafos"})
CREATE (neo4j:Tech {nombre: "Neo4j", categoria: "Grafos"})



CREATE (spring:Tech {nombre: "Spring Boot", categoria: "Backend"})
CREATE (mongo:Tech {nombre: "MongoDB", categoria: "Documental"})
CREATE (redis:Tech {nombre: "Redis", categoria: "Clave-Valor"})
CREATE (spark:Tech {nombre: "Apache Spark", categoria: "Procesamiento"})
CREATE (jena:Tech {nombre: "Apache Jena", categoria: "Web Semántica"})
CREATE (postgis:Tech {nombre: "PostGIS", categoria: "GIS"})
CREATE (ethereum:Tech {nombre: "Ethereum", categoria: "Blockchain"})
CREATE (couchbase:Tech {nombre: "Couchbase", categoria: "Móvil"})
CREATE (snowflake:Tech {nombre: "Snowflake", categoria: "Warehouse"})


// --- RELACIONES: VISTO_EN (Tema) ---
// --- T1 ---
CREATE (dvelox)-[:VISTO_EN]->(t01)
CREATE (kxen)-[:VISTO_EN]->(t01)
CREATE (knime)-[:VISTO_EN]->(t01)
CREATE (neuralDesigner)-[:VISTO_EN]->(t01)
CREATE (opennn)-[:VISTO_EN]->(t01)
CREATE (klinkview)-[:VISTO_EN]->(t01)
CREATE (orange)-[:VISTO_EN]->(t01)
CREATE (powerhouse)-[:VISTO_EN]->(t01)
CREATE (quiterian)-[:VISTO_EN]->(t01)
CREATE (rapidminer)-[:VISTO_EN]->(t01)
CREATE (rLang)-[:VISTO_EN]->(t01)
CREATE (spssClementine)-[:VISTO_EN]->(t01)
CREATE (sasEnterpriseMiner)-[:VISTO_EN]->(t01)
CREATE (statisticaDataMiner)-[:VISTO_EN]->(t01)
CREATE (weka)-[:VISTO_EN]->(t01)
CREATE (keel)-[:VISTO_EN]->(t01)
// --- T2 ---
CREATE (dynamoDb)-[:VISTO_EN]->(t02)
CREATE (simpleDb)-[:VISTO_EN]->(t02)
CREATE (voldemort)-[:VISTO_EN]->(t02)
CREATE (tokyoCabinet)-[:VISTO_EN]->(t02)
CREATE (redis)-[:VISTO_EN]->(t02)
CREATE (riak)-[:VISTO_EN]->(t02)
CREATE (scalaris)-[:VISTO_EN]->(t02)
CREATE (memcached)-[:VISTO_EN]->(t02)
CREATE (bigTable)-[:VISTO_EN]->(t02)
CREATE (cassandra)-[:VISTO_EN]->(t02)
CREATE (hbase)-[:VISTO_EN]->(t02)
CREATE (hypertable)-[:VISTO_EN]->(t02)
CREATE (couchDb)-[:VISTO_EN]->(t02)
CREATE (terrastore)-[:VISTO_EN]->(t02)
CREATE (hyperbaseDb)-[:VISTO_EN]->(t02)
CREATE (infoGrid)-[:VISTO_EN]->(t02)
CREATE (virtuoso)-[:VISTO_EN]->(t02)
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
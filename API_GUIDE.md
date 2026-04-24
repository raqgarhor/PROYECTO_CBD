# API REST - Guía de Endpoints

## 1. Objetivo
Este documento describe los endpoints REST expuestos por el backend del proyecto, incluyendo las operaciones sobre tecnologías, temas y consultas del grafo.

## 2. Base URL
```text
http://localhost:8080/api
```

## 3. Convenciones generales
- Todas las peticiones y respuestas usan JSON salvo indicación contraria.
- Los campos `nombre`, `categoria` e `id` siguen las validaciones del backend.
- Los errores se devuelven con formato estructurado desde `GlobalExceptionHandler`.

## 4. Tecnologías

### 4.1 Listar todas las tecnologías
**GET** `/tecnologias`

```bash
curl -X GET http://localhost:8080/api/tecnologias
```

**Respuesta de ejemplo:**
```json
[
  {
    "nombre": "Neo4j",
    "categoria": "Grafos",
    "descripcion": "Base de datos de grafos para relaciones complejas"
  },
  {
    "nombre": "MongoDB",
    "categoria": "Documental",
    "descripcion": "Base de datos NoSQL orientada a documentos"
  }
]
```

### 4.2 Obtener una tecnología por nombre
**GET** `/tecnologias/{nombre}`

```bash
curl -X GET http://localhost:8080/api/tecnologias/Neo4j
```

### 4.3 Buscar tecnologías por tema
**GET** `/tecnologias/buscar/tema/{tema}`

```bash
curl -X GET http://localhost:8080/api/tecnologias/buscar/tema/NoSQL
```

### 4.4 Crear una tecnología básica
**POST** `/tecnologias`

```bash
curl -X POST http://localhost:8080/api/tecnologias \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "PostgreSQL",
    "categoria": "Relacional",
    "descripcion": "Motor relacional de código abierto"
  }'
```

### 4.5 Crear una tecnología con relaciones
**POST** `/tecnologias/crear-con-relaciones`

Este endpoint permite crear un nodo nuevo, vincularlo a un tema y añadir relaciones con otras tecnologías.

**Ejemplo de payload:**
```json
{
  "nombre": "Elasticsearch",
  "categoria": "Search",
  "descripcion": "Motor de búsqueda distribuido",
  "temaId": "02",
  "relaciones": [
    {
      "tipo": "COMPLEMENTA",
      "destino": "MongoDB"
    },
    {
      "tipo": "SE_INTEGRA_CON",
      "destino": "Spring Boot"
    }
  ]
}
```

**CURL:**
```bash
curl -X POST http://localhost:8080/api/tecnologias/crear-con-relaciones \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Elasticsearch",
    "categoria": "Search",
    "descripcion": "Motor de búsqueda distribuido",
    "temaId": "02",
    "relaciones": [
      {"tipo": "COMPLEMENTA", "destino": "MongoDB"},
      {"tipo": "SE_INTEGRA_CON", "destino": "Spring Boot"}
    ]
  }'
```

### 4.6 Actualizar una tecnología
**PUT** `/tecnologias/{nombre}`

```bash
curl -X PUT http://localhost:8080/api/tecnologias/Neo4j \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Neo4j",
    "categoria": "Grafos",
    "descripcion": "Base de datos de grafos orientada a análisis de relaciones"
  }'
```

### 4.7 Eliminar una tecnología
**DELETE** `/tecnologias/{nombre}`

```bash
curl -X DELETE http://localhost:8080/api/tecnologias/PostgreSQL
```

## 5. Temas

### 5.1 Listar todos los temas
**GET** `/temas`

```bash
curl -X GET http://localhost:8080/api/temas
```

**Respuesta de ejemplo:**
```json
[
  {
    "id": "01",
    "nombre": "Minería de Datos"
  },
  {
    "id": "02",
    "nombre": "NoSQL"
  }
]
```

### 5.2 Obtener un tema por id
**GET** `/temas/{id}`

```bash
curl -X GET http://localhost:8080/api/temas/02
```

### 5.3 Crear un tema
**POST** `/temas`

```bash
curl -X POST http://localhost:8080/api/temas \
  -H "Content-Type: application/json" \
  -d '{
    "id": "11",
    "nombre": "Machine Learning"
  }'
```

### 5.4 Actualizar un tema
**PUT** `/temas/{id}`

```bash
curl -X PUT http://localhost:8080/api/temas/02 \
  -H "Content-Type: application/json" \
  -d '{
    "id": "02",
    "nombre": "NoSQL Avanzado"
  }'
```

### 5.5 Eliminar un tema
**DELETE** `/temas/{id}`

```bash
curl -X DELETE http://localhost:8080/api/temas/11
```

## 6. Grafo y analítica

### 6.1 Obtener el grafo completo
**GET** `/graph`

```bash
curl -X GET http://localhost:8080/api/graph
```

### 6.2 Estadísticas generales
**GET** `/graph/stats`

Devuelve métricas globales como:
- número de tecnologías
- número de temas
- integraciones
- relaciones totales

### 6.3 Detalle de un nodo
**GET** `/graph/node/{nodeId}`

```bash
curl -X GET http://localhost:8080/api/graph/node/Neo4j
```

### 6.4 Camino más corto
**GET** `/graph/path?from={origen}&to={destino}`

```bash
curl -X GET "http://localhost:8080/api/graph/path?from=Neo4j&to=MongoDB"
```

### 6.5 Buscar en el grafo
**GET** `/graph/search?q={texto}`

```bash
curl -X GET "http://localhost:8080/api/graph/search?q=Spark"
```

### 6.6 Recomendaciones por tema
**GET** `/graph/recommendations?temaId={id}`

```bash
curl -X GET "http://localhost:8080/api/graph/recommendations?temaId=02"
```

**Respuesta de ejemplo:**
```json
{
  "temaId": "02",
  "graph": {
    "nodes": [],
    "edges": []
  },
  "recommendations": [
    {
      "id": "MongoDB",
      "nombre": "MongoDB",
      "categoria": "Documental",
      "score": 16.5,
      "razones": [
        "Pertenece al tema seleccionado",
        "Se integra con 2 tecnologías",
        "Tiene 1 relaciones COMPLEMENTA",
        "Aparece en 2 tema(s)"
      ]
    }
  ]
}
```

### 6.7 Relaciones complementarias
**GET** `/graph/complementa`

```bash
curl -X GET http://localhost:8080/api/graph/complementa
```

### 6.8 Analítica del grafo
**GET** `/graph/analytics`

```bash
curl -X GET http://localhost:8080/api/graph/analytics
```

## 7. Manejo de errores

### 7.1 Error de validación (400)
```json
{
  "timestamp": "2026-04-20T10:30:00",
  "status": 400,
  "message": "Errores de validación",
  "errors": {
    "nombre": "El nombre de la tecnología no puede estar vacío",
    "categoria": "La categoría debe tener entre 2 y 50 caracteres"
  }
}
```

### 7.2 Recurso no encontrado (404)
```json
{
  "timestamp": "2026-04-20T10:30:00",
  "status": 404,
  "message": "Tecnología no encontrada: NoSQL"
}
```

### 7.3 Error interno del servidor (500)
```json
{
  "timestamp": "2026-04-20T10:30:00",
  "status": 500,
  "message": "Error interno del servidor"
}
```

## 8. Resumen de endpoints

### Tecnologías
- `GET /tecnologias`
- `GET /tecnologias/{nombre}`
- `GET /tecnologias/buscar/tema/{tema}`
- `POST /tecnologias`
- `POST /tecnologias/crear-con-relaciones`
- `PUT /tecnologias/{nombre}`
- `DELETE /tecnologias/{nombre}`

### Temas
- `GET /temas`
- `GET /temas/{id}`
- `POST /temas`
- `PUT /temas/{id}`
- `DELETE /temas/{id}`

### Grafo
- `GET /graph`
- `GET /graph/stats`
- `GET /graph/node/{nodeId}`
- `GET /graph/path`
- `GET /graph/search`
- `GET /graph/recommendations`
- `GET /graph/complementa`
- `GET /graph/analytics`


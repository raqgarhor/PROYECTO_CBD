# API REST - Guía de Endpoints

## Base URL
```
http://localhost:8080/api
```

---

## TECNOLOGÍAS - Endpoints

### 1. Listar todas las tecnologías
**GET** `/tecnologias`

```bash
curl -X GET http://localhost:8080/api/tecnologias
```

**Respuesta:**
```json
[
  {
    "nombre": "Neo4j",
    "categoria": "Base de Datos"
  },
  {
    "nombre": "MongoDB",
    "categoria": "NoSQL"
  }
]
```

---

### 2. Obtener una tecnología por nombre
**GET** `/tecnologias/{nombre}`

```bash
curl -X GET http://localhost:8080/api/tecnologias/Neo4j
```

---

### 3. Buscar tecnologías por tema
**GET** `/tecnologias/buscar/tema/{tema}`

```bash
curl -X GET http://localhost:8080/api/tecnologias/buscar/tema/NoSQL
```

---

### 4. Crear una nueva tecnología
**POST** `/tecnologias`

```bash
curl -X POST http://localhost:8080/api/tecnologias \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "PostgreSQL",
    "categoria": "Bases de Datos Relacionales"
  }'
```

**Validaciones:**
- `nombre`: No vacío, entre 2 y 100 caracteres
- `categoria`: No vacío, entre 2 y 50 caracteres

---

### 5. Actualizar una tecnología
**PUT** `/tecnologias/{nombre}`

```bash
curl -X PUT http://localhost:8080/api/tecnologias/Neo4j \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Neo4j",
    "categoria": "Graph Database"
  }'
```

---

### 6. Eliminar una tecnología
**DELETE** `/tecnologias/{nombre}`

```bash
curl -X DELETE http://localhost:8080/api/tecnologias/PostgreSQL
```

---

## TEMAS - Endpoints

### 1. Listar todos los temas
**GET** `/temas`

```bash
curl -X GET http://localhost:8080/api/temas
```

**Respuesta:**
```json
[
  {
    "id": "tema1",
    "nombre": "NoSQL"
  },
  {
    "id": "tema2",
    "nombre": "Big Data"
  }
]
```

---

### 2. Obtener un tema por id
**GET** `/temas/{id}`

```bash
curl -X GET http://localhost:8080/api/temas/tema1
```

---

### 3. Crear un nuevo tema
**POST** `/temas`

```bash
curl -X POST http://localhost:8080/api/temas \
  -H "Content-Type: application/json" \
  -d '{
    "id": "tema3",
    "nombre": "Blockchain"
  }'
```

**Validaciones:**
- `id`: No vacío, entre 1 y 50 caracteres
- `nombre`: No vacío, entre 2 y 100 caracteres

---

### 4. Actualizar un tema
**PUT** `/temas/{id}`

```bash
curl -X PUT http://localhost:8080/api/temas/tema1 \
  -H "Content-Type: application/json" \
  -d '{
    "id": "tema1",
    "nombre": "NoSQL Avanzado"
  }'
```

---

### 5. Eliminar un tema
**DELETE** `/temas/{id}`

```bash
curl -X DELETE http://localhost:8080/api/temas/tema3
```

---

## Manejo de Errores

### Error de Validación (400 Bad Request)
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

### Recurso No Encontrado (404 Not Found)
```json
{
  "timestamp": "2026-04-20T10:30:00",
  "status": 404,
  "message": "Tecnología no encontrada: NoSQL"
}
```

### Error Interno del Servidor (500 Internal Server Error)
```json
{
  "timestamp": "2026-04-20T10:30:00",
  "status": 500,
  "message": "Error interno del servidor"
}
```

---

## Cambios Realizados

### ✅ CRUD Completo
- **Tecnologias**: GET (todas), GET (por nombre), GET (por tema), POST, PUT, DELETE
- **Temas**: GET (todos), GET (por id), POST, PUT, DELETE

### ✅ Validación y Manejo de Errores
- Validaciones de entrada con `@Valid` y `jakarta.validation`
- `GlobalExceptionHandler` para manejo centralizado de excepciones
- Respuestas de error estructuradas y consistentes
- DTOs para separar la capa de API de las entidades

### ✅ Mappers
- `TecnologiaMapper`: Convierte entre Entidad y DTO
- `TemaMapper`: Convierte entre Entidad y DTO

### ✅ Mejoras en Servicios
- Métodos CRUD en ambos servicios
- Lanzamiento de excepciones apropiadas

### ✅ Estructura de Carpetas
```
backend/
├── src/main/java/com/G35/backend/
│   ├── config/
│   │   ├── Neo4jSeedRunner.java
│   │   └── GlobalExceptionHandler.java  (NUEVO)
│   ├── tecnologias/
│   │   ├── Tecnologia.java             (ACTUALIZADO)
│   │   ├── TecnologiaController.java   (ACTUALIZADO)
│   │   ├── TecnologiaService.java      (ACTUALIZADO)
│   │   ├── TecnologiaRepository.java
│   │   ├── dto/
│   │   │   └── TecnologiaDTO.java      (NUEVO)
│   │   └── mapper/
│   │       └── TecnologiaMapper.java   (NUEVO)
│   ├── temas/
│   │   ├── Tema.java                   (ACTUALIZADO)
│   │   ├── TemaController.java         (ACTUALIZADO)
│   │   ├── TemaService.java            (ACTUALIZADO)
│   │   ├── TemaRepository.java
│   │   ├── dto/
│   │   │   └── TemaDTO.java            (NUEVO)
│   │   └── mapper/
│   │       └── TemaMapper.java         (NUEVO)
│   └── BackendApplication.java
```

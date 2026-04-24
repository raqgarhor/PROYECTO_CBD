# Explorador de Tecnologías con Grafo (Neo4j + Spring Boot + React)

## 1. Descripción general
Este proyecto implementa una plataforma para modelar, consultar y visualizar tecnologías y temas académicos mediante un grafo en Neo4j.

La solución incluye:
- Backend con API REST en Spring Boot.
- Base de datos de grafos en Neo4j.
- Frontend React para exploración visual, recomendaciones y gestión de nodos.

## 2. Objetivo funcional
Permitir que el usuario:
1. Explore el grafo de tecnologías y temas.
2. Obtenga recomendaciones por tema con ranking y razones.
3. Analice relaciones complementarias.
4. Cree nuevas tecnologías y las conecte dinámicamente en el grafo.

## 3. Arquitectura
### Backend
- Java 17+
- Spring Boot
- Spring Data Neo4j

### Base de datos
- Neo4j (Bolt)
- Seed de datos con `backend/src/main/resources/data.cypher`

### Frontend
- React + Vite
- Visualización con Cytoscape

## 4. Modelo de grafo (resumen)
- Nodos:
  - `Tech` (tecnologías)
  - `Tema` (temas académicos)

- Relaciones principales:
  - `VISTO_EN`
  - `SE_INTEGRA_CON`
  - `COMPLEMENTA`
  - `RELACIONADA_CON`
  - `COMPITE_CON`
  - `ES_ALTERNATIVA_A`
  - `CONECTADO_POR`

## 5. Funcionalidades implementadas
1. CRUD de tecnologías y temas.
2. Consulta de grafo completo y subgrafos.
3. Camino más corto entre nodos.
4. Recomendaciones por tema con score y razones.
5. Modo de relaciones `COMPLEMENTA`.
6. Formulario para crear nuevas tecnologías y relaciones desde el frontend.
7. Dashboard de analítica (importancia, nodos puente, clústeres).

## 6. Manuales del proyecto
Para cumplir los requisitos de documentación, los manuales están separados en archivos Markdown:

- Manual de instalación y despliegue:
  - [MANUAL_INSTALACION_DESPLIEGUE.md](MANUAL_INSTALACION_DESPLIEGUE.md)

- Manual de usuario:
  - [MANUAL_USUARIO.md](MANUAL_USUARIO.md)

## 7. API 
- Guía de endpoints:
  - [API_GUIDE.md](API_GUIDE.md)

## 8. Estructura del repositorio
```text
backend/
explorer-ui/
README.md
MANUAL_INSTALACION_DESPLIEGUE.md
MANUAL_USUARIO.md
API_GUIDE.md
```

## 9. Estado
Proyecto orientado a implementación práctica para la asignatura CBD, con foco en visualización y recomendación sobre grafos.

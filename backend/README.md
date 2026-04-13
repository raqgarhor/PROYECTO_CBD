# G35 Backend - Manual de Usuario

## 📋 Descripción del Proyecto

**G35 Backend** es una aplicación backend desarrollada con **Spring Boot** que utiliza **Neo4j** como base de datos de grafos. Proporciona una API REST para gestionar y consultar datos relacionales.


## 🛠️ Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

| Herramienta | Versión | Descargar |
|------------|---------|----------|
| **Java JDK** | 17+ | [openjdk.java.net](https://openjdk.java.net/) |
| **Maven** | 3.6+ | [maven.apache.org](https://maven.apache.org/) |
| **Neo4j** | 4.0+ | [neo4j.com/download](https://neo4j.com/download/) |
| **Git** | Cualquier versión | [git-scm.com](https://git-scm.com/) |

### Verificar instalación:
```bash
java -version
mvn -version
```

---

## 📥 Instalación

### 1. Clona el repositorio
```bash
git clone <URL-del-repositorio>
cd backend
```

### 2. Configura Neo4j
Copia el archivo de ejemplo y actualiza tus credenciales:

```bash
# Windows (PowerShell)
Copy-Item src/main/resources/application-example.properties src/main/resources/application-local.properties

# macOS/Linux
cp src/main/resources/application-example.properties src/main/resources/application-local.properties
```

Edita `application-local.properties` con las credenciales:
```properties
spring.neo4j.uri=bolt://localhost:7687
spring.neo4j.authentication.username=neo4j
spring.neo4j.authentication.password=TU_CONTRASEÑA (solicitar a los dueños del proyecto)
```

### 3. Inicia Neo4j

**Opción A: Con Docker (Recomendado)**
```bash
docker run --name neo4j-g35 \
  -p 7687:7687 \
  -p 7474:7474 \
  -e NEO4J_AUTH=neo4j/password \
  neo4j:latest
```

**Opción B: Instalación Local**
- Descarga Neo4j desde [neo4j.com](https://neo4j.com/download/)
- Ejecuta el instalador
- Inicia el servicio desde la aplicación

### 4. Dirígete al directorio del proyecto
```bash
cd backend
```

---

## ▶️ Ejecución

### Compile el proyecto
```bash
mvn clean install
```

### Ejecuta la aplicación (Desarrollo)
```bash
mvn spring-boot:run -Dspring.profiles.active=local
```

La aplicación estará disponible en: **http://localhost:8080**

### Ejecuta como JAR (Producción)
```bash
mvn clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=local
```

---

## 📂 Estructura del Proyecto

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/G35/backend/
│   │   │   └── BackendApplication.java    # Clase principal
│   │   └── resources/
│   │       ├── application.properties             # Config base (compartida)
│   │       ├── application-example.properties     # Config de ejemplo
│   │       └── application-local.properties       # Config local (NO COMPARTIR)
│   └── test/
│       └── java/com/G35/backend/
│           └── BackendApplicationTests.java
├── pom.xml                                 # Dependencias Maven
├── mvnw / mvnw.cmd                        # Maven wrapper
├── README.md                               # Este archivo
├── NEO4J_CONFIG.md                        # Guía de configuración Neo4j
└── .gitignore                              # Archivos ignorados por Git
```

---

## 🗄️ Configuración de Neo4j

Ver el archivo **[NEO4J_CONFIG.md](NEO4J_CONFIG.md)** para más detalles sobre:
- Cómo configurar la conexión a Neo4j
- Credenciales y autenticación
- Resolver problemas de conexión

---

## 🔄 Flujo de Trabajo

### Para Desarrolladores

1. **Clonar el repositorio**
   ```bash
   git clone <URL>
   ```

2. **Crear archivo de configuración local**
   ```bash
   cp src/main/resources/application-example.properties src/main/resources/application-local.properties
   ```

3. **Actualizar credenciales de Neo4j** en `application-local.properties`

4. **Ejecutar el proyecto** con Spring Boot
   ```bash
   mvn spring-boot:run -Dspring.profiles.active=local
   ```

5. **Hacer cambios** - Spring DevTools recargará automáticamente

6. **Hacer commit** (except `application-local.properties`)
   ```bash
   git add .
   git commit -m "Tu mensaje"
   git push
   ```

---

## 🔐 Seguridad

⚠️ **IMPORTANTE - Nunca compartas credenciales:**

- ✅ `application.properties` - Se comparte (sin credenciales)
- ✅ `application-example.properties` - Se comparte (plantilla)
- ❌ `application-local.properties` - **NO se comparte** (está en `.gitignore`)

---

## 📦 Dependencias Principales

| Libería | Versión | Propósito |
|---------|---------|----------|
| Spring Boot Starter Web | 4.0.5 | Framework web y REST |
| Spring Data Neo4j | 4.0.5 | ORM para Neo4j |
| Lombok | Latest | Reduce boilerplate |
| Spring DevTools | 4.0.5 | Hot reload en desarrollo |

Para ver todas las dependencias:
```bash
mvn dependency:tree
```

---

## 🚀 Rutas de API (Ejemplos)

Una vez que el proyecto está corriendo, puedes acceder a:

```
GET  http://localhost:8080/                  # Página principal
```

*(Añade tus endpoints aquí según desarrolles)*

---

## 🐛 Solución de Problemas

### "Connection refused" a Neo4j
- Verifica que Neo4j está corriendo
- Confirma que el puerto es correcto (puerto 7687 por defecto)
- Revisa las credenciales en `application-local.properties`

### "Spring Boot no inicia"
```bash
# Limpia y recompila
mvn clean install
mvn spring-boot:run -Dspring.profiles.active=local
```

### "No encuentra application-local.properties"
**DON'T PANIC** - Es normal, cópialo desde `application-example.properties`:
```bash
cp src/main/resources/application-example.properties src/main/resources/application-local.properties
```

### Puerto 8080 ya está en uso
```bash
mvn spring-boot:run -Dspring.profiles.active=local -Dspring-boot.run.arguments="--server.port=8081"
```

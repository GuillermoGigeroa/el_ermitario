### Detalles del proyecto

Este es un proyecto personal, una aplicación fullstack para un ecommerce de stickers para unos amigos.

Demo en vivo: https://guillermogigeroa.github.io/sticker_ecommerce/

El proyecto es una aplicación Spring Boot 3.5.10 con frontend Angular 21.2.15 que incluye:
- REST API completa para gestión de productos y carrito de compras
- Sistema de carrito de compras con animaciones
- Funcionalidad de cámara con marcos y filtros decorativos
- Autenticación segura HTTP Basic
- Swagger UI para documentación de API
- Soporte para base de datos H2 (desarrollo) y MySQL (producción)

## 🛠️ Tecnologías del frontend

- **Framework**: Angular 21.2.15
- **Node**: Recomendado >=18
- **Package Manager**: npm
- **Estilos**: Bootstrap 5.2.3 + SCSS
- **Testing**: Jasmine + Karma
- **State Management**: RxJS 7.8.1

# Requisitos

- **Node.js** 18 o superior
- **Angular CLI** (compatible con la versión del proyecto)

## 🛠️ Tecnologías del backend

- **Java 17** - Lenguaje
- **Spring Boot 3.5.10** - Framework
- **Spring Web** - REST API
- **Spring Security** - Autenticación HTTP Basic
- **Spring Data JPA** - Persistencia
- **H2 Database** - Base de datos incrustada (desarrollo)
- **MySQL 5.7+** - Base de datos (producción, opcional)
- **Springdoc OpenAPI 2.x** - Documentación Swagger UI
- **SLF4J + Logback** - Logging
- **Maven** - Build tool

### Requisitos del backend

- Java 17+
- Maven 3.8+ (incluido: `mvnw`)

## 🚀 Instalación y Ejecución

### Backend (Spring Boot)

#### Compilar
```bash
mvnw.cmd clean package -DskipTests
```

#### Ejecutar
```bash
# Con Maven
mvnw.cmd spring-boot:run

# O con JAR
java -jar target/impresora.ggigeroa-0.0.1-SNAPSHOT.jar
```

El backend se levanta en `http://localhost:9090`

### Frontend (Angular)

#### Instalar dependencias
```bash
npm install
```

#### Ejecutar en desarrollo
```bash
npm start
# o
ng start -o
```

El frontend se levanta en `http://localhost:4200` (con proxy al backend en `localhost:9090`)

#### Compilar para producción
```bash
npm run build
# o
ng build --base-href /sticker_ecommerce/
```

Los archivos compilados se generan en la carpeta `docs/`

## 🔐 Autenticación y Base de Datos

La aplicación utiliza seguridad web y base de datos incrustada H2:
- **Usuario Web:** `ggigeroa`
- **Contraseña:** `admin`

### Consola de Base de Datos H2
- **URL:** `http://localhost:9090/h2-console`
- **JDBC URL:** `jdbc:h2:mem:impresora_db`
- **Nombre de Usuario:** `sa`
- **Contraseña:** *(vacía)*

> ⚠️ **Para producción:** Cambiar a OAuth2/JWT y reemplazar H2 por MySQL en `application.properties`.

## 📖 Documentación de API

### Swagger UI
Accede a la documentación interactiva de la API en:
```
http://localhost:9090/swagger-ui.html
```

### Endpoints Disponibles

#### Productos
- `GET /api/productos` - Listar todos los productos activos
- `GET /api/productos/{id}` - Obtener producto por ID
- `GET /api/productos/categoria?categoria=X` - Filtrar productos por categoría
- `POST /api/productos` - Crear nuevo producto (requiere autenticación)
- `PUT /api/productos/{id}` - Actualizar producto (requiere autenticación)
- `DELETE /api/productos/{id}` - Eliminar producto (requiere autenticación)

#### Carrito de Compras
- `GET /api/carrito/{sessionId}` - Obtener items del carrito
- `POST /api/carrito` - Agregar item al carrito (body: `{productoId, cantidad, sessionId}`)
- `PUT /api/carrito/{id}` - Actualizar cantidad de item (body: `{cantidad}`)
- `DELETE /api/carrito/{id}` - Eliminar item del carrito
- `DELETE /api/carrito/session/{sessionId}` - Vaciar carrito completo

#### Otros Endpoints
- `GET /api/registros` - Listar registros
- `GET /api/imagenes` - Listar imágenes
- `POST /api/imagenes` - Crear imagen (requiere autenticación)

### Ejemplo de uso de API (cURL)
```bash
# Obtener productos
curl -X GET http://localhost:9090/api/productos

# Agregar item al carrito
curl -X POST http://localhost:9090/api/carrito \
  -H "Content-Type: application/json" \
  -d '{"productoId": 1, "cantidad": 2, "sessionId": "session_123"}'

# Con autenticación
curl -u ggigeroa:admin -X GET http://localhost:9090/api/registros
```

## 🛒 Sistema de Carrito de Compras

### Características
- **Persistencia en backend:** Los items del carrito se guardan en la base de datos
- **SessionId:** Identificación temporal de usuarios (se genera automáticamente)
- **Badge animado:** Contador de items en el navbar con animación de bounce
- **Animación confetti:** Efecto visual al agregar productos al carrito
- **Modal/Sidebar:** Vista completa del carrito con resumen de compra
- **Gestión de cantidades:** Incrementar/decrementar cantidades de items
- **Cálculo automático:** Subtotal y total calculados en tiempo real

### Modelo de Datos

#### Producto
```json
{
  "id": 1,
  "nombre": "Sticker Gato",
  "descripcion": "Sticker adorable de gato",
  "precio": 5.99,
  "imagenBase64": "base64_encoded_image",
  "stock": 100,
  "categoria": "Animales",
  "activo": true
}
```

#### CarritoItem
```json
{
  "id": 1,
  "productoId": 1,
  "cantidad": 2,
  "sessionId": "session_123456_abc"
}
```

### Agregar Productos de Prueba

Para probar el carrito, necesitas agregar productos a la base de datos. Puedes hacerlo de las siguientes formas:

#### Opción 1: Via Swagger UI
1. Accede a `http://localhost:9090/swagger-ui.html`
2. Ve a la sección "Productos"
3. Usa el endpoint `POST /api/productos`
4. Autentícate con `ggigeroa` / `admin`
5. Envía un JSON con los datos del producto

#### Opción 2: Via Consola H2
1. Accede a `http://localhost:9090/h2-console`
2. Conecta con JDBC URL: `jdbc:h2:mem:impresora_db`
3. Ejecuta el siguiente SQL:
```sql
INSERT INTO producto (nombre, descripcion, precio, imagen_base64, stock, categoria, activo) 
VALUES 
('Sticker Gato', 'Sticker adorable de gato', 5.99, null, 100, 'Animales', true),
('Sticker Flor', 'Sticker de flor colorida', 4.99, null, 50, 'Naturaleza', true),
('Sticker Corazón', 'Sticker de corazón', 3.99, null, 75, 'Amor', true);
```

#### Opción 3: Via cURL
```bash
curl -u ggigeroa:admin -X POST http://localhost:9090/api/productos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Sticker Gato",
    "descripcion": "Sticker adorable de gato",
    "precio": 5.99,
    "imagenBase64": "",
    "stock": 100,
    "categoria": "Animales",
    "activo": true
  }'
```

## 🖼️ Funcionalidad de Cámara con Marcos

La aplicación incluye una función de "Cuadro Vivo" que permite:
- Acceder a la cámara del dispositivo
- Aplicar diferentes marcos decorativos (Polaroid, Gold, Neon, Flowers, Glass, Wood)
- Aplicar filtros de imagen (Normal, Sepia, Grayscale, Invert, Blur)
- Capturar fotos con temporizador
- Ver fotos capturadas en un modal
- Descargar las fotos capturadas

## 📁 Estructura del Proyecto

```
ggigeroa/
├── src/
│   ├── main/
│   │   ├── java/ggigeroa/impresora/runner/
│   │   │   ├── controller/       # Controladores REST
│   │   │   │   ├── ProductoController.java
│   │   │   │   ├── CarritoController.java
│   │   │   │   ├── ImagenController.java
│   │   │   │   └── RegistroController.java
│   │   │   ├── model/            # Modelos de datos
│   │   │   │   ├── Producto.java
│   │   │   │   ├── CarritoItem.java
│   │   │   │   ├── Imagen.java
│   │   │   │   └── Registro.java
│   │   │   ├── impl/             # Repositorios JPA
│   │   │   │   ├── ProductoRepository.java
│   │   │   │   ├── CarritoItemRepository.java
│   │   │   │   ├── ImagenRepository.java
│   │   │   │   └── RegistroRepository.java
│   │   │   └── config/           # Configuración Spring
│   │   │       ├── SecurityConfig.java
│   │   │       └── SwaggerConfig.java
│   │   └── resources/
│   │       └── application.properties
│   └── app/                       # Frontend Angular
│       ├── app/
│       │   ├── cart/              # Módulo de carrito
│       │   │   ├── models/        # Modelos TypeScript
│       │   │   ├── services/      # Servicios (ProductService, CartService)
│       │   │   ├── components/    # Componentes (Cart, Confetti)
│       │   │   └── cart.module.ts
│       │   ├── camera-frame/      # Módulo de cámara
│       │   ├── home/              # Componente Home
│       │   └── shared/            # Módulo compartido
│       └── index.html
├── docs/                          # Build de Angular (producción)
├── pom.xml                        # Configuración Maven
├── package.json                   # Configuración npm
├── proxy.conf.json                # Configuración proxy Angular
└── README.md
```

## 🧪 Testing

### Backend Tests
```bash
mvnw.cmd test
```

### Frontend Tests
```bash
ng test
```

## 📝 Scripts Disponibles

### Backend
- `mvnw.cmd clean package` - Compilar y empaquetar
- `mvnw.cmd spring-boot:run` - Ejecutar servidor
- `mvnw.cmd test` - Ejecutar tests

### Frontend
- `npm start` - Iniciar servidor de desarrollo
- `npm run build` - Compilar para producción
- `npm run build-java` - Compilar sin base-href
- `ng test` - Ejecutar tests unitarios
- `ng lint` - Ejecutar linter

## 🔧 Configuración

### Proxy Angular (proxy.conf.json)
El frontend usa un proxy para redirigir las peticiones `/api` al backend:
```json
{
  "/api": {
    "target": "http://localhost:9090",
    "secure": false,
    "logLevel": "debug",
    "timeout": 360000,
    "changeOrigin": true
  }
}
```

### application.properties
Configuración principal de Spring Boot:
```properties
server.port=9090
spring.datasource.url=jdbc:h2:mem:impresora_db
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.h2.console.enabled=true
```

## 🚨 Troubleshooting

### Error: "ng: command not found"
Solución: Usa `npx ng` en lugar de `ng` o instala Angular CLI globalmente:
```bash
npm install -g @angular/cli
```

### Error: "Failed to clean project"
Solución: Cierra Eclipse o cualquier IDE que tenga bloqueado el directorio `target/`

### Error: "Connection refused" en frontend
Solución: Asegúrate de que el backend esté corriendo en `localhost:9090`

### Carrito vacío después de agregar items
Solución: Verifica que los productos existan en la base de datos y que el sessionId se esté generando correctamente

## 📄 Licencia

© 2026 Guillermo A. Gigeroa – Todos los derechos reservados.
Ver [LICENSE](./LICENSE) para más detalles.
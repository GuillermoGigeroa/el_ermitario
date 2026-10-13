# Mejoras del juego Cyber Runner con integración ecommerce

Integrar el juego con el ecommerce cargando stickers como obstáculos (modo híbrido) y renderizando assets del SVG directamente en el canvas para crear una experiencia más rica y conectada con la tienda.

## Resumen
Mejorar el juego Cyber Runner para integrarlo con el ecommerce de stickers "El Ermitario": cargar stickers como obstáculos (modo híbrido estático + API), renderizar assets del SVG directamente en el canvas, y crear una experiencia conectada con la tienda.

## Análisis del SVG
- **Archivo**: `Ermitario-Calcos.svg` (808 líneas, 135 paths)
- **Contenido**: Personajes/calcos estilizados con múltiples paths en blanco/negro
- **Viewport**: 793.70135 x 1194.24 (A4 landscape)
- **Elementos identificables**: Texto "ERMITARIO CALCOS", múltiples figuras humanoides estilizadas

## Estrategia de Implementación

### Fase 1: Sistema de Assets SVG
**Objetivo**: Extraer y renderizar paths del SVG directamente en el canvas del juego.

1. **Crear servicio de parsing SVG** (`svg-parser.service.ts`)
   - Parsear el SVG y extraer paths específicos por ID
   - Convertir paths SVG a comandos de Canvas API
   - Almacenar paths en caché para performance
   - Permitir transformaciones (escala, rotación, posición)

2. **Identificar elementos del SVG**
   - Analizar estructura del SVG para identificar grupos de paths
   - Extraer personajes/figuras como sprites potenciales
   - Crear catálogo de assets disponibles (player, decoraciones, UI)

3. **Integrar renderizado en game-engine**
   - Modificar `game-engine.service.ts` para usar paths SVG
   - Reemplazar rectángulos simples con renderizado de paths SVG
   - Mantener fallback a rectángulos si falla carga de SVG

### Fase 2: Carga Híbrida de Stickers
**Objetivo**: Cargar stickers como obstáculos, empezando con estáticos y luego integrando API.

1. **Crear servicio de stickers** (`sticker-loader.service.ts`)
   - Cargar stickers estáticos iniciales (assets/images/1-7.png)
   - Integrar con `ProductService` para cargar desde API backend
   - Convertir imagenBase64 a Image object para canvas
   - Cachear imágenes para performance

2. **Modificar modelo de obstáculos**
   - Actualizar `obstacle.model.ts` para incluir imagen
   - Agregar propiedades: `image: HTMLImageElement | null`, `isSticker: boolean`
   - Diferenciar entre obstáculos geométricos y stickers

3. **Actualizar entity-manager**
   - Modificar `entity-manager.service.ts` para crear obstáculos con stickers
   - Seleccionar sticker aleatorio del catálogo disponible
   - Escalar sticker a tamaño apropiado de obstáculo
   - Manejar fallback si no hay stickers cargados

### Fase 3: Visualización de Stickers como Obstáculos
**Objetivo**: Renderizar stickers como obstáculos en el canvas.

1. **Modificar renderizado de obstáculos**
   - Actualizar `game-engine.service.ts` método `drawObstacle`
   - Si obstáculo tiene imagen, renderizar imagen escalada
   - Si no tiene imagen, usar renderizado geométrico original
   - Agregar efectos visuales (brillo, sombra) para consistencia

2. **Sistema de pre-carga de imágenes**
   - Pre-cargar stickers estáticos al iniciar el juego
   - Mostrar indicador de carga si tarda
   - Manejar errores de carga gracefully

### Fase 4: Integración con API Backend (Opcional/Futuro)
**Objetivo**: Conectar con backend real para stickers dinámicos.

1. **Integrar ProductService**
   - Modificar `sticker-loader.service.ts` para usar `ProductService`
   - Cargar productos activos del backend
   - Filtrar por categoría de stickers
   - Usar imagenBase64 de productos

2. **Actualizar UI del juego**
   - Mostrar nombre del sticker al colisionar (opcional)
   - Agregar botón "Ver en tienda" en game over (opcional)

## Archivos a Crear (3 nuevos)
1. `src/app/cyber-runner/services/svg-parser.service.ts` - Parser de SVG paths
2. `src/app/cyber-runner/services/sticker-loader.service.ts` - Carga de stickers
3. `src/app/cyber-runner/models/sticker-asset.model.ts` - Modelo de sticker asset

## Archivos a Modificar (5 archivos)
1. `src/app/cyber-runner/models/obstacle.model.ts` - Agregar propiedades de imagen
2. `src/app/cyber-runner/services/entity-manager.service.ts` - Crear obstáculos con stickers
3. `src/app/cyber-runner/services/game-engine.service.ts` - Renderizar stickers, pre-cargar imágenes
4. `src/app/cyber-runner/components/cyber-runner/cyber-runner.component.ts` - Inicializar sticker loader
5. `src/app/cyber-runner/cyber-runner.module.ts` - Agregar HttpClient para ProductService

## Detalles Técnicos

### SVG Parser Service
```typescript
- parseSvgFile(): Promise<SvgDocument>
- extractPathById(id: string): Path2D
- renderPathToCanvas(ctx: CanvasRenderingContext2D, path: Path2D, transform?: Transform)
- createSvgCache(): Map<string, Path2D>
```

### Sticker Loader Service
```typescript
- loadStaticStickers(): Promise<HTMLImageElement[]>
- loadApiStickers(): Observable<Product[]>
- getRandomSticker(): HTMLImageElement
- preloadImages(urls: string[]): Promise<void>
```

### Modificación de Obstáculos
```typescript
interface Obstacle {
  // ... propiedades existentes
  image?: HTMLImageElement;  // Nuevo: sticker image
  isSticker?: boolean;       // Nuevo: flag
  stickerName?: string;      // Nuevo: nombre del sticker
}
```

## Flujo de Implementación

1. **Fase 1**: Crear `svg-parser.service.ts` y analizar SVG
2. **Fase 2**: Crear `sticker-loader.service.ts` con carga estática
3. **Fase 3**: Modificar modelos y servicios para soportar stickers
4. **Fase 4**: Actualizar renderizado del juego
5. **Fase 5**: Integrar con ProductService (opcional, según necesidad)

## Verificación
- [ ] Stickers estáticos se cargan correctamente
- [ ] Obstáculos renderizan stickers en lugar de rectángulos
- [ ] SVG paths se renderizan correctamente en canvas
- [ ] Fallback a renderizado geométrico funciona
- [ ] Performance no degrada significativamente
- [ ] Game loop mantiene 60 FPS
- [ ] No hay memory leaks con imágenes cacheadas

## Riesgos y Consideraciones
- **Performance**: Renderizar SVG paths en cada frame puede ser costoso → Implementar caché y pre-renderizado
- **Tamaño de stickers**: Stickers PNG pueden ser grandes → Escalar apropiadamente y considerar spritesheets
- **Cross-origin**: Imágenes desde API pueden tener problemas CORS → Configurar headers apropiados
- **SVG complejidad**: 135 paths son muchos → Seleccionar solo paths relevantes, no procesar todo el SVG
- **Carga asíncrona**: Imágenes cargan async → Manejar estado de carga en UI del juego

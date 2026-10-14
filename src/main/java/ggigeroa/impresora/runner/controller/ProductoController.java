package ggigeroa.impresora.runner.controller;

import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import ggigeroa.impresora.runner.impl.ProductoRepository;
import ggigeroa.impresora.runner.model.Producto;

@RestController
@RequestMapping("/api/productos")
@Tag(name = "Productos", description = "API para gestionar productos del ecommerce")
public class ProductoController {

    private static final Logger logger = LoggerFactory.getLogger(ProductoController.class);

    @Autowired
    private ProductoRepository productoRepository;

    @Operation(summary = "Obtener todos los productos activos", description = "Devuelve una lista de todos los productos activos.")
    @ApiResponse(responseCode = "200", description = "Lista obtenida exitosamente")
    @GetMapping
    public ResponseEntity<List<Producto>> listarActivos() {
        logger.info("GET /api/productos - Listando productos activos");
        return ResponseEntity.ok(productoRepository.findByActivoTrue());
    }

    @Operation(summary = "Obtener productos por categoría", description = "Devuelve una lista de productos activos filtrados por categoría.")
    @ApiResponse(responseCode = "200", description = "Lista obtenida exitosamente")
    @GetMapping("/categoria")
    public ResponseEntity<List<Producto>> listarPorCategoria(
            @Parameter(description = "Categoría a filtrar", required = true) @RequestParam String categoria) {
        logger.info("GET /api/productos/categoria?categoria={} - Listando productos por categoría", categoria);
        return ResponseEntity.ok(productoRepository.findByActivoTrueAndCategoria(categoria));
    }

    @Operation(summary = "Obtener un producto por ID", description = "Busca y devuelve los detalles de un producto específico a partir de su ID.")
    @ApiResponse(responseCode = "200", description = "Producto encontrado exitosamente")
    @ApiResponse(responseCode = "404", description = "El producto no existe")
    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerPorId(
            @Parameter(description = "ID único del producto a buscar", required = true) @PathVariable Long id) {
        logger.info("GET /api/productos/{} - Buscando producto", id);
        return productoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Crear un nuevo producto", description = "Almacena un nuevo producto en la base de datos.")
    @ApiResponse(responseCode = "201", description = "Producto creado exitosamente")
    @ApiResponse(responseCode = "500", description = "Error interno al crear el producto")
    @PostMapping
    public ResponseEntity<Producto> crear(
            @Parameter(description = "Objeto Producto conteniendo nombre, descripción, precio, imagen, stock, categoría", required = true) @RequestBody Producto producto) {
        logger.info("POST /api/productos - Creando nuevo producto");
        try {
            Producto nuevoProducto = productoRepository.save(producto);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoProducto);
        } catch (Exception e) {
            logger.error("Error al crear producto", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Actualizar un producto existente", description = "Modifica los datos de un producto existente.")
    @ApiResponse(responseCode = "200", description = "Producto actualizado exitosamente")
    @ApiResponse(responseCode = "404", description = "El producto a actualizar no existe")
    @ApiResponse(responseCode = "500", description = "Error interno al actualizar el producto")
    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizar(
            @Parameter(description = "ID del producto a actualizar", required = true) @PathVariable Long id,
            @Parameter(description = "Nuevos datos del producto", required = true) @RequestBody Producto datosNuevos) {
        logger.info("PUT /api/productos/{} - Actualizando producto", id);
        Optional<Producto> productoExistente = productoRepository.findById(id);

        if (productoExistente.isPresent()) {
            Producto producto = productoExistente.get();
            producto.setNombre(datosNuevos.getNombre());
            producto.setDescripcion(datosNuevos.getDescripcion());
            producto.setPrecio(datosNuevos.getPrecio());
            producto.setImagenBase64(datosNuevos.getImagenBase64());
            producto.setStock(datosNuevos.getStock());
            producto.setCategoria(datosNuevos.getCategoria());
            producto.setActivo(datosNuevos.getActivo());

            try {
                Producto actualizado = productoRepository.save(producto);
                return ResponseEntity.ok(actualizado);
            } catch (Exception e) {
                logger.error("Error al actualizar producto", e);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Eliminar un producto", description = "Borra físicamente un producto de la base de datos utilizando su ID.")
    @ApiResponse(responseCode = "204", description = "Producto eliminado exitosamente (Sin contenido)")
    @ApiResponse(responseCode = "404", description = "El producto a borrar no existe")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
            @Parameter(description = "ID del producto a eliminar", required = true) @PathVariable Long id) {
        logger.info("DELETE /api/productos/{} - Eliminando producto", id);
        if (productoRepository.existsById(id)) {
            productoRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}

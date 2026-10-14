package ggigeroa.impresora.runner.controller;

import java.util.List;
import java.util.Map;
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
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import ggigeroa.impresora.runner.impl.CarritoItemRepository;
import ggigeroa.impresora.runner.impl.ProductoRepository;
import ggigeroa.impresora.runner.model.CarritoItem;
import ggigeroa.impresora.runner.model.Producto;

@RestController
@RequestMapping("/api/carrito")
@Tag(name = "Carrito", description = "API para gestionar el carrito de compras")
public class CarritoController {

    private static final Logger logger = LoggerFactory.getLogger(CarritoController.class);

    @Autowired
    private CarritoItemRepository carritoItemRepository;
    
    @Autowired
    private ProductoRepository productoRepository;

    @Operation(summary = "Obtener items del carrito", description = "Devuelve una lista de items del carrito para una sesión específica.")
    @ApiResponse(responseCode = "200", description = "Lista obtenida exitosamente")
    @GetMapping("/{sessionId}")
    public ResponseEntity<List<CarritoItem>> obtenerCarrito(
            @Parameter(description = "ID de sesión del usuario", required = true) @PathVariable String sessionId) {
        logger.info("GET /api/carrito/{} - Obteniendo carrito", sessionId);
        return ResponseEntity.ok(carritoItemRepository.findBySessionId(sessionId));
    }

    @Operation(summary = "Agregar item al carrito", description = "Agrega un nuevo item al carrito. Si el producto ya existe, incrementa la cantidad.")
    @ApiResponse(responseCode = "201", description = "Item agregado exitosamente")
    @ApiResponse(responseCode = "404", description = "Producto no encontrado")
    @ApiResponse(responseCode = "500", description = "Error interno al agregar item")
    @PostMapping
    public ResponseEntity<CarritoItem> agregarItem(
            @Parameter(description = "Objeto conteniendo productoId, cantidad y sessionId", required = true) @RequestBody Map<String, Object> requestBody) {
        Long productoId = Long.valueOf(requestBody.get("productoId").toString());
        Integer cantidad = requestBody.get("cantidad") != null ? Integer.valueOf(requestBody.get("cantidad").toString()) : 1;
        String sessionId = requestBody.get("sessionId").toString();
        
        logger.info("POST /api/carrito - Agregando item: productoId={}, cantidad={}, sessionId={}", productoId, cantidad, sessionId);
        
        // Verificar que el producto existe
        Optional<Producto> productoOpt = productoRepository.findById(productoId);
        if (!productoOpt.isPresent()) {
            logger.warn("Producto con id {} no encontrado", productoId);
            return ResponseEntity.notFound().build();
        }
        
        try {
            // Verificar si ya existe el item en el carrito
            Optional<CarritoItem> itemExistente = carritoItemRepository.findByProductoIdAndSessionId(productoId, sessionId);
            
            if (itemExistente.isPresent()) {
                // Actualizar cantidad
                CarritoItem item = itemExistente.get();
                item.setCantidad(item.getCantidad() + cantidad);
                CarritoItem actualizado = carritoItemRepository.save(item);
                return ResponseEntity.ok(actualizado);
            } else {
                // Crear nuevo item
                CarritoItem nuevoItem = new CarritoItem(productoId, cantidad, sessionId);
                CarritoItem guardado = carritoItemRepository.save(nuevoItem);
                return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
            }
        } catch (Exception e) {
            logger.error("Error al agregar item al carrito", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Actualizar cantidad de item", description = "Actualiza la cantidad de un item específico en el carrito.")
    @ApiResponse(responseCode = "200", description = "Item actualizado exitosamente")
    @ApiResponse(responseCode = "404", description = "Item no encontrado")
    @ApiResponse(responseCode = "500", description = "Error interno al actualizar item")
    @PutMapping("/{id}")
    public ResponseEntity<CarritoItem> actualizarCantidad(
            @Parameter(description = "ID del item a actualizar", required = true) @PathVariable Long id,
            @Parameter(description = "Nueva cantidad", required = true) @RequestBody Map<String, Object> requestBody) {
        Integer cantidad = Integer.valueOf(requestBody.get("cantidad").toString());
        
        logger.info("PUT /api/carrito/{} - Actualizando cantidad a {}", id, cantidad);
        
        Optional<CarritoItem> itemOpt = carritoItemRepository.findById(id);
        if (!itemOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        try {
            CarritoItem item = itemOpt.get();
            item.setCantidad(cantidad);
            CarritoItem actualizado = carritoItemRepository.save(item);
            return ResponseEntity.ok(actualizado);
        } catch (Exception e) {
            logger.error("Error al actualizar item del carrito", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Eliminar item del carrito", description = "Elimina un item específico del carrito.")
    @ApiResponse(responseCode = "204", description = "Item eliminado exitosamente (Sin contenido)")
    @ApiResponse(responseCode = "404", description = "Item no encontrado")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarItem(
            @Parameter(description = "ID del item a eliminar", required = true) @PathVariable Long id) {
        logger.info("DELETE /api/carrito/{} - Eliminando item", id);
        if (carritoItemRepository.existsById(id)) {
            carritoItemRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Vaciar carrito", description = "Elimina todos los items del carrito para una sesión específica.")
    @ApiResponse(responseCode = "204", description = "Carrito vaciado exitosamente (Sin contenido)")
    @DeleteMapping("/session/{sessionId}")
    public ResponseEntity<Void> vaciarCarrito(
            @Parameter(description = "ID de sesión del usuario", required = true) @PathVariable String sessionId) {
        logger.info("DELETE /api/carrito/session/{} - Vaciando carrito", sessionId);
        carritoItemRepository.deleteBySessionId(sessionId);
        return ResponseEntity.noContent().build();
    }
}

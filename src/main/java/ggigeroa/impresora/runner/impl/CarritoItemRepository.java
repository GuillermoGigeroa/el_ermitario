package ggigeroa.impresora.runner.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ggigeroa.impresora.runner.model.CarritoItem;

@Repository
public interface CarritoItemRepository extends JpaRepository<CarritoItem, Long> {
	
	List<CarritoItem> findBySessionId(String sessionId);
	
	Optional<CarritoItem> findByProductoIdAndSessionId(Long productoId, String sessionId);
	
	void deleteBySessionId(String sessionId);
	
}

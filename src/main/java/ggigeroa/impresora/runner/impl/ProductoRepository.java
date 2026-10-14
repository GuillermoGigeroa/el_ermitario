package ggigeroa.impresora.runner.impl;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ggigeroa.impresora.runner.model.Producto;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
	
	List<Producto> findByActivoTrue();
	
	List<Producto> findByCategoria(String categoria);
	
	List<Producto> findByActivoTrueAndCategoria(String categoria);
	
}

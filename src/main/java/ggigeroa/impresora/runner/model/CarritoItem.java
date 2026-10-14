package ggigeroa.impresora.runner.model;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class CarritoItem {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@JsonProperty("productoId")
	private Long productoId;
	
	@JsonProperty("cantidad")
	private Integer cantidad;
	
	@JsonProperty("sessionId")
	private String sessionId;
	
	public CarritoItem() {
		super();
		this.cantidad = 1;
	}

	public CarritoItem(Long productoId, Integer cantidad, String sessionId) {
		super();
		this.productoId = productoId;
		this.cantidad = cantidad;
		this.sessionId = sessionId;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getProductoId() {
		return productoId;
	}

	public void setProductoId(Long productoId) {
		this.productoId = productoId;
	}

	public Integer getCantidad() {
		return cantidad;
	}

	public void setCantidad(Integer cantidad) {
		this.cantidad = cantidad;
	}

	public String getSessionId() {
		return sessionId;
	}

	public void setSessionId(String sessionId) {
		this.sessionId = sessionId;
	}

	@Override
	public int hashCode() {
		return Objects.hash(id, productoId, sessionId);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		CarritoItem other = (CarritoItem) obj;
		return Objects.equals(id, other.id) && Objects.equals(productoId, other.productoId) 
				&& Objects.equals(sessionId, other.sessionId);
	}

	@Override
	public String toString() {
		return "CarritoItem [id=" + id + ", productoId=" + productoId + ", cantidad=" + cantidad + 
				", sessionId=" + sessionId + "]";
	}
	
}

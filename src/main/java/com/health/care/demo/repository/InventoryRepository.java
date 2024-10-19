package com.health.care.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.health.care.demo.entity.InventoryEntity;

import java.util.List;

@Repository
public interface InventoryRepository extends JpaRepository<InventoryEntity, Long> {
//    @Query("SELECT p FROM Product p WHERE (:name is null or p.name LIKE %:name%) AND (:manufacturerName is null or p.manufacturerName LIKE %:manufacturerName%)")
//    List<InventoryEntity> findByNameAndManufacturerName(@Param("name") String name, @Param("manufacturerName") String manufacturerName);

//    @Query(name = "select i from inventory i where (:name p.name LIKE %:name%) OR (:manufacturer_name p.manufacturer_name LIKE %:name%)")
//	List<InventoryEntity> getEntitiesByName(@Param("name") String name);
    
    
	@Query(value = "SELECT * FROM inventory WHERE :name IS NULL OR LOWER(name) LIKE LOWER(CONCAT('%', :name, '%')) OR LOWER(manufacturer_name) LIKE LOWER(CONCAT('%', :name, '%'))", nativeQuery = true)
    List<InventoryEntity> getEntitiesByName(@Param("name") String name);
}
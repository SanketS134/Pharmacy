package com.health.care.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.health.care.demo.entity.InventoryEntity;

import java.util.List;

@Repository
public interface InventoryRepository extends JpaRepository<InventoryEntity, Long> {
	@Query(value = "SELECT * FROM inventory WHERE :name IS NULL OR LOWER(name) LIKE LOWER(CONCAT('%', :name, '%')) OR LOWER(manufacturer_name) LIKE LOWER(CONCAT('%', :name, '%'))", nativeQuery = true)
    List<InventoryEntity> getEntitiesByName(@Param("name") String name);
	
}
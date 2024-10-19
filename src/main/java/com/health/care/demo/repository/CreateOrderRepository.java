package com.health.care.demo.repository;

import com.health.care.demo.entity.CreateOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CreateOrderRepository extends JpaRepository<CreateOrder, Long> {
    // You can add custom query methods here if needed
}

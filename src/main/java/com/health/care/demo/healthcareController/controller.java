package com.health.care.demo.healthcareController;

import com.health.care.demo.dto.PatientInventory;
import com.health.care.demo.entity.CreateOrder;
import com.health.care.demo.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class controller {

    @Autowired
    private OrderService orderService;

    @PostMapping ("/api/orders")
    public ResponseEntity<CreateOrder> createOrder(@RequestBody PatientInventory patientInventory) {
        CreateOrder createdOrder = orderService.createOrder(patientInventory);
        return ResponseEntity.ok(createdOrder);
    }

    // Other existing methods...
}

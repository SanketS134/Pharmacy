package com.health.care.demo.healthcareController;

import com.health.care.demo.dto.OrdersListClass;
import com.health.care.demo.dto.PatientInventory;
import com.health.care.demo.entity.CreateOrder;
import com.health.care.demo.entity.InventoryEntity;
import com.health.care.demo.service.OrderService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class controller {

    @Autowired
    private OrderService orderService;

    @PostMapping("/api/orders")
    public ResponseEntity<CreateOrder> createOrder(@RequestBody PatientInventory patientInventory) {
        CreateOrder createdOrder = orderService.createOrder(patientInventory);
        return ResponseEntity.ok(createdOrder);
    }
    
    @PostMapping("/api/save/inventory")
    public ResponseEntity<InventoryEntity> saveInventory(@RequestBody InventoryEntity list) {
    	InventoryEntity entity = orderService.sveInventory(list);
        return ResponseEntity.ok(entity);
    }

    @GetMapping ("api/get/orders")
    public ResponseEntity<List<OrdersListClass>> getOrders() {
        List<OrdersListClass> getListOrders = orderService.getOrders();
        return ResponseEntity.ok(getListOrders);
    }

    @GetMapping("/api/get/inventory/list")
    public ResponseEntity<List<InventoryEntity>> getListOfInventories(@RequestParam("name") String name) {
    	List<InventoryEntity> list = orderService.getListOfInventories(name);
        return ResponseEntity.ok(list);
    }
}

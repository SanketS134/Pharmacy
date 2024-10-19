package com.health.care.demo.service;

import java.util.List;

import com.health.care.demo.dto.OrdersListClass;
import com.health.care.demo.dto.PatientInventory;
import com.health.care.demo.entity.CreateOrder;
import com.health.care.demo.entity.InventoryEntity;


public interface OrderService {
    CreateOrder createOrder(PatientInventory patientInventory);
	InventoryEntity sveInventory(InventoryEntity inventory);
	List<OrdersListClass> getOrders();
}

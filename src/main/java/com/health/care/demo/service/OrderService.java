package com.health.care.demo.service;

import com.health.care.demo.dto.PatientInventory;
import com.health.care.demo.entity.CreateOrder;

public interface OrderService {
    CreateOrder createOrder(PatientInventory patientInventory);
}

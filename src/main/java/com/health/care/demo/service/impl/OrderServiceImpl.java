package com.health.care.demo.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.health.care.demo.dto.PatientInventory;
import com.health.care.demo.entity.CreateOrder;
import com.health.care.demo.repository.CreateOrderRepository;
import com.health.care.demo.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private CreateOrderRepository createOrderRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public CreateOrder createOrder(PatientInventory patientInventory) {
        CreateOrder order = new CreateOrder();
        order.setPatientName(patientInventory.getPatientName());
        order.setPhoneNumber(patientInventory.getPhoneNumber());
        order.setEmail(patientInventory.getEmail());
        order.setDoctorName(patientInventory.getDoctorName());
        order.setUploadPrescription(patientInventory.getUploadPrescription());
        order.setPrescriptionId(patientInventory.getPrescriptionId());

        try {
            String inventoryJson = objectMapper.writeValueAsString(patientInventory.getOrders());
            order.setInventoryJson(inventoryJson);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error processing inventory JSON", e);
        }

        return createOrderRepository.save(order);
    }
}

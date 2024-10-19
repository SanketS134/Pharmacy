package com.health.care.demo.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.health.care.demo.dto.PatientInventory;
import com.health.care.demo.entity.CreateOrder;
import com.health.care.demo.entity.InventoryEntity;
import com.health.care.demo.repository.CreateOrderRepository;
import com.health.care.demo.repository.InventoryRepository;
import com.health.care.demo.service.OrderService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private CreateOrderRepository createOrderRepository;

    @Autowired
    private ObjectMapper objectMapper;
    
    @Autowired
    private InventoryRepository inventoryRepo;
    

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

	@Override
	public InventoryEntity sveInventory(InventoryEntity inventory) {
		InventoryEntity inv = new InventoryEntity();
		try {
			Optional<InventoryEntity> entity = inventoryRepo.findById(inventory.getId());
			if (entity.isPresent()) 
				inventory.setCreatedOn(entity.get().getCreatedOn());
			else 
				inventory.setCreatedOn(System.currentTimeMillis());
			
			inventory.setUpdatedOn(System.currentTimeMillis());
			inventory.setTotalPrice(inventory.getQuantity() * (inventory.getUnitPrice()));
			inventory.setUpdatedOn(System.currentTimeMillis());
			inventory.setTotalPrice(inventory.getQuantity() * (inventory.getUnitPrice()));
			inv = inventoryRepo.save(inventory);
		} catch (Exception e) {
			throw new RuntimeException("error", e);
		}
		return inv;
	}

	@Override
	public List<InventoryEntity> getListOfInventories(String name) {
		List<InventoryEntity> entities = new ArrayList<>();
		try {
			entities = inventoryRepo.getEntitiesByName(name);
		}catch (Exception e) {
			throw new RuntimeException("error", e);
		}
		return entities;
	}

	@Override
	public List<InventoryEntity> getAllListOfInventories() {
		List<InventoryEntity> entities = new ArrayList<>();
		try {
			entities = inventoryRepo.findAll();
		}catch (Exception e) {
			throw new RuntimeException("error", e);
		}
		return entities;
	}
}

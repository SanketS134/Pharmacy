package com.health.care.demo.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.health.care.demo.dto.InventoryAndQuantity;
import com.health.care.demo.dto.OrdersListClass;
import com.health.care.demo.dto.PatientInventory;
import com.health.care.demo.dto.orderDTO;
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
        order.setPhNo(patientInventory.getPhoneNumber());
        order.setEmail(patientInventory.getEmail());
        order.setDoctorName(patientInventory.getDoctorName());
        order.setUploadPrescription(patientInventory.getUploadPrescription());
        order.setPrescriptionId(patientInventory.getPrescriptionId());
        order.setCreatedon(System.currentTimeMillis());
        order.setTouchedon(System.currentTimeMillis());
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
	
	public List<OrdersListClass> getOrders(String details) {
	    List<OrdersListClass> finalData = new ArrayList<OrdersListClass>();
	    List<CreateOrder> orders = createOrderRepository.findAll();
	    
	    if (orders.isEmpty()) {
	        return finalData;  // Or you can return an empty list instead of null
	    }
	    // Convert details to lowercase for case-insensitive search
	    String searchDetails = details != null ? details.toLowerCase() : null;
	    
	    for (CreateOrder order : orders) {
	        // Check if filtering is required
	        if (!details.isEmpty()) {
	        	// Convert patientName and phNo to lowercase and perform partial search
	            String patientNameLower = order.getPatientName().toLowerCase();
	            String phoneNumberLower = order.getPhNo().toLowerCase();

	            // Filter based on patientName or phoneNumber (phNo) being partially matched
	            if (!(patientNameLower.contains(searchDetails) || phoneNumberLower.contains(searchDetails))) {
	                continue; // Skip this order if neither matches the filter
	            }
	        }
	        // Process the order
	        String json = order.getInventoryJson();
	        List<orderDTO> list = convertsJsonIntoListOfOrders(json);
	        OrdersListClass data = new OrdersListClass();
	        List<InventoryAndQuantity> finalQuantity = new ArrayList<>();
	       
	        for (orderDTO dto : list) {
	            InventoryAndQuantity quantity = new InventoryAndQuantity();
	            Optional<InventoryEntity> entity = inventoryRepo.findById(dto.getInventoryId());
	            if (entity.isPresent()) {
	                quantity.setInventoryEntity(entity.get());
	                quantity.setMedicineQuantity(dto.getQuantity());
	                finalQuantity.add(quantity);
	            }
	        }
	        
	        data.setQuantity(finalQuantity);
	        data.setId(order.getId());
	        data.setPatientName(order.getPatientName());
	        data.setEmail(order.getEmail());
	        data.setPhoneNumber(order.getPhNo());
	        data.setPrescriptionId(order.getPrescriptionId());
	        data.setUploadPrescription(order.getUploadPrescription());
	        data.setDoctorName(order.getDoctorName());
	        
	        // Add the processed order to the finalData list
	        finalData.add(data);
	    }
	    
	    return finalData;
	}


	private List<orderDTO> convertsJsonIntoListOfOrders(String json) {
		 ObjectMapper objectMapper = new ObjectMapper();
	        List<orderDTO> ordersList = new ArrayList<>();
	        try {
	            ordersList = objectMapper.readValue(json, new TypeReference<List<orderDTO>>() {});
	        } catch (Exception e) {
	            e.printStackTrace(); // Handle the exception as needed
	        }
	        return ordersList;
	}
}

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
		
		inventoryRepo.save(inventory);
		
		
		
		return null;
	}

	@Override
	public List<OrdersListClass> getOrders() {
        List<OrdersListClass> finalData = new ArrayList<OrdersListClass>();
        List<CreateOrder> orders= createOrderRepository.findAll();
        if(orders.isEmpty()) {
        	return null;
        }
        for (CreateOrder order:orders) {
        	String json = order.getInventoryJson();
        	List<orderDTO> list = convertsJsonIntoListOfOrders(json);
        	OrdersListClass data = new OrdersListClass();
    	     List<InventoryAndQuantity> finalQuantity = new ArrayList<>();
        	for (orderDTO dto:list) {
        		InventoryAndQuantity Quantity = new InventoryAndQuantity();
        		Optional<InventoryEntity> entity =inventoryRepo.findById(dto.getInventoryId());
        		Quantity.setInventoryEntity(entity.get());
        		Quantity.setMedicineQuantity(dto.getQuantity());
        		finalQuantity.add(Quantity);
        	}
        	data.setQuantity(finalQuantity);
        	data.setId(order.getId());
        	data.setPatientName(order.getPatientName());
        	data.setEmail(order.getEmail());
        	data.setPhoneNumber(order.getPhNo());
        	data.setPrescriptionId(order.getPrescriptionId());
        	data.setUploadPrescription(order.getUploadPrescription());
        	data.setDoctorName(order.getDoctorName());
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

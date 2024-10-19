package com.health.care.demo.dto;

import com.health.care.demo.entity.InventoryEntity;

public class InventoryAndQuantity {

	private InventoryEntity inventoryEntity;
	private int medicineQuantity;
	
	public InventoryEntity getInventoryEntity() {
		return inventoryEntity;
	}
	public void setInventoryEntity(InventoryEntity inventoryEntity) {
		this.inventoryEntity = inventoryEntity;
	}
	public int getMedicineQuantity() {
		return medicineQuantity;
	}
	public void setMedicineQuantity(int medicineQuantity) {
		this.medicineQuantity = medicineQuantity;
	}
	
	
}

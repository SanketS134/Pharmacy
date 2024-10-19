package com.health.care.demo.dto;

import java.util.List;

public class OrdersListClass {
	    private long id;
	    private List<InventoryAndQuantity> quantity;
	    private String patientName;
	    private String phoneNumber;
	    private String email;
	    private String doctorName;
	    private String uploadPrescription;
	    private String prescriptionId;
		public long getId() {
			return id;
		}
		public void setId(long id) {
			this.id = id;
		}
		public List<InventoryAndQuantity> getQuantity() {
			return quantity;
		}
		public void setQuantity(List<InventoryAndQuantity> quantity) {
			this.quantity = quantity;
		}
		public String getPatientName() {
			return patientName;
		}
		public void setPatientName(String patientName) {
			this.patientName = patientName;
		}
		public String getPhoneNumber() {
			return phoneNumber;
		}
		public void setPhoneNumber(String phoneNumber) {
			this.phoneNumber = phoneNumber;
		}
		public String getEmail() {
			return email;
		}
		public void setEmail(String email) {
			this.email = email;
		}
		public String getDoctorName() {
			return doctorName;
		}
		public void setDoctorName(String doctorName) {
			this.doctorName = doctorName;
		}
		public String getUploadPrescription() {
			return uploadPrescription;
		}
		public void setUploadPrescription(String uploadPrescription) {
			this.uploadPrescription = uploadPrescription;
		}
		public String getPrescriptionId() {
			return prescriptionId;
		}
		public void setPrescriptionId(String prescriptionId) {
			this.prescriptionId = prescriptionId;
		}
	    
	    

}

package com.health.care.demo.entity;

import javax.persistence.*;

@Entity
@Table(name = "create_order")
public class CreateOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "inventory_json", nullable = false, length = 255)
    private String inventoryJson;

    @Column(name = "quantity", nullable = false)
    private int quantity;

    @Column(name = "patient_name", nullable = false, length = 255)
    private String patientName;

    @Column(name = "ph_no", nullable = false, length = 20)
    private String phNo;

    @Column(name = "email", nullable = false, length = 255)
    private String email;

    @Column(name = "doctor_name", nullable = false, length = 255)
    private String doctorName;

    @Column(name = "upload_prescription", nullable = false, length = 255)
    private String uploadPrescription;

    @Column(name = "prescription_id", nullable = false, length = 255)
    private String prescriptionId;

    @Column(name = "created_on", nullable = false)
    private Long createdon;

    @Column(name = "touched_on", nullable = false)
    private Long touchedon;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getInventoryJson() {
		return inventoryJson;
	}

	public void setInventoryJson(String inventoryJson) {
		this.inventoryJson = inventoryJson;
	}

	public int getQuantity() {
		return quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}

	public String getPatientName() {
		return patientName;
	}

	public void setPatientName(String patientName) {
		this.patientName = patientName;
	}

	public String getPhNo() {
		return phNo;
	}

	public void setPhNo(String phNo) {
		this.phNo = phNo;
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

	public Long getCreatedon() {
		return createdon;
	}

	public void setCreatedon(Long createdon) {
		this.createdon = createdon;
	}

	public Long getTouchedon() {
		return touchedon;
	}

	public void setTouchedon(Long touchedon) {
		this.touchedon = touchedon;
	}

    
    
}

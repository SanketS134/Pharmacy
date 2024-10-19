package com.health.care.demo.entity;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "createorder")
public class CreateOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "inverntryJson", nullable = false)
    private String inventoryJson;

    @Column(name = "patientName", nullable = false)
    private String patientName;

    @Column(name = "phNo", nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private String email;

    @Column(name = "doctorName", nullable = false)
    private String doctorName;

    @Column(name = "upLoadPrescription", nullable = false)
    private String uploadPrescription;

    @Column(name = "PrescriptionId", nullable = false)
    private String prescriptionId;

    @Column(name = "createdAt", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "touchedAt", nullable = false)
    private LocalDateTime touchedAt;

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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getTouchedAt() {
        return touchedAt;
    }

    public void setTouchedAt(LocalDateTime touchedAt) {
        this.touchedAt = touchedAt;
    }

    public CreateOrder() {
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        touchedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        touchedAt = LocalDateTime.now();
    }

    // Add getters and setters for all fields
}

import React, { useState, useEffect } from "react";
import { Card, Col, Collapse, message, Row, Spin, Table } from "antd";
import axios from "axios";
import "./Orders.css"; // Import the new CSS file

const { Panel } = Collapse;

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        "http://44.204.200.162:8090/api/get/orders"
      );
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("Failed to fetch orders. Please try again.");
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Medicine Name",
      dataIndex: ["inventoryEntity", "name"],
      key: "name",
    },
    {
      title: "Dosage",
      dataIndex: ["inventoryEntity", "dosage"],
      key: "dosage",
    },
    { title: "Quantity", dataIndex: "medicineQuantity", key: "quantity" },
    {
      title: "Unit Price",
      dataIndex: ["inventoryEntity", "unitPrice"],
      key: "unitPrice",
      render: (price) => `₹${price.toFixed(2)}`,
    },
    {
      title: "Total Price",
      key: "totalPrice",
      render: (_, record) =>
        `₹${(
          record.inventoryEntity.unitPrice * record.medicineQuantity
        ).toFixed(2)}`,
    },
  ];

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div
      className="orders"
      style={{ padding: "0 20px", maxWidth: "1200px", margin: "0 auto" }}
    >
      <h2>Orders</h2>
      {orders?.map((order) => (
        <Card
          key={order.id}
          title={`Order #${order.id}`}
          className="order-card"
        >
          <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
            <Col xs={24} sm={12}>
              <div style={{ backgroundColor: '#f0f2f5', padding: '16px', borderRadius: '8px' }}>
                <p style={{ margin: '0 0 8px' }}>
                  <strong style={{ color: '#1890ff' }}>Patient Name:</strong> {order.patientName}
                </p>
                <p style={{ margin: '0 0 8px' }}>
                  <strong style={{ color: '#1890ff' }}>Phone Number:</strong> {order.phoneNumber}
                </p>
                <p style={{ margin: '0' }}>
                  <strong style={{ color: '#1890ff' }}>Email:</strong> {order.email}
                </p>
              </div>
            </Col>
            <Col xs={24} sm={12}>
              <div style={{ backgroundColor: '#f0f2f5', padding: '16px', borderRadius: '8px' }}>
                <p style={{ margin: '0 0 8px' }}>
                  <strong style={{ color: '#1890ff' }}>Doctor Name:</strong> {order.doctorName}
                </p>
                <p style={{ margin: '0 0 8px' }}>
                  <strong style={{ color: '#1890ff' }}>Prescription ID:</strong> {order.prescriptionId}
                </p>
                <p style={{ margin: '0' }}>
                  <strong style={{ color: '#1890ff' }}>Prescription File:</strong> {order.uploadPrescription}
                </p>
              </div>
            </Col>
          </Row>
          <Collapse>
            <Panel header="Order Details" key="1">
              <Table
                columns={columns}
                dataSource={order.quantity}
                pagination={false}
                rowKey={(record) => record.inventoryEntity.id}
              />
            </Panel>
          </Collapse>
        </Card>
      ))}
    </div>
  );
}

export default Orders;

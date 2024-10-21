import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Space,
  Divider,
  Row,
  Col,
  Table,
  message,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import CartCounter from "./CartCounter";
import {
  saveCartToLocalStorage,
  getCartFromLocalStorage,
  clearCartFromLocalStorage,
  calculateTotalCartValue,
} from "../utils/cartUtils";
import axios from "axios";

const { Title, Text } = Typography;

function PlaceOrderPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [totalCartValue, setTotalCartValue] = useState(0);

  const [form] = Form.useForm();

  useEffect(() => {
    const savedCart = getCartFromLocalStorage();
    setCart(savedCart);
    setTotalCartValue(calculateTotalCartValue(savedCart));
  }, []);

  const columns = [
    { title: "Medicine", dataIndex: "name", key: "name" },
    { title: "Dosage", dataIndex: "dosage", key: "dosage" },
    {
      title: "Quantity",
      key: "quantity",
      render: (_, record) => (
        <CartCounter
          max={record.quantity}
          initialQuantity={record.orderedQuantity}
          onQuantityChange={(quantity) =>
            handleQuantityChange(record, quantity)
          }
        />
      ),
    },
    {
      title: "Price",
      key: "price",
      render: (_, record) =>
        `₹${(record.unitPrice * record.orderedQuantity).toFixed(2)}`,
    },
  ];

  const handleQuantityChange = (medicine, quantity) => {
    const updatedCart = cart
      .map((item) =>
        item.id === medicine.id ? { ...item, orderedQuantity: quantity } : item
      )
      .filter((item) => item.orderedQuantity > 0);
    setCart(updatedCart);
    saveCartToLocalStorage(updatedCart);
    setTotalCartValue(calculateTotalCartValue(updatedCart));
  };

  const handleSubmit = async (values) => {
    try {
      const orderPayload = {
        patientName: values.patientName,
        phoneNumber: values.patientContact,
        email: values.patientEmail,
        doctorName: values.doctorName || "",
        uploadPrescription: values.prescriptionLink || "",
        prescriptionId: values.prescriptionId || "",
        orders: cart.map(item => ({
          inventoryId: item.id,
          quantity: item.orderedQuantity
        }))
      };

      const response = await fetch('http://44.204.200.162:8090/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload)
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      message.success("Order placed successfully!");
      clearCartFromLocalStorage();
      navigate("/pharmacy");
    } catch (error) {
      console.error('Error placing order:', error);
      message.error("Failed to place order. Please try again.");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div style={{ padding: "0 20px", maxWidth: "1200px", margin: "0 auto" }}>
      <Card
        style={{ margin: "20px 0" }}
        title={
          <Space size={0} style={{ width: "100%" }}>
            <Button
              type="primary"
              shape="circle"
              ghost
              icon={<ArrowLeftOutlined />}
              onClick={handleBack}
              style={{ padding: 0 }}
            /> 
            <Title level={3} style={{ margin: "0 0 0 10px" }}>
               Place Order
            </Title>
          </Space>
        }
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={24}>
            <Col span={12}>
              <Title level={5}>Patient Details</Title>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="patientName"
                    label="Name"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="patientContact"
                    label="Contact"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="patientEmail"
                label="Email"
                rules={[{ required: true, type: "email" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Title level={5}>Doctor Details</Title>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="doctorName"
                    label="Name"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="doctorContact"
                    label="Contact"
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="prescriptionId"
                    label="Prescription ID"
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="prescriptionLink"
                    label="Prescription Link"
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
          <Divider style={{ margin: "24px 0" }} />
          <Title level={5}>Order Details</Title>
          <Table
            columns={columns}
            dataSource={cart}
            pagination={false}
            size="small"
            style={{ marginBottom: "12px" }}
          />
          <Row justify="end">
            <Col>
              <Text strong>
                Total Order Value: ₹{totalCartValue.toFixed(2)}
              </Text>
            </Col>
          </Row>
          <Form.Item style={{ marginTop: "24px", textAlign: "right" }}>
            <Button type="primary" size="large" htmlType="submit">
              Confirm Order
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default PlaceOrderPage;

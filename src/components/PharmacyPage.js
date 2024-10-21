import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Table,
  Input,
  Card,
  Typography,
  Space,
  Tag,
  Tooltip,
  Button,
  Row,
  Col,
  message,
  List,
} from "antd";
import { ShoppingCartOutlined, DeleteOutlined } from "@ant-design/icons";
import CartCounter from './CartCounter';
import { saveCartToLocalStorage, getCartFromLocalStorage, calculateTotalCartValue } from '../utils/cartUtils';
import { API_BASE_URL } from '../config';

const { Title, Text } = Typography;
const { Search } = Input;

function PharmacyPage() {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [cart, setCart] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInventoryData();
    const savedCart = getCartFromLocalStorage();
    setCart(savedCart);
  }, []);

  const fetchInventoryData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/get/all/inventory/list`);
      setData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching inventory data:", error);
      message.error("Failed to fetch inventory data. Please try again.");
      setIsLoading(false);
    }
  };

  const columns = [
    {
      title: "Medicine Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space direction="vertical" size="small">
          <Text strong>{text}</Text>
          <Tag color="blue">{record.category}</Tag>
        </Space>
      ),
    },
    { title: "Dosage", dataIndex: "dosage", key: "dosage" },
    {
      title: "Qty",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity) => (
        <Tooltip title={quantity > 50 ? "In Stock" : "Low Stock"}>
          <Tag color={quantity > 50 ? "green" : "orange"}>{quantity}</Tag>
        </Tooltip>
      ),
    },
    { title: "Manufacturer", dataIndex: "manufacturerName", key: "manufacturerName" },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (price) => <Text type="success">₹{price.toFixed(2)}</Text>,
    },
    {
      title: "Prescription Required",
      dataIndex: "prescriptionRequired",
      key: "prescriptionRequired",
      render: (required) => (
        <Tag color={required ? "red" : "green"}>
          {required ? "Yes" : "No"}
        </Tag>
      ),
    },
    {
      title: "Total Price",
      key: "totalPrice",
      render: (_, record) => {
        const cartItem = cart.find(item => item.id === record.id);
        const quantity = cartItem ? cartItem.orderedQuantity : 0;
        return <Text strong>₹{(record.unitPrice * quantity).toFixed(2)}</Text>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        const cartItem = cart.find(item => item.id === record.id);
        if (cartItem) {
          return (
            <CartCounter
              max={record.quantity}
              initialQuantity={cartItem.orderedQuantity}
              onQuantityChange={(quantity) => handleQuantityChange(record, quantity)}
            />
          );
        } else {
          return (
            <Tooltip title="Add to Cart">
              <Button
                type="primary"
                icon={<ShoppingCartOutlined />}
                onClick={() => handleAddToCart(record)}
              />
            </Tooltip>
          );
        }
      },
    },
  ];

  const handleSearch = async (value) => {
    setIsSearching(true);
    setSearchText(value);
    try {
      let response;
      if (value.trim()) {
        response = await axios.get(`${API_BASE_URL}/api/get/filtered/inventory/list?name=${encodeURIComponent(value.trim())}`);
      } else {
        response = await axios.get(`${API_BASE_URL}/api/get/all/inventory/list`);
      }
      setData(response.data);
    } catch (error) {
      console.error("Error searching inventory:", error);
      message.error("Failed to search inventory. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleQuantityChange = (medicine, quantity) => {
    const updatedCart = cart.filter(item => item.id !== medicine.id);
    if (quantity > 0) {
      updatedCart.push({ ...medicine, orderedQuantity: quantity });
    }
    setCart(updatedCart);
    saveCartToLocalStorage(updatedCart);
    message.success(`Updated ${medicine.name} quantity to ${quantity}`);
  };

  const handleAddToCart = (medicine) => {
    const updatedCart = [...cart, { ...medicine, orderedQuantity: 1 }];
    setCart(updatedCart);
    saveCartToLocalStorage(updatedCart);
    message.success(`Added ${medicine.name} to cart`);
  };

  const handleRemoveFromCart = (itemId) => {
    const updatedCart = cart.filter(item => item.id !== itemId);
    setCart(updatedCart);
    saveCartToLocalStorage(updatedCart);
    message.success("Item removed from cart");
  };

  const totalCartItems = cart.reduce((total, item) => total + item.orderedQuantity, 0);
  const totalCartValue = calculateTotalCartValue(cart);

  const handleProceed = () => {
    if (cart.length === 0) {
      message.warning("Your cart is empty. Please add items before proceeding.");
    } else {
      navigate("/place-order");
    }
  };

  return (
    <Row gutter={24} style={{ padding: '0 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Col span={17}>
        <Card
          className="pharmacy-page"
          style={{ margin: '20px 0' }}
          title={
            <Row justify="space-between" align="middle">
              <Col>
                <Title 
                  level={3} 
                  style={{ 
                    margin: 0, 
                    color: "#5b6c91", 
                    textAlign: 'left',
                  }}
                >
                  Pharmacy
                </Title>
              </Col>
              <Col>
                <Search
                  placeholder="Search medicines"
                  onSearch={handleSearch}
                  style={{ width: 300 }}
                  loading={isSearching}
                />
              </Col>
            </Row>
          }
        >
          <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            bordered
            size="small"
            loading={isLoading || isSearching}
          />
        </Card>
      </Col>
      <Col span={7}>
        <Card
          title={
            <Title 
              level={4} 
              style={{ 
                margin: 0, 
                textAlign: 'left',
                color: "#5b6c91", 
              }}
            >
              Cart
            </Title>
          }
          extra={<Text strong>Total: ₹{totalCartValue.toFixed(2)}</Text>}
          style={{ margin: '20px 0' }}
        >
          <List
            itemLayout="horizontal"
            dataSource={cart}
            renderItem={item => (
              <List.Item
                actions={[
                  <CartCounter
                    max={item.quantity}
                    initialQuantity={item.orderedQuantity}
                    onQuantityChange={(quantity) => handleQuantityChange(item, quantity)}
                  />,
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveFromCart(item.id)}
                  />
                ]}
              >
                <List.Item.Meta
                  title={item.name}
                  description={`${item.dosage} - ₹${item.unitPrice.toFixed(2)} each`}
                />
                <div>₹{(item.unitPrice * item.orderedQuantity).toFixed(2)}</div>
              </List.Item>
            )}
          />
          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <Text strong>Total Items: {totalCartItems}</Text>
          </div>
          <Button
            type="primary"
            size="large"
            block
            style={{ marginTop: 16 }}
            onClick={handleProceed}
          >
            Proceed to Place Order
          </Button>
        </Card>
      </Col>
    </Row>
  );
}

export default PharmacyPage;

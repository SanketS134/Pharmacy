import React, { useState, useEffect } from "react";
import { Collapse, message, Spin, Table, Input, Empty } from "antd";
import axios from "axios";
import { API_BASE_URL } from "../config";
import "./Orders.css";

const { Panel } = Collapse;
const { Search } = Input;

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPanels, setExpandedPanels] = useState([]);

  useEffect(() => {
    fetchOrders("");
  }, []);

  const fetchOrders = async (searchText) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/get/orders?details=${searchText}`
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

  const handleSearch = (value) => {
    const lowercaseValue = value.toLowerCase();
    fetchOrders(lowercaseValue);
  };

  const onCollapseChange = (key) => {
    setExpandedPanels(key);
  };

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div
      className="orders"
      style={{ padding: "20px 20px 0", maxWidth: "1200px", margin: "0 auto" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          paddingTop: "3px",
        }}
      >
        <h2 style={{ margin: 0, color: "#5b6c91", fontSize: "28px" }}>
          Orders
        </h2>
        <Search
          placeholder="Search by patient name or phone number"
          onSearch={handleSearch}
          style={{ width: 300 }}
          allowClear
          enterButton
        />
      </div>
      {orders.length > 0 ? (
        <Collapse onChange={onCollapseChange} activeKey={expandedPanels}>
          {orders?.map((order) => (
            <Panel
              key={order.id}
              header={
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: "normal",
                  }}
                >
                  <span style={{ width: "20%" }}>
                    <strong>Order #{order.id}</strong>
                  </span>
                  <span
                    style={{
                      width: "25%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <span>
                      <strong
                        style={{
                          color: "rgba(0, 0, 0, 0.45)",
                          marginRight: "8px",
                        }}
                      >
                        Patient Name:
                      </strong>{" "}
                      {order.patientName}
                    </span>
                    {expandedPanels.includes(order.id.toString()) && (
                      <span style={{ marginTop: "8px" }}>
                        <strong
                          style={{
                            color: "rgba(0, 0, 0, 0.45)",
                            marginRight: "8px",
                          }}
                        >
                          Email:
                        </strong>{" "}
                        {order.email}
                      </span>
                    )}
                  </span>
                  <span
                    style={{
                      width: "25%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <span>
                      <strong
                        style={{
                          color: "rgba(0, 0, 0, 0.45)",
                          marginRight: "8px",
                        }}
                      >
                        Phone Number:
                      </strong>{" "}
                      {order.phoneNumber}
                    </span>
                    {expandedPanels.includes(order.id.toString()) && (
                      <span style={{ marginTop: "8px" }}>
                        <strong
                          style={{
                            color: "rgba(0, 0, 0, 0.45)",
                            marginRight: "8px",
                          }}
                        >
                          Prescription ID:
                        </strong>{" "}
                        {order.prescriptionId}
                      </span>
                    )}
                  </span>
                  <span
                    style={{
                      width: "30%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <span>
                      <strong
                        style={{
                          color: "rgba(0, 0, 0, 0.45)",
                          marginRight: "8px",
                        }}
                      >
                        Doctor Name:
                      </strong>{" "}
                      {order.doctorName}
                    </span>
                    {expandedPanels.includes(order.id.toString()) && (
                      <span style={{ marginTop: "8px" }}>
                        <strong
                          style={{
                            color: "rgba(0, 0, 0, 0.45)",
                            marginRight: "8px",
                          }}
                        >
                          Prescription File:
                        </strong>{" "}
                        {order.uploadPrescription}
                      </span>
                    )}
                  </span>
                </div>
              }
            >
              <Table
                columns={columns}
                dataSource={order.quantity}
                pagination={false}
                rowKey={(record) => record.inventoryEntity.id}
              />
            </Panel>
          ))}
        </Collapse>
      ) : (
        <Empty />
      )}
    </div>
  );
}

export default Orders;

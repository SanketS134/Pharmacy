import React, { useState, useEffect } from 'react';
import { Input, Button, Table, Modal, Form, InputNumber, DatePicker, Row, Col, Popconfirm, Select, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import './Inventory.css';
import axios from 'axios';
import { API_BASE_URL } from '../config';

function Inventory() {
  const [inventoryData, setInventoryData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingKey, setEditingKey] = useState('');
  const [tableForm] = Form.useForm();
  const [modalForm] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [isSearching, setIsSearching] = useState(false);
  const [prevSearchTerm, setPrevSearchTerm] = useState('');

  useEffect(() => {
    fetchInventoryData();
  }, []); // Empty dependency array means this effect runs once on mount

  const fetchInventoryData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/get/all/inventory/list`);
      console.log('Inventory Data:', response.data);  // Print the data to the console
      
      // Update the state with the fetched data
      setInventoryData(response.data);
      setPagination({
        ...pagination,
        total: response.data.length, // Adjust this if the API returns a total count
      });
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      // Optionally, you can set some error state here to show an error message to the user
    }
  };

  const handleSearch = async (value) => {
    setSearchTerm(value);
    
    if (value.length >= 3 && value.length > prevSearchTerm.length) {
      setIsSearching(true);

      try {
        const response = await axios.get(`http://44.204.200.162:8090/api/get/filtered/inventory/list?name=${encodeURIComponent(value)}`);
        console.log('Filtered Inventory Data:', response.data);
        
        // Update the state with the fetched data
        setInventoryData(response.data);
        setPagination({
          ...pagination,
          total: response.data.length,
          current: 1,
        });
      } catch (error) {
        console.error('Error fetching filtered inventory data:', error);
        // Optionally, you can set some error state here to show an error message to the user
      } finally {
        setIsSearching(false);
      }
    } else if (value.length === 0) {
      // If the search term is empty, fetch all inventory data
      fetchInventoryData();
    }

    setPrevSearchTerm(value);
  };

  // Debounce function to delay API calls while typing
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Debounced search function
  const debouncedSearch = debounce(handleSearch, 300);

  const filteredInventory = inventoryData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isEditing = (record) => record.id === editingKey;

  const edit = (record) => {
    tableForm.setFieldsValue({
      ...record,
      mfgDate: record.mfgDate ? dayjs(record.mfgDate) : null,
      expirationDate: record.expirationDate ? dayjs(record.expirationDate) : null,
      createdOn: record.createdOn ? dayjs(record.createdOn) : null,
      updatedOn: record.updatedOn ? dayjs(record.updatedOn) : null,
    });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await tableForm.validateFields();
      const newData = [...inventoryData];
      const index = newData.findIndex((item) => key === item.id);
      if (index > -1) {
        const item = newData[index];
        const updatedItem = {
          ...item,
          ...row,
          prescriptionRequired: row.prescriptionRequired === 'Yes' ? true : false,
          mfgDate: row.mfgDate ? dayjs(row.mfgDate).format('YYYY-MM-DD') : null,
          expirationDate: row.expirationDate ? dayjs(row.expirationDate).format('YYYY-MM-DD') : null,
        };

        console.log('Updating item:', updatedItem);

        try {
          const response = await axios.post('http://44.204.200.162:8090/api/save/inventory', updatedItem);
          if (response.status === 200) {
            // Update the local state with the response data directly
            const updatedData = response.data;
            newData.splice(index, 1, updatedData);
            setInventoryData(newData);
            setEditingKey('');
            console.log('Item updated successfully:', updatedData);
          } else {
            console.error('Failed to update item:', response);
          }
        } catch (error) {
          console.error('Error updating item:', error);
        }
      } else {
        console.error('Record not found');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 50 },
    { title: 'NAME', dataIndex: 'name', key: 'name', editable: true, width: 150 },
    { 
      title: 'STATUS', 
      dataIndex: 'status', 
      key: 'status', 
      editable: true, 
      width: 100, 
      render: (text) => {
        const isInStock = text === 'In Stock';
        return (
          <span className={`status-badge ${isInStock ? 'status-instock' : 'status-other'}`}>
            {text}
          </span>
        );
      }
    },
    { title: 'DOSAGE', dataIndex: 'dosage', key: 'dosage', editable: true, width: 100 },
    { title: 'MANUFACTURER NAME', dataIndex: 'manufacturerName', key: 'manufacturerName', editable: true, width: 200 },
    { title: 'BATCH NO', dataIndex: 'batchNo', key: 'batchNo', editable: true, width: 120 },
    { title: 'MFG DATE', dataIndex: 'mfgDate', key: 'mfgDate', editable: true, width: 120 },
    { title: 'EXPIRATION DATE', dataIndex: 'expirationDate', key: 'expirationDate', editable: true, width: 120 },
    { 
      title: 'PRESCRIPTION REQUIRED', 
      dataIndex: 'prescriptionRequired', 
      key: 'prescriptionRequired', 
      editable: true, 
      width: 150, 
      render: (text) => text ? 'Yes' : 'No'
    },
    { title: 'REORDER LEVEL', dataIndex: 'reorderLevel', key: 'reorderLevel', editable: true, width: 120 },
    { title: 'QUANTITY', dataIndex: 'quantity', key: 'quantity', editable: true, width: 100 },
    { title: 'IMAGE URL', dataIndex: 'imageUrl', key: 'imageUrl', editable: true, width: 200 },
    { title: 'UNIT PRICE', dataIndex: 'unitPrice', key: 'unitPrice', editable: true, width: 100 },
    { title: 'TOTAL PRICE', dataIndex: 'totalPrice', key: 'totalPrice', editable: true, width: 100 },
    // Remove CREATED ON and UPDATED ON columns
    {
      title: 'ACTIONS',
      key: 'actions',
      fixed: 'right',
      width: 120,
      className: 'actions-column',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <Button onClick={() => save(record.id)} type="primary" size="small">Save</Button>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <Button size="small">Cancel</Button>
            </Popconfirm>
          </span>
        ) : (
          <Button disabled={editingKey !== ''} onClick={() => edit(record)} size="small">Edit</Button>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'quantity' || col.dataIndex === 'reorderLevel' || col.dataIndex === 'unitPrice' || col.dataIndex === 'totalPrice'
          ? 'number'
          : col.dataIndex === 'mfgDate' || col.dataIndex === 'expirationDate' || col.dataIndex === 'createdOn' || col.dataIndex === 'updatedOn'
          ? 'date'
          : col.dataIndex === 'prescriptionRequired'
          ? 'boolean'
          : col.dataIndex === 'status'
          ? 'status'
          : col.dataIndex === 'imageUrl'
          ? 'upload'
          : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    let inputNode;
    switch (inputType) {
      case 'number':
        inputNode = <InputNumber />;
        break;
      case 'date':
        inputNode = <DatePicker format="YYYY-MM-DD" />;
        break;
      case 'boolean':
        inputNode = (
          <Select>
            <Select.Option value={true}>Yes</Select.Option>
            <Select.Option value={false}>No</Select.Option>
          </Select>
        );
        break;
      case 'status':
        inputNode = (
          <Select>
            <Select.Option value="In Stock">In Stock</Select.Option>
            <Select.Option value="Out of Stock">Out of Stock</Select.Option>
          </Select>
        );
        break;
      case 'upload':
        inputNode = (
          <Upload>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        );
        break;
      default:
        inputNode = <Input />;
    }

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    modalForm.resetFields();
  };

  const onFinish = async (values) => {
    try {
      const newItem = {
       
          ...values,
          id:0,
          prescriptionRequired: values.prescriptionRequired === 'Yes' ? true : false,
          mfgDate: values.mfgDate ? dayjs(values.mfgDate).format('YYYY-MM-DD') : null,
          expirationDate: values.expirationDate ? dayjs(values.expirationDate).format('YYYY-MM-DD') : null,
     
      };

      console.log('Payload for new item:', newItem);

      // Make the POST API call to the correct endpoint
      const response = await axios.post('http://44.204.200.162:8090/api/save/inventory', newItem, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        // Add the new item to the local state
        setInventoryData([...inventoryData, response.data]);
        setIsModalVisible(false);
        modalForm.resetFields();
        console.log('Item added successfully');
      } else {
        console.error('Failed to add item:', response);
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  return (
    <div className="Inventory" style={{ padding: '0 150px' }}> {/* Add padding here */}
      <h1 className="inventory-title" style={{ 
        marginBottom: '16px',
        textAlign: 'left'
      }}>
        Inventory Management
      </h1>
      <div className="inventory-controls" style={{ 
        marginBottom: '16px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
      }}>
        <Input.Search
          placeholder="Search inventory..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            debouncedSearch(e.target.value);
          }}
          onSearch={(value) => handleSearch(value)}
          style={{ width: 300, marginRight: '16px' }}
          loading={isSearching}
        />
        <Button type="primary" onClick={showModal}>Add Item</Button>
      </div>
      <div>
        <Form form={tableForm} component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            size='small'
            bordered
            dataSource={filteredInventory}
            columns={mergedColumns}
            rowClassName={(record, index) => index % 2 === 0 ? 'even-row' : 'odd-row'}
            pagination={pagination}
            onChange={handleTableChange}
            rowKey="id"
            className="custom-table"
            scroll={{ x: 2000 }} 
          />
        </Form>
      </div>

      <Modal
        title="Add New Inventory Item"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width="90%"
        style={{ top: 20, maxWidth: '1000px' }}
      >
        <Form
          form={modalForm}
          name="addInventoryItem"
          onFinish={onFinish}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="dosage" label="Dosage" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="manufacturerName" label="Manufacturer Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="batchNo" label="Batch No" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="mfgDate" label="Mfg Date" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="expirationDate" label="Expiration Date" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="prescriptionRequired" label="Prescription Required" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value={true}>Yes</Select.Option>
                  <Select.Option value={false}>No</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="reorderLevel" label="Reorder Level" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="imageUrl" label="Image URL" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="unitPrice" label="Unit Price" rules={[{ required: true }]}>
                <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="totalPrice" label="Total Price" rules={[{ required: true }]}>
                <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="In Stock">In Stock</Select.Option>
                  <Select.Option value="Out of Stock">Out of Stock</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Button onClick={handleCancel} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

// Sample inventory data
const sampleInventoryData = [
  {
    id: 1,
    name: 'Aspirin',
    dosage: '500mg',
    manufacturerName: 'PharmaCorp',
    batchNo: 'ASP2023001',
    mfgDate: '2023-01-15',
    expirationDate: '2024-12-31',
    prescriptionRequired: Math.random() < 0.5, // Random true/false
    reorderLevel: 100,
    quantity: 500,
    imageUrl: 'https://example.com/aspirin.jpg',
    unitPrice: 9.99,
    totalPrice: 4995,
    status: Math.random() < 0.5 ? 'active' : 'inactive', // Random active/inactive
    createdOn: '2023-05-15',
    updatedOn: '2023-05-15'
  },
  {
    id: 2,
    name: 'Amoxicillin',
    dosage: '250mg',
    manufacturerName: 'MediSupply',
    batchNo: 'AMX2023002',
    mfgDate: '2023-02-20',
    expirationDate: '2024-06-30',
    prescriptionRequired: Math.random() < 0.5, // Random true/false
    reorderLevel: 50,
    quantity: 200,
    imageUrl: 'https://example.com/amoxicillin.jpg',
    unitPrice: 15.99,
    totalPrice: 3198,
    status: Math.random() < 0.5 ? 'active' : 'inactive', // Random active/inactive
    createdOn: '2023-04-20',
    updatedOn: '2023-04-20'
  },
  {
    id: 3,
    name: 'Lisinopril',
    dosage: '10mg',
    manufacturerName: 'HealthPharm',
    batchNo: 'LIS2023003',
    mfgDate: '2023-03-10',
    expirationDate: '2025-03-31',
    prescriptionRequired: Math.random() < 0.5, // Random true/false
    reorderLevel: 75,
    quantity: 300,
    imageUrl: 'https://example.com/lisinopril.jpg',
    unitPrice: 12.50,
    totalPrice: 3750,
    status: Math.random() < 0.5 ? 'active' : 'inactive', // Random active/inactive
    createdOn: '2023-05-01',
    updatedOn: '2023-05-01'
  },
  {
    id: 4,
    name: 'Metformin',
    dosage: '500mg',
    manufacturerName: 'DiabetesCare',
    batchNo: 'MET2023004',
    mfgDate: '2023-04-05',
    expirationDate: '2024-09-30',
    prescriptionRequired: Math.random() < 0.5, // Random true/false
    reorderLevel: 80,
    quantity: 400,
    imageUrl: 'https://example.com/metformin.jpg',
    unitPrice: 8.75,
    totalPrice: 3500,
    status: Math.random() < 0.5 ? 'active' : 'inactive', // Random active/inactive
    createdOn: '2023-05-10',
    updatedOn: '2023-05-10'
  },
  {
    id: 5,
    name: 'Ibuprofen',
    dosage: '200mg',
    manufacturerName: 'PharmaCorp',
    batchNo: 'IBU2023005',
    mfgDate: '2023-05-01',
    expirationDate: '2025-01-31',
    prescriptionRequired: Math.random() < 0.5, // Random true/false
    reorderLevel: 120,
    quantity: 600,
    imageUrl: 'https://example.com/ibuprofen.jpg',
    unitPrice: 7.50,
    totalPrice: 4500,
    status: Math.random() < 0.5 ? 'active' : 'inactive', // Random active/inactive
    createdOn: '2023-05-05',
    updatedOn: '2023-05-05'
  },
];

export default Inventory;

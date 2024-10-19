import React, { useState, useEffect } from 'react';
import { Table, Input, Space, Row, Col, Layout, Typography, Button, message } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';
import PrescriptionModal from './PrescriptionModal';

const { Content } = Layout;

// Create a custom Axios instance
const api = axios.create({
  baseURL: 'https://test-api.konceptforge.com/iclap-api',
  headers: {
    'X_TENANT_ID': 'getwell'
  }
});

function PrescriptionTable() {
  const [searchText, setSearchText] = useState('');
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [token, setToken] = useState('');

  useEffect(() => {
    fetchToken();
  }, []);

  const fetchToken = async () => {
    try {
      const response = await api.post('/user/admin_console_login', {
        emailAddress: "admin@wyseplus.in",
        password: "admin123"
      });
      const newToken = `Bearer ${response.data.accessToken}`; // Using accessToken from the response
      setToken(newToken);
      api.defaults.headers.common['Authorization'] = newToken;
      fetchConsultations(newToken);
    } catch (error) {
      console.error('Error fetching token:', error);
      message.error('Failed to authenticate');
    }
  };

  const fetchConsultations = async (authToken) => {
    try {
      const response = await api.get('/consultation/', {
        headers: {
          'Authorization': authToken,
          'X_TENANT_ID': 'getwell'
        }
      });
      const formattedData = response.data.data.map(consultation => ({
        consultationId: consultation._id,
        patientName: consultation.customer_name,
        doctorName: consultation.professional_name,
        phoneNumber: consultation.phoneNumber || 'N/A',
        date: new Date(consultation.createdAt).toLocaleDateString(),
        customerId: consultation.customer_id,
        orderId: consultation.order_id
      }));
      setConsultations(formattedData);
    } catch (error) {
      console.error('Error fetching consultations:', error);
      message.error('Failed to fetch consultations');
    } finally {
      setLoading(false);
    }
  };

  const handleViewPrescription = async (orderId) => {
    try {
      const consultationResponse = await api.get(`/consultation/${orderId}`, {
        headers: {
          'Authorization': token,
          'X_TENANT_ID': 'getwell'
        }
      });
      const consultationDetails = consultationResponse.data;

      if (!consultationDetails) {
        throw new Error('Consultation details not found in response');
      }

      setSelectedPrescription(consultationDetails);
      setModalVisible(true);
    } catch (error) {
      console.error('Error fetching prescription details:', error);
      message.error('Failed to retrieve prescription details');
    }
  };

  const columns = [
    {
      title: 'Consultation ID',
      dataIndex: 'consultationId',
      key: 'consultationId',
    },
    {
      title: 'Patient Name',
      dataIndex: 'patientName',
      key: 'patientName',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Doctor Name',
      dataIndex: 'doctorName',
      key: 'doctorName',
    },
    {
      title: 'Consultation Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'View Prescription',
      key: 'view',
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => handleViewPrescription(record.orderId)}
        >
          View
        </Button>
      ),
    },
  ];

  const filteredConsultations = consultations.filter(
    (consultation) => {
      const searchLower = searchText.toLowerCase();
      return (
        (consultation.consultationId && consultation.consultationId.toString().toLowerCase().includes(searchLower)) ||
        (consultation.patientName && consultation.patientName.toLowerCase().includes(searchLower)) ||
        (consultation.phoneNumber && consultation.phoneNumber.toLowerCase().includes(searchLower)) ||
        (consultation.doctorName && consultation.doctorName.toLowerCase().includes(searchLower))
      );
    }
  );

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Content style={{ padding: '20px' }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: '20px' }}>
          <Col>
            <Typography.Title 
              level={3} 
              style={{ color: '#322e6b', margin: 0 }}
              strong
            >
              PRESCRIPTIONS
            </Typography.Title>
          </Col>
          <Col>
            <Input
              placeholder="Search by ID, patient name, or phone number"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{
                width: '400px',
                borderRadius: 20,
              }}
            />
          </Col>
        </Row>
        <Table 
          columns={columns} 
          dataSource={filteredConsultations} 
          rowKey="consultationId"
          loading={loading}
          style={{ backgroundColor: '#fff', borderRadius: '8px' }}
        />
        <PrescriptionModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          prescriptionData={selectedPrescription}
        />
      </Content>
    </Layout>
  );
}

export default PrescriptionTable;

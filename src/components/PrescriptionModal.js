import React, { useState } from 'react';
import { Modal, Tabs, Form, Input, Collapse, Table } from 'antd';

const { TabPane } = Tabs;
const { Panel } = Collapse;

function PrescriptionModal({ visible, onClose, prescriptionData }) {
  const [activeTab, setActiveTab] = useState('patientInfo');

  const medicineColumns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Dosage', dataIndex: 'dosage', key: 'dosage' },
    { 
      title: 'Schedule', 
      dataIndex: 'schedule', 
      key: 'schedule',
      render: (schedule) => {
        const times = [];
        if (schedule.morning === 'YES') times.push('Morning');
        if (schedule.afternoon === 'YES') times.push('Afternoon');
        if (schedule.evening === 'YES') times.push('Evening');
        return times.join(', ') || 'Not specified';
      }
    },
    { title: 'Notes', dataIndex: 'notes', key: 'notes' },
  ];

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      width={800}
      footer={null}
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Patient Info" key="patientInfo">
          <div className="patinet-info">
            <div className="patinet-info-name">{prescriptionData?.customer_name}</div>
            <div>
              <span style={{ color: 'rgb(112, 112, 112)', fontSize: '13px', margin: '0px', textTransform: 'uppercase' }}>
                Appointment Id: {prescriptionData?.order_id?.slice(-5)}
              </span>
            </div>
          </div>
          <div className="previous-consultation-content">
            <Collapse defaultActiveKey={['3']}>
              <Panel header="Prescription" key="3">
                <Table
                  dataSource={prescriptionData?.diagnosis?.[0]?.medicines || []}
                  columns={medicineColumns}
                  pagination={false}
                  rowKey="name"
                />
              </Panel>
              <Panel header="Case Sheet - Cardiology" key="1">
                <Form layout="vertical">
                  {prescriptionData?.casesheet?.[0]?.questions.map((question, index) => (
                    <Form.Item key={index} label={question.question_text}>
                      <Input disabled value={question.answer_text} />
                    </Form.Item>
                  ))}
                </Form>
              </Panel>
              <Panel header="Summary" key="2">
                {/* <Form.Item label="Describe">
                  <Input.TextArea disabled rows={4} value={prescriptionData?.summary} />
                </Form.Item> */}
                {prescriptionData?.diagnosis?.[0]?.diagnosis_summary && (
                  <Form.Item label="Diagnosis Summary">
                    <Input.TextArea disabled rows={4} value={prescriptionData.diagnosis[0].diagnosis_summary} />
                  </Form.Item>
                )}
              </Panel>
              
              <Panel header="Advise Tests" key="4">
                <Table
                  dataSource={prescriptionData?.medical_test_advices}
                  columns={[
                    { title: 'Test Name', dataIndex: 'medical_test_name', key: 'name' },
                    { title: 'Description', dataIndex: 'description', key: 'description' },
                  ]}
                  pagination={false}
                />
              </Panel>
              <Panel header="Reports" key="5">
                {prescriptionData?.reports?.map((report, index) => (
                  <div key={index}>
                    <h4>{report.name}</h4>
                    {/* Add more details about the report here */}
                  </div>
                ))}
              </Panel>
              <Panel header="Follow-Up" key="6">
                {prescriptionData?.diagnosis?.[0]?.next_follow_up_date ? (
                  <p>Next follow-up date: {new Date(prescriptionData.diagnosis[0].next_follow_up_date).toLocaleDateString()}</p>
                ) : (
                  <p>No follow-up date is provided.</p>
                )}
              </Panel>
            </Collapse>
          </div>
        </TabPane>
      </Tabs>
    </Modal>
  );
}

export default PrescriptionModal;

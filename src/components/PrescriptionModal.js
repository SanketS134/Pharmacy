import React, { useState } from 'react';
import { Modal, Tabs, Form, Input, Collapse, Table } from 'antd';

const { TabPane } = Tabs;
const { Panel } = Collapse;

function PrescriptionModal({ visible, onClose, prescriptionData }) {
  const [activeTab, setActiveTab] = useState('patientInfo');

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
            <Collapse defaultActiveKey={['1']}>
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
                <Form.Item label="Describe">
                  <Input.TextArea disabled rows={4} value={prescriptionData?.summary} />
                </Form.Item>
              </Panel>
              <Panel header="Prescription" key="3">
                {/* Add prescription details here based on API response */}
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
                <p>{prescriptionData?.followUp || 'No FollowUp date is provided.'}</p>
              </Panel>
            </Collapse>
          </div>
        </TabPane>
        <TabPane tab="Chat" key="chat">
          <div style={{ marginTop: '8px' }}>
            <div style={{ borderRadius: '8px', width: '100%', height: '100%', display: 'flex', backgroundColor: 'rgb(231, 238, 240)' }}>
              <div style={{ width: '100%', top: '40px', bottom: '0px', flexDirection: 'column' }}>
                No chat history found
              </div>
            </div>
          </div>
        </TabPane>
      </Tabs>
    </Modal>
  );
}

export default PrescriptionModal;

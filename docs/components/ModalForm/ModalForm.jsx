import React, { useState } from 'react';
import ModalForm from '@/modal-form';
import { Card, DatePicker, Radio, Button } from 'antd';

const items = [];
for (let i = 0; i < 5; i++) {
  items.push({
    id: `field${i}`,
    label: `Field ${i}`,
  });
}
items.push({
  id: 'date',
  label: 'Field date',
  render: form => <DatePicker />,
});

export const LayoutSF = ({ title, modalFormProps }) => {
  const [modalVisible, setVisible] = useState(false);
  return (
    <Card title={title}>
      <Button onClick={() => setVisible(!modalVisible)}>查看</Button>
      <ModalForm
        visible={modalVisible}
        items={items}
        onOk={() => setVisible(!modalVisible)}
        onCancel={() => setVisible(!modalVisible)}
        {...modalFormProps}
      />
    </Card>
  );
};

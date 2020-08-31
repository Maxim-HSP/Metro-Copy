import React, { useState, useRef } from 'react';
import SearchForm from '@/search-form';
import { Card, DatePicker, Radio } from 'antd';

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

const LayoutSF = ({ title, searchFormProps }) => {
  const searchRef = useRef();
  const [btnPosition, setBtnP] = useState('rightTop');
  return (
    <Card title={title}>
      btnPosition:{' '}
      <Radio.Group
        value={btnPosition}
        onChange={e => setBtnP(e.target.value)}
        style={{ marginBottom: 20 }}
      >
        <Radio.Button value="rightTop">rightTop</Radio.Button>
        <Radio.Button value="followRight">followRight</Radio.Button>
        <Radio.Button value="follow">follow</Radio.Button>
      </Radio.Group>
      <SearchForm
        items={items}
        searchRef={searchRef}
        btnPosition={btnPosition}
        onSearch={(err, val) => console.log('formResults:', err, val)}
        {...searchFormProps}
      />
    </Card>
  );
};

export default LayoutSF;

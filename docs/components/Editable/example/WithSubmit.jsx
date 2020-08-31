import React from 'react';
import Editable from '@/editable';
import '@/editable/style/index.less';

const tableRef = React.createRef();

const dataSource = [
  {
    key: '1',
    name: '',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '2',
    name: '',
    age: 42,
    address: '西湖区湖底公园1号',
    editable: {
      disabled: ['age'],
    },
  },
  {
    key: '3',
    name: '',
    age: 42,
    address: '西湖区湖底公园1号',
    editable: {
      disabled: ['age'],
    },
  },
];

const rules = (max = 10) => [
  {
    validator: (rules, val, cb) => {
      if (val === '' || !val || val === '--') {
        cb('内容不能为空');
      } else if (val.length > max) {
        cb(`最长输入${max}个字符`);
      } else cb();
    },
  },
];

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: '30%',
    rules: [
      {
        required: true,
      },
      {
        validator: (_, value, cb) => {
          console.log('value :>> ', value);
          if (Number(value) < 0) cb('年龄不能为负数');
          cb();
        },
      },
    ],
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
    width: '30%',
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
    width: '40%',
  },
];

const WithSubmit = () => {
  function handleSubmit(dataSource) {
    tableRef.current.form.validateFieldsAndScroll(err => {
      if (err) return;
    });
    alert(JSON.stringify(dataSource));
  }
  return (
    <Editable
      tableRef={tableRef}
      dataSource={dataSource}
      columns={columns}
      rowKey="key"
      onSubmit={handleSubmit}
    />
  );
};

export default WithSubmit;

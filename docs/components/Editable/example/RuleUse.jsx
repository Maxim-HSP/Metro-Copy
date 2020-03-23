import React from 'react';
import Editable from '@/editable';
import '@/editable/style/index.less';

const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    age: -2,
    address: '西湖区湖底公园1号',
  },
  {
    key: '2',
    name: '胡彦祖',
    age: -1,
    address: '西湖区湖底公园1号',
    editable: {
      disabled: ['name'],
    },
  },
];

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: '30%',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
    width: '30%',
    rules: [
      {
        required: true,
        message: '请填写年龄',
      },
      {
        validator: (_, value, cb) => {
          if (Number(value) < 0) cb('年龄不能为负数');
          cb();
        },
      },
    ],
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
    width: '40%',
  },
];

const RuleUse = () => {
  return <Editable dataSource={dataSource} columns={columns} rowKey="key" />;
};

export default RuleUse;

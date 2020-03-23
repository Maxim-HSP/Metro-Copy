import React from 'react';
import Editable from '@/editable';
import '@/editable/style/index.less';

const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
    editable: {
      disabled: ['age'],
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
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
    width: '40%',
  },
];

const pagination = {
  pageSizeOptions: ['100', '200', '300'],
  defaultPageSize: 100,
};

const PageUse = () => {
  return (
    <Editable
      dataSource={dataSource}
      columns={columns}
      rowKey="key"
      pagination={pagination}
      needRowSelection
    />
  );
};

export default PageUse;

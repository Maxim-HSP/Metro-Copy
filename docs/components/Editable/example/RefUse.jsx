import React, { useRef } from 'react';
import { Button } from 'antd';
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
  {
    key: '3',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
    editable: {
      disabled: ['address'],
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

const RefUse = () => {
  const tableRef = useRef();

  function handleClick() {
    tableRef.current.getDataSource().then(res => {
      console.log(res);
    });
  }

  return (
    <>
      <Button onClick={handleClick}>Ref-Btn</Button>
      <Editable dataSource={dataSource} columns={columns} rowKey="key" tableRef={tableRef} />
    </>
  );
};

export default RefUse;

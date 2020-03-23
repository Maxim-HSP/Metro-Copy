import React from 'react';
import Editable from '@/editable';
import '@/editable/style/index.less';

const dataSource = [
  {
    key: '1',
    name: 'cgx',
    age: 30,
    address: '西湖区湖底公园1号',
  },
  {
    key: '2',
    name: 'hyb',
    age: 20,
    address: '西湖区湖底公园1号',
  },
];

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: '30%',
    isSelect: [{ label: '陈冠希', value: 'cgx' }, { label: '胡彦斌', value: 'hyb' }],
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
    width: '30%',
    isSelect: [
      { label: '少年', value: 10 },
      { label: '青年', value: 20 },
      { label: '中年', value: 30 },
      { label: '中老年', value: 40 },
    ],
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
    width: '40%',
  },
];

const BaseUse = () => {
  function handleCellChange(dataSource, curValue, preValue, rowIndex, dataIndex) {
    console.log('dataSource', dataSource);
    console.log('curValue', curValue);
    console.log('preValue', preValue);
    console.log('rowIndex', rowIndex);
    console.log('dataIndex', dataIndex);
  }

  return (
    <Editable
      dataSource={dataSource}
      columns={columns}
      rowKey="key"
      onCellChange={handleCellChange}
    />
  );
};

export default BaseUse;

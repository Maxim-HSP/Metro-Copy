import React, { useState } from 'react';
import { Card } from 'antd';
import SearchTree from '@/search-tree';
import './style/index.less';

const data = [
  {
    id: '0',
    fid: null,
    name: '0',
    children: [
      {
        id: '0-0',
        fid: '0',
        name: '0-0',
        children: [
          {
            id: '0-0-0',
            fid: '0-0',
            name: '0-0-0',
          },
        ],
      },
      {
        id: '0-1',
        fid: '0',
        name: '0-1',
      },
    ]
  },
  {
    id: '1',
    fid: null,
    name: '1',
    children: [
      {
        id: '1-0',
        fid: '1',
        name: '1-0',
      },
      {
        id: '1-1',
        fid: '1',
        name: '1-1',
      },
    ]
  },
  {
    id: '2',
    fid: null,
    name: '2',
    children: [
      {
        id: '2-0',
        fid: '2',
        name: '2-0',
      },
    ]
  },
];

export const BaseUse = () => (
  <Card>
    <SearchTree data={data} defaultExpandedKeys={['0']} />
  </Card>
);

export const CustomStyle = () => (
  <Card>
    <SearchTree wrapperClassName="searchTree" data={data} />
  </Card>
);

const setTreeNodeProps = (item, index) => ({
  style: {
    background: index % 2 === 0 ? 'pink' : '',
  }
});
export const CustomTreeNode = () => (
  <Card>
    <SearchTree setTreeNodeProps={setTreeNodeProps} data={data} />
  </Card>
);

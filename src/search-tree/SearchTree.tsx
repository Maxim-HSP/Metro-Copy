/*
 * 搜索树组件SearchTree
 * @Author: zhaoxc
 * @Date: 2019-07-09 17:35:16
 * @Last Modified by: zhaoxc
 * @Last Modified time: 2019-07-15 19:25:02
 */
import React, { useState, useEffect } from 'react';
import { Input, Tree } from 'antd';

import { TreeProps } from 'antd/lib/tree';

import './style/index.less';

const Search = Input.Search;
const TreeNode = Tree.TreeNode;

const keysEmpty: string[] = [];
const noop = () => {};

const emptyTreeNodeProps: ITreeNodeProps = {};

export interface ISearchTreeProps extends TreeProps {
  //外层容器className
  wrapperClassName?: string,
  //搜索树数据
  data: object [],
  setTreeNodeProps?: (item: object, index?: number) => ITreeNodeProps,
  //搜索回调
  onSearch?: (query: string) => void,
}

export interface ITreeNodeProps {
  style?: object,
  [restProps: string]: any,
}

const checkTreeNode = (item, searchValue) => {
  const { name, children } = item;

  // 本身有 search value 的字符串，则不进行下一步，render 时 不隐藏
  if (!searchValue || name.includes(searchValue)) {
    return false;
  }

  // 查看 children 是否有 search value ，如果全部无，则返回 true 隐藏该 tree node
  // 其中任何一个有 search value ，则返回 false，不隐藏
  if (children && children.length) {
    return children.every(child => checkTreeNode(child, searchValue));
  }

  // 没 children 且 自己没有 search value，则返回 true 隐藏该 tree node
  return true;
};

const generateSearchData = (data, searchValue = '') => {
  let searchData = data;
  if (searchValue) {
    searchData = [];
    data.forEach(item => {
      const { name, children } = item;
      if (name.indexOf(searchValue) > -1) {
        searchData.push(item);
      } else if (children && children.length) {
        const childrenData = generateSearchData(children, searchValue);
        if (childrenData.length) {
          searchData.push({
            ...item,
            children: childrenData,
          });
        }
      }
    });
  }
  return searchData;
};

const getSearchExpandedKeys = (data, searchValue = '', parentKey = '') => {
  let expandedKeys = [];
  data.forEach(item => {
    const { id, name, children } = item;
    if (name.indexOf(searchValue) > -1) {
      expandedKeys.push(parentKey);
    } else if (children && children.length) {
      const childrenData = getSearchExpandedKeys(children, searchValue, id);
      if (childrenData.length) {
        expandedKeys.push(...childrenData, id);
      }
    }
  });
  // 去重
  return expandedKeys.filter((item, i, self) => item && self.indexOf(item) === i);
};


const SearchTree: React.SFC<ISearchTreeProps> = props => {
  const {
    data,
    setTreeNodeProps,
    onSearch = noop,
    onExpand,
    defaultExpandedKeys = keysEmpty,
    wrapperClassName,
    ...restProps
  } = props;
  const [searchValue, setSearchValue] = useState('');
  const [expandedKeys, setExpandedKeys] = useState(defaultExpandedKeys);

  useEffect(() => {
    setExpandedKeys(defaultExpandedKeys);
  }, [JSON.stringify(defaultExpandedKeys)]);

  const generateTree = data =>
    data.map((item, index) => {
      const { id, name, children, fid } = item;
      const { style = {} , ...restProps } = setTreeNodeProps ? setTreeNodeProps(item, index) : emptyTreeNodeProps;
      return (
        <TreeNode
          style={{ ...style, display: checkTreeNode(item, searchValue) ? 'none' : 'block' }}
          key={id}
          fid={fid}
          title={name}
          {...restProps}
        >
          {children && children.length > 0 && generateTree(children)}
        </TreeNode>
      );
    });

  const onSearchChange = e => {
    const { value } = e.target;
    setSearchValue(value);
    if(value === '') {
      setExpandedKeys(defaultExpandedKeys);
    } else {
      setExpandedKeys(getSearchExpandedKeys(data, value));
    }
    onSearch && onSearch(value);
  };

  const onExpandChange = (expandedKeys, info) => {
    setExpandedKeys(expandedKeys);
    onExpand && onExpand(expandedKeys, info);
  };

  return (
    <div className={wrapperClassName}>
      <Search placeholder="请输入内容" value={searchValue} onChange={onSearchChange} />
      <Tree showLine {...restProps} expandedKeys={expandedKeys} onExpand={onExpandChange}>
        {generateTree(data)}
      </Tree>
    </div>
  )
}

export default SearchTree;

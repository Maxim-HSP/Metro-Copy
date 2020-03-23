import React, { Component } from 'react';
import { Table, Alert } from 'antd';
import { TableProps, PaginationConfig } from 'antd/lib/table';
import intersection from 'lodash/intersection';
import pick from 'lodash/pick';

import './style/index.less';

export type TData<T> = {
  list: T[];
  pagination?: PaginationConfig | boolean;
};

export type NeedRowSelection =
  | boolean
  | {
      alert?: boolean;
    };

export interface StandardTableProps<T = any> extends TableProps<T> {
  data?: TData<T>;
  //  是否开启选择功能&显示统计
  needRowSelection?: NeedRowSelection;
  // 选择/取消选择回调 = rowSelection.onChange
  onSelectRow?: (rowKeys: string[], rows: T[]) => void;
  // 禁用选择功能
  disabled?: (record: T) => boolean;
  // 指定选中行
  selectedRowKeys?: string[];
}

export interface StandardTableState<T> {
  selectedRowKeys: string[];
  preData: TData<T>;
  preSelectedRowKeys: string[];
}

export default class StandardTable<T> extends Component<
  StandardTableProps<T>,
  StandardTableState<T>
> {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      preData: this.props.data,
      preSelectedRowKeys: this.props.selectedRowKeys,
    };
  }

  static getDerivedStateFromProps(nextProps, state) {
    const { data: nextData = {}, selectedRowKeys: nextSelectedRowKeys, rowKey } = nextProps;
    const { selectedRowKeys } = state;
    const { list = [] } = nextData;
    let dataRowKeys = [];
    const newState = {
      preData: nextData,
      preSelectedRowKeys: nextSelectedRowKeys,
    } as StandardTableState<any>;

    if (nextSelectedRowKeys !== state.preSelectedRowKeys) {
      // selectedRowKeys mutation cause force update
      newState.selectedRowKeys = nextSelectedRowKeys;
    } else if (nextData !== state.preData) {
      // data mutation cause force update the selectedRowKeys.
      if (typeof rowKey === 'string') {
        dataRowKeys = list.map(row => row[rowKey]);
      } else if (typeof rowKey === 'function') {
        dataRowKeys = list.map(row => rowKey(row));
      }

      newState.selectedRowKeys = intersection(selectedRowKeys, dataRowKeys);
    }
    return newState;
  }

  handleTableChange = (pagination, filters, sorter, extra) => {
    const { onChange } = this.props;
    // 关注主要数据，减少业务代码结构。
    const pickedPagination = pick(pagination, ['current', 'pageSize']);
    onChange && onChange(pickedPagination, filters, sorter, extra);
  };

  handleRowSelectChange = (rowKeys, rows) => {
    const { onSelectRow } = this.props;
    this.setState({
      selectedRowKeys: rowKeys,
    });
    onSelectRow && onSelectRow(rowKeys, rows);
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };

  render() {
    const { selectedRowKeys } = this.state;
    const { data = {}, needRowSelection, rowSelection = {}, disabled, ...rest } = this.props;
    const { list = [], pagination } = data as TData<T>;

    // pagination = falsy: 表格不展示和进行分页
    const paginationProps =
      pagination && Object.keys(pagination).length > 0
        ? {
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共${total}条记录`,
            ...(typeof pagination === 'object' ? pagination : {}),
          }
        : false;

    const rowSelectionProps = needRowSelection
      ? {
          ...rowSelection,
          selectedRowKeys,
          onChange: this.handleRowSelectChange,
          getCheckboxProps: record => ({
            disabled: disabled && disabled(record),
          }),
        }
      : null;

    const toLeaf = (data, callback) => {
      if (data.children && Array.isArray(data.children)) {
        data.children.forEach(child => {
          toLeaf(child, callback);
        });
      } else {
        callback(data);
      }
    };

    if (this.props.columns) {
      this.props.columns.forEach(column => {
        if (column.align) return;
        toLeaf(column, item => {
          if (item.title && typeof item.title === 'string' && !item.align) {
            item.title = <div style={{ textAlign: 'center' }}>{item.title}</div>;
          }
        });
      });
    }

    const needAlert: boolean =
      needRowSelection === true ||
      (typeof needRowSelection === 'object' && needRowSelection.alert === true);

    return (
      <>
        {needAlert ? (
          <div className="tableAlert">
            <Alert
              message={
                <div>
                  已选择 <a style={{ fontWeight: 600 }}> {selectedRowKeys.length} </a> 项数据
                  &nbsp;&nbsp;
                  <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>
                    清空
                  </a>
                </div>
              }
              type="info"
              showIcon
            />
          </div>
        ) : null}
        <Table
          {...rest}
          dataSource={list}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          rowSelection={rowSelectionProps}
        />
      </>
    );
  }
}

export { StandardTable };

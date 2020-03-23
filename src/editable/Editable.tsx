import React, { RefObject, useImperativeHandle } from 'react';
import { Form, Button } from 'antd';

import { FormComponentProps, ValidationRule } from 'antd/lib/form';
import { TableProps, ColumnProps } from 'antd/lib/table';
import { ButtonProps } from 'antd/lib/button';

import useProps from './useProps';
import { withDefaultProps, Omit } from '../_utils/type';
import StandardTable from '../standard-table';

import './style/index.less';
interface IDataEditable {
  disabled: string[];
}

interface IDataSource {
  editable: boolean | IDataEditable;
}

export interface EditableColumn<T = any> extends ColumnProps<T> {
  /** 列的是否可编辑 */
  editable?: boolean;
  /** 列数据的校验规则 ref: https://ant.design/components/form-cn/#%E6%A0%A1%E9%AA%8C%E8%A7%84%E5%88%99 */
  rule?: ValidationRule[];
  /** 是否启动Select作为单元格控件 */
  isSelect?: boolean | Array<{ label: string; value: any }>;
}

export interface EditableProps<T = any> extends TableProps<T>, FormComponentProps {
  /** 表格列的配置描述， 用过 antd Table 的都懂 */
  columns?: Array<EditableColumn<T>>;
  /** 单元格更新回调 */
  onCellChange?: (
    nextSource: T[],
    curValue: any,
    beforeValue: any,
    rowIndex: number,
    dataIndex: string,
  ) => void;
  /** 保存按钮回调，如传入此属性，则会在表格下方多出一个button */
  onSubmit?: (nextSource: T[]) => void;
  /** 保存按钮的props, 与onSubmit联用, 可用 text 属性设置按钮文字 */
  btnProps?: { text?: string } & ButtonProps;
  tableRef?: RefObject<any>;
}

const Editable = <T extends IDataSource>({
  dataSource,
  columns,
  form,
  btnProps,
  onCellChange,
  pagination,
  onSubmit,
  tableRef,
  ...resProps
}: EditableProps<T>): JSX.Element => {
  const { cacheSource, editColumns, hasError, isEdit, getDataSource } = useProps(
    dataSource,
    columns,
    onCellChange,
    form,
  );

  const { text: btnText, ...restBtnProps } = btnProps;

  useImperativeHandle(tableRef, () => ({ isEdit, getDataSource }));

  function handleSubmit() {
    if (onSubmit) onSubmit(cacheSource);
  }

  const data = {
    list: cacheSource,
    pagination: pagination || false,
  };

  return (
    <>
      <StandardTable
        className="metro-editable"
        dataSource={cacheSource}
        columns={editColumns}
        rowClassName={() => 'metro-editable-row'}
        data={data}
        {...resProps}
      />
      {onSubmit && (
        <Button
          onClick={handleSubmit}
          {...restBtnProps}
          disabled={hasError}
          className="metro-editable-submitBtn"
        >
          {btnText}
        </Button>
      )}
    </>
  );
};

const defaultProps: Omit<EditableProps<any>, 'form'> = {
  dataSource: [],
  columns: [],
  btnProps: { text: '保存', style: { marginTop: 10 } },
  onCellChange: () => {},
};

export default withDefaultProps(defaultProps, Form.create()(Editable));

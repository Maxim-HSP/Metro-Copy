import React, { useMemo, RefObject, useImperativeHandle } from 'react';
import { Form, Button } from 'antd';

import { FormComponentProps, ValidationRule } from 'antd/lib/form';
import { TableProps, ColumnProps } from 'antd/lib/table';
import { ButtonProps } from 'antd/lib/button';

import useProps, { useCreateForm } from './useProps';
import { withDefaultProps, Omit } from '../_utils/type';
import StandardTable from '../standard-table';
import './style/index.less';

/**---------------------------------types------------------------------------------- */

interface IDataEditable {
  /** 该行不可编辑的列 key */
  disabled: string[];
}

interface IDataSource {
  /** 该行是否可编辑 */
  editable: boolean | IDataEditable;
}

export interface EditableColumn<T = any> extends ColumnProps<T> {
  /** 该列是否可编辑 */
  editable?: boolean;
  /** 列数据的校验规则 ref: https://ant.design/components/form-cn/#%E6%A0%A1%E9%AA%8C%E8%A7%84%E5%88%99 */
  rule?: ValidationRule[];
  /** 是否将该单元格换为Select */
  isSelect?: boolean | Array<{ label: string; value: any }>;
}

export type OnCellChange<T> = (
  /** 更新后的 dataSource */
  nextSource: T[],
  /** 更新后当前单元格的值 */
  curValue: any,
  /** 更新前当前单元格的值 */
  beforeValue: any,
  /** 当前单元格的 rowIndex */
  rowIndex: number,
  /** 当前单元格的 dataIndex */
  dataIndex: string,
) => void

export interface EditableProps<T = any> extends TableProps<T>, FormComponentProps {
  /** 表格列的配置数组，基本与antd Table保持一致 */
  columns?: Array<EditableColumn<T>>;
  /** 单元格更新回调 */
  onCellChange?: OnCellChange<T>;
  /** 保存按钮回调，如传入此属性，则会在表格下方多出一个button */
  onSubmit?: (nextSource: T[], form: any) => void;
  /** 保存按钮的props, 与onSubmit联用, 可用 text 属性设置按钮文字 */
  btnProps?: { text?: string } & ButtonProps;
  /** 表格Ref，暴露指定对象{isEdit, getDataSource, form} */
  tableRef?: RefObject<any>;
  /** 是否有校验出错，由组件自动维护，用于控制提交按钮禁用等 */
  hasErr?: boolean;
}

/**---------------------------------component------------------------------------------- */

const Editable = <T extends IDataSource>({
  dataSource,
  columns,
  onSubmit,
  onCellChange,
  pagination,
  tableRef,
  btnProps: { text: btnText, ...restBtnProps },
  // self props
  form, hasErr,
  ...resProps
}: EditableProps<T>): JSX.Element => {

  // parse main props
  const { cacheSource, editColumns, curCell, getDataSource } = 
    useProps(dataSource, columns, onCellChange, form)

  // ref registry
  useImperativeHandle(tableRef, () => ({ isEdit: curCell !== null, getDataSource, form }));

  return (
    <>
      <StandardTable
        className="metro-editable"
        dataSource={cacheSource}
        columns={editColumns}
        rowClassName={() => 'metro-editable-row'}
        data={{
          list: cacheSource,
          pagination: pagination || false,
        }}
        {...resProps}
      />
      {onSubmit && (
        <Button
          className="metro-editable-submitBtn"
          onClick={() => onSubmit(cacheSource, form)}
          // 错误禁用是自动的，可以由btnProps覆盖disable属性
          disabled={hasErr}
          {...restBtnProps}
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

export default withDefaultProps(defaultProps, (props) => {
  const { hasErr, ...opts } = useCreateForm();
  // 避免重复create form，注意opts中的变量会被闭包
  const ReadyEditable = useMemo(() => Form.create(opts)(Editable), []);
  return <ReadyEditable hasErr={hasErr} {...props} />;
});

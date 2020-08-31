import React, { FC, useEffect, RefObject } from 'react';
import { Input, Form, Select } from 'antd';
import { ValidationRule } from 'antd/lib/form';

const Item = Form.Item;
const Option = Select.Option;

export type CellType = {
  dataIndex: string;
  rowIndex: number;
} | null;

export interface CellProps {
  form: any;
  dataIndex: string;
  rowIndex: number;
  curCell: CellType;
  onSetCurCell: (curCell: CellType) => void;
  initialValue: any;
  rules: ValidationRule[];
  isSelect: boolean | Array<{ label: string; value: any }>;
}

const Cell: FC<CellProps> = ({
  form,
  dataIndex,
  rowIndex,
  curCell,
  onSetCurCell,
  initialValue,
  rules = [],
  isSelect,
}) => {
  // 是否处于可编辑状态
  const isEditing: boolean =
    !!curCell && curCell.dataIndex === dataIndex && curCell.rowIndex === rowIndex;
  // input Ref，用于激活后自动focus
  const inputRef = useFocus(isEditing);

  // 失焦、输入完成后，更新CurCell以触发hooks更新
  function handleSave() {
    onSetCurCell(null);
  }

  // 非编辑状态 静态值
  const handleActive = () => onSetCurCell({ dataIndex, rowIndex })
  const stockCell = (
    <div onClick={handleActive} className="editable-cell-value-wrap">
      {Array.isArray(isSelect)
        ? (function() {
            const target = isSelect.find(({ value }) => value === initialValue);
            return target ? target.label : initialValue;
          })()
        : initialValue}
    </div>
  );

  // 匹配控件
  const getFormItem = () => {
    if (isSelect) {
      return (
        <Select onChange={handleSave} ref={inputRef} onBlur={handleSave} style={{ width: '100%' }}>
          {Array.isArray(isSelect) &&
            isSelect.map((item, index) => (
              <Option key={index} value={item.value}>
                {item.label}
              </Option>
            ))}
        </Select>
      );
    } else {
      return <Input ref={inputRef} onPressEnter={handleSave} onBlur={handleSave} />;
    }
  };

  // 匹配校验
  const rulesWithCellInfo = rules.map(item => {
    const { validator } = item;
    return validator
      ? {
          ...item,
          validator: (rule: any, value: any, callback: any) => {
            validator(rule, value, callback, curCell);
          },
        }
      : item;
  });

  return (
    <div style={{ textAlign: 'left' }}>
      <Item>
        {form.getFieldDecorator(`${dataIndex}-${rowIndex}`, {
          initialValue: initialValue === '--' ? '' : initialValue,
          rules: rulesWithCellInfo,
        })(isEditing ? getFormItem() : stockCell)}
      </Item>
    </div>
  );
};

const useFocus = (isEditing: boolean) => {
  const inputRef: RefObject<any> = React.createRef();
  useEffect(() => {
    // 被激活时自动focus
    if (isEditing && inputRef.current) inputRef.current.focus();
  }, [isEditing]);
  return inputRef;
};

export default Cell;

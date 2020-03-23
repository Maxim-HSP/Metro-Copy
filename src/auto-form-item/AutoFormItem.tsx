import * as React from 'react';
import { Col, Form } from 'antd';
import { ColProps } from 'antd/lib/col';
import { FormItemProps } from 'antd/lib/form';

import './style/index.less';
export interface IAutoFormItemProp extends FormItemProps {
  form?: any;
  /** 表单域id */
  id?: string;
  /** 表单域标签 */
  label?: string;
  /** 表单域控件 */
  comp: JSX.Element;
  /** 表单Item占位，同栅格布局 */
  col?: {
    span?: number;
    resSpan?: ColProps;
  };
  /** 不自动设置labelCol和wrapperCol */
  disableSizeCol?: boolean;
  /** 不包裹栅格式布局（Col组件） */
  disabledGrid?: boolean;
  /** 同 form.getFieldDecorator 参数 */
  options?: any;
}

// 默认 Form.Item 区域占位
const defaultItemCol: ColProps = { xxl: 6, xl: 8, lg: 12, md: 24, sm: 24 };
// 默认 标签/控件 栅格占位
const defaultSizeCol = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

// 单个表单Item
export default (props: IAutoFormItemProp) => {
  const {
    // 基本必要属性
    form,
    id,
    comp,
    label,
    // 总占位，或响应式栅格（span优先于响应式）
    col = {},
    // 依据antd 3.14新增，可在Form组件上统一设置labelCol和wrapperCol
    // 故需要disableSizeCol用于封装Form类组件时，关闭Item的defaultSizeCol
    disableSizeCol = false,
    // 不使用栅格布局（不渲染Col）
    disabledGrid,
    // 表单域注册配置
    options = {},
    // 其他属性(最终生效于Form.Item)
    ...restProps
  } = props;
  // 注册表单域，无id则不注册
  const RightComp: JSX.Element = id && form ? form.getFieldDecorator(id, options)(comp) : comp;
  const { span, resSpan = defaultItemCol } = col;
  /** ----------------------------Render-------------------------------- */
  const formItem = (
    <Form.Item
      label={label}
      {...(disableSizeCol ? {} : defaultSizeCol)}
      // defaultSizeCol 可以被传入的labelCol等覆盖
      {...restProps}
    >
      {RightComp}
    </Form.Item>
  )
  return (disabledGrid ? formItem : <Col span={span} {...(span ? {} : resSpan)}>{formItem}</Col>);
};

import React, { useMemo } from 'react';
import { Form, Input, Row, Col, Button, Divider } from 'antd';

// interface
import { ColProps } from 'antd/lib/col';
import { FormCreateOption, FormProps, ValidateCallback } from 'antd/lib/form';

import AutoFormItem, { IAutoFormItemProp } from '../auto-form-item';
import { Omit } from '../_utils/type';

import './style/index.less';

/**---------------------------------types------------------------------------------- */

export interface ISearchFormItem extends Omit<IAutoFormItemProp, 'comp'> {
  /**
   * Set this to change alert kind
   * @default info
   */
  render?: (form: any) => JSX.Element;
}
// 主要接口
export interface ISearchFromProps extends Omit<IAutoFormProps, 'form'> {
  /** Form.create 的可选 options */
  /**
   * Set this to change alert kind
   * @default info
   */
  options?: FormCreateOption<any>;
}
export interface IAutoFormProps
  extends Omit<FormProps & ILayoutProps, 'handleReset' | 'btnElement'> {
  /** 指定表单配置数组，一个元素为一个Item，可以是一个函数（以form作为参数） */
  items?: Array<ISearchFormItem> | ((form?: any) => Array<ISearchFormItem>);
  /** 快捷设置每个Form.Item的props（包括style等），可避免在items数组中写入重复的属性 */
  itemsProps?: IAutoFormItemProp;
  /** 受控重置，接收form为参数 */
  onReset?: (form?: any) => void;
  /** 受控提交，接收form为参数 */
  onSubmit?: (form?: any) => void;
  /** 非受控提交，同 validateFields 的 callback */
  onSearch?: ValidateCallback<object>;
  /** 自定义按钮render，接收form为参数 */
  btnRender?: ((form?: any) => JSX.Element) | JSX.Element;
  /** form */
  form?: any;
}
interface ILayoutProps extends IBtnGroupProps {
  /** 不使用栅格式布局 */
  disabledGrid?: boolean;
  /** 按钮位置，可能的值：'rightTop', 'followRight', 'follow' */
  btnPosition?: 'rightTop' | 'followRight' | 'follow';
  btnElement?: JSX.Element;
}
interface IBtnGroupProps {
  /** 查询按钮的 loading 状态 */
  btnLoading?: boolean;
  handleReset?: (form?: any) => void;
}

/**---------------------------------component------------------------------------------- */

// 默认 标签/控件 栅格占位
const defaultSizeCol: { labelCol: ColProps; wrapperCol: ColProps; labelAlign: 'right' | 'left' } = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
  labelAlign: 'left',
};
// 右对齐 标签/控件 栅格占位
const rightSizeCol: { labelCol: ColProps; wrapperCol: ColProps } = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};

const SearchForm: React.SFC<ISearchFromProps> = props => {
  const { options, ...restProps } = props;
  // 只兼容静态的options（即初始化时传入的options），缓存ReadyAutoForm，以免被频繁create导致表单重置
  const ReadyAutoForm = useMemo(() => {
    return Form.create(options)(AutoForm);
  }, []);
  return <ReadyAutoForm {...restProps} />;
};

const AutoForm: React.FC<IAutoFormProps> = props => {
  const {
    // 基础核心props
    form,
    items,
    onReset,
    onSubmit,
    onSearch,
    // 功能性props
    disabledGrid,
    itemsProps,
    // 按钮相关props
    btnLoading,
    btnPosition,
    btnRender,
    // 传递 Form props
    ...formProps
  } = props;

  // items兼容函数模式接收form作为参数，以支持动态表单（如联动效验等）
  const autoFormItems = typeof items === 'function' ? items(form) : items;
  // btnRender兼容函数模式接收form作为参数，可调用form api实现功能
  const btnElement = typeof btnRender === 'function' ? btnRender(form) : btnRender;
  // 使用按钮靠右布局时，改变表单布局为右对齐
  const sizeCol = btnPosition === 'followRight' ? rightSizeCol : defaultSizeCol;

  // 提交
  const submit = e => {
    e.preventDefault();
    if (onSubmit) {
      // 受控
      onSubmit(form);
    } else {
      // 不受控
      form.validateFields(onSearch);
    }
  };
  // 重置
  const handleReset = () => {
    if (onReset) onReset(form);
    // 受控
    else form.resetFields(); // 不受控
  };

  return (
    <Form
      onSubmit={submit}
      layout={disabledGrid ? 'inline' : 'horizontal'}
      // antd 3.14新增，可在Form上设置Col
      // 不使用栅格布局，则默认不设置labelCol和wrapperCol
      {...(disabledGrid ? {} : sizeCol)}
      {...formProps}
    >
      <Layout
        btnPosition={btnPosition}
        btnLoading={btnLoading}
        btnElement={btnElement}
        handleReset={handleReset}
        disabledGrid={disabledGrid}
      >
        {autoFormItems &&
          autoFormItems.map((item, i) => {
            const { id, render, ...itemProps } = item;
            return (
              <AutoFormItem
                form={form}
                key={id || item.label || i}
                id={id}
                disableSizeCol
                disabledGrid={disabledGrid}
                comp={
                  render ? render(form) : <Input placeholder={`请输入${item.label || id || ''}`} />
                }
                {...itemsProps}
                {...itemProps}
              />
            );
          })}
      </Layout>
    </Form>
  );
};

const Layout: React.FC<ILayoutProps> = props => {
  const { btnPosition, btnLoading, btnElement, handleReset, disabledGrid, children } = props;

  const btnGroup = btnElement || <BtnGroup btnLoading={btnLoading} handleReset={handleReset} />;
  const bthColStyle = { height: '40px', lineHeight: '40px', display: 'inline-block' };
  // 在disabledGrid为true时，默认为follow布局
  const finalBtnPosition = disabledGrid && !btnPosition ? 'follow' : btnPosition;

  switch (finalBtnPosition) {
    case 'follow':
      return (
        <Row gutter={0}>
          {children}
          <Col style={bthColStyle}>{btnGroup}</Col>
        </Row>
      );
    case 'followRight':
      return (
        <Row gutter={0}>
          {children}
          <Col style={{ ...bthColStyle, float: 'right' }}>{btnGroup}</Col>
        </Row>
      );
    default:
      return (
        // 为了实现按钮自适应宽度且位置靠右，目前暂用flex布局最为合适
        <Row gutter={0} style={{ display: 'flex' }}>
          <Col style={{ width: '100%' }}>{children}</Col>
          <Col style={{ ...bthColStyle, whiteSpace: 'nowrap' }}>{btnGroup}</Col>
        </Row>
      );
  }
};

// 默认按钮组，可通过btnRender覆盖
const BtnGroup: React.FC<IBtnGroupProps> = props => {
  return (
    <>
      <Button
        type="primary"
        icon="search"
        htmlType="submit"
        size="default"
        loading={props.btnLoading}
      >
        查询
      </Button>
      <Divider type="vertical" />
      <Button onClick={props.handleReset} size="default">
        重置
      </Button>
    </>
  );
};

export default SearchForm;

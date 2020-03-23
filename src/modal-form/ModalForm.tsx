import React, { useMemo } from 'react';
import { Modal, Form, Input, Row } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { FormCreateOption } from 'antd/lib/form';

import { Omit } from '../_utils/type';
import AutoFormItem, { IAutoFormItemProp } from '../auto-form-item';

import './style/index.less';
export interface IModalFormItem extends Omit<IAutoFormItemProp, 'comp'> {
  render?: (form: any) => JSX.Element;
}
export interface IModalForm<T> extends IBaseModalForm {
  options?: FormCreateOption<T>;
}
// 继承 Antd ModalProps，同时覆盖 onOk 类型
type OnOk = (err: object, val: object, form: any) => void | Promise<any>;
interface IModalProps extends Omit<ModalProps, 'onOk'> {
  onOk?: OnOk;
}

export interface IBaseModalForm {
  form?: any;
  /** 设置 Modal 组件的 props */
  modalProps?: IModalProps;
  /** Modal props - title */
  title?: string;
  /** Modal props - visible */
  visible?: boolean;
  /** 点击取消或关闭的回调，接收 form 为参数 */
  onCancel?: (form: any) => void;
  /** 点击确定的回调，非受控提交 */
  onOk?: OnOk;
  /** 默认确认按钮的loading状态 */
  btnLoading?: boolean;
  /** 自定义 Modal 底部内容，接收form作为参数 */
  footer?: (form?: any) => JSX.Element;
  /** 指定表单配置数组, 一个元素为一个Item，可以是一个函数（以form作为参数）*/
  items?: (form?: any) => IModalFormItem[] | IModalFormItem[];
  /** 是否给每个 Form.Item 添加 hasFeedback */
  hasFeedback?: boolean;
  /** 点击确定的回调，受控提交，接收 form 为参数 */
  onSubmit?: (form: any) => void;
}

interface IFormContent {
  hasFeedback?: boolean;
  items?: IModalFormItem[];
  form?: any;
}

// 默认 标签/控件 栅格占位
const defaultSizeCol = {
  labelCol: { span: 8 },
  wrapperCol: { span: 15 },
};

const ModalForm: React.FC<IModalForm<object>> = props => {
  const { options, ...restProps } = props;
  // 只兼容静态的options（即初始化时传入的options），缓存ReadyAutoForm，以免被频繁create导致表单重置
  const ReadyAutoForm = useMemo(() => {
    return Form.create(options)(BaseModalForm);
  }, []);
  return <ReadyAutoForm {...restProps} />;
};

const defaultModalProps: IModalProps = {};

const BaseModalForm: React.FC<IBaseModalForm> = props => {
  const {
    // Modal
    // 设置Modal可只用modalProps，以下参数可直接写在ModalForm上方便使用
    modalProps: {
      onOk: mOnok,
      onCancel: mOnCancle,
      footer: mFooter,
      ...restModalProps
    } = defaultModalProps,
    title,
    visible,
    btnLoading,
    onOk = mOnok,
    onCancel = mOnCancle,
    footer = mFooter,
    // Form.Item
    form,
    items,
    hasFeedback,
    // Form
    onSubmit,
    ...formProps
  } = props;

  // 兼容footer接收form作为参数生成动态自定义按钮或其他组件
  const footerElement = typeof footer === 'function' ? footer(form) : footer;

  // 保存按钮逻辑（提交）
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      // 受控
      onSubmit(form);
    } else {
      // 不受控
      form.validateFields((err: object, val: object) => onOk(err, val, form));
    }
  };
  // 取消按钮逻辑（重置）
  const handleReset = () => {
    if (onCancel) {
      form.resetFields();
      onCancel(form);
    }
  };

  return (
    <Form
      labelAlign="right"
      onSubmit={submit}
      autoComplete="off"
      // antd 3.14新增，可在Form上设置Col
      {...defaultSizeCol}
      {...formProps}
    >
      <Modal
        okText="保存"
        cancelText="取消"
        closable={true}
        keyboard={false}
        maskClosable={false}
        // 可变props
        title={title}
        visible={visible}
        confirmLoading={btnLoading}
        onOk={submit}
        onCancel={handleReset}
        {...(footerElement ? { footer: footerElement } : {})}
        {...restModalProps}
      >
        <FormContent
          // 用于AutoFormItem
          // 用于AutoFormItem，兼容函数模式传递form作为参数动态生成
          items={typeof items === 'function' ? items(form) : items}
          form={form}
          hasFeedback={hasFeedback}
        />
      </Modal>
    </Form>
  );
};

const FormContent: React.FC<IFormContent> = props => {
  const { items, form, hasFeedback } = props;
  return (
    <Row gutter={0}>
      {items &&
        items.map((item: IModalFormItem, i: number) => {
          const { id, render, ...itemProps } = item;
          const comp = render ? (
            render(form)
          ) : (
            <Input placeholder={`请输入${item.label || id || ''}`} />
          );
          // 当render返回null时，不渲染整个item，不注册表单域（实际上用null注册表单域也会报错）
          if (comp === null) return null;
          return (
            <AutoFormItem
              form={form}
              key={id || item.label || i}
              id={id}
              hasFeedback={hasFeedback}
              col={{ resSpan: { xxl: 12, xl: 12, lg: 12, md: 24, sm: 24 } }}
              disableSizeCol
              comp={comp}
              // 如果col占位是24（满行），自动填满标签/控件 比例
              {...(item.col && item.col.span === 24
                ? {
                    labelCol: { span: 4 },
                    wrapperCol: { span: 20 },
                  }
                : {})}
              {...itemProps}
            />
          );
        })}
    </Row>
  );
};

export default ModalForm;

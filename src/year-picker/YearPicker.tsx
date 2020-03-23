import React, { useState } from 'react';
import { DatePicker } from 'antd';
import * as moment from 'moment';
import { DatePickerProps, DatePickerMode } from 'antd/lib/date-picker/interface';

import './style/index.less';

export interface IYearPickerProps extends DatePickerProps {
  onChange?: (date: moment.Moment) => void;
  [props: string]: any;
}

const useYearPicker = (props: IYearPickerProps): IYearPickerProps => {
  const { onChange, ...restProps } = props;
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<moment.Moment>(restProps.value || restProps.defaultValue);
  return {
    open,
    value,
    mode: 'year',
    showToday: false,
    format: 'YYYY',
    // 不使用onBlur或onFocus，会造成闪烁，因为每次点击都会触发这两个句柄
    onOpenChange: (open: boolean) => {
      if (open) setOpen(true)
      else setOpen(false)
    },
    onPanelChange: (val: moment.Moment, curMode: DatePickerMode) => {
      // 兼容value受控的情况
      if (!restProps.value) {
        setValue(val)
      }
      if (!curMode) {
        setOpen(false)
        if (onChange) onChange(val)
      }
    },
    // 兼容clear按钮，由于value是由onPanelChange维护的，故DatePicker的onChange只会在点击clear按钮时触发
    onChange: (val) => {
      if (!val) {
        setValue(val)
        if (onChange) onChange(val)
      }
    },
    ...restProps,
  };
};

const YearPicker: React.SFC<IYearPickerProps> = props => {
  return <DatePicker {...useYearPicker(props)} />;
};

// 兼容被Form注册为表单域的情况（form在注册表单域时会使用ref）
class ClassYearPicker extends React.PureComponent<IYearPickerProps, unknown> {
  render() {
    return <YearPicker {...this.props} />
  }
}

export {
  ClassYearPicker as default,
  YearPicker as PureYearPicker
}
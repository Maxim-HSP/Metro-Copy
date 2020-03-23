import React, { useReducer, useEffect, Component } from 'react';
import { Upload, Modal, Icon, message } from 'antd';
import { UploadFile, UploadChangeParam, UploadProps } from 'antd/lib/upload/interface';

import { reducer, initialState } from './reducer';

import { withDefaultProps } from '../_utils/type';

import './style/index.less';

export interface IBaseUploadProps {
  // 上传的地址
  action?: string;
  // 项目使用的request，通常在@utils/request
  request?: (...arg: any[]) => Promise<any>;
  // 最大尺寸 单位（MB）
  maxSize?: number;
  // 最大文件数
  maxLength?: number;
  // 文件列表
  value?: UploadFile[];
  // 支持上传的文件类型
  fileType?: string[];
  // fileList 的 change 回调， 只会在 status 为 done 的时候触发
  onChange?(fileList: UploadFile[]): void;
  // 上传地址是否使用公共网关
  isCommonApi?: boolean;
}

const BaseUpload: React.FC<IBaseUploadProps> = props => {
  const {
    action,
    maxLength,
    maxSize,
    fileType,
    value,
    request,
    onChange: propOnChange,
    isCommonApi = false,
  } = props;

  const [state, dispatch] = useReducer(reducer, initialState);

  const { previewVisible, previewImage, fileList, loading } = state;

  useEffect(() => {
    dispatch({
      type: 'CHANGE',
      payload: value || [],
    });
  }, [value]);

  function handlePreview(file: UploadFile) {
    dispatch({
      type: 'PREVIEW',
      payload: file.url || file.thumbUrl,
    });
  }

  function handleCancel() {
    dispatch({
      type: 'CANCEL',
    });
  }

  async function customRequest({ file, onSuccess, onError }) {
    // 封装一个 formData
    const formData = new FormData();
    formData.append('file', file);
    // 使用 utils 里的 request 覆盖原始的上传解决跨域的问题
    const res = await request(action, {
      method: 'POST',
      body: formData,
      isCommonApi,
    });
    if (!res) return onError(new Error('上传失败'));
    onSuccess(res);
  }

  function handleChange({ fileList, file }: UploadChangeParam) {
    const { status = 'error', name } = file;
    dispatch({
      type: 'CHANGE',
      payload: fileList,
    });
    switch (status) {
      case 'done':
        propOnChange && propOnChange(fileList);
        break;
      case 'removed':
        propOnChange && propOnChange(fileList);
        break;
      case 'error':
        message.error(`${name} 上传失败！`);
        dispatch({
          type: 'CHANGE',
          payload: fileList.filter((_, index) => index !== fileList.length - 1),
        });
        break;
    }
  }

  // 上传前的限制
  function beforeUpload(file: UploadFile) {
    const isNotType: boolean = !(fileType && fileType.some(item => file.type === `image/${item}`));
    const isOutSize: boolean = maxSize && file.size / 1024 / 1024 > maxSize;
    if (isNotType) {
      message.error(`仅支持格式为 ${fileType && fileType.join('/ ')} 的文件`);
    }
    if (isOutSize) {
      message.error(`不能超过${maxSize}MB!`);
    }
    return !isNotType && !isOutSize;
  }

  const uploadButton: JSX.Element = (
    <div>
      <Icon type={loading ? 'loading' : 'plus'} />
      <div className="ant-upload-text">上传图片</div>
    </div>
  );

  const uploadProp: UploadProps = {
    customRequest,
    fileList,
    beforeUpload,
    listType: 'picture',
    onPreview: handlePreview,
    onChange: handleChange,
  };

  const isCross: boolean = !!maxLength && maxLength <= fileList.length;

  return (
    <React.Fragment>
      <Upload {...uploadProp}>{isCross ? null : uploadButton}</Upload>
      <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </React.Fragment>
  );
};

const defaultProps: IBaseUploadProps = {
  action: '',
  request: async () => {},
  fileType: ['jpg', 'jpeg', 'png'],
};

// 使用类组件导出，屏蔽使用 getFieldDecorator 包裹的 ref 警告
export default class ImgUpload extends Component<IBaseUploadProps> {
  render() {
    const ReadyUpload = withDefaultProps(defaultProps, BaseUpload);
    return <ReadyUpload {...this.props} />;
  }
}

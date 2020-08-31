import React, { useEffect } from 'react';

import './styles/index.less';
import lock from './images/lock.png';
import noAuth from './images/noAuth.png';
import { IEProps } from './index.d';

export interface IMProps extends IEProps {
  handleLogout?: () => void;
  systemDesc: ISProps;
}

interface ISProps {
  imgModule: any;
  name: string;
  desc: string;
}

const Maintain = (props: IMProps) => {
  const {
    handleLogout,
    afterMount,
    systemDesc: {
      imgModule = noAuth,
      name = '数字化能源管理平台',
      desc = '通过对电力用户用能数据采集，帮助用户实现用能精细化管理，发现用能异常，优化用能结构，提升管理效率，助力企业实现数字化转型。',
    },
  } = props;

  useEffect(() => {
    afterMount && afterMount();
  });

  return (
    <div className="metro-noauth-wrapper">
      <div className="metro-noauth-lock">
        <img src={lock} alt="lock" />
      </div>
      <p>抱歉，您没有本系统的权限，开通请联系</p>
      <p>400-860-9991</p>
      {handleLogout ? (
        <p>
          或者您也可以<a onClick={handleLogout}>重新登录</a>
        </p>
      ) : (
        <span />
      )}

      <div className="metro-noauth-descWrap">
        <div className="metro-noauth-image">
          <img src={imgModule} alt="平台说明图片" />
        </div>
        <p>{name}</p>
        <p>{desc}</p>
      </div>
    </div>
  );
};
export default Maintain;

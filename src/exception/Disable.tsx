import React, { useEffect } from 'react';

import './styles/index.less';
import disable from './images/disable.png';
import { IEProps } from './index.d';

// export interface IProps extends IEProps {}

const Disabled = (props: IEProps) => {
  const { afterMount } = props;
  useEffect(() => {
    afterMount && afterMount();
  });

  return (
    <div className={'metro-disabled-wrapper'}>
      <div className={'metro-disabled-image'}>
        <img src={disable} />
      </div>
      <div className={'metro-disabled-desc'}>
        <p>抱歉，您的账户在当前系统已禁用，请联系</p>
        <p>400-860-9991</p>
      </div>
    </div>
  );
};
export default Disabled;

import React from 'react';
import Img from './Img'
import './style/index.less';

export default props => {
  const { title } = props;
  return (
    <div className="metro-maintenance">
      <Img />
      <div style={{ fontSize: 18, marginTop: 8 }}>UNDER MAINTENANCE</div>
      <div style={{ fontSize: 24 }}>{title || '系统维护中...'}</div>
    </div>
  );
};

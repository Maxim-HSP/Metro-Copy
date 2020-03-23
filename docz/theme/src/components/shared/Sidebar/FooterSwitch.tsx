import * as React from 'react';
import styled from 'styled-components';
import Switch from 'rc-switch';

const Container = styled.div`
  .rc-switch-checked {
    border: 1px solid ${({ color }) => color};
    background-color: ${({ color }) => color};
  }
`;

export interface IFooterSwitch {
  color: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export const FooterSwitch: React.SFC<IFooterSwitch> = props => {
  const { color, value, onChange } = props;

  return (
    <Container color={color}>
      <Switch
        checkedChildren="夜"
        unCheckedChildren="日"
        onChange={onChange}
        defaultChecked={value}
      />
    </Container>
  );
};

import React, { SFC } from 'react';

export type text = 'info' | 'positive' | 'negative' | 'warning';

export interface AButtonProps {
  /**
   * Set this to change alert kind
   * @default info
   */
  text: 'info' | 'positive' | 'negative' | 'warning';
}

export const AButton: SFC<AButtonProps> = ({ text, ...props }) => (
  <button {...props} >{text}</button>
);

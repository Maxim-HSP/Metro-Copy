import * as React from 'react';
import { SFC } from 'react';
import { theme, ComponentsProvider } from 'docz';
import get from 'lodash/get';

import { Provider } from '~utils/themeContext';

import * as modes from './styles/modes';
import { components } from './components/ui';
import { Global } from './styles/global';
import { config } from './config';
import { ThemeProvider } from './utils/theme';

const Theme: SFC = ({ children }) => (
  <ThemeProvider>
    <Global />
    <ComponentsProvider components={components}>{children}</ComponentsProvider>
  </ThemeProvider>
);

export const Enhance = props => {
  const [mode, setMode] = React.useState<'dark' | 'light'>('light');
  const MyTheme = theme(config, ({ codemirrorTheme, ...config }) => ({
    ...config,
    mode,
    codemirrorTheme: codemirrorTheme || `docz-${mode}`,
    colors: {
      ...get(modes, mode),
      ...config.colors,
    },
  }))(Theme);

  return (
    <Provider value={[mode, setMode]}>
      <MyTheme {...props} />
    </Provider>
  );
};

export default Enhance;
export { components };

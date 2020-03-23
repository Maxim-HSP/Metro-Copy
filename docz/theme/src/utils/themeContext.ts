import * as React from 'react';
const themeContext = React.createContext(null);
export const { Provider, Consumer } = themeContext;
export default themeContext;

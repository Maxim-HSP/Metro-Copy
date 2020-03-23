const docConfig = require('./docz/docz.config').default;

const lessToCss = require('./babel/lessToCss');

const lessInBabelMode = true;

export default {
  esm: 'babel',
  cjs: 'babel',
  lessInBabelMode,
  disableTypeCheck: true,
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
    ],
    ...(process.env.CSS && lessInBabelMode ? [lessToCss] : []),
  ],
  doc: {
    ...docConfig,
    htmlContext: {
      head: {
        favicon: './docz/assets/favicon.png',
      },
    },
    // father 默认cdn， 放项目的public里面避免内网切换请求不到资源
    reactConfig: {
      react: '/public/react.js',
      reactDom: '/public/react-dom.js',
    },
  },
};

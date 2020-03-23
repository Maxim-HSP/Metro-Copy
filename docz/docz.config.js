/**
 * docz配置
 * Update: 2019.7.10
 * from https://www.docz.site/docs/project-configuration
 * Tips1. 如果需要变更这个文件，请明确知道你即将要做什么。
 * Tips2. 注意实际生效于docz的配置还会经过father处理，目前已知如postCss、less插件已由其添加（否则antd等UI库是不能编译的）
 * Tips3. 在此声明的配置属性实际上可以在自定义theme或文档(一般通过docz hooks api)中拿到，
 *        故可以比较灵活的通过自定义属性定制文档的表现或功能。
 */

const path = require('path');
// const alias = require('./plugins/docz-plugin-alias');

const modifyBundlerConfig = (config, dev, args) => {
  config.resolve.alias = Object.assign({}, config.resolve.alias, {
    // 文档环境别名
    '@': path.resolve(__dirname, '../src'),
    '@docs': path.resolve(__dirname, '../docs'),
    // 主题环境别名
    '~': path.resolve(__dirname, './theme/src'),
    '~utils': path.resolve(__dirname, './theme/src/utils'),
    '~styles': path.resolve(__dirname, './theme/src/styles'),
  });
  return config;
};

module.exports.default = {
  /** Basic */
  title: 'Metro-Doc',
  description: 'ChinaWY Front-end Component Library',
  repository: 'http://172.16.11.30:3001/jinxin/metro.git',
  menu: ['Getting Started', '组件', '开发', 'Test'],
  /** 路径相关 */
  // TODO: 如何将src路径与docs绑定（解决不编译问题）？
  // src: 'docs',
  indexHtml: 'docz/index.html',
  public: 'docz/public',
  /** 功能相关 */
  typescript: true, // 实际上father会检查tsconfig文件自动设置本项
  // debug: true,
  // hashRouter: true,
  ignore: ['es/**', 'lib/**', 'readme.md'],
  // propsParser: false,
  // codeSandbox: false,
  // wrapper: 'docs/config/Wrapper.js',
  /** Theme */
  theme: '~/index.tsx',
  themeConfig: {
    mode: 'dark',
    codemirrorTheme: 'material',
    colors: {
      primary: '#2386e3',
      link: '#bd4932',
    },
    logo: {
      // 注意静态资源路径实际由public配置生效
      src: 'public/MMetro.png',
      width: 128,
    },
  },
  /** 插件或编译配置等 */
  modifyBundlerConfig,
  // plugins: [alias()],
  port: 8080,
};

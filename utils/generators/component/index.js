/**
 * Component Generator
 */

/* eslint strict: ["off"] */

'use strict';

const componentExists = require('../check_exist');

module.exports = {
  description: 'Add an unconnected component',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: '组件名称',
      default: 'wy-button',
      validate: value => {
        if (/.+/.test(value)) {
          return componentExists(value) ? '该组件已经存在了' : true;
        }
        // TODO:  validate conventions

        return '请输入组件名称';
      },
    },
    {
      type: 'confirm',
      name: 'wantTest',
      default: true,
      message: '是否包含测试 ?',
    },
  ],
  actions: data => {
    // Generate index.js and index.test.js
    const actions = [
      {
        type: 'add',
        path: '../../src/{{dashCase name}}/index.ts',
        templateFile: './component/index.ts.hbs',
        abortOnFail: true,
      },
      {
        type: 'add',
        path: '../../src/{{dashCase name}}/{{ properCase name }}.tsx',
        templateFile: './component/index.tsx.hbs',
        abortOnFail: true,
      },
      {
        type: 'add',
        path: '../../src/{{dashCase name}}/style/index.ts',
        templateFile: './component/style/index.ts.hbs',
        abortOnFail: true,
      },
      {
        type: 'add',
        path: '../../src/{{dashCase name}}/style/index.less',
        templateFile: './component/style/index.less.hbs',
        abortOnFail: true,
      },
    ];

    if (data.wantTest) {
      actions.push({
        type: 'add',
        path: '../../src/{{dashCase name}}/__test__/{{ properCase name }}.test.js',
        templateFile: './component/test/index.js.hbs',
        abortOnFail: true,
      });
    }

    return actions;
  },
};

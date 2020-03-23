import React from 'react';
import { mount } from 'enzyme';
import SearchTree from '..';

const treeData = [
  {
    id: 'a',
    fid: null,
    name: 'a',
    children: [
      {
        id: 'a1',
        fid: 'a',
        name: 'a1',
      },
      {
        id: 'a2',
        fid: 'a',
        name: 'a2',
      },
    ]
  },
  {
    id: 'b',
    fid: 'b',
    name: 'b',
    children: [
      {
        id: 'ba',
        fid: 'b',
        name: 'ba',
      },
      {
        id: 'bb',
        fid: 'b',
        name: 'bb',
      },
    ]
  },
  {
    id: 'c',
    fid: 'c',
    name: 'c',
    children: [
      {
        id: 'c1',
        fid: 'c',
        name: 'c1',
      },
    ]
  },
]

const noop = () => {};
describe('SearchTree', () => {
  let wrapper;
  
  beforeAll(() => {
    wrapper = mount(<SearchTree data={treeData} onSearch={noop} setTreeNodeProps={noop}/>);
  });

  it('render works', () => {
    expect(wrapper.render()).toMatchSnapshot();
    expect(wrapper.find('.ant-input').length).toBe(1);
  });

  it('search works', () => {
    const searchInput = wrapper.find('.ant-input');

    expect(wrapper.find('.ant-tree-node-content-wrapper[title="a"]').length).toBe(1);
    expect(wrapper.find('.ant-tree-node-content-wrapper[title="b"]').length).toBe(1);
    expect(wrapper.find('.ant-tree-node-content-wrapper[title="ba"]').length).toBe(0);

    searchInput.simulate('change', { target: { value: 'a' } });
    expect(wrapper.find('.ant-tree-node-content-wrapper[title="a"]').length).toBe(1);
    expect(wrapper.find('.ant-tree-node-content-wrapper[title="b"]').length).toBe(1);
    expect(wrapper.find('.ant-tree-node-content-wrapper[title="ba"]').length).toBe(1);


    searchInput.simulate('change', { target: { value: undefined } });
    expect(wrapper.find('.ant-tree-node-content-wrapper[title="a"]').length).toBe(1);
    expect(wrapper.find('.ant-tree-node-content-wrapper[title="b"]').length).toBe(1);
    expect(wrapper.find('.ant-tree-node-content-wrapper[title="ba"]').length).toBe(0);
  });

  it('expand works', () => {
    const openButton = wrapper.find('.ant-tree-switcher_close');

    expect(openButton.length).toBe(3);

    openButton.last().simulate('click');
    expect(wrapper.find('.ant-tree-switcher_close').length).toBe(2);
    expect(wrapper.find('.ant-tree-switcher_open').length).toBe(1);
  });
});

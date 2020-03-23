import React from 'react';
import { mount } from 'enzyme';
import YearPicker from '..';

describe('YearPicker',() => {
  let wrapper;
  beforeAll(() => {
    wrapper = mount(<YearPicker />);
  })

  it('render correctly', () => {
    expect(wrapper.render()).toMatchSnapshot();
    expect(wrapper.find('.ant-calendar-picker').length).toBe(1);
  });

  it('open panel', () => {
    wrapper.find('.ant-calendar-picker-input').simulate('focus');
    expect(wrapper.find('.ant-calendar-panel')).toHaveLength(1);
  });
  
  it('select year', () => {
    wrapper.find('.ant-calendar-picker-input').simulate('focus');
    expect(wrapper.find('.ant-calendar-panel')).toHaveLength(1);
    wrapper.find({title: '2018', role: 'gridcell'}).simulate('click');
    expect(wrapper.find('.ant-calendar-picker-input').prop('value')).toEqual('2018');
  })
});

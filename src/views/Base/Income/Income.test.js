import React from 'react';
import ReactDOM from 'react-dom';
import Income from './Income';
import {mount} from 'enzyme/build';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Income />, div);
  ReactDOM.unmountComponentAtNode(div);
});
it('toggle click without crashing', () => {
  const wrapper = mount(<Income />);
  for (let i=0; i<4; i++) {
    let Income = wrapper.find('#list-tab .list-group-item-action.list-group-item').at(i);
    Income.simulate('click');
    expect(wrapper.state().activeTab).toEqual(i);
  }
  wrapper.unmount()
});

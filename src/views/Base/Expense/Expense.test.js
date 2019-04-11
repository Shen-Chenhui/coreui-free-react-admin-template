import React from 'react';
import ReactDOM from 'react-dom';
import Expense from './Expense';
import {mount} from 'enzyme/build';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Expense />, div);
  ReactDOM.unmountComponentAtNode(div);
});
it('toggle click without crashing', () => {
  const wrapper = mount(<Expense />);
  for (let i=0; i<4; i++) {
    let Expense = wrapper.find('#list-tab .list-group-item-action.list-group-item').at(i);
    Expense.simulate('click');
    expect(wrapper.state().activeTab).toEqual(i);
  }
  wrapper.unmount()
});

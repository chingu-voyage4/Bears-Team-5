import React from 'react';
import { shallow } from 'enzyme';
import CreateArticle from '../../components/CreateArticle';

let wrapper;

beforeEach(() => {
  wrapper = shallow(<CreateArticle />);
});

test('should render component correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

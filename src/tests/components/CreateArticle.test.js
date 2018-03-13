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

test('should set article title on input change', () => {
  const value = 'Article title';
  wrapper.find('input').simulate('change', {
    target: { value },
  });
  expect(wrapper.state('articleTitle')).toBe(value);
});

test('should set article body on input change', () => {
  const value = 'This is the article boddy';
  wrapper.find('textarea').simulate('change', {
    target: { value },
  });
  expect(wrapper.state('articleBody')).toBe(value);
});

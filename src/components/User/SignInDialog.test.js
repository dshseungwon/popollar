import React from 'react';
import renderer from 'react-test-renderer';
import SignInDialog from './SignInDialog';

describe('SignInDialog', () => {
  let component = null;

  it('renders correctly', () => {
    component = renderer.create(<SignInDialog/>);
  });

  it('matches snapshot', () => {
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  })
})
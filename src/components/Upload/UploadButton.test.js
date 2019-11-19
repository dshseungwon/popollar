import React from 'react';
import renderer from 'react-test-renderer';
import UploadButton from './UploadButton';

describe('SignInCheck', () => {
  let component = null;

  it('renders correctly', () => {
    component = renderer.create(<UploadButton/>);
  });

  it('matches snapshot', () => {
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  })

  it('Is state changes on click "OPEN"', () => {
    component.getInstance().handleClickOpen();
    expect(component.getInstance().state.value).toBe(true);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Is state changes on click "CLOSE"', () => {
    component.getInstance().handleClose();
    expect(component.getInstance().state.value).toBe(false);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
})
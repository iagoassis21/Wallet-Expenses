import reducerWithBackdoor from './reducerWithBackdoor';

const { createStore } = jest.requireActual('redux');

export default function mockCreateStore(reducer, preloadedState = {}, enhancer) {
  let initialState = preloadedState;

  const initialStateJson = process.env.props.reduxInitialState;
  if (initialStateJson) {
    initialState = JSON.parse(initialStateJson);
    if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
      enhancer = preloadedState;
    } else if (typeof preloadedState === 'object') {
      initialState = { ...preloadedState, ...initialState };
    }
  }

  return createStore(reducerWithBackdoor(reducer), initialState, enhancer);
}

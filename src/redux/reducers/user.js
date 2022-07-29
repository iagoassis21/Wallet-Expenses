import { SAVE_USER } from '../actions';

const INITIAL_STATE = {
  email: '',
};

const user = (state = INITIAL_STATE, action) => {
  const { email } = action;
  switch (action.type) {
  case SAVE_USER:
    return {
      ...state,
      email,
    };
  default:
    return state;
  }
};

export default user;

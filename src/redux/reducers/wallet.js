import { GET } from '../actions';

const INITIAL_STATE = {
  currencies: [],
  expenses: [],
  editor: false,
  idToEdit: 0,
};

const wallet = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case GET:
    return {
      ...state,
      currencies: [...action.data],
    };
  default:
    return state;
  }
};

export default wallet;

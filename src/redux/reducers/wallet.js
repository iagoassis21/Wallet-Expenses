import { GET_CURR, ADD_EXPENSES, DELETE_EXPENSE } from '../actions';

const INITIAL_STATE = {
  currencies: [],
  expenses: [],
  editor: false,
  idToEdit: 0,
};

const wallet = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case GET_CURR:
    return {
      ...state,
      currencies: [...action.data],
    };
  case ADD_EXPENSES:
    return {
      ...state,
      expenses: [...state.expenses, action.expense],
    };
  case DELETE_EXPENSE:
    return {
      ...state,
      expenses: [...action.newEx],
    };
  default:
    return state;
  }
};

export default wallet;

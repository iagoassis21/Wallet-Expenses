import { GET_CURR, ADD_EXPENSES, DELETE_EXPENSE,
  SET_EXPENSE_EDIT, SET_EXPENSE_EDITED } from '../actions';

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
  case SET_EXPENSE_EDIT:
    return {
      ...state,
      editor: true,
      idToEdit: action.setId,
    };
  case SET_EXPENSE_EDITED:
    return {
      ...state,
      editor: false,
      expenses: [...action.setExEdited],
    };

  default:
    return state;
  }
};

export default wallet;

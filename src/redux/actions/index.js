export const SAVE_USER = 'SAVE_USER';
export const REQUEST_API = 'REQUEST_API';
export const GET_CURR = 'GET_CURR';
export const ADD_EXPENSES = 'ADD_EXPENSES';
export const DELETE_EXPENSE = 'DELETE_EXPENSE';
export const saveUserAction = (email) => ({ type: SAVE_USER, email });
export const requestAPI = () => ({ type: REQUEST_API });
export const getCurrencies = (data) => ({ type: GET_CURR, data });
export const deleteExpenseAction = (newEx) => ({ type: DELETE_EXPENSE, newEx });

export function fetchAPI() {
  return async (dispatch) => {
    dispatch(requestAPI());
    const response = await fetch('https://economia.awesomeapi.com.br/json/all');
    const json = await response.json();
    return dispatch(getCurrencies(Object.keys(json).filter((item) => item !== 'USDT')));
  };
}

const fetchApiValues = async () => {
  const response = await fetch('https://economia.awesomeapi.com.br/json/all');
  const json = await response.json();
  return json;
};

export const saveExpenseAction = (values) => async (dispatch) => {
  const exchangeRates = await fetchApiValues();
  dispatch({ type: ADD_EXPENSES, expense: { ...values, exchangeRates } });
};

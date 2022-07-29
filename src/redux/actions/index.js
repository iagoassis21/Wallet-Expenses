export const SAVE_USER = 'SAVE_USER';
export const saveUserAction = (email) => ({ type: SAVE_USER, email });

export const REQUEST_API = 'REQUEST_API';
export const GET = 'GET';
export const requestAPI = () => ({ type: REQUEST_API });
export const getData = (data) => ({ type: GET, data });
export function fetchAPI() {
  return async (dispatch) => {
    dispatch(requestAPI());
    const response = await fetch('https://economia.awesomeapi.com.br/json/all');
    const json = await response.json();
    return dispatch(getData(Object.keys(json).filter((item) => item !== 'USDT')));
  };
}

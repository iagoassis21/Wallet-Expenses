export default function reducerWithBackdoor(reducer) {
  return (state, action) => {
    let newState = reducer(state, action);
    if (action.type === 'STARTEST_BACKDOOR') {
      newState = {
        ...newState,
        ...action.payload,
        wallet: {
          ...newState.wallet,
          ...action.payload.wallet,
        },
        user: {
          ...newState.user,
          ...action.payload.user,
        },
      };
    }

    return newState;
  };
}

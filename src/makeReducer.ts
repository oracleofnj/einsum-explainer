function makeReducer(ducks: Duck[]): Reducer {
  const appReducers: { [key: string]: Reducer } = ducks.reduce(
    (obj: { [key: string]: Reducer }, duck) => {
      obj[duck.type] = duck.reducer;
      return obj;
    },
    {}
  );

  function reducer(state: AppState, action: AppAction): AppState {
    const actionReducer = appReducers[action.type];

    if (actionReducer) {
      return actionReducer(state, action);
    } else {
      throw new TypeError(JSON.stringify(action));
    }
  }

  return reducer;
}

export { makeReducer };

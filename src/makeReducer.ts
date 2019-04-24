import { AppState, AppAction } from "./appState";

export interface AnyAction {
  type: string;
}

export type Reducer = (state: AppState, action: AppAction) => AppState;
export type ActionCreator = (...args: any[]) => AppAction;
export type ActionTypeGuard = (action: AppAction) => boolean;
export type Duck = {
  type: string;
  typeguard: ActionTypeGuard;
  actionCreator: ActionCreator;
  reducer: Reducer;
};

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

import React, { useReducer, useState } from "react";
import { reducer, initialState } from "../appstate/appState";
import EinsumExplainer from "./EinsumExplainer";

import "./App.css";
import "flexboxgrid";

const App = () => {
  const [appState, dispatch] = useReducer(reducer, initialState);
  const [, setReloadTime] = useState(Date.now());

  if (module.hot) {
    module.hot.accept("./EinsumExplainer", () => {
      setReloadTime(Date.now());
    });
  }

  return <EinsumExplainer appState={appState} dispatch={dispatch} />;
};

export default App;

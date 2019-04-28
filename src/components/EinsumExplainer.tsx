import React, { useReducer } from "react";
import ExplainerInput from "./ExplainerInput";
import ExplainerOutput from "./ExplainerOutput";
import { reducer, initialState } from "../appstate/appState";
import "./App.css";

const EinsumExplainer = () => {
  const [appState, dispatch] = useReducer(reducer, initialState);
  return (
    <div className="App">
      <ExplainerInput appState={appState} dispatch={dispatch} />
      <ExplainerOutput appState={appState} />
    </div>
  );
};

export default EinsumExplainer;

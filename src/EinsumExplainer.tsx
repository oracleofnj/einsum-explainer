import React, { useReducer } from "react";
import ExplainerInput from "./ExplainerInput";
import ExplainerOutput from "./ExplainerOutput";
import { reducer, initialState } from "./appState";

const EinsumExplainer = () => {
  const [appState, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      <ExplainerInput appState={appState} dispatch={dispatch} />
      <ExplainerOutput appState={appState} />
    </>
  );
};

export default EinsumExplainer;

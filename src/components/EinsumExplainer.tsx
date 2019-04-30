import React, { useReducer } from "react";
import { reducer, initialState } from "../appstate/appState";
import Equation from "./Equation";
import Shapes from "./Shapes";
import Computation from "./Computation";

import "./App.css";
import "flexboxgrid";

const EinsumExplainer = () => {
  const [appState, dispatch] = useReducer(reducer, initialState);
  const { equation, visibleSizes, operandContents, operandShapes } = appState;

  return (
    <div className="wrap container-fluid">
      <Equation equation={equation} dispatch={dispatch} />
      <Shapes
        equation={equation}
        dispatch={dispatch}
        visibleSizes={visibleSizes}
        operandShapes={operandShapes}
      />
      <Computation
        equation={equation}
        dispatch={dispatch}
        visibleSizes={visibleSizes}
        operandContents={operandContents}
        operandShapes={operandShapes}
      />
    </div>
  );
};

export default EinsumExplainer;

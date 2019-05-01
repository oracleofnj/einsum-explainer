import React from "react";
import { AppState, AppAction } from "../appstate/appState";
import Equation from "./Equation";
import Shapes from "./Shapes";
import Computation from "./Computation";

type EinsumExplainerProps = {
  appState: AppState;
  dispatch: React.Dispatch<AppAction>;
};

const EinsumExplainer = ({ appState, dispatch }: EinsumExplainerProps) => {
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

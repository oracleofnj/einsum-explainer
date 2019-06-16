import React from "react";
import { AppState, AppAction } from "../appstate/appState";
import Equation from "./Equation";
import Shapes from "./Shapes";
import Computation from "./Computation";
import Presets from "./Presets";
import EinsumPath from "./EinsumPath";

type EinsumExplainerProps = {
  appState: AppState;
  dispatch: React.Dispatch<AppAction>;
};

const EinsumExplainer = ({ appState, dispatch }: EinsumExplainerProps) => {
  const { equation, visibleSizes, operandStates, optimizationMethod } = appState;

  return (
    <div className="wrap container-fluid">
      <Presets dispatch={dispatch} />
      <Equation equation={equation} dispatch={dispatch} />
      <Shapes
        equation={equation}
        dispatch={dispatch}
        visibleSizes={visibleSizes}
        operandShapes={operandStates.map(x => x.shapeStr)}
      />
      <Computation
        equation={equation}
        dispatch={dispatch}
        visibleSizes={visibleSizes}
        operandContents={operandStates.map(x => x.contentsStr)}
        operandShapes={operandStates.map(x => x.shapeStr)}
      />
      <EinsumPath
        equation={equation}
        dispatch={dispatch}
        visibleSizes={visibleSizes}
        optimizationMethod={optimizationMethod}
        operandContents={operandStates.map(x => x.contentsStr)}
        operandShapes={operandStates.map(x => x.shapeStr)}
      />
    </div>
  );
};

export default EinsumExplainer;

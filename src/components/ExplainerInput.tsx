import React from "react";
import { AppState, AppAction } from "../appstate/appState";
import EquationInput from "./EquationInput";
import ShapesAndContentsInput from "./ShapesAndContentsInput";

type ExplainerInputProps = {
  appState: AppState;
  dispatch: React.Dispatch<AppAction>;
};

const ExplainerInput = (props: ExplainerInputProps) => {
  const { appState, dispatch } = props;
  const { equation, visibleSizes, operandContents, operandShapes } = appState;

  return (
    <>
      <EquationInput equation={equation} dispatch={dispatch} />
      <ShapesAndContentsInput
        dispatch={dispatch}
        visibleSizes={visibleSizes}
        operandContents={operandContents}
        operandShapes={operandShapes}
      />
    </>
  );
};

export default ExplainerInput;

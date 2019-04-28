import React from "react";
import { AppAction } from "../appstate/appState";
import EquationInput from "./EquationInput";
import { validateAsJson } from "../pkg/einsum";
import EquationOutput from "./EquationOutput";

type EquationProps = {
  equation: string;
  dispatch: React.Dispatch<AppAction>;
};

const Equation = ({ equation, dispatch }: EquationProps) => {
  const equationJSON = validateAsJson(equation);
  return (
    <div>
      <EquationInput equation={equation} dispatch={dispatch} />
      <EquationOutput explanationJSON={equationJSON} />
    </div>
  );
};

export default React.memo(Equation);

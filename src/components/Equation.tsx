import React from "react";
import { AppAction } from "../appstate/appState";
import EquationInput from "./EquationInput";
import { validateAsJson } from "../pkg/einsum_wasm";
import EquationOutput from "./EquationOutput";
import InputOutputRow from "./layout/InputOutputRow";

type EquationProps = {
  equation: string;
  dispatch: React.Dispatch<AppAction>;
};

const Equation = ({ equation, dispatch }: EquationProps) => {
  const equationJSON = validateAsJson(equation);
  return (
    <InputOutputRow
      input={<EquationInput equation={equation} dispatch={dispatch} />}
      output={<EquationOutput explanationJSON={equationJSON} />}
    />
  );
};

export default React.memo(Equation);

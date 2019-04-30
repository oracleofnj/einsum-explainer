import React, { ChangeEvent } from "react";
import { appActions, AppAction } from "../appstate/appState";
import InputColumn from "./layout/InputColumn";

type ExplainerInputProps = {
  equation: string;
  dispatch: React.Dispatch<AppAction>;
};

const EquationInput = ({ equation, dispatch }: ExplainerInputProps) => {
  const onEquationChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(appActions.updateEquation(e.target.value));
  };

  return (
    <InputColumn
      prompt="Equation:"
      control={<input type="text" onChange={onEquationChange} value={equation} />}
    />
  );
};

export default React.memo(EquationInput);

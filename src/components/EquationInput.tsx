import React, { ChangeEvent } from "react";
import { appActions, AppAction } from "../appstate/appState";

type ExplainerInputProps = {
  equation: string;
  dispatch: React.Dispatch<AppAction>;
};

const EquationInput = ({ equation, dispatch }: ExplainerInputProps) => {
  const onEquationChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(appActions.updateEquation(e.target.value));
  };

  return (
    <p>
      Equation: <input type="text" onChange={onEquationChange} value={equation} />
    </p>
  );
};

export default React.memo(EquationInput);

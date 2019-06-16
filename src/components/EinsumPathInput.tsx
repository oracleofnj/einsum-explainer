import React, { ChangeEvent } from "react";
import { appActions, AppAction } from "../appstate/appState";
import InputColumn from "./layout/InputColumn";

type EinsumPathInputProps = {
  optimizationMethod: string;
  dispatch: React.Dispatch<AppAction>;
};

const EinsumPathInput = ({ optimizationMethod, dispatch }: EinsumPathInputProps) => {
  const onMethodChange = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch(appActions.updateOptimizationMethod(e.target.value));
  };

  return (
    <InputColumn
      prompt="Optimizer:"
      control={
        <select onChange={onMethodChange} value={optimizationMethod}>
          <option value="Naive">Naive</option>
          <option value="Reverse">Reverse</option>
        </select>
      }
    />
  );
};

export default React.memo(EinsumPathInput);

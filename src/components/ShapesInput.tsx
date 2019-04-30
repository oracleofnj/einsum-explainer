import React, { ChangeEvent } from "react";
import { appActions, AppAction } from "../appstate/appState";
import InputColumn from "./layout/InputColumn";

type ShapesInputProps = {
  visibleSizes: number;
  operandShapes: string[];
  dispatch: React.Dispatch<AppAction>;
};

const ShapesInput = ({ operandShapes, visibleSizes, dispatch }: ShapesInputProps) => {
  const shapes: string[] = [];
  for (let i = 0; i < visibleSizes; i++) {
    shapes.push(i < operandShapes.length ? operandShapes[i] : "[]");
  }

  const makeOnShapeChange = (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(appActions.updateShape(index, e.target.value));
  };

  return (
    <>
      {shapes.map((data, index) => (
        <InputColumn
          key={index}
          prompt={`Shape of ${String.fromCharCode(index + "A".charCodeAt(0))}:`}
          control={<input type="text" onChange={makeOnShapeChange(index)} value={data} />}
        />
      ))}
    </>
  );
};

export default React.memo(ShapesInput);

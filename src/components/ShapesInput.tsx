import React, { ChangeEvent } from "react";
import { appActions, AppAction } from "../appstate/appState";

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
    <p>
      {shapes.map((data, index) => (
        <div key={index}>
          <span>
            Shape of {String.fromCharCode(index + "A".charCodeAt(0))}:{" "}
            <input type="text" onChange={makeOnShapeChange(index)} value={data} />
          </span>
        </div>
      ))}
    </p>
  );
};

export default React.memo(ShapesInput);

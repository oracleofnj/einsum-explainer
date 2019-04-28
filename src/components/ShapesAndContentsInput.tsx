import React, { ChangeEvent } from "react";
import { appActions, AppAction } from "../appstate/appState";
import range from "../utils/range";

type ShapesAndContentsInputProps = {
  visibleSizes: number;
  operandShapes: string[];
  operandContents: string[];
  dispatch: React.Dispatch<AppAction>;
};

const ShapesAndContentsInput = (props: ShapesAndContentsInputProps) => {
  const { dispatch, visibleSizes, operandContents, operandShapes } = props;
  const shapes = operandShapes.slice(0, visibleSizes);
  const contents = operandContents.slice(0, visibleSizes);

  const makeOnShapeChange = (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(appActions.updateShape(index, e.target.value));
  };

  const makeOnContentsChange = (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(appActions.updateContents(index, e.target.value));
  };

  return (
    <p>
      {range(visibleSizes).map(index => (
        <div key={index}>
          <span>
            Shape of {String.fromCharCode(index + "A".charCodeAt(0))}:{" "}
            <input
              type="text"
              onChange={makeOnShapeChange(index)}
              value={typeof shapes[index] === "string" ? shapes[index] : "[]"}
            />
          </span>
          <span>
            Contents of {String.fromCharCode(index + "A".charCodeAt(0))}:{" "}
            <input
              type="text"
              onChange={makeOnContentsChange(index)}
              value={typeof contents[index] === "string" ? contents[index] : "[]"}
            />
          </span>
        </div>
      ))}
    </p>
  );
};

export default React.memo(ShapesAndContentsInput);

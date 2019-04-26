import React, { ChangeEvent } from "react";
import { appActions, AppState, AppAction } from "../appstate/appState";
import range from "../utils/range";

type ExplainerInputProps = {
  appState: AppState;
  dispatch: React.Dispatch<AppAction>;
};

const ExplainerInput = (props: ExplainerInputProps) => {
  const { appState, dispatch } = props;
  const einsumString = appState.equation;
  const { visibleSizes } = appState;
  const shapes = appState.operandShapes.slice(0, visibleSizes);
  const contents = appState.operandContents.slice(0, visibleSizes);

  const onEquationChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(appActions.updateEquation(e.target.value));
  };

  const makeOnShapeChange = (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(appActions.updateShape(index, e.target.value));
  };

  const makeOnContentsChange = (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(appActions.updateContents(index, e.target.value));
  };

  const onAddShape = () => {
    dispatch(appActions.addShape());
  };

  return (
    <>
      <p>
        <button onClick={onAddShape}>Add Shape</button>
      </p>
      <p>
        Equation: <input type="text" onChange={onEquationChange} value={einsumString} />
      </p>
      <p>
        There appear{visibleSizes > 1 ? "" : "s"} to be {visibleSizes} input tensor
        {visibleSizes > 1 ? "s" : ""} in your equation.
      </p>
      {range(visibleSizes).map(index => (
        <p key={index}>
          <div>
            Shape of {String.fromCharCode(index + "A".charCodeAt(0))}:{" "}
            <input
              type="text"
              onChange={makeOnShapeChange(index)}
              value={typeof shapes[index] === "string" ? shapes[index] : "[]"}
            />
          </div>
          <div>
            Contents of {String.fromCharCode(index + "A".charCodeAt(0))}:{" "}
            <input
              type="text"
              onChange={makeOnContentsChange(index)}
              value={typeof contents[index] === "string" ? contents[index] : "[]"}
            />
          </div>
        </p>
      ))}
    </>
  );
};

export default ExplainerInput;

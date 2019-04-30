import React from "react";
import { AppAction } from "../appstate/appState";
import { validateAndSizeFromShapesAsStringAsJson, validateAsJson } from "../pkg/einsum";
import AxisLengthsOutput from "./AxisLengthsOutput";
import { parseShapeString } from "../utils/parseShapeStrings";
import ShapesInput from "./ShapesInput";
import { isErrorMessage } from "../types/einsum_typeguards";
import InputOutputRow from "./layout/InputOutputRow";

type ShapesProps = {
  equation: string;
  visibleSizes: number;
  operandShapes: string[];
  dispatch: React.Dispatch<AppAction>;
};

const Shapes = ({ equation, visibleSizes, operandShapes, dispatch }: ShapesProps) => {
  const equationJSON = validateAsJson(equation);
  const shapes = operandShapes.slice(0, visibleSizes);
  const shapeArrays = shapes.map(parseShapeString);
  let sizedExplanationJSON;
  if (shapeArrays.some(isErrorMessage)) {
    sizedExplanationJSON = JSON.stringify({
      Err: JSON.stringify(shapeArrays.filter(isErrorMessage))
    });
  } else {
    sizedExplanationJSON = validateAndSizeFromShapesAsStringAsJson(
      equation,
      JSON.stringify(shapeArrays.map(x => (x as { Ok: number[] }).Ok))
    );
  }

  return (
    <InputOutputRow
      input={
        <ShapesInput
          dispatch={dispatch}
          visibleSizes={visibleSizes}
          operandShapes={operandShapes}
        />
      }
      output={
        <AxisLengthsOutput
          sizedExplanationJSON={sizedExplanationJSON}
          equationJSON={equationJSON}
        />
      }
    />
  );
};

export default React.memo(Shapes);

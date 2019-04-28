import React from "react";
import { AppAction } from "../appstate/appState";
import { validateAndSizeFromShapesAsStringAsJson, slowEinsumAsJson } from "../pkg/einsum";
import AxisLengthsOutput from "./AxisLengthsOutput";
import { parseShapeString } from "../utils/parseShapeStrings";
import ShapesInput from "./ShapesInput";

type ShapesProps = {
  equation: string;
  visibleSizes: number;
  operandShapes: string[];
  dispatch: React.Dispatch<AppAction>;
};

const Shapes = ({ equation, visibleSizes, operandShapes, dispatch }: ShapesProps) => {
  const shapes = operandShapes.slice(0, visibleSizes);

  const sizedExplanationJSON = validateAndSizeFromShapesAsStringAsJson(
    equation,
    JSON.stringify(shapes.map(parseShapeString))
  );

  return (
    <div>
      <ShapesInput
        dispatch={dispatch}
        visibleSizes={visibleSizes}
        operandShapes={operandShapes}
      />
      <AxisLengthsOutput sizedExplanationJSON={sizedExplanationJSON} />
    </div>
  );
};

export default React.memo(Shapes);

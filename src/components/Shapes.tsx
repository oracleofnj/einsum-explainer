import React from "react";
import { AppAction } from "../appstate/appState";
import { validateAndSizeFromShapesAsStringAsJson, slowEinsumAsJson } from "../pkg/einsum";
import ShapesAndContentsInput from "./ShapesAndContentsInput";
import AxisLengthsOutput from "./AxisLengthsOutput";
import ComputationOutput from "./ComputationOutput";
import { parseShapeString } from "../utils/parseShapeStrings";
import range from "../utils/range";

type ShapesProps = {
  equation: string;
  visibleSizes: number;
  operandShapes: string[];
  operandContents: string[];
  dispatch: React.Dispatch<AppAction>;
};

const Shapes = ({
  equation,
  visibleSizes,
  operandShapes,
  operandContents,
  dispatch
}: ShapesProps) => {
  const shapes = operandShapes.slice(0, visibleSizes);
  const contents = operandContents.slice(0, visibleSizes);

  const sizedExplanationJSON = validateAndSizeFromShapesAsStringAsJson(
    equation,
    JSON.stringify(shapes.map(parseShapeString))
  );
  const operandsJSON = JSON.stringify(
    range(Math.min(shapes.length, contents.length)).map(i => {
      return {
        shape: parseShapeString(shapes[i]),
        contents: parseShapeString(contents[i])
      };
    })
  );
  const computationOutputJSON = slowEinsumAsJson(equation, operandsJSON);

  return (
    <div>
      <ShapesAndContentsInput
        dispatch={dispatch}
        visibleSizes={visibleSizes}
        operandContents={operandContents}
        operandShapes={operandShapes}
      />
      <AxisLengthsOutput sizedExplanationJSON={sizedExplanationJSON} />
      <ComputationOutput computationOutputJSON={computationOutputJSON} />
    </div>
  );
};

export default React.memo(Shapes);

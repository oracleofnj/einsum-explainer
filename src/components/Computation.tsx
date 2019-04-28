import React from "react";
import { AppAction } from "../appstate/appState";
import { slowEinsumAsJson } from "../pkg/einsum";
import ComputationOutput from "./ComputationOutput";
import { parseShapeString } from "../utils/parseShapeStrings";
import range from "../utils/range";
import ContentsInput from "./ContentsInput";

type ComputationProps = {
  equation: string;
  visibleSizes: number;
  operandShapes: string[];
  operandContents: string[];
  dispatch: React.Dispatch<AppAction>;
};

const Computation = ({
  equation,
  visibleSizes,
  operandShapes,
  operandContents,
  dispatch
}: ComputationProps) => {
  const shapes = operandShapes.slice(0, visibleSizes);
  const contents = operandContents.slice(0, visibleSizes);

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
      <ContentsInput
        dispatch={dispatch}
        visibleSizes={visibleSizes}
        operandContents={operandContents}
      />
      <ComputationOutput computationOutputJSON={computationOutputJSON} />
    </div>
  );
};

export default React.memo(Computation);

import React from "react";
import { AppAction } from "../appstate/appState";
import { einsumPathAsJson } from "../pkg/einsum_wasm";
import { parseShapeString } from "../utils/parseShapeStrings";
import { isErrorMessage } from "../types/einsum_typeguards";
import { parseDataString } from "../utils/parseDataString";
import InputOutputRow from "./layout/InputOutputRow";
import EinsumPathOutput from "./EinsumPathOutput";
import EinsumPathInput from "./EinsumPathInput";

type PathProps = {
  equation: string;
  optimizationMethod: string;
  visibleSizes: number;
  operandShapes: string[];
  operandContents: string[];
  dispatch: React.Dispatch<AppAction>;
};

const EinsumPath = ({
  equation,
  optimizationMethod,
  visibleSizes,
  operandShapes,
  operandContents,
  dispatch
}: PathProps) => {
  const shapes = operandShapes.slice(0, visibleSizes);
  const contents = operandContents.slice(0, visibleSizes);
  const operands = [];
  for (let i = 0; i < Math.min(shapes.length, contents.length); i++) {
    const shape = parseShapeString(shapes[i]);
    const data = parseDataString(contents[i]);

    if (!isErrorMessage(shape) && !isErrorMessage(data) && typeof data.Ok !== "number") {
      operands.push({
        shape: shape.Ok,
        contents: data.Ok.flat(2 ** 16)
      });
    } else {
      operands.push({
        Err: `Array ${i} doesn't work`
      });
    }
  }

  const operandsJSON = JSON.stringify(operands);
  const einsumPathJSON = einsumPathAsJson(
    equation,
    operandsJSON,
    JSON.stringify(optimizationMethod)
  );

  return (
    <InputOutputRow
      input={<EinsumPathInput dispatch={dispatch} optimizationMethod={optimizationMethod} />}
      output={<EinsumPathOutput einsumPathJSON={einsumPathJSON} />}
    />
  );
};

export default React.memo(EinsumPath);

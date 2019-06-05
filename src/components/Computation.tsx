import React from "react";
import { AppAction } from "../appstate/appState";
import { slowEinsumAsJson, einsumPathAsJson } from "../pkg/einsum_wasm";
import ComputationOutput from "./ComputationOutput";
import { parseShapeString } from "../utils/parseShapeStrings";
import ContentsInput from "./ContentsInput";
import { isErrorMessage } from "../types/einsum_typeguards";
import { parseDataString } from "../utils/parseDataString";
import InputOutputRow from "./layout/InputOutputRow";

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
  const einsumPathJSON = einsumPathAsJson(equation, operandsJSON);
  const computationOutputJSON = slowEinsumAsJson(equation, operandsJSON);

  return (
    <InputOutputRow
      input={
        <ContentsInput
          dispatch={dispatch}
          visibleSizes={visibleSizes}
          operandContents={operandContents}
        />
      }
      output={
        <ComputationOutput
          computationOutputJSON={computationOutputJSON}
          einsumPathJSON={einsumPathJSON}
        />
      }
    />
  );
};

export default React.memo(Computation);

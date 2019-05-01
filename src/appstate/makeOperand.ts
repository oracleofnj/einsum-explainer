import range from "../utils/range";
import parseOutput from "../utils/parseOutputString";
import { operandState } from "./appState";

export default function makeOperand(
  shape: number[],
  start: number = 0,
  step: number = 1
): operandState {
  if (shape.length === 0) {
    return {
      shapeStr: "()",
      contentsStr: "[]",
      contentsVector: []
    };
  }
  const totalSize = shape.reduce((product, val) => val * product, 1);
  const contents = range(start, start + step * totalSize, step);
  const ndArray = parseOutput({ shape, contents });
  return {
    shapeStr: JSON.stringify(shape)
      .replace(/\[/g, "(")
      .replace(/\]/g, ")"),
    contentsStr: JSON.stringify(ndArray),
    contentsVector: contents
  };
}

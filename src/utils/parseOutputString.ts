import { FlattenedOperand } from "../types/einsum_typeguards";

type NDArray = number | NDArrayArray;

interface NDArrayArray extends Array<NDArray> {}

function unflatten(shape: number[], contents: number[]): NDArray {
  switch (shape.length) {
    case 0:
      return contents[0];
    case 1:
      return contents.slice();
    default:
      const result: NDArray = [];
      let stride = 1;
      for (let i = 1; i < shape.length; i++) {
        stride *= shape[i];
      }
      for (let i = 0; i < shape[0]; i++) {
        result.push(unflatten(shape.slice(1), contents.slice(i * stride, (i + 1) * stride)));
      }
      return result;
  }
}

export default function parseOutput(output: FlattenedOperand): NDArray {
  const { shape, contents } = output;
  return unflatten(shape, contents);
}

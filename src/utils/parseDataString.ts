import { Result, isNDArray, NDArray } from "../types/einsum_typeguards";

function parseDataString(dataString: string): Result<NDArray> {
  const bracketedDataString = dataString.replace(/\(/g, "[").replace(/\)/g, "]");
  let obj;
  try {
    obj = JSON.parse(bracketedDataString);
  } catch {
    return {
      Err: "Not a valid ndArray"
    };
  }
  return isNDArray(obj) ? { Ok: obj } : { Err: "Not a valid ndArray" };
}

export { parseDataString };

import { Result, isNumberArray } from "../types/einsum_typeguards";

function parseShapeString(shapeString: string): Result<number[]> {
  const bracketedShapeString = shapeString.replace(/\(/g, "[").replace(/\)/g, "]");
  let obj;
  try {
    obj = JSON.parse(bracketedShapeString);
  } catch {
    return {
      Err: "Not a valid shape"
    };
  }
  return isNumberArray(obj) ? { Ok: obj } : { Err: "Not a valid shape" };
}

export { parseShapeString };

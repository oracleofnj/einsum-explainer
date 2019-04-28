import { Result, isErrorMessage, isOk } from "../types/einsum_typeguards";

export default function parseAndTypecheckJSON<T>(
  str: string,
  typeguard: (r: any) => r is T,
  problematicFunctionName: string
): Result<T> {
  let obj;
  try {
    obj = JSON.parse(str);
  } catch {
    return {
      Err: `${problematicFunctionName} returned invalid JSON`
    };
  }
  if (isOk(obj, typeguard)) {
    return obj;
  } else if (isErrorMessage(obj)) {
    return obj;
  } else {
    return { Err: `${problematicFunctionName} returned valid JSON but of the wrong type` };
  }
}

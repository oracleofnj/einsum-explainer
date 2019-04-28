import { Result, enforce } from "../types/einsum_typeguards";

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
  return enforce(obj, typeguard, {
    Err: `${problematicFunctionName} returned valid JSON but of the wrong type`
  });
}

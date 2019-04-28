export type ErrorMessage = {
  Err: string;
};

export function isErrorMessage(r: any): r is ErrorMessage {
  return (r as object).hasOwnProperty("Err");
}

export type Result<T> = { Ok: T } | ErrorMessage;

export function isOk<T>(r: any, typeguard: (obj: any) => obj is T): r is Result<T> {
  return (r as object).hasOwnProperty("Ok") && typeguard((r as { Ok: T }).Ok);
}

export function enforce<T>(
  obj: any,
  typeguard: (obj: any) => obj is T,
  err: ErrorMessage
): Result<T> {
  if (isOk(obj, typeguard)) {
    return obj;
  } else if (isErrorMessage(obj)) {
    return obj;
  } else {
    return err;
  }
}

export function isNumberArray(r: any): r is number[] {
  return r instanceof Array && r.every(x => typeof x === "number");
}

export type NDArray = number | NDArrayArray;

interface NDArrayArray extends Array<NDArray> {}

function isProbablyNDArray(r: any): r is NDArray {
  if (typeof r === "number") {
    return true;
  }
  if (!(r instanceof Array)) {
    return false;
  }
  if (isNumberArray(r) && r.length !== 0) {
    return true;
  }
  const first = r[0];
  if (!(first instanceof Array) || first.length === 0) {
    return false;
  }
  const len = first.length;
  return (
    len !== 0 && r.every(x => x instanceof Array && x.length === len && isProbablyNDArray(x))
  );
}

export function getShape(arr: NDArray): Result<number[]> {
  if (typeof arr === "number") {
    return { Ok: [] };
  }
  const innerShape = getShape(arr[0]);
  if (isErrorMessage(innerShape)) {
    return innerShape;
  }
  for (let i = 1; i < arr.length; i++) {
    const nextShape = getShape(arr[i]);
    if (isErrorMessage(nextShape)) {
      return nextShape;
    }
    if (!innerShape.Ok.every((val, ix) => nextShape.Ok[ix] === val)) {
      return {
        Err: "Array contains elements with different shapes"
      };
    }
  }
  return { Ok: [arr.length, ...innerShape.Ok] };
}

export function isNDArray(r: any): r is NDArray {
  if (!isProbablyNDArray(r)) {
    return false;
  }
  const shape = getShape(r);
  return !isErrorMessage(shape);
}

export type Contraction = {
  operand_indices: string[];
  output_indices: string[];
  summation_indices: string[];
};

export function isContraction(r: object): r is Contraction {
  return (
    r.hasOwnProperty("operand_indices") &&
    (r as Contraction).operand_indices instanceof Array &&
    r.hasOwnProperty("output_indices") &&
    r.hasOwnProperty("summation_indices")
  );
}

export type OutputSize = { [key: string]: number };

export function isOutputSize(r: any): r is OutputSize {
  return Object.entries(r as object).every(([_, val]) => typeof val === "number");
}

export type SizedContraction = {
  contraction: Contraction;
  output_size: OutputSize;
};

export function isSizedContraction(r: object): r is SizedContraction {
  return (
    r.hasOwnProperty("contraction") &&
    isContraction((r as SizedContraction).contraction) &&
    r.hasOwnProperty("output_size") &&
    isOutputSize((r as SizedContraction).output_size)
  );
}

export type FlattenedOperand = {
  shape: number[];
  contents: number[];
};

export function isFlattenedOperand(r: object): r is FlattenedOperand {
  return (
    r.hasOwnProperty("shape") &&
    isNumberArray((r as FlattenedOperand).shape) &&
    r.hasOwnProperty("contents") &&
    isNumberArray((r as FlattenedOperand).contents)
  );
}

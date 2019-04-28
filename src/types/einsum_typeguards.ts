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
    (r as FlattenedOperand).shape instanceof Array &&
    (r as FlattenedOperand).shape.every(x => typeof x === "number") &&
    r.hasOwnProperty("contents") &&
    (r as FlattenedOperand).contents instanceof Array &&
    (r as FlattenedOperand).contents.every(x => typeof x === "number")
  );
}

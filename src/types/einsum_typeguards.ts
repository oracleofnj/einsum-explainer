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
  operand_indices: string[][];
  output_indices: string[];
  summation_indices: string[];
};

export function isContraction(r: object): r is Contraction {
  return (
    r.hasOwnProperty("operand_indices") &&
    (r as Contraction).operand_indices instanceof Array &&
    (r as Contraction).operand_indices.every(x => x instanceof Array) &&
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

export type SingletonOrder = {
  Singleton: SizedContraction;
};

export function isSingletonOrder(r: object): r is SingletonOrder {
  return r.hasOwnProperty("Singleton") && isSizedContraction((r as SingletonOrder).Singleton);
}

export type OperandNumberInput = {
  Input: number;
};

export function isOperandNumberInput(r: object): r is OperandNumberInput {
  return r.hasOwnProperty("Input") && typeof (r as OperandNumberInput).Input === "number";
}

export type OperandNumberIntermediate = {
  IntermediateResult: number;
};

export function isOperandNumberIntermediate(r: object): r is OperandNumberIntermediate {
  return (
    r.hasOwnProperty("IntermediateResult") &&
    typeof (r as OperandNumberIntermediate).IntermediateResult === "number"
  );
}

export type OperandNumber = OperandNumberInput | OperandNumberIntermediate;

export function isOperandNumber(r: object): r is OperandNumber {
  return isOperandNumberInput(r) || isOperandNumberIntermediate(r);
}

export type OperandNumPair = {
  lhs: OperandNumber;
  rhs: OperandNumber;
};

export function isOperandNumPair(r: object): r is OperandNumPair {
  return (
    r.hasOwnProperty("lhs") &&
    isOperandNumber((r as OperandNumPair).lhs) &&
    r.hasOwnProperty("rhs") &&
    isOperandNumber((r as OperandNumPair).rhs)
  );
}

export type OrderPair = {
  sized_contraction: SizedContraction;
  operand_nums: OperandNumPair;
};

export function isOrderPair(r: object): r is OrderPair {
  return (
    r.hasOwnProperty("sized_contraction") &&
    isSizedContraction((r as OrderPair).sized_contraction) &&
    r.hasOwnProperty("operand_nums") &&
    isOperandNumPair((r as OrderPair).operand_nums)
  );
}

export type PairsOrder = {
  Pairs: OrderPair[];
};

export function isPairsOrder(r: object): r is PairsOrder {
  return (
    r.hasOwnProperty("Pairs") &&
    (r as PairsOrder).Pairs instanceof Array &&
    (r as PairsOrder).Pairs.every(isOrderPair)
  );
}

export type ContractionOrder = SingletonOrder | PairsOrder;

export function isContractionOrder(r: object): r is ContractionOrder {
  return isSingletonOrder(r) || isPairsOrder(r);
}

export type SingletonSteps = {
  SingletonContraction: {
    method: string;
  };
};

export function isSingletonSteps(r: object): r is SingletonSteps {
  return (
    r.hasOwnProperty("SingletonContraction") &&
    typeof (r as SingletonSteps).SingletonContraction === "object" &&
    (r as SingletonSteps).SingletonContraction.hasOwnProperty("method") &&
    typeof (r as SingletonSteps).SingletonContraction.method === "string"
  );
}

export type SimplificationMethod = {
  method: string;
  new_indices: string[];
  einsum_string: string;
};

export function isSimplificationMethod(r: object): r is SimplificationMethod {
  return (
    r.hasOwnProperty("method") &&
    typeof (r as SimplificationMethod).method === "string" &&
    r.hasOwnProperty("new_indices") &&
    (r as SimplificationMethod).new_indices instanceof Array &&
    (r as SimplificationMethod).new_indices.every(x => typeof x === "string") &&
    r.hasOwnProperty("einsum_string") &&
    typeof (r as SimplificationMethod).einsum_string === "string"
  );
}

export type PairStep = {
  lhs_simplification: SimplificationMethod | null;
  rhs_simplification: SimplificationMethod | null;
  method: string;
  simplified_einsum_string: string;
};

export function isPairStep(r: object): r is PairStep {
  return (
    r.hasOwnProperty("lhs_simplification") &&
    ((r as PairStep).lhs_simplification === null ||
      isSimplificationMethod((r as PairStep).lhs_simplification as object)) &&
    r.hasOwnProperty("rhs_simplification") &&
    ((r as PairStep).rhs_simplification === null ||
      isSimplificationMethod((r as PairStep).rhs_simplification as object)) &&
    r.hasOwnProperty("method") &&
    typeof (r as PairStep).method === "string" &&
    r.hasOwnProperty("simplified_einsum_string") &&
    typeof (r as PairStep).simplified_einsum_string === "string"
  );
}

export type PairSteps = {
  PairContractions: PairStep[];
};

export function isPairSteps(r: object): r is PairSteps {
  return (
    r.hasOwnProperty("PairContractions") &&
    (r as PairSteps).PairContractions instanceof Array &&
    (r as PairSteps).PairContractions.every(isPairStep)
  );
}

export type PathSteps = SingletonSteps | PairSteps;

export function isPathSteps(r: object): r is PathSteps {
  return isSingletonSteps(r) || isPairSteps(r);
}

export type EinsumPath = {
  contraction_order: ContractionOrder;
  steps: PathSteps;
};

export function isEinsumPath(r: object): r is EinsumPath {
  return (
    r.hasOwnProperty("contraction_order") &&
    isContractionOrder((r as EinsumPath).contraction_order) &&
    r.hasOwnProperty("steps") &&
    isPathSteps((r as EinsumPath).steps)
  );
}

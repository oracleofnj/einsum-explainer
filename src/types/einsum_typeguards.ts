export type ErrorMessage = {
  Err: string;
};

function isErrorMessage(r: any): r is ErrorMessage {
  return (r as object).hasOwnProperty("Err");
}

export type Contraction = {
  operand_indices: string[];
  output_indices: string[];
  summation_indices: string[];
};

function isContraction(r: object): r is Contraction {
  return (
    r.hasOwnProperty("operand_indices") &&
    (r as Contraction).operand_indices instanceof Array &&
    r.hasOwnProperty("output_indices") &&
    r.hasOwnProperty("summation_indices")
  );
}

export type ContractionSuccess = {
  Ok: Contraction;
};

function isContractionSuccess(r: any): r is ContractionSuccess {
  return (r as object).hasOwnProperty("Ok") && isContraction((r as ContractionSuccess).Ok);
}

export type ContractionValidationResult = ContractionSuccess | ErrorMessage;

function isContractionValidationResult(r: any): r is ContractionValidationResult {
  return (
    isErrorMessage(r as ContractionValidationResult) ||
    isContractionSuccess(r as ContractionValidationResult)
  );
}

export type OutputSize = { [key: string]: number };

function isOutputSize(r: any): r is OutputSize {
  return Object.entries(r as object).every(([_, val]) => typeof val === "number");
}

export type SizedContraction = {
  contraction: Contraction;
  output_size: OutputSize;
};

function isSizedContraction(r: object): r is SizedContraction {
  return (
    r.hasOwnProperty("contraction") &&
    isContraction((r as SizedContraction).contraction) &&
    r.hasOwnProperty("output_size") &&
    isOutputSize((r as SizedContraction).output_size)
  );
}

export type SizedContractionSuccess = {
  Ok: SizedContraction;
};

function isSizedContractionSuccess(r: object): r is SizedContractionSuccess {
  return r.hasOwnProperty("Ok") && isSizedContraction((r as SizedContractionSuccess).Ok);
}

export type SizedContractionValidationResult = SizedContractionSuccess | ErrorMessage;

function isSizedContractionValidationResult(r: any): r is SizedContractionValidationResult {
  return isErrorMessage(r) || isSizedContractionSuccess(r as SizedContractionValidationResult);
}

export {
  isErrorMessage,
  isContractionSuccess,
  isContractionValidationResult,
  isSizedContractionValidationResult
};
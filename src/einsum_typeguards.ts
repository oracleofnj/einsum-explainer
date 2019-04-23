function isErrorMessage(r: any): r is ErrorMessage {
  return (r as object).hasOwnProperty("Err");
}

function isContraction(r: object): r is Contraction {
  return (
    r.hasOwnProperty("operand_indices") &&
    (r as Contraction).operand_indices instanceof Array &&
    r.hasOwnProperty("output_indices") &&
    r.hasOwnProperty("summation_indices")
  );
}

function isContractionSuccess(
  r: ContractionValidationResult
): r is ContractionSuccess {
  return r.hasOwnProperty("Ok") && isContraction((r as ContractionSuccess).Ok);
}

function isContractionValidationResult(
  r: any
): r is ContractionValidationResult {
  return (
    isErrorMessage(r as ContractionValidationResult) ||
    isContractionSuccess(r as ContractionValidationResult)
  );
}

function isOutputSize(r: any): r is OutputSize {
  if (!(r instanceof Array)) {
    return false;
  }
  return r.every((x: any) => typeof x === "number");
}

function isSizedContraction(r: object): r is SizedContraction {
  return (
    r.hasOwnProperty("contraction") &&
    isContraction((r as SizedContraction).contraction) &&
    r.hasOwnProperty("output_size") &&
    isOutputSize((r as SizedContraction).output_size)
  );
}

function isSizedContractionSuccess(r: object): r is SizedContractionSuccess {
  return (
    r.hasOwnProperty("Ok") &&
    isSizedContraction((r as SizedContractionSuccess).Ok)
  );
}

function isSizedContractionValidationResult(
  r: any
): r is SizedContractionValidationResult {
  return (
    isErrorMessage(r) ||
    isSizedContractionSuccess(r as SizedContractionValidationResult)
  );
}

export {
  isErrorMessage,
  isContractionValidationResult,
  isSizedContractionValidationResult
};

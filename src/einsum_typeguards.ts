function isErrorMessage(r: ValidationResult): r is ErrorMessage {
  return r.hasOwnProperty("Err");
}

function isContraction(r: ValidationResult): r is Success {
  return (
    r.hasOwnProperty("Ok") &&
    (r as Success).Ok.hasOwnProperty("operand_indices") &&
    (r as Success).Ok.hasOwnProperty("output_indices") &&
    (r as Success).Ok.hasOwnProperty("summation_indices")
  );
}

function isValidationResult(r: any): r is ValidationResult {
  return (
    isErrorMessage(r as ValidationResult) ||
    isContraction(r as ValidationResult)
  );
}

export { isErrorMessage, isValidationResult };

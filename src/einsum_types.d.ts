declare type Contraction = {
  operand_indices: string[];
  output_indices: string[];
  summation_indices: string[];
};

declare type ErrorMessage = {
  Err: string;
};

declare type ContractionSuccess = {
  Ok: Contraction;
};

declare type OutputSize = number[];

declare type SizedContraction = {
  contraction: Contraction;
  output_size: OutputSize;
};

declare type SizedContractionSuccess = {
  Ok: SizedContraction;
};

declare type ContractionValidationResult = ContractionSuccess | ErrorMessage;
declare type SizedContractionValidationResult =
  | SizedContractionSuccess
  | ErrorMessage;

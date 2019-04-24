type Contraction = {
  operand_indices: string[];
  output_indices: string[];
  summation_indices: string[];
};

type ErrorMessage = {
  Err: string;
};

type ContractionSuccess = {
  Ok: Contraction;
};

type OutputSize = number[];

type SizedContraction = {
  contraction: Contraction;
  output_size: OutputSize;
};

type SizedContractionSuccess = {
  Ok: SizedContraction;
};

type ContractionValidationResult = ContractionSuccess | ErrorMessage;
type SizedContractionValidationResult = SizedContractionSuccess | ErrorMessage;

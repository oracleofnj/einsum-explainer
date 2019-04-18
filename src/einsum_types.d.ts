declare type Contraction = {
  operand_indices: string[];
  output_indices: string[];
  summation_indices: string[];
};

declare type ErrorMessage = {
  Err: string;
};

declare type Success = {
  Ok: Contraction;
};

declare type ValidationResult = Success | ErrorMessage;

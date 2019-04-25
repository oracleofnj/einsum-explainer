import { Contraction } from "../types/einsum_typeguards";

function makeLatexString(contraction: Contraction): string {
  // Out_{i,k}=\sum_j A_{i,j} B_{j,k}
  const outputMatrix = `Out_{${contraction.output_indices.join(",")}}`;
  const summationSymbols = contraction.summation_indices.map(idx => `\\sum_${idx}`).join(" ");
  function makeInputMatrix(indices: string, n: number) {
    const asciiA: number = "A".charCodeAt(0);
    const matrixName = String.fromCharCode(asciiA + n);
    const subscripts = indices.split("").join(",");

    return `${matrixName}_{${subscripts}}`;
  }
  const inputMatrices = contraction.operand_indices.map(makeInputMatrix).join(" ");

  return `${outputMatrix} = ${summationSymbols} ${inputMatrices}`;
}

export default makeLatexString;

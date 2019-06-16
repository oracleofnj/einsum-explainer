import { AppState, operandState } from "./appState";
import makeOperand from "./makeOperand";

type PartialAppState = {
  equation: string;
  operandStates: operandState[];
};

type Preset = {
  description: string;
  presetFn: () => PartialAppState;
};

const presets: { [key: string]: Preset } = {
  matrixMultiplication: {
    description: "Matrix Multiplication",
    presetFn: () => ({
      equation: "ij,jk->ik",
      operandStates: [makeOperand([2, 3], 0, 1), makeOperand([3, 5], 0, 10)]
    })
  },
  matrixTransposition: {
    description: "Matrix Transposition (Implicit)",
    presetFn: () => ({
      equation: "ji",
      operandStates: [makeOperand([2, 3], 0, 1)]
    })
  },
  sum2D: {
    description: "Sum All Elements (2D)",
    presetFn: () => ({
      equation: "ij->",
      operandStates: [makeOperand([2, 3], 0, 1)]
    })
  },
  columnSum: {
    description: "Sum Each Column",
    presetFn: () => ({
      equation: "ij->j",
      operandStates: [makeOperand([2, 3], 0, 1)]
    })
  },
  rowSum: {
    description: "Sum Each Row",
    presetFn: () => ({
      equation: "ij->i",
      operandStates: [makeOperand([2, 3], 0, 1)]
    })
  },
  getDiagonal: {
    description: "Take the Diagonal",
    presetFn: () => ({
      equation: "ii->i",
      operandStates: [makeOperand([3, 3], 0, 1)]
    })
  },
  matrixVectorMultiplication: {
    description: "Matrix-Vector Multiplication",
    presetFn: () => ({
      equation: "ij,j->i",
      operandStates: [makeOperand([2, 3], 0, 1), makeOperand([3], 0, 10)]
    })
  },
  outerProduct: {
    description: "Outer Product",
    presetFn: () => ({
      equation: "i,j->ij",
      operandStates: [makeOperand([3], 0, 1), makeOperand([4], 10, 10)]
    })
  },
  batchMM1: {
    description: "Batch Matrix Multiplication (single RHS)",
    presetFn: () => ({
      equation: "nij,jk->nik",
      operandStates: [makeOperand([4, 2, 5], 0, 1), makeOperand([5, 3], 0, 10)]
    })
  },
  batchMM2: {
    description: "Batch Matrix Multiplication (multiple RHS)",
    presetFn: () => ({
      equation: "nij,njk->nik",
      operandStates: [makeOperand([4, 2, 5], 0, 1), makeOperand([4, 5, 3], 0, 10)]
    })
  },
  tensorContraction: {
    description: "Tensor Contraction",
    presetFn: () => ({
      equation: "pqrs,tuqvr->pstuv",
      operandStates: [makeOperand([2, 3, 5, 7], 0, 1), makeOperand([11, 13, 3, 17, 5], 0, 10)]
    })
  },
  bilinearTransformation: {
    description: "Bilinear Transformation",
    presetFn: () => ({
      equation: "ik,jkl,il->ij",
      operandStates: [
        makeOperand([2, 3], 0, 1),
        makeOperand([5, 3, 7], 0, 10),
        makeOperand([2, 7], 0, 100)
      ]
    })
  }
};

export function getState({ presetFn }: Preset): AppState {
  const { equation, operandStates } = presetFn();
  const visibleSizes = operandStates.length;
  return {
    equation,
    visibleSizes,
    operandStates: [...operandStates, ...Array(256 - visibleSizes).fill(makeOperand([]))],
    optimizationMethod: "Naive"
  };
}

export default presets;

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

function matrixMultiplication(): PartialAppState {
  return {
    equation: "ij,jk->ik",
    operandStates: [makeOperand([2, 3], 0, 1), makeOperand([3, 5], 0, 10)]
  };
}

function matrixTransposition(): PartialAppState {
  return {
    equation: "ji",
    operandStates: [makeOperand([2, 3], 0, 1)]
  };
}

function sum2D(): PartialAppState {
  return {
    equation: "ij->",
    operandStates: [makeOperand([2, 3], 0, 1)]
  };
}

function columnSum(): PartialAppState {
  return {
    equation: "ij->j",
    operandStates: [makeOperand([2, 3], 0, 1)]
  };
}

function rowSum(): PartialAppState {
  return {
    equation: "ij->i",
    operandStates: [makeOperand([2, 3], 0, 1)]
  };
}

function getDiagonal(): PartialAppState {
  return {
    equation: "ii->i",
    operandStates: [makeOperand([3, 3], 0, 1)]
  };
}

const presets: { [key: string]: Preset } = {
  matrixMultiplication: {
    description: "Matrix Multiplication",
    presetFn: matrixMultiplication
  },
  matrixTransposition: {
    description: "Matrix Transposition (Implicit)",
    presetFn: matrixTransposition
  },
  sum2D: {
    description: "Sum All Elements (2D)",
    presetFn: sum2D
  },
  columnSum: {
    description: "Sum Each Column",
    presetFn: columnSum
  },
  rowSum: {
    description: "Sum Each Row",
    presetFn: rowSum
  },
  getDiagonal: {
    description: "Take the Diagonal",
    presetFn: getDiagonal
  }
};

export function getState({ presetFn }: Preset): AppState {
  const { equation, operandStates } = presetFn();
  const visibleSizes = operandStates.length;
  return {
    equation,
    visibleSizes,
    operandStates: [...operandStates, ...Array(256 - visibleSizes).fill(makeOperand([]))]
  };
}

export default presets;

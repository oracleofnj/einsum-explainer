import {
  EinsumPath,
  isPairsOrder,
  isPairSteps,
  isSingletonOrder,
  isSingletonSteps,
  OrderPair,
  PairStep,
  SizedContraction,
  Result,
  isOperandNumberInput,
  OperandNumber,
  SimplificationMethod
} from "../types/einsum_typeguards";

export type OrderAndStep = OrderPair & PairStep;
type SizedContractionAndMethod = {
  sized_contraction: SizedContraction;
  method: string;
};
type OrderAndSteps =
  | {
      Pairs: OrderAndStep[];
    }
  | {
      Singleton: SizedContractionAndMethod;
    };

type OrderTreeNode =
  | {
      sourceType: "Input";
      source: number;
    }
  | {
      sourceType: "Simplification";
      source: Simplification;
    }
  | {
      sourceType: "Result";
      source: OrderTree;
    };

interface Simplification {
  method: string;
  einsum_string: string;
  input: OrderTreeNode;
}

interface OrderTree {
  lhs: OrderTreeNode;
  rhs: OrderTreeNode;
  method: string;
  simplified_einsum_string: string;
}

function treeifyStep(pairs: OrderAndStep[], intermediateNum: number): OrderTree {
  const orderAndStep = pairs[intermediateNum];
  const { lhs, rhs } = orderAndStep.operand_nums;
  const {
    method,
    simplified_einsum_string,
    lhs_simplification,
    rhs_simplification
  } = orderAndStep;

  function resolve(num: OperandNumber): OrderTreeNode {
    return isOperandNumberInput(num)
      ? {
          sourceType: "Input",
          source: num.Input
        }
      : {
          sourceType: "Result",
          source: treeifyStep(pairs, num.IntermediateResult)
        };
  }

  function getSimplification(
    simplificationMethod: SimplificationMethod | null,
    num: OperandNumber
  ): OrderTreeNode {
    return simplificationMethod !== null
      ? {
          sourceType: "Simplification",
          source: {
            method: simplificationMethod.method,
            einsum_string: simplificationMethod.einsum_string,
            input: resolve(num)
          }
        }
      : resolve(num);
  }

  return {
    lhs: getSimplification(lhs_simplification, lhs),
    rhs: getSimplification(rhs_simplification, rhs),
    method,
    simplified_einsum_string
  };
}

export function treeifySteps(pairs: OrderAndStep[]): OrderTree {
  return treeifyStep(pairs, pairs.length - 1);
}

export function zipSteps(path: EinsumPath): Result<OrderAndSteps> {
  if (isPairsOrder(path.contraction_order) && isPairSteps(path.steps)) {
    const pairContractions = path.steps.PairContractions;
    return {
      Ok: {
        Pairs: path.contraction_order.Pairs.map((val, idx) => ({
          ...val,
          ...pairContractions[idx]
        }))
      }
    };
  } else if (isSingletonOrder(path.contraction_order) && isSingletonSteps(path.steps)) {
    return {
      Ok: {
        Singleton: {
          sized_contraction: path.contraction_order.Singleton,
          method: path.steps.SingletonContraction.method
        }
      }
    };
  } else {
    return { Err: "Inconsistent order and steps" };
  }
}

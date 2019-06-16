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
  OperandNumber
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

type orderTreeNode =
  | {
      sourceType: "Input";
      source: number;
    }
  | {
      sourceType: "Result";
      source: OrderTree;
    };

interface OrderTree {
  lhs: orderTreeNode;
  rhs: orderTreeNode;
}

function treeifyStep(pairs: OrderAndStep[], intermediateNum: number): OrderTree {
  const { lhs, rhs } = pairs[intermediateNum].operand_nums;

  function resolve(num: OperandNumber): orderTreeNode {
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

  return {
    lhs: resolve(lhs),
    rhs: resolve(rhs)
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

import React from "react";
import { OrderTreeNode } from "../utils/showPath";

type EinsumPathDetailsProps = {
  level: number;
  treeNode: OrderTreeNode;
};

const EinsumPathDetails = (props: EinsumPathDetailsProps) => {
  const { treeNode, level } = props;
  let contents;
  switch (treeNode.sourceType) {
    case "Input":
      contents = <div>Input #{treeNode.source}</div>;
      break;
    case "Simplification":
      contents = (
        <>
          <div>{`${treeNode.source.method} (${treeNode.source.einsum_string})`}</div>
          <EinsumPathDetails level={level + 1} treeNode={treeNode.source.input} />
        </>
      );
      break;
    case "Result":
      contents = (
        <>
          <div>{`${treeNode.source.method} (${treeNode.source.simplified_einsum_string})`}</div>
          <EinsumPathDetails level={level + 1} treeNode={treeNode.source.lhs} />
          <EinsumPathDetails level={level + 1} treeNode={treeNode.source.rhs} />
        </>
      );
      break;
    default:
      return <div>Unknown sourceType: {JSON.stringify(treeNode)}</div>;
  }
  return <div style={level > 0 ? { paddingLeft: "1em" } : {}}>{contents}</div>;
};

export default React.memo(EinsumPathDetails);

import { useStores } from "@/_utils/providers/contexts/StoreContext";
import { GraphNode } from "@/stores/object-graph.store";
import { observer } from "mobx-react-lite";
import React from "react";

interface NodeProps {
  node: GraphNode;
  depth: number;
}

const Node: React.FC<NodeProps> = observer(({ node, depth }) => {
  return (
    <div style={{ marginLeft: `${depth * 20}px` }}>
      <div>
        {node.name} ({node.type})
      </div>
      {node.children.map((child) => (
        <Node key={child.id} node={child} depth={depth + 1} />
      ))}
    </div>
  );
});

const UIGraph: React.FC = observer(() => {
  const { objectGraph } = useStores();
  if (!objectGraph.root) return <div>No graph data</div>;
  console.log("objetGraph", JSON.stringify(objectGraph.root));

  return <Node node={objectGraph.root} depth={0} />;
});

export default UIGraph;

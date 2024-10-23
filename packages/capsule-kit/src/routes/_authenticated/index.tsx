import { useStores } from "@/_utils/providers/contexts/StoreContext";
import { Cmdk } from "@/components/Cmdk";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UIGraph from "@/components/UiGraph";
import { createFileRoute } from "@tanstack/react-router";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

type ObjectPoolType = "definition";
type ObjectPoolUnitDetailsType = "name" | "children" | "metadata";
type ObjectPoolUnit = Record<ObjectPoolType, ObjectPoolUnitDetails>;
type ObjectPoolUnitDetails = Record<
  ObjectPoolUnitDetailsType,
  string | Record<string, any>
>;

const HomeComponent = observer(() => {
  const { objectPool } = useStores();
  useEffect(() => {
    objectPool.initPool();
  }, []);

  const [input, setInput] = useState("");
  const addPipe = () => {
    objectPool.addToPool({
      id: "p2",
      name: input,
      workspace: "w1",
      children: [],
    });
  };

  return (
    <div
      className="min-h-screen bg-black p-8"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">
          Workspace : {objectPool.getWorkspaceById("w1")?.name}
        </h1>
        <h1 className="text-4xl font-bold text-white mb-8">Pipe : {}</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4"></div>

        <div className="max-w-64 m-3">
          <Input onChange={(e) => setInput(e.target.value)} />
          <Button onMouseDown={() => addPipe()}>Add </Button>
        </div>

        <h2>UIGraph</h2>
        <UIGraph />
        <Cmdk />
      </div>
    </div>
  );
});

export const Route = createFileRoute("/_authenticated/")({
  component: HomeComponent,
});

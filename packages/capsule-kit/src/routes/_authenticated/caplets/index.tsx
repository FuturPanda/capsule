import { Button } from "@/components/ui/button.tsx";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { capletRequest } from "@/stores/caplets/caplet.request.ts";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { v4 } from "uuid";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2).max(100),
});

export type CreateCapletFormValues = z.infer<typeof formSchema>;

export const CapletDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [caplets, setCaplets] = useState<
    { title: string | null; id: string | null }[]
  >([]);
  const navigate = useNavigate();

  const loadCaplets = async () => {
    setIsLoading(true);
    try {
      const ids = localStorage.getItem("capletIds")?.split("::");
      if (ids) {
        const caplets = ids
          .map((id) => ({
            title: localStorage.getItem(`${id}::TITLE`),
            id: id,
          }))
          .filter((caplet) => caplet.title !== null);
        setCaplets(caplets);
      }
    } catch (error) {
      toast({
        title: `Failed to load Caplets`,
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const query = useQuery({
    queryKey: ["caplets"],
    queryFn: capletRequest.getAllCaplets,
  });

  useEffect(() => {
    loadCaplets();
  }, []);

  console.log("DATA = ", query.data);
  return (
    <>
      <div className="hidden h-2/3 w-full px-20 m-auto flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold tracking-tight">Caplets</h2>
            <Button
              onClick={() => {
                const id = v4();
                localStorage.setItem(
                  "capletIds",
                  caplets.length > 0
                    ? caplets.map((caplet) => caplet.id).join("::") + "::" + id
                    : id,
                );
                navigate({
                  to: "/caplets/$capletId",
                  params: { capletId: id },
                });
              }}
              className="border"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Caplet
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {caplets.map((caplet) => (
              <Link to={`/caplets/$capletId`} params={{ capletId: caplet.id! }}>
                <Card className="bg-background border-zinc-800">
                  <CardHeader className="">
                    <CardTitle>{caplet.title}</CardTitle>
                  </CardHeader>
                  {/* gcc {caplet.title} */}
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export const Route = createFileRoute("/_authenticated/caplets/")({
  component: () => <CapletDashboard />,
});

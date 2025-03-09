import { useToast } from "@/hooks/use-toast";
import { CapsuleClient } from "@capsule-mono-repo/capsule-client";
import { useState } from "react";

export interface ResourceTableOptions<T, CreateDto, UpdateDto> {
  resourceName: string;
  fetchResources: () => Promise<Pick<T, keyof T>[] | undefined>;
  createResource?: (data: CreateDto) => Promise<T>;
  updateResource?: (id: string, data: UpdateDto) => Promise<T>;
  deleteResource?: (id: string) => Promise<void>;
  client?: CapsuleClient;
}

export function useResourceTable<
  T extends { id: string | number },
  CreateDto,
  UpdateDto,
>({
  resourceName,
  fetchResources,
  createResource,
  updateResource,
  deleteResource,
}: ResourceTableOptions<T, CreateDto, UpdateDto>) {
  const [data, setData] = useState<T[] | undefined>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState<T | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  const loadResources = async () => {
    setIsLoading(true);
    try {
      const resources = await fetchResources();
      console.log(resources);
      setData(resources);
    } catch (error) {
      toast({
        title: `Failed to load ${resourceName}`,
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedResource(null);
    setIsFormOpen(true);
  };

  const handleEdit = (id: string) => {
    const resource = data?.find((item) => item.id === id);
    if (resource) {
      setSelectedResource(resource);
      setIsFormOpen(true);
    }
  };

  const handleDelete = async (ids: string[]) => {
    if (!deleteResource) return;

    try {
      for (const id of ids) {
        await deleteResource(id);
      }

      toast({
        title: `${resourceName} deleted`,
        description: `Successfully deleted ${ids.length} ${resourceName.toLowerCase()}`,
      });

      //await loadResources();
    } catch (error) {
      toast({
        title: `Failed to delete ${resourceName}`,
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const handleSave = async (formData: CreateDto | UpdateDto) => {
    try {
      if (selectedResource) {
        if (!updateResource) throw new Error("Update not implemented");
        await updateResource(
          selectedResource.id as string,
          formData as UpdateDto,
        );
        toast({
          title: `${resourceName.slice(0, -1)} updated`,
          description: `Successfully updated the ${resourceName.toLowerCase().slice(0, -1)}`,
        });
      } else {
        if (!createResource) throw new Error("Create not implemented");
        await createResource(formData as CreateDto);
        toast({
          title: `${resourceName.slice(0, -1)} created`,
          description: `Successfully created a new ${resourceName.toLowerCase().slice(0, -1)}`,
        });
      }

      setIsFormOpen(false);
      //await loadResources();
    } catch (error) {
      toast({
        title: `Failed to save ${resourceName.slice(0, -1)}`,
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
  };

  return {
    data,
    setData,
    isLoading,
    isFormOpen,
    selectedResource,
    loadResources,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSave,
    handleCancel,
  };
}

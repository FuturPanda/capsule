import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCapsuleClient } from "@/hooks/use-capsule-client";
import { GetEntitiesDto } from "@/stores/databases/database.model";
import {
  CapsuleEventType,
  CreateTask,
  Task,
  UpdateTask,
} from "@capsulesh/shared-types";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ResourceTable } from ".";
import { useResourceTable } from "./use-resource-table";

const taskTableDefinition: GetEntitiesDto = {
  id: "tasks-001",
  tableName: "tasks",
  columns: [
    {
      id: "col-001",
      name: "id",
      type: "integer",
      isRequired: 1,
      isPrimaryKey: 1,
    },
    {
      id: "col-002",
      name: "content",
      type: "text",
      isRequired: 1,
      isPrimaryKey: 0,
    },
    {
      id: "col-003",
      name: "assignee",
      type: "text",
      isRequired: 0,
      isPrimaryKey: 0,
    },
    {
      id: "col-004",
      name: "dueDate",
      type: "timestamp",
      isRequired: 0,
      isPrimaryKey: 0,
    },
    {
      id: "col-005",
      name: "priority",
      type: "text",
      isRequired: 0,
      isPrimaryKey: 0,
    },
    {
      id: "col-006",
      name: "progress",
      type: "numeric",
      isRequired: 0,
      isPrimaryKey: 0,
    },
    {
      id: "col-007",
      name: "isCompleted",
      type: "boolean",
      isRequired: 0,
      isPrimaryKey: 0,
    },
    {
      id: "col-008",
      name: "completedAt",
      type: "timestamp",
      isRequired: 0,
      isPrimaryKey: 0,
    },
  ],
};

export function TasksTable() {
  const client = useCapsuleClient();
  const {
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
  } = useResourceTable<Task, CreateTask, UpdateTask>({
    resourceName: "Tasks",
    fetchResources: async () => client?.models.tasks?.select().list(),
    createResource: async (resource: CreateTask) =>
      client?.models.tasks?.create(resource),
    updateResource: async (id: number, resource: UpdateTask) =>
      client?.models.tasks?.update(id, resource),
    deleteResource: async (id: number) => client?.models.tasks?.delete(id),
  });

  useEffect(() => {
    loadResources();

    if (client) {
      const unsubscribe = client.on(CapsuleEventType.TASKS_CREATED, (event) => {
        const newTask = event.task;
        setData((prevData) => (prevData ? [...prevData, newTask] : [newTask]));
      });
      return () => {
        unsubscribe();
      };
    }
  }, []);

  const form = useForm<CreateTask | UpdateTask>({
    defaultValues: {
      content: "",
      assignee: "",
      dueDate: null,
      priority: "medium",
      progress: -5,
      isCompleted: false,
    },
  });

  useEffect(() => {
    if (selectedResource) {
      form.reset({
        content: selectedResource.content,
        assignee: selectedResource.assignee,
        dueDate: selectedResource.due_date,
        priority: selectedResource.priority,
        progress: selectedResource.progress,
        isCompleted: selectedResource.is_completed,
      });
    } else {
      form.reset({
        content: "",
        assignee: "",
        dueDate: null,
        priority: "medium",
        progress: 0,
        isCompleted: false,
      });
    }
  }, [selectedResource, form]);

  const onSubmit = (formData: CreateTask | UpdateTask) => {
    handleSave(formData);
  };

  return (
    <>
      <ResourceTable
        resourceName="Tasks"
        tableDefinition={taskTableDefinition}
        data={data}
        isLoading={isLoading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog
        open={isFormOpen}
        onOpenChange={(open) => !open && handleCancel()}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedResource ? "Edit Task" : "Create Task"}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assignee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignee</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                        value={
                          field.value
                            ? new Date(field.value).toISOString().slice(0, 16)
                            : ""
                        }
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? new Date(e.target.value).toISOString()
                              : null,
                          )
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <FormControl>
                      <select
                        className="w-full px-3 py-2 border rounded-md bg-background "
                        {...field}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="progress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Progress ({field.value}%)</FormLabel>
                    <FormControl>
                      <Input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        {...field}
                        className="p-0"
                        value={field.value}
                        onChange={(e) => {
                          const newValue = parseInt(e.target.value, 10);
                          console.log("New progress value:", newValue);
                          field.onChange(newValue);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isCompleted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    </FormControl>
                    <FormLabel>Mark as completed</FormLabel>
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedResource ? "Save Changes" : "Create Task"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

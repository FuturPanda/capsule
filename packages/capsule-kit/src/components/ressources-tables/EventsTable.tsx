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
import { Textarea } from "@/components/ui/textarea";
import { useCapsuleClient } from "@/hooks/use-capsule-client";
import { GetEntitiesDto } from "@/stores/databases/database.model";
import {
  CapsuleEventType,
  CreateEvent,
  Event,
  UpdateEvent,
} from "@capsulesh/shared-types";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ResourceTable } from ".";
import { useResourceTable } from "./use-resource-table";

const eventsTableDefinition: GetEntitiesDto = {
  id: "events-001",
  tableName: "events",
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
      name: "title",
      type: "text",
      isRequired: 1,
      isPrimaryKey: 0,
    },
    {
      id: "col-003",
      name: "description",
      type: "text",
      isRequired: 0,
      isPrimaryKey: 0,
    },
    {
      id: "col-004",
      name: "location",
      type: "text",
      isRequired: 0,
      isPrimaryKey: 0,
    },
    {
      id: "col-005",
      name: "startDate",
      type: "timestamp",
      isRequired: 1,
      isPrimaryKey: 0,
    },
    {
      id: "col-006",
      name: "endDate",
      type: "timestamp",
      isRequired: 0,
      isPrimaryKey: 0,
    },
    {
      id: "col-007",
      name: "allDay",
      type: "boolean",
      isRequired: 0,
      isPrimaryKey: 0,
    },
    {
      id: "col-008",
      name: "category",
      type: "text",
      isRequired: 0,
      isPrimaryKey: 0,
    },
    {
      id: "col-009",
      name: "status",
      type: "text",
      isRequired: 0,
      isPrimaryKey: 0,
    },
  ],
};

export function EventsTable() {
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
  } = useResourceTable<Event, CreateEvent, UpdateEvent>({
    resourceName: "Events",
    fetchResources: async () => client?.models.events?.select().list(),
    createResource: async (resource: CreateEvent) =>
      client?.models.events?.create(resource),
    updateResource: async (id: number, resource: UpdateEvent) =>
      client?.models.events?.update(id, resource),
    deleteResource: async (id: number) => client?.models.events?.delete(id),
  });

  useEffect(() => {
    loadResources();

    if (client) {
      const unsubscribe = client.on(
        CapsuleEventType.EVENTS_CREATED,
        (event) => {
          const newEvent = event.event;
          console.log("Event created:", newEvent);
          setData((prevData) =>
            prevData ? [...prevData, newEvent] : [newEvent],
          );
        },
      );
      return () => {
        unsubscribe();
      };
    }
  }, []);

  const form = useForm<CreateEvent | UpdateEvent>({
    defaultValues: {
      title: "",
      description: "",
      location: "",
      startTime: new Date(),
      endTime: undefined,
      isAllDay: false,
      category: "",
      attendees: [],
    },
  });

  useEffect(() => {
    if (selectedResource) {
      form.reset({
        title: selectedResource.title,
        description: selectedResource.description,
        location: selectedResource.location,
        startTime: selectedResource.startTime,
        endTime: selectedResource.endTime,
        isAllDay: selectedResource.isAllDay,
        category: selectedResource.category,
      });
    } else {
      form.reset({
        title: "",
        description: "",
        location: "",
        startTime: new Date(),
        endTime: undefined,
        isAllDay: false,
        category: "",
      });
    }
  }, [selectedResource, form]);

  const onSubmit = (formData: CreateEvent | UpdateEvent) => {
    handleSave(formData);
  };

  return (
    <>
      <ResourceTable
        resourceName="Events"
        tableDefinition={eventsTableDefinition}
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
              {selectedResource ? "Edit Event" : "Create Event"}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} value={field.value || ""} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
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
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
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
                name="allDay"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    </FormControl>
                    <FormLabel>All Day Event</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <select
                        className="w-full px-3 py-2 border rounded-md bg-background"
                        {...field}
                        value={field.value || "scheduled"}
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="canceled">Canceled</option>
                        <option value="completed">Completed</option>
                        <option value="postponed">Postponed</option>
                      </select>
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedResource ? "Save Changes" : "Create Event"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

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
  CreatePerson,
  Person,
  UpdatePerson,
} from "@capsulesh/shared-types";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ResourceTable } from ".";
import { useResourceTable } from "./use-resource-table";

const peopleTableDefinition: GetEntitiesDto = {
  id: "people-001",
  tableName: "people",
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
      name: "firstName",
      type: "text",
      isRequired: 1,
      isPrimaryKey: 0,
    },
    {
      id: "col-003",
      name: "lastName",
      type: "text",
      isRequired: 1,
      isPrimaryKey: 0,
    },
    {
      id: "col-004",
      name: "dateOfBirth",
      type: "date",
      isRequired: 0,
      isPrimaryKey: 0,
    },
    {
      id: "col-005",
      name: "gender",
      type: "text",
      isRequired: 0,
      isPrimaryKey: 0,
    },
    {
      id: "col-006",
      name: "email",
      type: "text",
      isRequired: 0,
      isPrimaryKey: 0,
    },
    {
      id: "col-007",
      name: "phone",
      type: "text",
      isRequired: 0,
      isPrimaryKey: 0,
    },
    {
      id: "col-008",
      name: "address",
      type: "text",
      isRequired: 0,
      isPrimaryKey: 0,
    },
    {
      id: "col-009",
      name: "occupation",
      type: "text",
      isRequired: 0,
      isPrimaryKey: 0,
    },
  ],
};

export function PersonTable() {
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
  } = useResourceTable<Person, CreatePerson, UpdatePerson>({
    resourceName: "Persons",
    fetchResources: async () => client?.models.persons?.select().list(),
    createResource: async (resource: CreatePerson) =>
      client?.models.persons?.create(resource),
    updateResource: async (id: number, resource: UpdatePerson) =>
      client?.models.persons?.update(id, resource),
    deleteResource: async (id: number) => client?.models.persons?.delete(id),
  });

  useEffect(() => {
    loadResources();

    if (client) {
      const unsubscribe = client.on(
        CapsuleEventType.PEOPLE_CREATED,
        (event) => {
          const newPerson = event.person;
          console.log("Person created:", newPerson);
          setData((prevData) =>
            prevData ? [...prevData, newPerson] : [newPerson],
          );
        },
      );
      return () => {
        unsubscribe();
      };
    }
  }, []);

  const form = useForm<CreatePerson | UpdatePerson>({
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: null,
      gender: undefined,
      email: "",
      phone: "",
      address: "",
      occupation: "",
    },
  });

  useEffect(() => {
    if (selectedResource) {
      form.reset({
        firstName: selectedResource.firstName,
        lastName: selectedResource.lastName,
        dateOfBirth: selectedResource.dateOfBirth,
        gender: selectedResource.gender,
        email: selectedResource.email,
        phone: selectedResource.phone,
        address: selectedResource.address,
        occupation: selectedResource.occupation,
      });
    } else {
      form.reset({
        firstName: "",
        lastName: "",
        dateOfBirth: null,
        gender: undefined,
        email: "",
        phone: "",
        address: "",
        occupation: "",
      });
    }
  }, [selectedResource, form]);

  const onSubmit = (formData: CreatePerson | UpdatePerson) => {
    handleSave(formData);
  };

  return (
    <>
      <ResourceTable
        resourceName="Persons"
        tableDefinition={peopleTableDefinition}
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
              {selectedResource ? "Edit Person" : "Create Person"}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value || ""} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <select
                        className="w-full px-3 py-2 border rounded-md bg-background"
                        {...field}
                        value={field.value || ""}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="non-binary">Non-binary</option>
                        <option value="other">Other</option>
                        <option value="prefer_not_to_say">
                          Prefer not to say
                        </option>
                      </select>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="occupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Occupation</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedResource ? "Save Changes" : "Create Person"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

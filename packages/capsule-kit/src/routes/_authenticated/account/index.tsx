import { Button } from "@/components/ui/button.tsx";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { useBoundStore } from "@/stores/global.store.ts";
import { userRequests } from "@/stores/users/user.request.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  email: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email(),
  avatarUrl: z.string().optional(),
  description: z.string().max(160).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const Profile = () => {
  const user = useBoundStore((state) => state.user);
  const updateUser = useBoundStore((state) => state.updateUser);
  const queryClient = useQueryClient();
  const updateAccountMutation = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      updateUser(values);
      return userRequests.updateUserProfile(values);
    },
    onSuccess: (data) => {
      console.log("on success user = ", user, data);
      queryClient.setQueryData(["user"], user);
      return true;
    },
    onError: (error) => {
      console.error("Login failed", error);
      return false;
    },
  });

  const defaultValues: Partial<ProfileFormValues> = useMemo(
    () => ({
      username: user?.username || "",
      email: user?.email || "",
      avatarUrl: user?.avatarUrl || "",
      description: user?.description || "",
    }),
    [user?.email, user?.username, user?.description, user?.avatarUrl],
  );
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  function onSubmit(data: ProfileFormValues) {
    updateAccountMutation.mutate(data);
  }

  return (
    <div className="flex flex-col h-full w-full bg-background">
      <div className="px-6 py-4 border-b border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-zinc-100">Account</h2>
          </div>
        </div>
      </div>
      <div className="px-6 py-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 max-w-2xl"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-normal">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Capsule"
                      {...field}
                      className="bg-background focus-visible:ring-1 rounded-md focus-visible:ring-ring border text-white"
                    />
                  </FormControl>
                  <FormDescription className="text-zinc-400">
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-normal">Email</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="hello@capsule.com"
                      {...field}
                      className="bg-background border focus-visible:ring-1 rounded-md focus-visible:ring-ring  text-white"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-normal">Avatar</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="https://avatar.com/avatar1"
                      {...field}
                      className="bg-background focus-visible:ring-1 rounded-md focus-visible:ring-ring  border text-white"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-normal">Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about yourself"
                      className="resize-none bg-background border text-white min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="bg-transparent text-ring border hover:bg-ring  hover:text-white"
            >
              Update profile
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/_authenticated/account/")({
  component: () => <Profile />,
});

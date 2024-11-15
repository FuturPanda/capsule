import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Database } from "lucide-react";
import { useBoundStore } from "@/stores/global.store.ts";
import { useMemo } from "react";

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
  avatar: z.string().optional(),
  bio: z.string().max(160).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const Profile = () => {
  const user = useBoundStore((state) => state.user);
  const updateUser = useBoundStore((state) => state.updateUser);

  const defaultValues: Partial<ProfileFormValues> = useMemo(
    () => ({
      username: user?.username || "",
      email: user?.email || "",
      avatar: user?.avatar || "",
      bio: user?.bio || "",
    }),
    [user?.email, user?.username, user?.bio, user?.avatar],
  );
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  function onSubmit(data: ProfileFormValues) {
    updateUser(data);
  }

  return (
    <div className="flex flex-col h-full w-full bg-zinc-950">
      <div className="px-6 py-4 border-b border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-zinc-400" />
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
                      className="bg-zinc-900 border-none text-white"
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
                      className="bg-zinc-900 border-none text-white"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-normal">Avatar</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="https://avatar.com/avatar1"
                      {...field}
                      className="bg-zinc-900 border-none text-white"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-normal">Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about yourself"
                      className="resize-none bg-zinc-900 border-none text-white min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
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

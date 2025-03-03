import { useAuth } from "@/_utils/providers/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  url: z.string().url(),
  encodedApiKey: z.string().base64(),
});

type LoginFormValues = z.infer<typeof formSchema>;

function LoginComponent() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      url: "",
      encodedApiKey: "",
    },
  });

  const auth = useAuth();
  const router = useRouter();
  const [, setIsSubmitting] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    console.log("is submitting ::: ", values);
    try {
      auth!
        .login(values.email, values.password, values.url, values.encodedApiKey)
        .then(() => router.navigate({ to: "/" }));
    } catch (error) {
      console.error("Error logging in: ", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex justify-center items-center w-full h-full">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your Capsule Api Key below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your email"
                            type={"email"}
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="..."
                            type={"password"}
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Capsule Instance Url</FormLabel>
                        <FormControl>
                          <Input placeholder="..." {...field} type={"url"} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="encodedApiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Api Key</FormLabel>
                        <FormControl>
                          <Input placeholder="..." {...field} type={"text"} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="w-full flex items-end justify-end">
                    <Button
                      type="submit"
                      variant={"outline"}
                      className="bg-green-800"
                    >
                      Submit
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export const Route = createFileRoute("/login")({
  beforeLoad: ({ context }) => {
    console.log("before login route : ", context.auth.isAuthenticated);
    if (context.auth.isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
  component: LoginComponent,
});

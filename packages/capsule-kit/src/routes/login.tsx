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
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().min(2).max(50),
  password: z.string(),
});

type LoginFormValues = z.infer<typeof formSchema>;

function LoginComponent() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const auth = useAuth();
  const navigate = useNavigate();
  const [, setIsSubmitting] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    console.log("is submitting ");
    try {
      const email = values.email;
      const password = values.password;
      if (!email || !password) return;
      await auth!.login(email, password);
    } catch (error) {
      console.error("Error logging in: ", error);
    } finally {
      setIsSubmitting(false);
      await navigate({ to: "/" });
    }
  }

  return (
    <div className="flex justify-center items-center w-full h-full">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account blablablma
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
                          <Input placeholder="@" {...field} />
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
                          <Input placeholder="" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Submit</Button>
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

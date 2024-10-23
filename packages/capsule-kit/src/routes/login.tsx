import { useAuth } from "@/_utils/providers/contexts/AuthContext";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  beforeLoad: ({ context }) => {
    console.log("before login route : ", context.auth.isAuthenticated);
    if (context.auth.isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
  component: LoginComponent,
});

function LoginComponent() {
  const auth = useAuth();
  // const store = useStores();
  // const isLoading = useRouterState({ select: (s) => s.isLoading });
  const navigate = useNavigate();
  const [, setIsSubmitting] = React.useState(false);
  console.log("logging auth : ", auth);
  if (auth.isAuthenticated) navigate({ to: "/" });

  const onFormSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    try {
      evt.preventDefault();
      const data = new FormData(evt.currentTarget);
      const email = data.get("email")?.toString();
      const password = data.get("password")?.toString();
      console.log(`password is : ${password} and email is : ${email}`);
      if (!email || !password) return;
      await auth!.login(email, password);
    } catch (error) {
      console.error("Error logging in: ", error);
    } finally {
      setIsSubmitting(false);
      await navigate({ to: "/" });
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-full">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input id="password" type="password" required />
            </div>
            <Button
              type="submit"
              onMouseDown={() => onFormSubmit}
              className="w-full"
            >
              Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

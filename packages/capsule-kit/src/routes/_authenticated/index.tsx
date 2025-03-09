import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Database, GitBranch, Rocket } from "lucide-react";
import { forwardRef } from "react";

const HomeComponent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div className="w-full px-6 py-6 md:px-10 lg:px-16 flex-1">
    <div className="mb-8">
      <h1 className="text-3xl font-light tracking-tight mb-2">
        Welcome to your Capsule
      </h1>
      <p className="text-zinc-400 max-w-2xl">
        Your secure, personal data space. Get started by connecting your data
        sources and explore the capabilities of your Capsule.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <GetStartedCard />
      <DocsCard />
      <DataCard />
      <ModelsCard />
    </div>

    <div className="mt-12">
      <h2 className="text-xl font-medium mb-4">Recent Activity</h2>
      <div className="border border-zinc-800 rounded-lg p-8 text-center bg-background">
        <div className="flex flex-col items-center justify-center">
          <Database className="h-12 w-12 text-zinc-600 mb-4" />
          <h3 className="text-lg font-medium text-zinc-300 mb-2">
            No recent activity
          </h3>
          <p className="text-zinc-500 max-w-md mb-6">
            Your activity will appear here once you start using your Capsule.
            Try creating a data source or running a query to get started.
          </p>
          <div className="flex gap-4">
            <Button
              as={Link}
              to="/data"
              className="bg-zinc-800 hover:bg-zinc-700 text-white border-none"
            >
              <Database className="mr-2 h-4 w-4" />
              Explore Data
            </Button>
            <Button
              as={Link}
              to="/query"
              variant="outline"
              className="border-zinc-700"
            >
              Run a Query
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
));

function GetStartedCard() {
  return (
    <Card className="bg-background border-zinc-800">
      <CardHeader className="pb-2">
        <Rocket className="h-10 w-10 text-teal-500 mb-2" />
        <CardTitle>Get Started</CardTitle>
        <CardDescription>Begin your Capsule journey</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-zinc-400 mb-4">
          Connect your data sources, create your first Caplet, or explore the
          pre-built models.
        </p>
        <Button
          as={Link}
          to="/data"
          className="bg-teal-600 hover:bg-teal-700 text-white w-full"
        >
          Quick Start
        </Button>
      </CardContent>
    </Card>
  );
}

function DocsCard() {
  return (
    <Card className="bg-background border-zinc-800">
      <CardHeader className="pb-2">
        <BookOpen className="h-10 w-10 text-blue-500 mb-2" />
        <CardTitle>Documentation</CardTitle>
        <CardDescription>Learn how to use Capsule</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-zinc-400 mb-4">
          Explore guides, tutorials, and reference materials to make the most of
          your Capsule.
        </p>
        <Button
          as="a"
          href="https://docs.capsule.sh"
          target="_blank"
          variant="outline"
          className="w-full border-zinc-700 hover:border-blue-500"
        >
          View Docs
        </Button>
      </CardContent>
    </Card>
  );
}

function DataCard() {
  return (
    <Card className="bg-background border-zinc-800">
      <CardHeader className="pb-2">
        <Database className="h-10 w-10 text-purple-500 mb-2" />
        <CardTitle>Your Data</CardTitle>
        <CardDescription>Explore your data sources</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-zinc-400 mb-4">
          Connect, manage, and query your data sources all in one secure place.
        </p>
        <Button
          as={Link}
          to="/data"
          variant="outline"
          className="w-full border-zinc-700 hover:border-purple-500"
        >
          View Data
        </Button>
      </CardContent>
    </Card>
  );
}

function ModelsCard() {
  return (
    <Card className="bg-background border-zinc-800">
      <CardHeader className="pb-2">
        <GitBranch className="h-10 w-10 text-orange-500 mb-2" />
        <CardTitle>Built-in Models</CardTitle>
        <CardDescription>Use pre-built data models</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-zinc-400 mb-4">
          Capsule comes with built-in models for common data types like tasks,
          events, and persons.
        </p>
        <Button variant="outline" className="w-full border-zinc-700 ">
          <Link
            to={`/models/$model`}
            params={{
              model: "tasks",
            }}
          >
            Explore Exemple
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export const Route = createFileRoute("/_authenticated/")({
  component: HomeComponent,
});

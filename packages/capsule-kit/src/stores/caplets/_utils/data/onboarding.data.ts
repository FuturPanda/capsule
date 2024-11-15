import { CapletContentTypeEnum } from "@/stores/caplets/caplet.model.ts";

export const OnboardingCaplets = [
  {
    id: "init",
    title: "Welcome to Capsule ! ",
    description:
      "Get started with this example project that uses SQL to find the most popular dessert order for a fictional dumpling restaurant.",
    contentIds: ["a"],
  },
  {
    id: "test",
    title: "another caplet ",
    description:
      "Get started with this example project that uses SQL to find the most popular dessert order for a fictional dumpling restaurant.",
    contentIds: ["b", "a"],
  },
];

export const OnboardingContentPool = {
  a: {
    id: "a",
    type: CapletContentTypeEnum.TEXT,
    value: "This is a text content with id a",
  },
  b: {
    id: "b",
    type: CapletContentTypeEnum.TEXT,
    value: "This is a text content with id b",
  },
};

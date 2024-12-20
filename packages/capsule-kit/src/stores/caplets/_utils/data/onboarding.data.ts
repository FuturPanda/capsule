import { CapletContentTypeEnum } from "@/stores/caplets/caplet.interface.ts";

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

export interface ContentType {
  id: string;
  content_type: CapletContentTypeEnum;
  value: string;
}

export interface ContentPool {
  [key: string]: ContentType;
}

export const OnboardingContentPool = {
  a: {
    id: "a",
    content_type: CapletContentTypeEnum.TEXT,
    value: "This is a text content with id a",
  },
  b: {
    id: "b",
    content_type: CapletContentTypeEnum.TEXT,
    value: "This is a text content with id b",
  },
};

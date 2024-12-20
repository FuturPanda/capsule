import dynamicIconImports from "lucide-react/dynamicIconImports";

export type Caplet = {
  id: string;
  title: string;
  contentIds: string[];
  icon?: keyof typeof dynamicIconImports;
};

export interface CapletContent {
  id: string;
  content_type: CapletContentTypeEnum;
  value?: string | EntityCapletContentValue;
}

export interface EntityCapletContentValue {
  dataSourceId: string;
  entityId: string;
}

export enum CapletContentTypeEnum {
  TEXT = "TEXT",
  SOURCE = "SOURCE",
  ENTITY = "ENTITY",
}

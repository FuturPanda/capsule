import dynamicIconImports from "lucide-react/dynamicIconImports";
import {
  CapletContentTypeEnum,
  EntityCapletContentValue,
} from "@/stores/caplets/caplet.interface.ts";

export interface GetCapletDto {}

export interface GetCapletContentDto {
  id: string;
  content_type: CapletContentTypeEnum;
  caplet_id: string;
  value: string;
}

export interface CreateCapletDto {
  title: string;
  contentIds: string[];
  icon?: keyof typeof dynamicIconImports;
}

export interface CreateCapletContentDto {
  id: string;
  caplet_id: string;
  content_type: CapletContentTypeEnum;
  value?: string | EntityCapletContentValue;
}

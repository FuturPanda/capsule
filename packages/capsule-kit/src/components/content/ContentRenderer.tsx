import { useBoundStore } from "@/stores/global.store.ts";
import { CapletContentTypeEnum } from "@/stores/caplets/caplet.model.ts";
import { TextContent } from "@/components/content/TextContent.tsx";
import { DataSourceContent } from "@/components/content/DataSourceContent.tsx";
import { TableContent } from "@/components/content/TableContent.tsx";

export interface ContentRendererProps {
  capletId: string;
  contentId: string;
}

export const ContentRenderer = ({
  capletId,
  contentId,
}: ContentRendererProps) => {
  const content = useBoundStore((state) => state.findContent(contentId));

  let output = <></>;
  if (content?.type === CapletContentTypeEnum.TEXT)
    output = <TextContent capletId={capletId} contentId={content.id} />;
  else if (content?.type === CapletContentTypeEnum.SOURCE)
    output = (
      <DataSourceContent capletId={capletId} dataContentId={contentId} />
    );
  else if (content?.type === CapletContentTypeEnum.ENTITY)
    output = <TableContent capletId={capletId} contentId={contentId} />;
  return output;
};

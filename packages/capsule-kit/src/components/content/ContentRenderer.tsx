import { TextContent } from "@/components/content/TextContent.tsx";
import { CapletContentTypeEnum } from "@/stores/caplets/caplet.interface.ts";
import { GetCapletContentDto } from "@/stores/caplets/caplet.model.ts";

export interface ContentRendererProps {
  content: GetCapletContentDto;
}

export const ContentRenderer = ({ content }: ContentRendererProps) => {
  let output = <></>;
  if (content?.content_type === CapletContentTypeEnum.TEXT)
    output = <TextContent content={content} />;
  // else if (content?.content_type === CapletContentTypeEnum.SOURCE)
  //   output = (
  //     <DataSourceContent capletId={capletId} dataContentId={contentId} />
  //   );
  // else if (content?.content_type === CapletContentTypeEnum.ENTITY)
  //   output = <TableContent capletId={capletId} contentId={contentId} />;
  return output;
};

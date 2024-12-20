import { createFileRoute } from "@tanstack/react-router";
import ToolBar from "@/components/caplets/ToolBar.tsx";
import { ContentRenderer } from "@/components/content/ContentRenderer.tsx";
import { useEffect, useMemo, useRef } from "react";
import { useAutoScroll } from "@/components/caplets/utils/hooks/auto-scroll.tsx";
import { BoundStore, useBoundStore } from "@/stores/global.store.ts";
import { useQuery } from "@tanstack/react-query";
import { capletRequest } from "@/stores/caplets/caplet.request.ts";

export default function CapletComponent() {
  const { capletId } = Route.useParams();
  const mainRef = useRef<HTMLElement>(null);
  const { autoScrollEnabled, scrollToBottom } = useAutoScroll(mainRef);

  const selectCaplet = useMemo(
    () => (state: BoundStore) => state.findCaplet(capletId),
    [capletId],
  );
  const query = useQuery({
    queryKey: ["caplet"],
    queryFn: () => capletRequest.getCapletContent(capletId),
  });
  const caplet = useBoundStore(selectCaplet);
  console.log(caplet?.contentIds);
  useEffect(() => {
    if (autoScrollEnabled && caplet?.contentIds?.length) {
      requestAnimationFrame(() => {
        scrollToBottom();
      });
    }
  }, [caplet?.contentIds?.length, autoScrollEnabled, scrollToBottom]);

  if (!caplet?.contentIds) return null;

  return (
    <div className="flex-1 flex flex-col">
      <main
        ref={mainRef}
        className="flex-1 overflow-auto p-4 items-center pb-20 scroll-smooth"
      >
        {query.data?.map((content) => <ContentRenderer content={content} />)}

        <ToolBar capletId={caplet.id} />
      </main>
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/caplets/$capletId")({
  component: CapletComponent,
});

import { type generateJsonLdGraph, safeJsonLdStringify } from "@/lib/json-ld";

export function JsonLdScript({
  graph,
}: {
  graph: ReturnType<typeof generateJsonLdGraph>;
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: safeJsonLdStringify(graph),
      }}
    />
  );
}

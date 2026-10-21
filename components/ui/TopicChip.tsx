import Link from "next/link";
import { Chip } from "@/components/ui/Chip";
import { topicIsIndexed } from "@/lib/seo/titles";
import type { WpTopic } from "@/lib/cms/wordpress";

/**
 * A category or tag as a chip. It links to the topic's page only once that page
 * is in the index (five posts or more); until then it is a plain label, so no
 * link points at a page marked noindex.
 */
export function TopicChip({ topic }: { topic: WpTopic }) {
  if (!topicIsIndexed(topic)) return <Chip>{topic.name}</Chip>;
  return (
    <Link href={`/blog/topic/${topic.slug}`} prefetch={false} className="inline-block transition-colors hover:text-ink">
      <Chip className="hover:border-line-strong">{topic.name}</Chip>
    </Link>
  );
}
